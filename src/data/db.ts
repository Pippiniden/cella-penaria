import Dexie, { type EntityTable } from 'dexie';
import { applyMigrations } from './migrations';
import type {
  Category,
  CookLog,
  Food,
  ImageBlob,
  ImageMeta,
  Ingredient,
  Location,
  Part,
  Recipe,
  SettingRow,
  ShoppingItem,
  StockItem,
  TagAxis,
} from './types';

export class CellaDB extends Dexie {
  ingredients!: EntityTable<Ingredient, 'id'>;
  stock!: EntityTable<StockItem, 'id'>;
  parts!: EntityTable<Part, 'id'>;
  recipes!: EntityTable<Recipe, 'id'>;
  tagAxes!: EntityTable<TagAxis, 'id'>;
  shopping!: EntityTable<ShoppingItem, 'id'>;
  cookLogs!: EntityTable<CookLog, 'id'>;
  locations!: EntityTable<Location, 'id'>;
  categories!: EntityTable<Category, 'id'>;
  imageMeta!: EntityTable<ImageMeta, 'id'>;
  imageBlobs!: EntityTable<ImageBlob, 'id'>;
  thumbBlobs!: EntityTable<ImageBlob, 'id'>;
  foods!: EntityTable<Food, 'code'>;
  settings!: EntityTable<SettingRow, 'key'>;

  constructor(name = 'cella-penaria') {
    super(name);
    applyMigrations(this);
  }
}

/** アプリ全体で使う DB。テストでは new CellaDB('test-...') を使う */
export const db = new CellaDB();
