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
      worldInfoEntries: [{
        id: '景和設定::3',
        world: '景和設定',
        uid: '3',
        label: '住所',
        content: '簷下的住所設定。',
      }],
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
    expect(panel.querySelector('[data-feature-settings="letters"]')).not.toBeNull();
    expect(panel.querySelector('[data-feature-settings="stories"]')).not.toBeNull();
    expect(panel.querySelector('[data-action="generate:letters"]')?.textContent).toContain('生成一封新來信');
    expect(panel.querySelector('[data-action="generate:stories"]')?.textContent).toContain('生成一篇新番外');
    expect(panel.querySelector('.resident-loader-history')).toBeNull();
    expect(panel.querySelector('.resident-loader-panel-header [data-action="save-settings"]')?.textContent).toContain('儲存設定');
    expect(panel.textContent).toContain('切換角色卡時，桌寵會自動跟著切換');
    expect(panel.querySelectorAll('[data-world-info-entry]')).toHaveLength(3);
    expect(panel.textContent).toContain('世界書常駐條目');
    expect(panel.textContent).toContain('景和設定｜住所');
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

  it('renders letters and conversation extras as content-only HTML reading views', () => {
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
      histories: {
        letters: [{
          id: 7,
          characterKey: 'avatar:jinghe.png',
          chatKey: 'chat:story',
          feature: 'letters' as const,
          content: '今天也記得好好吃飯。',
          prompt: 'prompt',
          apiSource: 'current',
          createdAt: Date.UTC(2026, 7, 14, 12, 30),
        }],
        stories: [{
          id: 8,
          characterKey: 'avatar:jinghe.png',
          chatKey: 'chat:story',
          feature: 'stories' as const,
          content: '番外只有生成後的正文。',
          prompt: 'prompt',
          apiSource: 'current',
          createdAt: Date.UTC(2026, 7, 14, 13, 30),
        }],
      },
      contextSummaries: {
        letters: { messageCount: 8, characterCount: 520, preview: '最近來信脈絡' },
        stories: { messageCount: 6, characterCount: 420, preview: '最近番外脈絡' },
      },
      hasBinding: true,
    };

    const letters = createLoaderPanel({ ...base, view: 'letters' });
    expect(letters.querySelector('#resident-loader-title')?.textContent).toBe('角色來信日記');
    expect(letters.classList.contains('resident-loader-letters-page')).toBe(true);
    expect(letters.querySelector('[data-history-view="letters"]')).not.toBeNull();
    expect(letters.querySelector('[data-feature-settings]')).toBeNull();
    expect(letters.querySelector('[data-action^="generate:"]')).toBeNull();
    expect(letters.querySelector('[data-action="download-history"][data-feature="letters"]')).not.toBeNull();
    expect(letters.textContent).toContain('今天也記得好好吃飯。');
    expect(letters.textContent).not.toContain('指定連線設定檔案');
    expect(letters.textContent).not.toContain('current');

    const stories = createLoaderPanel({ ...base, view: 'stories' });
    expect(stories.querySelector('#resident-loader-title')?.textContent).toBe('對話番外留言板');
    expect(stories.classList.contains('resident-loader-stories-page')).toBe(true);
    expect(stories.querySelector('[data-history-view="stories"]')).not.toBeNull();
    expect(stories.querySelector('[data-feature-settings]')).toBeNull();
    expect(stories.querySelector('[data-action^="generate:"]')).toBeNull();
    expect(stories.querySelector('[data-action="download-history"][data-feature="stories"]')).not.toBeNull();
    expect(stories.textContent).toContain('番外只有生成後的正文。');
  });
});
