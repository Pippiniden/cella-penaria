// 線画アイコン（24px グリッド）。色は currentColor に従う。

type Props = { className?: string };

const base = {
  width: 24,
  height: 24,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
};

export const IconToday = ({ className }: Props) => (
  <svg {...base} className={className}>
    <rect x="3.5" y="5" width="17" height="15" rx="2.5" />
    <path d="M3.5 9.5h17M8 3v4M16 3v4" />
    <circle cx="12" cy="14.5" r="1.6" />
  </svg>
);

export const IconStock = ({ className }: Props) => (
  <svg {...base} className={className}>
    <rect x="5" y="2.5" width="14" height="19" rx="2.5" />
    <path d="M5 9.5h14M8.5 5.5v2M8.5 12.5v4" />
  </svg>
);

export const IconRecipe = ({ className }: Props) => (
  <svg {...base} className={className}>
    <path d="M5 4.5A1.5 1.5 0 0 1 6.5 3H18v15H6.5A1.5 1.5 0 0 0 5 19.5z" />
    <path d="M5 19.5A1.5 1.5 0 0 0 6.5 21H18v-3M9 7.5h5M9 11h3" />
  </svg>
);

export const IconShopping = ({ className }: Props) => (
  <svg {...base} className={className}>
    <path d="M3 4h2.5l2 11h10l2-8H7" />
    <circle cx="9.5" cy="19" r="1.4" />
    <circle cx="16.5" cy="19" r="1.4" />
  </svg>
);

export const IconSettings = ({ className }: Props) => (
  <svg {...base} className={className}>
    <path d="M4 7h9M17 7h3M4 17h3M11 17h9" />
    <circle cx="15" cy="7" r="2" />
    <circle cx="9" cy="17" r="2" />
  </svg>
);

export const IconBack = ({ className }: Props) => (
  <svg {...base} className={className}>
    <path d="M15 5l-7 7 7 7" />
  </svg>
);
