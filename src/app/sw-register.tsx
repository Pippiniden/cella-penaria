import { useRegisterSW } from 'virtual:pwa-register/react';

// 新しいバージョンの通知。docs/spec.md > PWA仕様 > 更新
// 待機中の Service Worker は「更新」を押したときだけ有効化する。

export function UpdatePrompt() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW();

  if (!needRefresh) return null;

  return (
    <div
      role="status"
      className="fixed inset-x-3 bottom-[calc(4.5rem+env(safe-area-inset-bottom))] z-30 mx-auto flex max-w-xl items-center gap-3 rounded-xl bg-ink px-4 py-3 text-sm text-bg shadow-lg"
    >
      <span className="flex-1">新しいバージョンがあります</span>
      <button type="button" className="px-2 py-1 opacity-70" onClick={() => setNeedRefresh(false)}>
        あとで
      </button>
      <button
        type="button"
        className="rounded-lg bg-accent px-3 py-1.5 font-semibold text-on-accent"
        onClick={() => void updateServiceWorker(true)}
      >
        更新
      </button>
    </div>
  );
}
