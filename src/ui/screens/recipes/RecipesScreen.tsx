import { EmptyState } from '../../components/EmptyState';
import { ScreenHeader } from '../../components/ScreenHeader';

// レシピ一覧。docs/spec.md > 画面仕様 > レシピ一覧
// TODO(フェーズ2): 一覧、検索、並べ替え、おまかせ、レシピ・パーツの新規作成

export function RecipesScreen() {
  return (
    <>
      <ScreenHeader title="レシピ" />
      <div className="mx-auto max-w-xl px-4">
        <EmptyState message="レシピはまだありません" />
      </div>
    </>
  );
}
