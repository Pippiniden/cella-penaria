# Cella Penaria

冷蔵庫・調味料の在庫管理と、自作レシピの検索・提案を1つにしたスマホ向けPWA。個人用で、GitHub Pages で配信する。
「在庫 → 提案 → 調理 → 在庫の減算」のループを最少の操作で回せることを最優先にする。

- 仕様: [docs/spec.md](docs/spec.md)（「仕様書の節」はこのファイルの見出し名）
- 言語: 画面の文言・コメント・コミットメッセージは日本語

## コマンド

```sh
npm install
npm run dev        # 開発サーバー（http://localhost:5173/cella-penaria/）
npm test           # Vitest（tests/ 以下）
npm run typecheck  # アプリと Service Worker の型チェック
npm run build      # 型チェック → 本番ビルド（dist/）
npm run preview    # ビルド結果の確認（Service Worker も動く）
```

作業の最後に `npm test` と `npm run build` が通ることを確認する。

## 技術スタック

TypeScript / Vite / React / Tailwind CSS v4 / Dexie.js（IndexedDB）/ vite-plugin-pwa（injectManifest）/ react-router（ハッシュ方式）/ Vitest

## 構成

上の層から下の層へだけ依存する。計算の変更は domain、保存の変更は data、見た目の変更は ui の中で完結させる。

```
src/
  app/          起動・ルーティング・Service Worker の登録・更新通知
  ui/
    screens/    画面ごとに1フォルダ（home, stock, recipes, shopping, settings, …）
    components/ 共通部品（TabBar, ScreenHeader, EmptyState, …）
    theme/      theme.css（Tailwind の設定と色の変数。ダークモード込み）
  domain/       計算すべて。純粋関数のみ（UI・DB・ネットワークを import しない）
  data/
    types.ts    型の唯一の定義
    db.ts       Dexie の DB
    migrations.ts スキーマの version 定義と同期の schemaVersion
    seed.ts     初期データ（固定ID・updatedAt=0）
    repos/      読み書き。updatedAt と deviceId の付与はここだけ
  sync/         Google Drive 同期（フェーズ4）
  media/        画像の縮小・WebP 変換（フェーズ2以降）
  platform/     端末機能（スリープ防止、共有、ストレージ保護）
  config/       数値の初期値
  sw/           Service Worker
public/         manifest 用アイコン、foods.json（フェーズ5）
tools/build-foods/ 成分表 Excel → foods.json の変換（フェーズ5）
tests/          domain と data のテスト
```

## 変えたいこと → 触る場所

まだ存在しないファイルは、そのフェーズで作るときの置き場所を示す。

| 変えたいこと | 触る場所 | 仕様書の節 | 一緒に確認 |
| --- | --- | --- | --- |
| 数値の初期値（期限の境界、画像サイズ、同期間隔、猶予日数など） | src/config | 各節 | ― |
| 期限区分の分け方 | src/domain/expiry | 期限区分 | 冷蔵庫ビューの見出し（src/ui/screens/stock） |
| 在庫あり・なしの判定 | src/domain/availability | 在庫の有無 | 照合結果が変わる |
| 照合の段階、代用の判定 | src/domain/matching | 在庫照合 | tests/domain/matching |
| スロットの組み合わせの展開・上限 | src/domain/combinations | 組み合わせの展開 | 照合と栄養の両方 |
| おすすめ順、並べ替えの種類 | src/domain/ranking、src/ui/screens/recipes | 既定のおすすめ順 | ホームの提案も同じ順 |
| 質問の選び方、終了条件 | src/domain/questions | 質問の軸選択 | src/ui/screens/question |
| 検索のヒットの仕方 | src/domain/normalize | 表記揺れの正規化 | foods.json の検索キー（tools/build-foods で再生成） |
| まとめて追加の区切り方 | src/domain/bulk-parse | 表記揺れの正規化 | 在庫と買い物リストの両方で使う |
| 人数変更の分量の丸め | src/domain/scaling | 分量の換算 | 栄養計算にも倍率が効く |
| 栄養の計算方法 | src/domain/nutrition | 栄養計算 | ― |
| 栄養の表示項目を増やす | tools/build-foods → public/foods.json → src/domain/nutrition → src/ui/screens/recipe-detail | 栄養計算、成分表データ変換仕様 | foods.json の版を上げる |
| 作ったときの在庫の減らし方 | src/domain/deduction、src/ui/screens/cooked-sheet | 作ったときの在庫減算 | 元に戻すの一括取り消し |
| 買い物リストの並び | src/domain/shopping-order | 買い物リストの並び | カテゴリの順はデータ側（設定画面） |
| 保存するデータの項目を増やす・変える | src/data/types → src/data/migrations → 同期の schemaVersion → 該当するエディタ | データ仕様 | 下のルール3 |
| 初期の保管場所・カテゴリ・タグ | src/data/seed | 初期データ | 既に使っている端末には入らない |
| 1つの画面の表示・配置・操作 | src/ui/screens/画面名 | 画面仕様の該当画面 | ― |
| 追加シート、元に戻すバーなど共通部品 | src/ui/components/部品名 | 共通部品 | 全画面に影響 |
| 色、文字サイズ、余白 | src/ui/theme/theme.css | 画面の安全領域 | ダークモード |
| タブ構成、画面のつながり | src/app/router、src/ui/components/TabBar | 画面遷移 | src/app/AppLayout（タブを隠す画面） |
| 同期のタイミング | src/sync/runner | 同期のタイミング | ― |
| マージの規則 | src/sync/merge | マージ規則 | tests/sync/merge（必須） |
| Google の認証 | src/sync/auth | 認証 | ― |
| 画像の縮小・形式 | src/media/process-image | 画像処理仕様 | 既存の画像は変わらない |
| 使わない画像の削除 | src/sync/orphans | 画像の掃除 | ― |
| エクスポート・インポート | src/sync/export-import | JSONエクスポートとインポート | マージ規則を共有 |
| オフライン時のキャッシュ対象 | src/sw/service-worker、vite.config.ts | キャッシュ戦略 | ― |
| 更新のお知らせの出し方 | src/app/sw-register | 更新 | ― |
| アプリ名、アイコン | vite.config.ts（manifest）、index.html、public/icons | manifest | iOS 用アイコン |
| スリープ防止、共有 | src/platform/wake-lock、src/platform/share | 端末機能 | 非対応端末での動作 |

