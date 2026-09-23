// @vitest-environment jsdom

import 'fake-indexeddb/auto';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ResidentLoaderApp } from '../src/loader/app';
import { openResidentRepository } from '../src/loader/repository';
import { buildArchive, manifestFixture, packFixture, pngHeader } from './helpers/resident-pack-fixture';

const DATABASE = 'resident-loader';

async function deleteDatabase(): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    const request = indexedDB.deleteDatabase(DATABASE);
    request.onsuccess = () => resolve();
    request.onblocked = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

/** jsdom 26 的 File 沒有 arrayBuffer()，補在實例上讓 importPack 走得動。 */
function archiveFile(archive: ArrayBuffer, filename: string): File {
  const file = new File([archive], filename, { type: 'application/zip' });
  Object.defineProperty(file, 'arrayBuffer', { configurable: true, value: async () => archive });
  return file;
}

async function importThrough(archive: ArrayBuffer, filename: string): Promise<string> {
  const input = document.body.querySelector<HTMLInputElement>('[data-action="import"]');
  const status = document.body.querySelector<HTMLElement>('[data-status]');
  if (!input || !status) throw new Error('import input or status line missing');
  Object.defineProperty(input, 'files', { configurable: true, value: [archiveFile(archive, filename)] });
  status.textContent = '';
  input.dispatchEvent(new Event('change'));
  await vi.waitFor(() => {
    const now = document.body.querySelector<HTMLElement>('[data-status]')?.textContent ?? '';
    if (!now || now.startsWith('正在檢查')) throw new Error('still importing');
  });
  return document.body.querySelector<HTMLElement>('[data-status]')?.textContent ?? '';
}

function mountDrawer(): void {
  const drawer = document.createElement('div');
  drawer.id = 'extensions_settings2';
  document.body.append(drawer);
}

const first = packFixture();
const second = packFixture({
  manifest: manifestFixture({ displayName: '小景和', creator: '路人' }),
  spritesheet: pngHeader(1024, 1536, [9]),
});

describe('ResidentLoaderApp pack import', () => {
  let app: ResidentLoaderApp | undefined;

  afterEach(async () => {
    app?.stop();
    app = undefined;
    document.body.replaceChildren();
    await deleteDatabase();
  });

  it('keeps the existing pack and reports the conflict when the user declines to overwrite', async () => {
    mountDrawer();
    const confirmOverwrite = vi.fn().mockResolvedValue(false);
    app = new ResidentLoaderApp(() => ({}), { confirmOverwrite });
    await app.start();
    await app.openPanel();

    expect(await importThrough(await buildArchive(first), 'first.jrpack.zip')).toContain('已安全匯入「景和」');
    const message = await importThrough(await buildArchive(second), 'second.jrpack.zip');

    expect(confirmOverwrite).toHaveBeenCalledTimes(1);
    expect(confirmOverwrite.mock.calls[0]?.[0]).toContain('小景和');
    expect(confirmOverwrite.mock.calls[0]?.[0]).toContain('路人');
    expect(message).toContain('保留');
    expect(message).toContain('景和');

    const repository = await openResidentRepository();
    const stored = await repository.getPack('jinghe');
    repository.close();
    expect(stored?.manifest.identity).toEqual({ displayName: '景和', creator: 'Mini', description: '桌邊的小居民。' });
    // fake-indexeddb 在 jsdom 下讀回的是另一個 realm 的 Uint8Array，逐 byte 比才準。
    expect(Array.from(stored?.spritesheet ?? [])).toEqual(Array.from(first.spritesheet));
  });

  it('overwrites the pack only after the user confirms', async () => {
    mountDrawer();
    const confirmOverwrite = vi.fn().mockResolvedValue(true);
    app = new ResidentLoaderApp(() => ({}), { confirmOverwrite });
    await app.start();
    await app.openPanel();

    await importThrough(await buildArchive(first), 'first.jrpack.zip');
    const message = await importThrough(await buildArchive(second), 'second.jrpack.zip');

    expect(confirmOverwrite).toHaveBeenCalledTimes(1);
    expect(message).toContain('已安全匯入「小景和」');

    const repository = await openResidentRepository();
    const stored = await repository.getPack('jinghe');
    repository.close();
    expect(stored?.manifest.identity.displayName).toBe('小景和');
    expect(Array.from(stored?.spritesheet ?? [])).toEqual(Array.from(pngHeader(1024, 1536, [9])));
  });
});
