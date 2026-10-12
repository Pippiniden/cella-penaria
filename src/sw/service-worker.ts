/// <reference lib="webworker" />
import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching';

// docs/spec.md > PWA仕様 > キャッシュ戦略
// アプリ本体と同梱データ（foods.json など）をインストール時にすべて事前キャッシュする。
// Google の認証・Drive API はキャッシュしない（ここで扱わないので常にネットワークへ行く）。

declare const self: ServiceWorkerGlobalScope & {
  __WB_MANIFEST: Array<{ url: string; revision: string | null } | string>;
};

cleanupOutdatedCaches();
precacheAndRoute(self.__WB_MANIFEST);

// 更新は画面の「更新」ボタンからの指示でだけ切り替える（調理中に勝手に変わらないように）
self.addEventListener('message', (event) => {
  if ((event.data as { type?: string } | null)?.type === 'SKIP_WAITING') {
    void self.skipWaiting();
  }
});
