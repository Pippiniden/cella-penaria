import { useLiveQuery } from 'dexie-react-hooks';
import { Link } from 'react-router';
import { db } from '../../../data/db';
import { listStockView, type StockView } from '../../../data/repos/stock';
import { todayStr } from '../../../domain/date';
import { isExpiringSoon } from '../../../domain/expiry';
import { EmptyState } from '../../components/EmptyState';
import { ScreenHeader } from '../../components/ScreenHeader';

// 今日（ホーム）。docs/spec.md > 画面仕様 > 今日
// TODO(フェーズ2〜3): 期限が近い食材を使うレシピの提案、「質問で探す」「食材から探す」

export function HomeScreen() {
  const items = useLiveQuery(() => listStockView(db), [], [] as StockView[]);
  const today = todayStr();
  const expiring = items.filter((i) => i.tracking === 'expiry' && isExpiringSoon(i.expiresOn, today));

  return (
    <>
      <ScreenHeader title="今日" />
      <div className="mx-auto max-w-xl space-y-4 px-4">
        {expiring.length > 0 ? (
          <Link to="/stock" className="block rounded-xl bg-warn-bg px-4 py-3 text-warn">
            <p className="font-semibold">期限が近い {expiring.length}品</p>
            <p className="text-sm">{expiring.map((i) => i.name).join('・')}</p>
          </Link>
        ) : (
          <EmptyState message="期限が近い食材はありません" />
        )}
      </div>
    </>
  );
}
