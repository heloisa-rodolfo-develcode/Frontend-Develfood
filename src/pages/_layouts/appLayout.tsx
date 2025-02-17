// pages/_layouts/appLayout.tsx
import { Outlet } from 'react-router-dom';

export function AppLayout() {
  return (
    <div>
      <h1>App Layout</h1>
      <Outlet />  {/* Renderiza o conteúdo das rotas filhas (home) */}
    </div>
  );
}
