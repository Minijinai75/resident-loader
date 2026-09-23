import JSZip from 'jszip';
import type { ImportedResidentPack } from '../../src/loader/pack-importer';
import type { ResidentPackManifest } from '../../src/loader/pack-schema';

/** 只帶 PNG 簽名＋IHDR 的最小合法表頭（與 loader-pack-importer.test.ts 同形）。 */
export function pngHeader(width = 1024, height = 1536, tail: number[] = []): Uint8Array {
  const bytes = new Uint8Array(24 + tail.length);
  bytes.set([137, 80, 78, 71, 13, 10, 26, 10], 0);
  bytes.set([0, 0, 0, 13, 73, 72, 68, 82], 8);
  new DataView(bytes.buffer).setUint32(16, width);
  new DataView(bytes.buffer).setUint32(20, height);
  bytes.set(tail, 24);
  return bytes;
}

export function manifestFixture(overrides: Partial<ResidentPackManifest['identity']> = {}): ResidentPackManifest {
  return {
    schemaVersion: 1,
    id: 'jinghe',
    identity: {
      displayName: '景和',
      creator: 'Mini',
      description: '桌邊的小居民。',
      ...overrides,
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
    prompts: { idle: '待機', letters: '書信', stories: '番外' },
    capabilities: ['idle', 'letters', 'stories'],
  };
}

export function packFixture(overrides: Partial<ImportedResidentPack> = {}): ImportedResidentPack {
  return {
    manifest: manifestFixture(),
    spritesheet: pngHeader(),
    importedAt: 100,
    ...overrides,
  };
}

/** 打一個 loader 收得下的 .jrpack.zip。 */
export async function buildArchive(pack: ImportedResidentPack): Promise<ArrayBuffer> {
  const zip = new JSZip();
  zip.file('manifest.json', JSON.stringify(pack.manifest));
  zip.file(
    'pack-meta.json',
    JSON.stringify({ format: 'jinghe-resident-pack', formatVersion: 1, generatedBy: 'tavern-pet-workshop' }),
  );
  zip.folder('assets')!.file('spritesheet.png', pack.spritesheet);
  return zip.generateAsync({ type: 'arraybuffer' });
}
