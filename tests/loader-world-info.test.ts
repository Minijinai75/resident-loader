import { describe, expect, it } from 'vitest';
import {
  buildSelectedWorldInfoContext,
  loadConstantWorldInfoEntries,
} from '../src/loader/world-info-adapter';

describe('SillyTavern world-info adapter', () => {
  it('lists only enabled constant entries returned by the current ST 1.18 world-info flow', async () => {
    const entries = await loadConstantWorldInfoEntries(async () => ({
      getSortedEntries: async () => [
        { world: '景和設定', uid: 3, comment: '住所', content: '簷下的住所設定。', constant: true, disable: false },
        { world: '景和設定', uid: 4, key: ['夜晚'], content: '只在夜晚觸發。', constant: false, disable: false },
        { world: '景和設定', uid: 5, comment: '舊設定', content: '停用內容。', constant: true, disable: true },
      ],
    }));

    expect(entries).toEqual([{
      id: '景和設定::3',
      world: '景和設定',
      uid: '3',
      label: '住所',
      content: '簷下的住所設定。',
    }]);
  });

  it('builds prompt context from checked IDs only and keeps the source book visible', () => {
    const entries = [
      { id: 'book::1', world: 'book', uid: '1', label: '外觀', content: '銀白短髮。' },
      { id: 'book::2', world: 'book', uid: '2', label: '秘密', content: '沒有勾選。' },
    ];
    const context = buildSelectedWorldInfoContext(entries, ['book::1']);
    expect(context).toContain('book｜外觀');
    expect(context).toContain('銀白短髮');
    expect(context).not.toContain('沒有勾選');
  });
});
