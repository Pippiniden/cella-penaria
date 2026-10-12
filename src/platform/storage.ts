// docs/spec.md > PWA仕様 > データの保全

/** ブラウザによるデータの自動削除を避けるよう要求する。結果（永続化されたか）を返す */
export async function requestPersist(): Promise<boolean> {
  if (!navigator.storage?.persist) return false;
  try {
    if (await navigator.storage.persisted()) return true;
    return await navigator.storage.persist();
  } catch {
    return false;
  }
}

export interface StorageInfo {
  persisted: boolean | null;
  usageBytes: number | null;
  quotaBytes: number | null;
}

export async function getStorageInfo(): Promise<StorageInfo> {
  const info: StorageInfo = { persisted: null, usageBytes: null, quotaBytes: null };
  try {
    if (navigator.storage?.persisted) info.persisted = await navigator.storage.persisted();
    if (navigator.storage?.estimate) {
      const e = await navigator.storage.estimate();
      info.usageBytes = e.usage ?? null;
      info.quotaBytes = e.quota ?? null;
    }
  } catch {
    // 非対応の端末では null のまま
  }
  return info;
}
