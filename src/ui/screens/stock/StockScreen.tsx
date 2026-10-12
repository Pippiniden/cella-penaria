import { useLiveQuery } from 'dexie-react-hooks';
import { useState } from 'react';
import { db } from '../../../data/db';
import { listStockView, type StockView } from '../../../data/repos/stock';
import { todayStr } from '../../../domain/date';
import {
  EXPIRY_BUCKET_LABEL,
  EXPIRY_BUCKET_ORDER,
  expiryBucket,
  expiryLabel,
  type ExpiryBucket,
} from '../../../domain/expiry';
import { EmptyState } from '../../components/EmptyState';
import { ScreenHeader } from '../../components/ScreenHeader';

// 在庫。docs/spec.md > 画面仕様 > 在庫
// TODO(フェーズ1): 保管場所チップ、スワイプ操作、編集シート、残量の切り替え

type View = 'fridge' | 'pantry';

const LEVEL_LABEL = { enough: 'ある', low: '少ない', none: 'ない' } as const;

const BADGE: Record<ExpiryBucket, string> = {
  expired: 'bg-danger-bg text-danger',
  soon: 'bg-danger-bg text-danger',
  week: 'bg-warn-bg text-warn',
  later: 'text-muted',
  none: 'text-muted',
};

export function StockScreen() {
  const [view, setView] = useState<View>('fridge');
  const items = useLiveQuery(() => listStockView(db), [], [] as StockView[]);
  const today = todayStr();

  const fridge = items
    .filter((i) => i.tracking === 'expiry')
    .sort((a, b) => (a.expiresOn ?? '9999').localeCompare(b.expiresOn ?? '9999'));
  const pantry = items.filter((i) => i.tracking === 'quantity');

  return (
    <>
      <ScreenHeader title="在庫" />
      <div className="mx-auto max-w-xl px-4">
        <div role="tablist" className="mb-2 grid grid-cols-2 rounded-xl bg-surface-2 p-1 text-sm">
          {(
            [
              ['fridge', '冷蔵庫'],
              ['pantry', '調味料・ストック'],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              role="tab"
              type="button"
              aria-selected={view === key}
              onClick={() => setView(key)}
              className={`min-h-10 rounded-lg ${view === key ? 'bg-surface font-semibold shadow-sm' : 'text-muted'}`}
            >
              {label}
            </button>
          ))}
        </div>

        {view === 'fridge' ? (
          fridge.length === 0 ? (
            <EmptyState message="冷蔵庫の食材はまだありません" />
          ) : (
            EXPIRY_BUCKET_ORDER.map((bucket) => {
              const rows = fridge.filter((i) => expiryBucket(i.expiresOn, today) === bucket);
              if (rows.length === 0) return null;
              return (
                <section key={bucket} className="mt-3">
                  <h2 className="px-1 pb-1 text-xs text-muted">{EXPIRY_BUCKET_LABEL[bucket]}</h2>
                  <ul className="divide-y divide-line rounded-xl bg-surface">
                    {rows.map((i) => (
                      <li key={i.id} className="flex min-h-12 items-center justify-between px-4">
                        <span>
                          {i.name}
                          {i.count !== null && <span className="ml-1 text-muted">×{i.count}</span>}
                        </span>
                        <span className={`rounded-md px-2 py-0.5 text-xs ${BADGE[bucket]}`}>
                          {expiryLabel(i.expiresOn, today)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </section>
              );
            })
          )
        ) : pantry.length === 0 ? (
          <EmptyState message="調味料・ストックはまだありません" />
        ) : (
          <ul className="mt-3 divide-y divide-line rounded-xl bg-surface">
            {pantry.map((i) => (
              <li key={i.id} className="flex min-h-12 items-center justify-between px-4">
                <span>{i.name}</span>
                <span className={i.level === 'enough' ? 'text-muted' : 'text-warn'}>
                  {LEVEL_LABEL[i.level]}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
