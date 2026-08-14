import type { HistoryRecord } from './repository';
import type { GenerationFeature } from './settings';

function historyTitle(feature: GenerationFeature): string {
  return feature === 'letters' ? '角色來信日記' : '對話番外';
}

function formatTime(timestamp: number): string {
  return new Intl.DateTimeFormat('zh-TW', {
    dateStyle: 'medium',
    timeStyle: 'short',
    hour12: false,
  }).format(new Date(timestamp));
}

export function buildHistoryText(
  records: HistoryRecord[],
  feature: GenerationFeature,
  characterName: string,
): string {
  const ordered = [...records].sort((left, right) => left.createdAt - right.createdAt);
  const sections = ordered.map((record) => [
    `【${formatTime(record.createdAt)}】`,
    record.content.trim(),
  ].join('\n'));
  return [
    `${characterName}｜${historyTitle(feature)}`,
    `共 ${ordered.length} 筆`,
    '',
    sections.join('\n\n────────────────────\n\n'),
    '',
  ].join('\n');
}

export function historyFilename(characterName: string, feature: GenerationFeature): string {
  const safeName = characterName
    .replace(/[<>:"/\\|?*\u0000-\u001F]/g, '')
    .replace(/[. ]+$/g, '')
    .trim() || '角色';
  const suffix = feature === 'letters' ? '來信日記' : '對話番外';
  return `${safeName}－${suffix}.txt`;
}
