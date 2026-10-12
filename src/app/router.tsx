import { createHashRouter } from 'react-router';
import { HomeScreen } from '../ui/screens/home/HomeScreen';
import { RecipesScreen } from '../ui/screens/recipes/RecipesScreen';
import { SettingsScreen } from '../ui/screens/settings/SettingsScreen';
import { ShoppingScreen } from '../ui/screens/shopping/ShoppingScreen';
import { StockScreen } from '../ui/screens/stock/StockScreen';
import { AppLayout } from './AppLayout';

// 画面遷移。docs/spec.md > 画面遷移
// GitHub Pages は途中の URL で再読み込みすると 404 になるため、ハッシュ方式（#/recipes）にする。

export const router = createHashRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <HomeScreen /> },
      { path: 'stock', element: <StockScreen /> },
      { path: 'recipes', element: <RecipesScreen /> },
      { path: 'shopping', element: <ShoppingScreen /> },
      { path: 'settings', element: <SettingsScreen /> },
    ],
  },
]);
