import type { ImportedResidentPack } from './pack-importer';
import { normalizeLoaderSettings, type LoaderSettings } from './settings';

const DATABASE_VERSION = 2;
const DEFAULT_DATABASE_NAME = 'resident-loader';

interface PackRecord extends ImportedResidentPack {
  id: string;
}

interface SettingsRecord {
  characterKey: string;
  value: LoaderSettings;
  updatedAt: number;
}

export interface CharacterIdentity {
  characterKey: string;
  displayName: string;
}

export interface CharacterBinding extends CharacterIdentity {
  packId: string;
  boundAt: number;
}

export interface HistoryScope {
  characterKey: string;
  chatKey: string;
  feature: 'letters' | 'stories';
}

export interface HistoryInput extends HistoryScope {
  content: string;
  prompt: string;
  apiSource: string;
  createdAt?: number;
}

export interface HistoryRecord extends HistoryScope {
  id: number;
  content: string;
  prompt: string;
  apiSource: string;
  createdAt: number;
}

export interface PackIdentitySummary {
  displayName: string;
  creator: string;
}

/**
 * 同 id、內容不同的角色包撞在一起。匯入流程收到它要問使用者，不准無聲覆蓋
 * （審查 P0-2：開放生態下兩個作者都做「小明」、或有人故意做同 id 的假冒包）。
 */
export class PackConflictError extends Error {
  readonly packId: string;
  readonly existing: PackIdentitySummary;
  readonly incoming: PackIdentitySummary;

  constructor(packId: string, existing: PackIdentitySummary, incoming: PackIdentitySummary) {
    super(
      `角色包 id「${packId}」已經存在：目前是「${existing.displayName}」（作者 ${existing.creator || '未填'}），` +
        `要匯入的是「${incoming.displayName}」（作者 ${incoming.creator || '未填'}），兩者內容不同。`,
    );
    this.name = 'PackConflictError';
    this.packId = packId;
    this.existing = existing;
    this.incoming = incoming;
  }
}

function identityOf(pack: ImportedResidentPack): PackIdentitySummary {
  return {
    displayName: pack.manifest.identity.displayName,
    creator: pack.manifest.identity.creator,
  };
}

function stableStringify(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(',')}]`;
  if (typeof value === 'object' && value !== null) {
    const record = value as Record<string, unknown>;
    return `{${Object.keys(record)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${stableStringify(record[key])}`)
      .join(',')}}`;
  }
  return JSON.stringify(value);
}

function sameBytes(a: Uint8Array, b: Uint8Array): boolean {
  if (a.byteLength !== b.byteLength) return false;
  for (let index = 0; index < a.byteLength; index += 1) {
    if (a[index] !== b[index]) return false;
  }
  return true;
}

/** manifest 逐鍵相等（不看鍵序）且圖集逐 byte 相等，才算同一個包。 */
export function samePackContent(a: ImportedResidentPack, b: ImportedResidentPack): boolean {
  return stableStringify(a.manifest) === stableStringify(b.manifest) && sameBytes(a.spritesheet, b.spritesheet);
}

function requestResult<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('IndexedDB request failed.'));
  });
}

function transactionComplete(transaction: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onabort = () => reject(transaction.error ?? new Error('IndexedDB transaction aborted.'));
    transaction.onerror = () => reject(transaction.error ?? new Error('IndexedDB transaction failed.'));
  });
}

function createStores(database: IDBDatabase): void {
  if (!database.objectStoreNames.contains('packs')) {
    database.createObjectStore('packs', { keyPath: 'id' });
  }
  if (!database.objectStoreNames.contains('bindings')) {
    database.createObjectStore('bindings', { keyPath: 'characterKey' });
  }
  if (!database.objectStoreNames.contains('history')) {
    const store = database.createObjectStore('history', { keyPath: 'id', autoIncrement: true });
    store.createIndex('scope', ['characterKey', 'chatKey', 'feature'], { unique: false });
  }
  if (!database.objectStoreNames.contains('settings')) {
    database.createObjectStore('settings', { keyPath: 'characterKey' });
  }
}

export class ResidentRepository {
  constructor(private readonly database: IDBDatabase) {}

  close(): void {
    this.database.close();
  }

  /**
   * 存入角色包。同 id 已存在時：內容相同＝當作重新匯入（更新 importedAt）；
   * 內容不同＝丟 PackConflictError、一個 byte 都不寫，除非呼叫端明確 `overwrite: true`。
   * 讀與寫在同一筆 readwrite 交易裡完成，兩次匯入撞在一起也不會互相蓋掉。
   */
  async putPack(pack: ImportedResidentPack, options: { overwrite?: boolean } = {}): Promise<void> {
    const record = { ...pack, id: pack.manifest.id } satisfies PackRecord;
    const transaction = this.database.transaction('packs', 'readwrite');
    const store = transaction.objectStore('packs');
    let conflict: PackConflictError | undefined;

    if (options.overwrite) {
      store.put(record);
    } else {
      const lookup = store.get(pack.manifest.id) as IDBRequest<PackRecord | undefined>;
      lookup.onsuccess = () => {
        const existing = lookup.result;
        if (existing && !samePackContent(existing, pack)) {
          conflict = new PackConflictError(pack.manifest.id, identityOf(existing), identityOf(pack));
          return;
        }
        store.put(record);
      };
    }

    await transactionComplete(transaction);
    if (conflict) throw conflict;
  }

