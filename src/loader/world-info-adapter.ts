export interface WorldInfoEntrySummary {
  id: string;
  world: string;
  uid: string;
  label: string;
  content: string;
}

interface WorldInfoModule {
  getSortedEntries?: () => Promise<unknown[]>;
}

type WorldInfoModuleLoader = () => Promise<WorldInfoModule>;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function text(value: unknown, maximum: number): string {
  return typeof value === 'string' ? value.trim().slice(0, maximum) : '';
}

function entryLabel(entry: Record<string, unknown>, uid: string): string {
  const comment = text(entry.comment, 200);
  if (comment) return comment;
  const keys = Array.isArray(entry.key)
    ? entry.key.filter((value): value is string => typeof value === 'string' && value.trim().length > 0)
    : [];
  return keys.length ? keys.join('、').slice(0, 200) : `條目 ${uid}`;
}

async function importWorldInfoModule(): Promise<WorldInfoModule> {
  const modulePath = '/scripts/world-info.js';
  return import(/* @vite-ignore */ modulePath) as Promise<WorldInfoModule>;
}

export async function loadConstantWorldInfoEntries(
  loadModule: WorldInfoModuleLoader = importWorldInfoModule,
): Promise<WorldInfoEntrySummary[]> {
  try {
    const module = await loadModule();
    if (typeof module.getSortedEntries !== 'function') return [];
    const source = await module.getSortedEntries();
    if (!Array.isArray(source)) return [];
    const output: WorldInfoEntrySummary[] = [];
    const seen = new Set<string>();
    for (const candidate of source) {
      if (!isRecord(candidate) || candidate.constant !== true || candidate.disable === true) continue;
      const content = text(candidate.content, 12_000);
      if (!content) continue;
      const world = text(candidate.world, 300) || '世界書';
      const uid = String(candidate.uid ?? '').trim().slice(0, 100);
      if (!uid) continue;
      const id = `${world}::${uid}`;
      if (seen.has(id)) continue;
      seen.add(id);
      output.push({ id, world, uid, label: entryLabel(candidate, uid), content });
    }
    return output;
  } catch (error) {
    console.warn('[酒館桌寵] 無法讀取世界書常駐條目', error);
    return [];
  }
}

export function buildSelectedWorldInfoContext(
  entries: WorldInfoEntrySummary[],
  selectedIds: string[],
  maximumCharacters = 16_000,
): string {
  const selected = new Set(selectedIds);
  const sections: string[] = [];
  let used = 0;
  for (const entry of entries) {
    if (!selected.has(entry.id)) continue;
    const section = `【${entry.world}｜${entry.label}】\n${entry.content}`;
    const remaining = maximumCharacters - used;
    if (remaining <= 0) break;
    sections.push(section.slice(0, remaining));
    used += section.length;
  }
  return sections.join('\n\n');
}
