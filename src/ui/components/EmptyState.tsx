import type { ReactNode } from 'react';

// 空状態。短い説明1行と、次にすべき操作のボタン1つだけ。docs/spec.md > 画面仕様 > 共通部品

interface Props {
  message: string;
  action?: ReactNode;
}

export function EmptyState({ message, action }: Props) {
  return (
    <div className="flex flex-col items-center gap-4 px-6 py-16 text-center">
      <p className="text-sm text-muted">{message}</p>
      {action}
    </div>
  );
}
