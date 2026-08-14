export interface TavernChatMessage {
  is_user?: boolean;
  name?: unknown;
  mes?: unknown;
  [key: string]: unknown;
}

function clippedText(value: unknown, maximum: number): string {
  const text = String(value ?? '').replace(/\s+/g, ' ').trim();
  return text.length > maximum ? `${text.slice(0, maximum)}…` : text;
}

export function buildFeaturePrompt(input: {
  packPrompt: string;
  promptOverride: string;
  recentMessages: number;
  chat: TavernChatMessage[];
  userName: string;
  characterName: string;
  characterContext?: string;
  worldInfoContext?: string;
}): string {
  const basePrompt = input.promptOverride.trim() || input.packPrompt.trim();
  const summary = summarizeRecentConversation(
    input.chat,
    input.recentMessages,
    input.userName,
    input.characterName,
  );
  const sections = [basePrompt];
  const characterContext = input.characterContext?.trim().slice(0, 8_000);
  if (characterContext) sections.push(`目前綁定角色卡資料：\n${characterContext}`);
  const worldInfoContext = input.worldInfoContext?.trim().slice(0, 16_000);
  if (worldInfoContext) sections.push(`USER 勾選的世界書常駐條目：\n${worldInfoContext}`);
  if (!summary.preview) return sections.join('\n\n');
  const budgetedContext =
    summary.preview.length > 12_000 ? `…${summary.preview.slice(-12_000)}` : summary.preview;
  sections.push(`最近對話（由舊到新）：\n${budgetedContext}`);
  return sections.join('\n\n');
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function currentCharacter(context: Record<string, unknown>): Record<string, unknown> | undefined {
  if (isRecord(context.character)) return context.character;
  const characters = context.characters;
  const id = context.characterId ?? context.character_id;
  if (Array.isArray(characters)) {
    const candidate = characters[Number(id)];
    return isRecord(candidate) ? candidate : undefined;
  }
  if (isRecord(characters) && (typeof id === 'string' || typeof id === 'number')) {
    const candidate = characters[String(id)];
    return isRecord(candidate) ? candidate : undefined;
  }
  return undefined;
}

export function extractCharacterCardContext(context: unknown): string {
  if (!isRecord(context)) return '';
  const character = currentCharacter(context);
  if (!character) return '';
  const data = isRecord(character.data) ? character.data : {};
  const fields: Array<[string, unknown]> = [
    ['角色描述', data.description ?? character.description],
    ['性格', data.personality ?? character.personality],
    ['情境', data.scenario ?? character.scenario],
  ];
  return fields
    .map(([label, value]) => {
      const text = clippedText(value, 2_500);
      return text ? `${label}：${text}` : '';
    })
    .filter(Boolean)
    .join('\n')
    .slice(0, 8_000);
}

export interface ConversationSummary {
  messageCount: number;
  characterCount: number;
  preview: string;
}

export function summarizeRecentConversation(
  chat: TavernChatMessage[],
  recentMessages: number,
  userName: string,
  characterName: string,
): ConversationSummary {
  const count = Math.min(50, Math.max(0, Math.round(recentMessages)));
  if (count === 0) return { messageCount: 0, characterCount: 0, preview: '' };
  const lines = chat
    .slice(-count)
    .map((message) => {
      const content = clippedText(message.mes, 1_200);
      if (!content) return '';
      const fallbackName = message.is_user ? userName : characterName;
      const name = clippedText(message.name, 80) || fallbackName;
      return `${name}：${content}`;
    })
    .filter(Boolean);
  const preview = lines.join('\n');
  return {
    messageCount: lines.length,
    characterCount: preview.length,
    preview,
  };
}
