import { Outlet, useLocation } from 'react-router';
import { TabBar } from '../ui/components/TabBar';
import { UpdatePrompt } from './sw-register';

// 全画面共通の枠。下部タブはエディタ・調理モード・質問フロー・設定では隠す。

const HIDE_TABS = [/^\/settings/, /^\/cook/, /^\/question/, /^\/edit/];

export function AppLayout() {
  const { pathname } = useLocation();
  const showTabs = !HIDE_TABS.some((re) => re.test(pathname));

  return (
    <div className={`min-h-full ${showTabs ? 'pb-[calc(4.5rem+env(safe-area-inset-bottom))]' : ''}`}>
      <Outlet />
      {showTabs && <TabBar />}
      <UpdatePrompt />
    </div>
  );
}
