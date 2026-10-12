import { EmptyState } from '../../components/EmptyState';
import { ScreenHeader } from '../../components/ScreenHeader';

// 買い物リスト。docs/spec.md > 画面仕様 > 買い物リスト
// TODO(フェーズ1): 追加欄、カテゴリ順の表示、チェック、在庫への登録、共有

export function ShoppingScreen() {
  return (
    <>
      <ScreenHeader title="買い物" />
      <div className="mx-auto max-w-xl px-4">
        <EmptyState message="買い物リストは空です" />
      </div>
    </>
  );
}
