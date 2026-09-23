import 'fake-indexeddb/auto';
import { afterEach, describe, expect, it } from 'vitest';
import { openResidentRepository, PackConflictError, type ResidentRepository } from '../src/loader/repository';
import { manifestFixture, packFixture, pngHeader } from './helpers/resident-pack-fixture';

const databases: string[] = [];
const opened: ResidentRepository[] = [];

async function open(): Promise<ResidentRepository> {
  const name = `resident-loader-conflict-${crypto.randomUUID()}`;
  databases.push(name);
  const repository = await openResidentRepository({ databaseName: name });
  opened.push(repository);
  return repository;
}

afterEach(async () => {
  for (const repository of opened.splice(0)) repository.close();
  await Promise.all(
    databases.splice(0).map(
      (name) =>
        new Promise<void>((resolve, reject) => {
          const request = indexedDB.deleteDatabase(name);
          request.onsuccess = () => resolve();
          request.onerror = () => reject(request.error);
        }),
    ),
  );
});

const original = packFixture();
const sameContentLater = packFixture({ importedAt: 200 });
const differentSprite = packFixture({ spritesheet: pngHeader(1024, 1536, [1, 2, 3]), importedAt: 200 });
const differentManifest = packFixture({
  manifest: {
    ...manifestFixture({ displayName: '小景和', creator: '路人' }),
    prompts: { idle: '別的', letters: '書信', stories: '番外' },
  },
  importedAt: 200,
});

describe('ResidentRepository.putPack conflict guard', () => {
  it('treats re-importing identical content as an update, not a conflict', async () => {
    const repository = await open();
    await repository.putPack(original);

    await expect(repository.putPack(sameContentLater)).resolves.toBeUndefined();

    expect(await repository.getPack('jinghe')).toEqual(sameContentLater);
  });

  it('refuses to silently replace a pack whose sprite sheet differs under the same id', async () => {
    const repository = await open();
    await repository.putPack(original);

    await expect(repository.putPack(differentSprite)).rejects.toBeInstanceOf(PackConflictError);

    expect(await repository.getPack('jinghe')).toEqual(original);
  });

  it('names both packs so the user can tell which one is which', async () => {
    const repository = await open();
    await repository.putPack(original);

    const error = await repository.putPack(differentManifest).catch((caught: unknown) => caught);

    expect(error).toBeInstanceOf(PackConflictError);
    const conflict = error as PackConflictError;
    expect(conflict.packId).toBe('jinghe');
    expect(conflict.existing).toEqual({ displayName: '景和', creator: 'Mini' });
    expect(conflict.incoming).toEqual({ displayName: '小景和', creator: '路人' });
    expect(conflict.message).toContain('景和');
    expect(conflict.message).toContain('Mini');
    expect(conflict.message).toContain('小景和');
    expect(conflict.message).toContain('路人');
    expect(await repository.getPack('jinghe')).toEqual(original);
  });

  it('overwrites only when the caller explicitly asks for it', async () => {
    const repository = await open();
    await repository.putPack(original);

    await repository.putPack(differentSprite, { overwrite: true });

    expect(await repository.getPack('jinghe')).toEqual(differentSprite);
  });
});
