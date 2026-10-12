// 調理中のスリープ防止。docs/spec.md > PWA仕様 > 端末機能
// 画面が非表示になると自動で解除されるため、表示に戻るたびに取り直す。
// 非対応の端末では何もしない。

/** スリープ防止を開始し、解除する関数を返す */
export function keepScreenAwake(): () => void {
  if (!('wakeLock' in navigator)) return () => {};
  let sentinel: WakeLockSentinel | null = null;
  let active = true;

  const acquire = async () => {
    if (!active || document.visibilityState !== 'visible') return;
    try {
      sentinel = await navigator.wakeLock.request('screen');
    } catch {
      sentinel = null;
    }
  };
  const onVisibility = () => {
    void acquire();
  };

  void acquire();
  document.addEventListener('visibilitychange', onVisibility);

  return () => {
    active = false;
    document.removeEventListener('visibilitychange', onVisibility);
    void sentinel?.release();
    sentinel = null;
  };
}
