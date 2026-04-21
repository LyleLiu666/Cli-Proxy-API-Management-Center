import { Suspense, useEffect } from 'react';
import { Outlet, RouterProvider, createHashRouter } from 'react-router-dom';
import { NotificationContainer } from '@/components/common/NotificationContainer';
import { ConfirmationModal } from '@/components/common/ConfirmationModal';
import { ProtectedRoute } from '@/router/ProtectedRoute';
import { RouteLoadingFallback } from '@/router/RouteLoadingFallback';
import { lazyRoute } from '@/router/lazyRoute';
import { useLanguageStore, useThemeStore } from '@/stores';

const LoginPage = lazyRoute(() => import('@/pages/LoginPage'), 'LoginPage');
const MainLayout = lazyRoute(() => import('@/components/layout/MainLayout'), 'MainLayout');

function RootShell() {
  return (
    <>
      <NotificationContainer />
      <ConfirmationModal />
      <Outlet />
    </>
  );
}

const router = createHashRouter([
  {
    element: <RootShell />,
    children: [
      { path: '/login', element: <LoginPage /> },
      {
        path: '/*',
        element: (
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

function App() {
  const initializeTheme = useThemeStore((state) => state.initializeTheme);
  const language = useLanguageStore((state) => state.language);
  const setLanguage = useLanguageStore((state) => state.setLanguage);

  useEffect(() => {
    const cleanupTheme = initializeTheme();
    return cleanupTheme;
  }, [initializeTheme]);

  useEffect(() => {
    setLanguage(language);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 仅用于首屏同步 i18n 语言

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <Suspense fallback={<RouteLoadingFallback />}>
      <RouterProvider router={router} />
    </Suspense>
  );
}

export default App;