## 変更時のルール

1. ロジックは src/domain に純粋関数で書く。画面・DB・ネットワークを読み込まない。変更したら tests/domain のテストを追加・更新する
2. 型の定義は src/data/types.ts だけに置く。画面側で同じ形の型を作り直さない
3. 保存するデータの形を変えたら、types、migrations（Dexie の version を1つ追加）、`DATA_SCHEMA_VERSION`（1上げる）の3点を同時に変える。既存の version 定義は書き換えない
4. updatedAt と deviceId は src/data/repos の中だけで設定する（`save` / `softDelete`）。画面や domain から直接書かない（同期の前提が崩れるため）
5. 削除は必ず deletedAt による論理削除にする。物理削除は同期の180日掃除だけ。一覧表示では `alive()` で除く
6. 画像は書き換えない。差し替えは新しいIDで保存する
7. 数値の初期値は src/config に集め、コードの中に直接書かない
8. 動きを変えたら、docs/spec.md の該当節も同じ作業の中で更新する
9. 初期データの ID は固定値にする（端末ごとに投入したものが同期で二重にならないように）
10. 日付は 'YYYY-MM-DD' の文字列で扱い、計算は src/domain/date を使う
11. IndexedDB では boolean をインデックスにできない。checked などは読み込んでから絞り込む

## 画面づくりの約束

- スマホ縦画面が基本。頻繁に押すものは画面下半分に置き、タップ領域は最小 44×44px
- 色はテーマの変数（bg / surface / surface-2 / ink / muted / line / accent / danger / warn / ok）だけを使う。直接の色指定はしない
- 色だけに意味を持たせない（期限は「今日」「3日」などの文字も出す）
- 確認ダイアログより「元に戻す」を優先する（エディタの未保存確認だけは例外）
- 空状態は短い説明1行と次の操作のボタン1つだけ
- ノッチ・ホームバーの余白は `pt-safe` / `pb-safe` か `env(safe-area-inset-*)` で取る

## 依頼の書き方（例）

```text
【変えたいこと】おすすめ順で、期限切れの食材を使うレシピを最優先にしたい
【触る場所】src/domain/ranking
【仕様書】ロジック仕様 > 既定のおすすめ順
【確認】tests/domain/ranking を追加し、ホームの提案も同じ順になること
```

## 開発フェーズ

1. 基盤と在庫：食材マスタ、在庫の2タイプ、食材追加シート、買い物リスト、JSONエクスポート ← 次はここ
2. レシピ：パーツとレシピのエディタ（スロット込み）、レシピ詳細、在庫照合、「作った」での在庫減算
3. 提案：質問による絞り込み、代用ルールと上書き、期限優先の提案
4. 同期：Google Drive 連携、論理削除を含むマージ
5. 栄養：成分表の変換スクリプト、単位換算、栄養計算
6. 以降：レシピテキストの取り込み、バーコード読み取り、スロット間の組み合わせ除外ルールなど
