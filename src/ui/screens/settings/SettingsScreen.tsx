import { useLiveQuery } from 'dexie-react-hooks';
import { useEffect, useState } from 'react';
import { db } from '../../../data/db';
import { alive } from '../../../data/repos/base';
import { getStorageInfo, type StorageInfo } from '../../../platform/storage';
import { ScreenHeader } from '../../components/ScreenHeader';

// 設定。docs/spec.md > 画面仕様 > 設定
// TODO(フェーズ1): JSON エクスポート・インポート、マスタ類の編集画面
// TODO(フェーズ4): Google Drive 同期

function formatBytes(n: number | null): string {
  if (n === null) return '不明';
  if (n < 1024 * 1024) return `${Math.round(n / 1024)} KB`;
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
}

export function SettingsScreen() {
  const [storage, setStorage] = useState<StorageInfo | null>(null);
  const axes = useLiveQuery(async () => alive(await db.tagAxes.orderBy('order').toArray()), [], []);
  const categories = useLiveQuery(
    async () => alive(await db.categories.orderBy('order').toArray()),
    [],
    [],
  );

  useEffect(() => {
    void getStorageInfo().then(setStorage);
  }, []);

  return (
    <>
      <ScreenHeader title="設定" back right={null} />
      <div className="mx-auto max-w-xl space-y-6 px-4 pb-8">
        <section>
          <h2 className="px-1 pb-1 text-xs text-muted">データ</h2>
          <dl className="divide-y divide-line rounded-xl bg-surface text-sm">
            <div className="flex min-h-12 items-center justify-between px-4">
              <dt>データの保護</dt>
              <dd className="text-muted">
                {storage?.persisted === null || storage === null
                  ? '不明'
                  : storage.persisted
                    ? '自動削除されない'
                    : '未保護'}
              </dd>
            </div>
            <div className="flex min-h-12 items-center justify-between px-4">
              <dt>使用容量</dt>
              <dd className="text-muted">{formatBytes(storage?.usageBytes ?? null)}</dd>
            </div>
          </dl>
        </section>

        <section>
          <h2 className="px-1 pb-1 text-xs text-muted">タグ軸</h2>
          <ul className="divide-y divide-line rounded-xl bg-surface text-sm">
            {axes.map((a) => (
              <li key={a.id} className="px-4 py-3">
                <p className="font-semibold">
                  {a.name}
                  <span className="ml-2 font-normal text-muted">{a.question}</span>
                </p>
                <p className="mt-1 flex flex-wrap gap-1">
                  {a.values.map((v) => (
                    <span key={v.id} className="rounded-full border border-line px-2 py-0.5 text-xs">
                      {v.name}
                    </span>
                  ))}
                </p>
                {a.valueSource === 'minutes' && (
                  <p className="mt-1 text-xs text-muted">所要時間から自動で決まります</p>
                )}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="px-1 pb-1 text-xs text-muted">カテゴリ（売り場順）</h2>
          <p className="rounded-xl bg-surface px-4 py-3 text-sm">
            {categories.map((c) => c.name).join(' → ')}
          </p>
        </section>

        <p className="text-center text-xs text-muted">Cella Penaria</p>
      </div>
    </>
  );
}
