import type { EntityTable, Table } from 'dexie';
import type { CellaDB } from '../db';
import type { ID, SyncMeta } from '../types';
import { getDeviceId } from './settings';

// 同期対象レコードの書き込みは必ずここを通す（CLAUDE.md ルール4・5）。
// updatedAt と deviceId を付け、削除は論理削除にする。

export function newId(): ID {
  return crypto.randomUUID();
}

/** 新規レコード用の SyncMeta（id は自動採番） */
export function blankMeta(): SyncMeta {
  return { id: newId(), updatedAt: 0, deletedAt: null, deviceId: '' };
}

/** 論理削除されていないものだけを返す */
export function alive<T extends SyncMeta>(rows: T[]): T[] {
  return rows.filter((r) => r.deletedAt === null);
}

/** 作成・更新。updatedAt と deviceId はここで上書きする */
export async function save<T extends SyncMeta>(
  db: CellaDB,
  table: EntityTable<T, 'id'>,
  record: T,
  now: number = Date.now(),
): Promise<T> {
  const deviceId = await getDeviceId(db);
  const stamped = { ...record, updatedAt: now, deviceId };
  await table.put(stamped);
  return stamped;
}

/** 論理削除。物理削除は同期の掃除処理だけが行う */
export async function softDelete<T extends SyncMeta>(
  db: CellaDB,
  table: EntityTable<T, 'id'>,
  id: ID,
  now: number = Date.now(),
): Promise<void> {
  // ジェネリックな EntityTable では get の型が解決できないため、キーの型を明示する
  const current = await (table as unknown as Table<T, ID>).get(id);
  if (!current || current.deletedAt !== null) return;
  const deviceId = await getDeviceId(db);
  await table.put({ ...current, deletedAt: now, updatedAt: now, deviceId });
}
