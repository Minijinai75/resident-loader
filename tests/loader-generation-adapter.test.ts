import { describe, expect, it, vi } from 'vitest';
import {
  createGenerationAdapter,
  extractConnectionProfiles,
  getTavernIdentity,
} from '../src/loader/st-adapter';

describe('getTavernIdentity', () => {
  it('uses the avatar filename as a stable character key and isolates the chat key', () => {
    expect(
      getTavernIdentity({
        characterId: 3,
        chatId: 'stale-snapshot',
        getCurrentChatId: () => '2026-08-14-story',
        name1: 'Mini',
        name2: '景和',
        characters: {
          3: { name: '景和', avatar: 'jinghe.png' },
        },
      }),
    ).toEqual({
      characterKey: 'avatar:jinghe.png',
      characterName: '景和',
      chatKey: 'chat:2026-08-14-story',
      userName: 'Mini',
    });
  });
});

const rawProfiles = [
  { id: 'writer', name: '寫作', api: 'claude', model: 'model-a', apiKey: 'SECRET' },
  { id: 'kobold', name: '本機 Kobold', api: 'koboldcpp', model: '' },
];

describe('extractConnectionProfiles', () => {
  it('prefers the official getSupportedProfiles() list so unsupported APIs never reach the panel', () => {
    const profiles = extractConnectionProfiles({
      extensionSettings: { connectionManager: { profiles: rawProfiles } },
      ConnectionManagerRequestService: {
        getSupportedProfiles: () => [rawProfiles[0]],
      },
    });

    expect(profiles).toEqual([{ id: 'writer', name: '寫作', api: 'claude', model: 'model-a' }]);
  });

  it('returns no profiles when Connection Manager reports itself unavailable', () => {
    const profiles = extractConnectionProfiles({
      extensionSettings: { connectionManager: { profiles: rawProfiles } },
      ConnectionManagerRequestService: {
        getSupportedProfiles: () => {
          throw new Error('Connection Manager is not available');
        },
      },
    });

    expect(profiles).toEqual([]);
  });

  it('falls back to the raw extension settings on Tavern builds without the request service', () => {
    const profiles = extractConnectionProfiles({
      extensionSettings: { connectionManager: { profiles: rawProfiles } },
    });

    expect(profiles.map((profile) => profile.id)).toEqual(['writer', 'kobold']);
    expect(JSON.stringify(profiles)).not.toContain('SECRET');
  });
});

function profileContext(overrides: Record<string, unknown> = {}) {
  const sendRequest = vi.fn().mockResolvedValue({ content: '  指定連線內容  ', reasoning: '' });
  const context = {
    extensionSettings: { connectionManager: { profiles: rawProfiles } },
    ConnectionManagerRequestService: {
      sendRequest,
      getSupportedProfiles: () => [rawProfiles[0]],
    },
    ...overrides,
  };
  return { context, sendRequest };
}

describe('createGenerationAdapter', () => {
  it('uses the current Tavern API silently and never exposes a SEND operation', async () => {
    const generate = vi.fn().mockResolvedValue({ content: '  目前連線生成的內容  ' });
    const adapter = createGenerationAdapter({
      getContext: () => ({}),
      findApi: (name) => (name === 'generate' ? generate : undefined),
    });

    const result = await adapter.generateText({
      mode: 'current',
      profileId: '',
      prompt: '測試 Prompt',
      maxChatHistory: 7,
    });

    expect(result).toEqual({ text: '目前連線生成的內容', source: 'current' });
    expect(generate).toHaveBeenCalledWith({
      user_input: '測試 Prompt',
      should_stream: false,
      should_silence: true,
      max_chat_history: 7,
    });
    expect('send' in adapter).toBe(false);
  });

  it('sends the profile request through ConnectionManagerRequestService instead of the slash parser', async () => {
    const { context, sendRequest } = profileContext();
    const findApi = vi.fn(() => undefined);
    const adapter = createGenerationAdapter({ getContext: () => context, findApi });

    const result = await adapter.generateText({
      mode: 'profile',
      profileId: 'writer',
      prompt: '番外 Prompt',
      maxChatHistory: 3,
    });

    expect(result).toEqual({ text: '指定連線內容', source: 'profile:writer' });
    expect(sendRequest).toHaveBeenCalledTimes(1);
    expect(sendRequest).toHaveBeenCalledWith(
      'writer',
      [{ role: 'user', content: '番外 Prompt' }],
      2048,
      { stream: false, extractData: true, includePreset: true },
    );
    expect(findApi).not.toHaveBeenCalledWith('triggerSlash');
    expect(JSON.stringify(sendRequest.mock.calls)).not.toContain('SECRET');
  });

  it.each([
    ['MVU status bar with pipes', '【狀態】HP: 80 | MP: 40 | 好感度: 62'],
    ['multi-paragraph prompt', '第一段。\n\n第二段有\t定位字元。\n最後一行沒有句號'],
    ['dialogue with double quotes', '她說："今天不要走。"\n他回："\\"好\\"，我留下。"'],
    ['macro-looking text stays literal', '{{user}} 對 {{char}} 說 {{setglobalvar::x::1}}'],
    ['trailing backslash and windows path', 'C:\\Users\\Mini\\酒館\\'],
  ])('passes the prompt to the API byte-for-byte: %s', async (_label, prompt) => {
    const { context, sendRequest } = profileContext();
    const adapter = createGenerationAdapter({ getContext: () => context });

    await adapter.generateText({ mode: 'profile', profileId: 'writer', prompt, maxChatHistory: 0 });

    const messages = sendRequest.mock.calls[0]?.[1] as Array<{ role: string; content: string }>;
    expect(messages).toHaveLength(1);
    expect(messages[0]?.role).toBe('user');
    expect(messages[0]?.content).toBe(prompt);
  });

  it('rejects profiles that the request service does not support', async () => {
    const { context, sendRequest } = profileContext();
    const adapter = createGenerationAdapter({ getContext: () => context });

    await expect(
      adapter.generateText({ mode: 'profile', profileId: 'kobold', prompt: 'x', maxChatHistory: 0 }),
    ).rejects.toThrow('找不到指定的酒館連線設定檔');
    expect(sendRequest).not.toHaveBeenCalled();
  });

  it('explains when the Tavern build has no ConnectionManagerRequestService', async () => {
    const adapter = createGenerationAdapter({
      getContext: () => ({ extensionSettings: { connectionManager: { profiles: rawProfiles } } }),
    });

    await expect(
      adapter.generateText({ mode: 'profile', profileId: 'writer', prompt: 'x', maxChatHistory: 0 }),
    ).rejects.toThrow('這個酒館版本沒有 Connection Manager 生成介面');
  });

  it('surfaces the underlying API error instead of the generic wrapper', async () => {
    const { context, sendRequest } = profileContext();
    sendRequest.mockRejectedValue(new Error('API request failed', { cause: new Error('401 Unauthorized') }));
    const adapter = createGenerationAdapter({ getContext: () => context });

    await expect(
      adapter.generateText({ mode: 'profile', profileId: 'writer', prompt: 'x', maxChatHistory: 0 }),
    ).rejects.toThrow('401 Unauthorized');
  });

  it('reports an empty completion as a generation problem', async () => {
    const { context, sendRequest } = profileContext();
    sendRequest.mockResolvedValue({ content: '', reasoning: '' });
    const adapter = createGenerationAdapter({ getContext: () => context });

    await expect(
      adapter.generateText({ mode: 'profile', profileId: 'writer', prompt: 'x', maxChatHistory: 0 }),
    ).rejects.toThrow('酒館沒有回傳文字');
  });
});