  async getPack(packId: string): Promise<ImportedResidentPack | undefined> {
    const transaction = this.database.transaction('packs', 'readonly');
    const record = await requestResult(
      transaction.objectStore('packs').get(packId) as IDBRequest<PackRecord | undefined>,
    );
    await transactionComplete(transaction);
    if (!record) return undefined;
    const { id: _id, ...pack } = record;
    return pack;
  }

  async listPacks(): Promise<ImportedResidentPack[]> {
    const transaction = this.database.transaction('packs', 'readonly');
    const records = await requestResult(
      transaction.objectStore('packs').getAll() as IDBRequest<PackRecord[]>,
    );
    await transactionComplete(transaction);
    return records.map(({ id: _id, ...pack }) => pack).sort((a, b) => b.importedAt - a.importedAt);
  }

  async bindCharacter(identity: CharacterIdentity, packId: string): Promise<CharacterBinding> {
    if (!(await this.getPack(packId))) {
      throw new Error('找不到要綁定的角色包。');
    }
    const binding: CharacterBinding = {
      ...identity,
      packId,
      boundAt: Date.now(),
    };
    const transaction = this.database.transaction('bindings', 'readwrite');
    transaction.objectStore('bindings').put(binding);
    await transactionComplete(transaction);
    return binding;
  }

  async getBinding(characterKey: string): Promise<CharacterBinding | undefined> {
    const transaction = this.database.transaction('bindings', 'readonly');
    const binding = await requestResult(
      transaction.objectStore('bindings').get(characterKey) as IDBRequest<CharacterBinding | undefined>,
    );
    await transactionComplete(transaction);
    return binding;
  }

  async unbindCharacter(characterKey: string): Promise<void> {
    const transaction = this.database.transaction('bindings', 'readwrite');
    transaction.objectStore('bindings').delete(characterKey);
    await transactionComplete(transaction);
  }

  async putSettings(characterKey: string, value: unknown): Promise<LoaderSettings> {
    const settings = normalizeLoaderSettings(value);
    const transaction = this.database.transaction('settings', 'readwrite');
    transaction.objectStore('settings').put({
      characterKey,
      value: settings,
      updatedAt: Date.now(),
    } satisfies SettingsRecord);
    await transactionComplete(transaction);
    return settings;
  }

  async getSettings(characterKey: string): Promise<LoaderSettings | undefined> {
    const transaction = this.database.transaction('settings', 'readonly');
    const record = await requestResult(
      transaction.objectStore('settings').get(characterKey) as IDBRequest<SettingsRecord | undefined>,
    );
    await transactionComplete(transaction);
    return record?.value;
  }

  async addHistory(input: HistoryInput): Promise<number> {
    const record = {
      ...input,
      content: input.content.trim(),
      prompt: input.prompt,
      createdAt: input.createdAt ?? Date.now(),
    };
    if (!record.content) throw new Error('不能保存空白的生成紀錄。');

    const transaction = this.database.transaction('history', 'readwrite');
    const id = await requestResult(transaction.objectStore('history').add(record));
    await transactionComplete(transaction);
    if (typeof id !== 'number') throw new Error('生成紀錄沒有取得有效編號。');
    return id;
  }

  async listHistory(scope: HistoryScope): Promise<HistoryRecord[]> {
    const transaction = this.database.transaction('history', 'readonly');
    const records = await requestResult(
      transaction
        .objectStore('history')
        .index('scope')
        .getAll(IDBKeyRange.only([scope.characterKey, scope.chatKey, scope.feature])) as IDBRequest<
        HistoryRecord[]
      >,
    );
    await transactionComplete(transaction);
    return records.sort((a, b) => b.createdAt - a.createdAt || b.id - a.id);
  }

  async deleteHistory(id: number): Promise<void> {
    const transaction = this.database.transaction('history', 'readwrite');
    transaction.objectStore('history').delete(id);
    await transactionComplete(transaction);
  }
}

export async function openResidentRepository(options?: {
  databaseName?: string;
  indexedDBFactory?: IDBFactory;
}): Promise<ResidentRepository> {
  const factory = options?.indexedDBFactory ?? indexedDB;
  const request = factory.open(options?.databaseName ?? DEFAULT_DATABASE_NAME, DATABASE_VERSION);
  request.onupgradeneeded = () => createStores(request.result);
  const database = await requestResult(request);
  return new ResidentRepository(database);
}
