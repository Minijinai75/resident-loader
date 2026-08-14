// @vitest-environment jsdom

import { describe, expect, it } from 'vitest';
import { createLoaderPanel } from '../src/loader/panel';
import { DEFAULT_LOADER_SETTINGS } from '../src/loader/settings';
import type { ImportedResidentPack } from '../src/loader/pack-importer';

const pack: ImportedResidentPack = {
  manifest: {
    schemaVersion: 1,
    id: 'jinghe',
    identity: {
      displayName: '<img src=x onerror=alert(1)>景和',
      creator: 'Mini',
      description: '桌邊的小居民。',
    },
    assets: { spritesheet: 'assets/spritesheet.png' },
    animation: {
      kind: 'grid',
      columns: 8,
      rows: 12,
      frameWidth: 128,
      frameHeight: 128,
      frameCount: 96,
    },
    theme: { accentColor: '#8ca8c7' },
    prompts: {
      idle: '待機 Prompt',
      letters: '角色包書信 Prompt',
      stories: '角色包番外 Prompt',
    },
    capabilities: ['idle', 'letters', 'stories'],
  },
  spritesheet: new Uint8Array(),
  importedAt: 100,
};

describe('createLoaderPanel', () => {
  it('shows import, binding, appearance, and daily prompt controls in the settings view', () => {
    const panel = createLoaderPanel({
      identity: {
        characterKey: 'avatar:jinghe.png',
        characterName: '景和',
        chatKey: 'chat:story',
        userName: 'Mini',
      },
      packs: [pack],
      selectedPackId: 'jinghe',
      settings: {
        ...DEFAULT_LOADER_SETTINGS,
        features: {
          ...DEFAULT_LOADER_SETTINGS.features,
          stories: {
            ...DEFAULT_LOADER_SETTINGS.features.stories,
            promptOverride: 'USER 改過的番外 Prompt',
            recentMessages: 12,
            mode: 'profile',
            profileId: 'writer',
          },
        },
      },
      profiles: [{ id: 'writer', name: '番外專用', api: 'openai', model: 'model-a' }],
      histories: {
        letters: [],
        stories: [
          {
            id: 1,
            characterKey: 'avatar:jinghe.png',
            chatKey: 'chat:story',
            feature: 'stories',
            content: '這段番外關掉面板後也還在。',
            prompt: 'prompt',
            apiSource: 'profile:writer',
            createdAt: 100,
          },
        ],
      },
      contextSummaries: {
        letters: { messageCount: 8, characterCount: 520, preview: 'Mini：最近一樓' },
        stories: { messageCount: 12, characterCount: 860, preview: '景和：最近番外內容' },
      },
      view: 'settings',
      hasBinding: true,
    });

    expect(panel.querySelector<HTMLTextAreaElement>('[data-prompt="idle"]')?.value).toBe(
      '待機 Prompt',
    );
    expect(panel.querySelector<HTMLInputElement>('[data-recent="idle"]')?.value).toBe('4');
    expect(panel.querySelector('[data-action="generate:idle"]')?.textContent).toContain('讓桌寵說一句');
    expect(panel.textContent).toContain('自動生成目前關閉');
    expect(panel.querySelectorAll('[data-motion-preset]')).toHaveLength(3);
    expect(panel.querySelector('[data-action="import-trigger"]')?.textContent).toContain('選擇並匯入角色包');
    expect(panel.querySelector<HTMLInputElement>('[data-action="import"]')?.hidden).toBe(true);
    expect(panel.querySelector('[data-action="unbind"]')).not.toBeNull();
    expect(panel.textContent).toContain('動作播放速度');
    expect(panel.textContent).toContain('畫面移動速度');
    expect(panel.querySelector('details[data-advanced-motion]')).not.toBeNull();
  });

  it('renders imported names as text rather than executable HTML', () => {
    const panel = createLoaderPanel({
      identity: null,
      packs: [pack],
      selectedPackId: 'jinghe',
      settings: DEFAULT_LOADER_SETTINGS,
      profiles: [],
      histories: { letters: [], stories: [] },
      contextSummaries: {
        letters: { messageCount: 0, characterCount: 0, preview: '' },
        stories: { messageCount: 0, characterCount: 0, preview: '' },
      },
      view: 'settings',
      hasBinding: false,
    });

    expect(panel.querySelector('img')).toBeNull();
    expect(panel.textContent).toContain('<img src=x onerror=alert(1)>景和');
  });

  it('renders letters and conversation extras as separate HTML reading views', () => {
    const base = {
      identity: {
        characterKey: 'avatar:jinghe.png',
        characterName: '景和',
        chatKey: 'chat:story',
        userName: 'Mini',
      },
      packs: [pack],
      selectedPackId: 'jinghe',
      settings: DEFAULT_LOADER_SETTINGS,
      profiles: [],
      histories: { letters: [], stories: [] },
      contextSummaries: {
        letters: { messageCount: 8, characterCount: 520, preview: '最近來信脈絡' },
        stories: { messageCount: 6, characterCount: 420, preview: '最近番外脈絡' },
      },
      hasBinding: true,
    };

    const letters = createLoaderPanel({ ...base, view: 'letters' });
    expect(letters.querySelector('#resident-loader-title')?.textContent).toBe('角色來信紀錄');
    expect(letters.querySelector('[data-feature="letters"]')).not.toBeNull();
    expect(letters.querySelector('[data-feature="stories"]')).toBeNull();
    expect(letters.querySelector('[data-action="back-settings"]')).not.toBeNull();
    expect(letters.querySelector('[data-action="generate:letters"]')?.textContent).toContain('生成一封新來信');
    expect(letters.textContent).toContain('指定連線設定檔案');

    const stories = createLoaderPanel({ ...base, view: 'stories' });
    expect(stories.querySelector('#resident-loader-title')?.textContent).toBe('對話番外紀錄');
    expect(stories.querySelector('[data-feature="stories"]')).not.toBeNull();
    expect(stories.querySelector('[data-feature="letters"]')).toBeNull();
    expect(stories.querySelector('[data-action="generate:stories"]')?.textContent).toContain('生成一篇新番外');
  });
});
