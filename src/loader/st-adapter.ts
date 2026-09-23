export interface ConnectionProfileSummary {
  id: string;
  name: string;
  api: string;
  model: string;
}

export interface TavernIdentity {
  characterKey: string;
  characterName: string;
  chatKey: string;
  userName: string;
}

type UnknownFunction = (...args: never[]) => unknown;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function safeString(value: unknown, maximum = 200): string {
  return typeof value === 'string' ? value.trim().slice(0, maximum) : '';
}

/**
 * 新版 SillyTavern 把 ConnectionManagerRequestService 放在 getContext() 上
 * （1.18.0 `st-context.js:292`，實作 `scripts/extensions/shared.js:388-618`）。
 * 這是 /profile-genstream 自己內部用的東西：messages 直接進 API 管線，
 * 不經指令解析器、不做 macro 替換。
 */
interface ConnectionManagerRequestServiceLike {
  sendRequest: (
    profileId: string,
    prompt: Array<{ role: string; content: string }>,
    maxTokens: number,
    custom?: { stream?: boolean; extractData?: boolean; includePreset?: boolean },
  ) => Promise<unknown>;
  getSupportedProfiles?: () => unknown;
}

const PROFILE_MAX_TOKENS = 2048; // 與 /profile-genstream 的 length 預設值相同

function connectionManagerService(context: unknown): ConnectionManagerRequestServiceLike | undefined {
  if (!isRecord(context)) return undefined;
  const service = context.ConnectionManagerRequestService;
  if (!isRecord(service) || typeof service.sendRequest !== 'function') return undefined;
  return service as unknown as ConnectionManagerRequestServiceLike;
}

/**
 * 只列 ConnectionManagerRequestService 接得住的設定檔（Chat／Text Completion）。
 * 官方 getSupportedProfiles() 在時以它為準；它拋錯代表 Connection Manager 被停用，
 * 那就沒有可用的設定檔。沒有這個服務的舊版酒館退回原始設定清單。
 */
function rawConnectionProfiles(context: unknown): unknown[] {
  if (!isRecord(context)) return [];
  const service = isRecord(context.ConnectionManagerRequestService)
    ? context.ConnectionManagerRequestService
    : undefined;
  if (service && typeof service.getSupportedProfiles === 'function') {
    try {
      const supported = (service.getSupportedProfiles as () => unknown)();
      return Array.isArray(supported) ? supported : [];
    } catch {
      return [];
    }
  }
  const extensionSettings = context.extensionSettings;
  if (!isRecord(extensionSettings)) return [];
  const connectionManager = extensionSettings.connectionManager;
  if (!isRecord(connectionManager) || !Array.isArray(connectionManager.profiles)) return [];
  return connectionManager.profiles;
}

export function extractConnectionProfiles(context: unknown): ConnectionProfileSummary[] {
  return rawConnectionProfiles(context).flatMap((profile): ConnectionProfileSummary[] => {
    if (!isRecord(profile)) return [];
    const id = safeString(profile.id);
    const name = safeString(profile.name) || id;
    if (!id || !name) return [];
    return [
      {
        id,
        name,
        api: safeString(profile.api),
        model: safeString(profile.model),
      },
    ];
  });
}

function recordValue(record: Record<string, unknown>, key: unknown): unknown {
  if (typeof key !== 'string' && typeof key !== 'number') return undefined;
  const collection = record.characters;
  if (Array.isArray(collection)) return collection[Number(key)];
  if (isRecord(collection)) return collection[String(key)];
  return undefined;
}

