import type { CellaDB } from '../db';

// 端末ごとの設定（同期しない）。

export async function getSetting<T>(db: CellaDB, key: string): Promise<T | undefined> {
  const row = await db.settings.get(key);
  return row?.value as T | undefined;
}

export async function setSetting(db: CellaDB, key: string, value: unknown): Promise<void> {
  await db.settings.put({ key, value });
}

/** この端末の ID。初回に作って保存する */
export async function getDeviceId(db: CellaDB): Promise<string> {
  const existing = await getSetting<string>(db, 'deviceId');
  if (existing) return existing;
  const id = crypto.randomUUID();
  await setSetting(db, 'deviceId', id);
  return id;
}
