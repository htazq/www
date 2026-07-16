const DB_NAME = 'at9-block-array';
const STORE = 'snapshots';
const KEY = 'current';

function openDatabase() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => request.result.createObjectStore(STORE);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveLocalBlocks(blocks: Uint8Array) {
  const db = await openDatabase();
  await new Promise<void>((resolve, reject) => {
    const transaction = db.transaction(STORE, 'readwrite');
    transaction.objectStore(STORE).put(blocks, KEY);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
  db.close();
}

export async function loadLocalBlocks() {
  const db = await openDatabase();
  const result = await new Promise<Uint8Array | undefined>((resolve, reject) => {
    const request = db.transaction(STORE, 'readonly').objectStore(STORE).get(KEY);
    request.onsuccess = () =>
      resolve(request.result instanceof Uint8Array ? request.result : undefined);
    request.onerror = () => reject(request.error);
  });
  db.close();
  return result;
}
