import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router';
import { bootstrap } from './app/bootstrap';
import { router } from './app/router';
import './ui/theme/theme.css';

const root = document.getElementById('root');
if (!root) throw new Error('#root が見つかりません');

void bootstrap().finally(() => {
  createRoot(root).render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>,
  );
});
