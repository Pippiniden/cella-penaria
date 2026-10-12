import type Dexie from 'dexie';

// IndexedDB のスキーマ定義。保存する形を変えたら、ここに新しい version を追加する（CLAUDE.md ルール3）。
// 既存の version は書き換えない。古いデータへの初期値の補完は .upgrade() で行う。
// 注意: boolean はインデックスにできない（IndexedDB のキーにならない）。

/** 同期ファイル（data.json）の形式のバージョン。保存する形を変えたら 1 上げる */
export const DATA_SCHEMA_VERSION = 1;

export function applyMigrations(db: Dexie): void {
  db.version(1).stores({
    ingredients: 'id, name, updatedAt',
    stock: 'id, ingredientId, expiresOn, locationId, updatedAt',
    parts: 'id, updatedAt',
    recipes: 'id, updatedAt',
    tagAxes: 'id, order',
    shopping: 'id, updatedAt',
    cookLogs: 'id, recipeId, cookedOn',
    locations: 'id, order',
    categories: 'id, order',
    imageMeta: 'id, updatedAt',
    imageBlobs: 'id',
    thumbBlobs: 'id',
    foods: 'code, key',
    settings: 'key',
  });
}
