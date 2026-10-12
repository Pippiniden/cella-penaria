import type { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router';
import { IconBack, IconSettings } from './icons';

// 画面上部の見出し。右上は既定で設定へのリンク。

interface Props {
  title: string;
  /** 戻るボタンを出す */
  back?: boolean;
  /** 右上の中身を差し替える（null で何も出さない） */
  right?: ReactNode | null;
}

export function ScreenHeader({ title, back = false, right }: Props) {
  const navigate = useNavigate();
  return (
    <header className="pt-safe sticky top-0 z-10 bg-bg/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-xl items-center gap-1 px-2">
        {back ? (
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="grid size-11 place-items-center rounded-full text-ink"
            aria-label="戻る"
          >
            <IconBack className="size-6" />
          </button>
        ) : (
          <span className="w-2" />
        )}
        <h1 className="flex-1 truncate text-lg font-semibold">{title}</h1>
        {right === undefined ? (
          <Link
            to="/settings"
            className="grid size-11 place-items-center rounded-full text-muted"
            aria-label="設定"
          >
            <IconSettings className="size-6" />
          </Link>
        ) : (
          right
        )}
      </div>
    </header>
  );
}