export function getTavernIdentity(context: unknown): TavernIdentity | null {
  if (!isRecord(context)) return null;
  const character = recordValue(context, context.characterId);
  const directCharacter = isRecord(context.character) ? context.character : undefined;
  const resolvedCharacter = isRecord(character) ? character : directCharacter;
  const data = resolvedCharacter && isRecord(resolvedCharacter.data) ? resolvedCharacter.data : undefined;
  const characterName =
    safeString(context.name2) ||
    safeString(resolvedCharacter?.name) ||
    safeString(data?.name);
  if (!characterName) return null;

  const avatar = safeString(resolvedCharacter?.avatar) || safeString(data?.avatar);
  const rawCharacterId = context.characterId;
  const characterKey = avatar
    ? `avatar:${avatar}`
    : rawCharacterId !== undefined && rawCharacterId !== null
      ? `character-id:${String(rawCharacterId)}`
      : `name:${characterName}`;
  const chatMetadata = isRecord(context.chatMetadata)
    ? context.chatMetadata
    : isRecord(context.chat_metadata)
      ? context.chat_metadata
      : undefined;
  let liveChatId = '';
  if (typeof context.getCurrentChatId === 'function') {
    try {
      liveChatId = safeString((context.getCurrentChatId as () => unknown)());
    } catch {
      liveChatId = '';
    }
  }
  const rawChatKey =
    liveChatId ||
    safeString(context.chatId) ||
    safeString(context.chatFile) ||
    safeString(context.chat_file) ||
    safeString(chatMetadata?.chatId) ||
    safeString(chatMetadata?.chat_id) ||
    'current';

  return {
    characterKey,
    characterName,
    chatKey: `chat:${rawChatKey}`,
    userName: safeString(context.name1) || 'USER',
  };
}

function defaultFindApi(name: string): unknown {
  const current = globalThis as Record<string, unknown>;
  if (name in current) return current[name];
  try {
    const parent = globalThis.top as unknown as Record<string, unknown> | null;
    return parent?.[name];
  } catch {
    return undefined;
  }
}

function callable(value: unknown): UnknownFunction | undefined {
  return typeof value === 'function' ? (value as UnknownFunction) : undefined;
}

function cleanGeneratedText(value: unknown): string {
  let text = '';
  if (typeof value === 'string') text = value;
  else if (isRecord(value)) {
    text = safeString(value.content, 20_000) || safeString(value.text, 20_000);
  }
  text = text
    .trim()
    .replace(/^```(?:markdown|text)?\s*/i, '')
    .replace(/\s*```$/, '')
    .trim();
  if (!text) throw new Error('酒館沒有回傳文字，請檢查生成連線。');
  return text.slice(0, 12_000);
}

function describeRequestError(error: unknown): string {
  // shared.js:485 把真正的錯誤包成 Error('API request failed', { cause })，拆出來給使用者看。
  if (error instanceof Error) {
    const cause = (error as Error & { cause?: unknown }).cause;
    const causeMessage = cause instanceof Error ? cause.message : typeof cause === 'string' ? cause : '';
    return causeMessage || error.message;
  }
  return typeof error === 'string' ? error : '未知錯誤';
}

export function createGenerationAdapter(options: {
  getContext: () => unknown;
  findApi?: (name: string) => unknown;
}) {
  const findApi = options.findApi ?? defaultFindApi;
  return {
    async generateText(input: {
      mode: 'current' | 'profile';
      profileId: string;
      prompt: string;
      maxChatHistory: number;
    }): Promise<{ text: string; source: string }> {
      const context = options.getContext();
      if (input.mode === 'profile') {
        const service = connectionManagerService(context);
        if (!service) {
          throw new Error('這個酒館版本沒有 Connection Manager 生成介面，請更新 SillyTavern。');
        }
        const profile = extractConnectionProfiles(context).find((item) => item.id === input.profileId);
        if (!profile) throw new Error('找不到指定的酒館連線設定檔。');
        // prompt 以 messages 陣列原樣交給 API 管線：不拼指令字串、不經解析器、不展開 macro。
        let result: unknown;
        try {
          result = await service.sendRequest(
            profile.id,
            [{ role: 'user', content: input.prompt }],
            PROFILE_MAX_TOKENS,
            { stream: false, extractData: true, includePreset: true },
          );
        } catch (error) {
          throw new Error(`指定連線生成失敗：${describeRequestError(error)}`);
        }
        return { text: cleanGeneratedText(result), source: `profile:${profile.id}` };
      }

      const generate = callable(findApi('generate'));
      if (generate) {
        const result = await generate({
          user_input: input.prompt,
          should_stream: false,
          should_silence: true,
          max_chat_history: Math.max(0, Math.min(50, Math.round(input.maxChatHistory))),
        } as never);
        return { text: cleanGeneratedText(result), source: 'current' };
      }

      const current = isRecord(context) ? context : {};
      const quiet = callable(current.generateQuietPrompt) ?? callable(findApi('generateQuietPrompt'));
      if (!quiet) throw new Error('找不到酒館生成介面，請確認目前連線或 TavernHelper。');
      const result = await quiet({ quietPrompt: input.prompt, removeReasoning: true } as never);
      return { text: cleanGeneratedText(result), source: 'current' };
    },
  };
}
