# Cella Penaria

冷蔵庫・調味料の在庫管理と、自作レシピの検索・提案を1つにしたスマホ向けPWA（個人用）。
名前はラテン語で「食料の貯蔵庫」。

公開先: https://pippiniden.github.io/cella-penaria/

## 使い方（開発）

```sh
npm install
npm run dev     # http://localhost:5173/cella-penaria/
npm test
npm run build
```

- 仕様: [docs/spec.md](docs/spec.md)
- AI に作業を頼むときの案内（構成・変更箇所・ルール）: [CLAUDE.md](CLAUDE.md)

## 公開

main に push すると GitHub Actions がテスト・ビルドして GitHub Pages に公開する。
初回だけ、リポジトリの Settings → Pages → Build and deployment の Source を「GitHub Actions」にする。

## インストール

スマホのブラウザで公開先を開き、ホーム画面に追加する（iPhone は Safari の共有メニュー →「ホーム画面に追加」）。
