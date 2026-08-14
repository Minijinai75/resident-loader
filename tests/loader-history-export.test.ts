import { describe, expect, it } from 'vitest';
import { buildHistoryText, historyFilename } from '../src/loader/history-export';

describe('history TXT export', () => {
  const records = [
    {
      id: 2,
      characterKey: 'avatar:jinghe.png',
      chatKey: 'chat:story',
      feature: 'letters' as const,
      content: '第二封信',
      prompt: 'prompt',
      apiSource: 'current',
      createdAt: Date.UTC(2026, 7, 15, 3, 0),
    },
    {
      id: 1,
      characterKey: 'avatar:jinghe.png',
      chatKey: 'chat:story',
      feature: 'letters' as const,
      content: '第一封信',
      prompt: 'prompt',
      apiSource: 'profile:writer',
      createdAt: Date.UTC(2026, 7, 14, 3, 0),
    },
  ];

  it('exports accumulated entries chronologically with dates and content only', () => {
    const text = buildHistoryText(records, 'letters', '景和');
    expect(text).toContain('景和｜角色來信日記');
    expect(text.indexOf('第一封信')).toBeLessThan(text.indexOf('第二封信'));
    expect(text).not.toContain('profile:writer');
    expect(text).not.toContain('prompt');
  });

  it('creates safe readable TXT filenames for both pages', () => {
    expect(historyFilename('景/和:*?', 'letters')).toBe('景和－來信日記.txt');
    expect(historyFilename('景/和:*?', 'stories')).toBe('景和－對話番外.txt');
  });
});
