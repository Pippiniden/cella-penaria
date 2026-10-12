import type { CellaDB } from './db';
import type { Category, Location, SyncMeta, TagAxis } from './types';

// 初回起動時に入れる初期データ。docs/spec.md > データ仕様 > 初期データ
//
// ID は固定値にする。端末ごとにランダムな ID で投入すると、同期したときに同じものが二重になるため。
// updatedAt は 0 にして、利用者が編集した値が同期で必ず勝つようにする。
// 既に使っている端末には再投入しない（ストアが空のときだけ入れる）。

const meta = (id: string): SyncMeta => ({ id, updatedAt: 0, deletedAt: null, deviceId: 'seed' });

export const seedLocations: Location[] = [
  { ...meta('loc-fridge'), name: '冷蔵', order: 1 },
  { ...meta('loc-freezer'), name: '冷凍', order: 2 },
  { ...meta('loc-vegetable'), name: '野菜室', order: 3 },
  { ...meta('loc-room'), name: '常温', order: 4 },
  { ...meta('loc-seasoning'), name: '調味料棚', order: 5 },
];

/** order は売り場の順（買い物リストの並び） */
export const seedCategories: Category[] = [
  { ...meta('cat-vegetable'), name: '野菜', order: 1 },
  { ...meta('cat-fruit'), name: '果物', order: 2 },
  { ...meta('cat-meat'), name: '肉', order: 3 },
  { ...meta('cat-seafood'), name: '魚介', order: 4 },
  { ...meta('cat-egg'), name: '卵', order: 5 },
  { ...meta('cat-dairy'), name: '乳製品', order: 6 },
  { ...meta('cat-soy'), name: '豆腐・大豆製品', order: 7 },
  { ...meta('cat-processed'), name: '加工品', order: 8 },
  { ...meta('cat-staple'), name: '主食', order: 9 },
  { ...meta('cat-dry'), name: '乾物', order: 10 },
  { ...meta('cat-seasoning'), name: '調味料', order: 11 },
  { ...meta('cat-other'), name: 'その他', order: 12 },
];

export const seedTagAxes: TagAxis[] = [
  {
    ...meta('axis-role'),
    name: '位置づけ',
    question: '何を作る？',
    values: [
      { id: 'role-main', name: '主菜' },
      { id: 'role-side', name: '副菜' },
      { id: 'role-soup', name: '汁物' },
      { id: 'role-staple', name: '主食' },
      { id: 'role-onedish', name: '一品で完結' },
    ],
    askable: true,
    order: 1,
    valueSource: 'manual',
    partTaggable: false,
  },
  {
    ...meta('axis-hero'),
    name: '主役',
    question: '何を食べたい？',
    values: [
      { id: 'hero-meat', name: '肉' },
      { id: 'hero-seafood', name: '魚介' },
      { id: 'hero-vegetable', name: '野菜' },
      { id: 'hero-egg-soy', name: '卵・大豆製品' },
    ],
    askable: true,
    order: 2,
    valueSource: 'manual',
    partTaggable: false,
  },
  {
    ...meta('axis-genre'),
    name: 'ジャンル',
    question: 'どこの料理？',
    values: [
      { id: 'genre-washoku', name: '和食' },
      { id: 'genre-yoshoku', name: '洋食（日本式）' },
      { id: 'genre-italian', name: 'イタリアン' },
      { id: 'genre-french', name: 'フレンチ' },
      { id: 'genre-mediterranean', name: 'スペイン・地中海' },
      { id: 'genre-chinese', name: '中華' },
      { id: 'genre-korean', name: '韓国' },
      { id: 'genre-southeast-asian', name: '東南アジア' },
      { id: 'genre-indian-middle-east', name: 'インド・中東' },
      { id: 'genre-latin', name: 'メキシコ・中南米' },
      { id: 'genre-other', name: 'その他' },
    ],
    askable: true,
    order: 3,
    valueSource: 'manual',
    partTaggable: true,
  },
  {
    ...meta('axis-mood'),
    name: '気分',
    question: 'どんな気分？',
    values: [
      { id: 'mood-light', name: 'さっぱり' },
      { id: 'mood-normal', name: 'ふつう' },
      { id: 'mood-rich', name: 'こってり' },
    ],
    askable: true,
    order: 4,
    valueSource: 'manual',
    partTaggable: true,
  },
  {
    ...meta('axis-method'),
    name: '調理法',
    question: 'どう作る？',
    values: [
      { id: 'method-grill', name: '焼く・炒める' },
      { id: 'method-simmer', name: '煮る' },
      { id: 'method-fry', name: '揚げる' },
      { id: 'method-steam', name: '蒸す・レンジ' },
      { id: 'method-raw', name: '和える・生' },
    ],
    askable: true,
    order: 5,
    valueSource: 'manual',
    partTaggable: true,
  },
  {
    ...meta('axis-time'),
    name: '手間',
    question: '時間はどれくらい？',
    values: [
      { id: 'time-quick', name: '15分以内', maxMinutes: 15 },
      { id: 'time-normal', name: '30分くらい', maxMinutes: 30 },
      { id: 'time-long', name: 'じっくり', maxMinutes: null },
    ],
    askable: true,
    order: 6,
    valueSource: 'minutes',
    partTaggable: false,
  },
  {
    ...meta('axis-temp'),
    name: '温度',
    question: '温かいのと冷たいの、どっち？',
    values: [
      { id: 'temp-hot', name: '温かい' },
      { id: 'temp-cold', name: '冷たい' },
    ],
    askable: true,
    order: 7,
    valueSource: 'manual',
    partTaggable: true,
  },
];

/** 各ストアが空のときだけ初期データを入れる */
export async function seedIfEmpty(db: CellaDB): Promise<void> {
  await db.transaction('rw', [db.locations, db.categories, db.tagAxes], async () => {
    if ((await db.locations.count()) === 0) await db.locations.bulkPut(seedLocations);
    if ((await db.categories.count()) === 0) await db.categories.bulkPut(seedCategories);
    if ((await db.tagAxes.count()) === 0) await db.tagAxes.bulkPut(seedTagAxes);
  });
}
