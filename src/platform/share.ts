// テキストの共有。docs/spec.md > PWA仕様 > 端末機能
// 共有画面が使えない端末ではクリップボードにコピーする。

export type ShareResult = 'shared' | 'copied' | 'cancelled' | 'failed';

export async function shareText(text: string, title?: string): Promise<ShareResult> {
  if (navigator.share) {
    try {
      await navigator.share({ text, title });
      return 'shared';
    } catch (e) {
      if (e instanceof DOMException && e.name === 'AbortError') return 'cancelled';
    }
  }
  try {
    await navigator.clipboard.writeText(text);
    return 'copied';
  } catch {
    return 'failed';
  }
}
