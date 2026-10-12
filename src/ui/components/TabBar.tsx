import { NavLink } from 'react-router';
import { IconRecipe, IconShopping, IconStock, IconToday } from './icons';

// 下部タブ。docs/spec.md > 画面仕様（タブ構成）

const tabs = [
  { to: '/', label: '今日', Icon: IconToday, end: true },
  { to: '/stock', label: '在庫', Icon: IconStock, end: false },
  { to: '/recipes', label: 'レシピ', Icon: IconRecipe, end: false },
  { to: '/shopping', label: '買い物', Icon: IconShopping, end: false },
];

export function TabBar() {
  return (
    <nav
      aria-label="メイン"
      className="pb-safe fixed inset-x-0 bottom-0 z-20 border-t border-line bg-surface/95 backdrop-blur"
    >
      <ul className="mx-auto flex max-w-xl">
        {tabs.map(({ to, label, Icon, end }) => (
          <li key={to} className="flex-1">
            <NavLink
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex min-h-14 flex-col items-center justify-center gap-0.5 text-[11px] ${
                  isActive ? 'text-accent' : 'text-muted'
                }`
              }
            >
              <Icon className="size-6" />
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
