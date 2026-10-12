import type { CellaDB } from '../db';
import type { Ingredient, StockItem, TrackingType } from '../types';
import { alive } from './base';

/** 画面表示用に食材マスタの名前と管理タイプを付けた在庫 */
export interface StockView extends StockItem {
  name: string;
  tracking: TrackingType;
}

export async function listStockView(db: CellaDB): Promise<StockView[]> {
  const [stock, ingredients] = await Promise.all([db.stock.toArray(), db.ingredients.toArray()]);
  const byId = new Map<string, Ingredient>(ingredients.map((i) => [i.id, i]));
  return alive(stock).map((s) => {
    const ing = s.ingredientId ? byId.get(s.ingredientId) : undefined;
    return {
      ...s,
      name: s.kind === 'leftover' ? (s.label ?? '作り置き') : (ing?.name ?? '（不明な食材）'),
      // 作り置きは期限管理として扱う
      tracking: s.kind === 'leftover' ? 'expiry' : (ing?.tracking ?? 'expiry'),
    };
  });
}
