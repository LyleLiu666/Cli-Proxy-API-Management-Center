import { Suspense } from 'react';
import { Navigate, useRoutes, type Location } from 'react-router-dom';
import { RouteLoadingFallback } from '@/router/RouteLoadingFallback';
import { lazyRoute } from '@/router/lazyRoute';

const DashboardPage = lazyRoute(() => import('@/pages/DashboardPage'), 'DashboardPage');
const AiProvidersPage = lazyRoute(() => import('@/pages/AiProvidersPage'), 'AiProvidersPage');
const AiProvidersAmpcodeEditPage = lazyRoute(
  () => import('@/pages/AiProvidersAmpcodeEditPage'),
  'AiProvidersAmpcodeEditPage'
);
const AiProvidersClaudeEditLayout = lazyRoute(
  () => import('@/pages/AiProvidersClaudeEditLayout'),
  'AiProvidersClaudeEditLayout'
);
const AiProvidersClaudeEditPage = lazyRoute(
  () => import('@/pages/AiProvidersClaudeEditPage'),
  'AiProvidersClaudeEditPage'
);
const AiProvidersClaudeModelsPage = lazyRoute(
  () => import('@/pages/AiProvidersClaudeModelsPage'),
  'AiProvidersClaudeModelsPage'
);
const AiProvidersCodexEditPage = lazyRoute(
  () => import('@/pages/AiProvidersCodexEditPage'),
  'AiProvidersCodexEditPage'
);
const AiProvidersGeminiEditPage = lazyRoute(
  () => import('@/pages/AiProvidersGeminiEditPage'),
  'AiProvidersGeminiEditPage'
);
const AiProvidersOpenAIEditLayout = lazyRoute(
  () => import('@/pages/AiProvidersOpenAIEditLayout'),
  'AiProvidersOpenAIEditLayout'
);
const AiProvidersOpenAIEditPage = lazyRoute(
  () => import('@/pages/AiProvidersOpenAIEditPage'),
  'AiProvidersOpenAIEditPage'
);
const AiProvidersOpenAIModelsPage = lazyRoute(
  () => import('@/pages/AiProvidersOpenAIModelsPage'),
  'AiProvidersOpenAIModelsPage'
);
const AiProvidersVertexEditPage = lazyRoute(
  () => import('@/pages/AiProvidersVertexEditPage'),
  'AiProvidersVertexEditPage'
);
const AuthFilesPage = lazyRoute(() => import('@/pages/AuthFilesPage'), 'AuthFilesPage');
const AuthFilesOAuthExcludedEditPage = lazyRoute(
  () => import('@/pages/AuthFilesOAuthExcludedEditPage'),
  'AuthFilesOAuthExcludedEditPage'
);
const AuthFilesOAuthModelAliasEditPage = lazyRoute(
  () => import('@/pages/AuthFilesOAuthModelAliasEditPage'),
  'AuthFilesOAuthModelAliasEditPage'
);
const OAuthPage = lazyRoute(() => import('@/pages/OAuthPage'), 'OAuthPage');
const QuotaPage = lazyRoute(() => import('@/pages/QuotaPage'), 'QuotaPage');
const UsagePage = lazyRoute(() => import('@/pages/UsagePage'), 'UsagePage');
const ConfigPage = lazyRoute(() => import('@/pages/ConfigPage'), 'ConfigPage');
const LogsPage = lazyRoute(() => import('@/pages/LogsPage'), 'LogsPage');
const SystemPage = lazyRoute(() => import('@/pages/SystemPage'), 'SystemPage');

const mainRoutes = [
  { path: '/', element: <DashboardPage /> },
  { path: '/dashboard', element: <DashboardPage /> },
  { path: '/settings', element: <Navigate to="/config" replace /> },
  { path: '/api-keys', element: <Navigate to="/config" replace /> },
  { path: '/ai-providers/gemini/new', element: <AiProvidersGeminiEditPage /> },
  { path: '/ai-providers/gemini/:index', element: <AiProvidersGeminiEditPage /> },
  { path: '/ai-providers/codex/new', element: <AiProvidersCodexEditPage /> },
  { path: '/ai-providers/codex/:index', element: <AiProvidersCodexEditPage /> },
  {
    path: '/ai-providers/claude/new',
    element: <AiProvidersClaudeEditLayout />,
    children: [
      { index: true, element: <AiProvidersClaudeEditPage /> },
      { path: 'models', element: <AiProvidersClaudeModelsPage /> },
    ],
  },
  {
    path: '/ai-providers/claude/:index',
    element: <AiProvidersClaudeEditLayout />,
    children: [
      { index: true, element: <AiProvidersClaudeEditPage /> },
      { path: 'models', element: <AiProvidersClaudeModelsPage /> },
    ],
  },
  { path: '/ai-providers/vertex/new', element: <AiProvidersVertexEditPage /> },
  { path: '/ai-providers/vertex/:index', element: <AiProvidersVertexEditPage /> },
  {
    path: '/ai-providers/openai/new',
    element: <AiProvidersOpenAIEditLayout />,
    children: [
      { index: true, element: <AiProvidersOpenAIEditPage /> },
      { path: 'models', element: <AiProvidersOpenAIModelsPage /> },
    ],
  },
  {
    path: '/ai-providers/openai/:index',
    element: <AiProvidersOpenAIEditLayout />,
    children: [
      { index: true, element: <AiProvidersOpenAIEditPage /> },
      { path: 'models', element: <AiProvidersOpenAIModelsPage /> },
    ],
  },
  { path: '/ai-providers/ampcode', element: <AiProvidersAmpcodeEditPage /> },
  { path: '/ai-providers', element: <AiProvidersPage /> },
  { path: '/ai-providers/*', element: <AiProvidersPage /> },
  { path: '/auth-files', element: <AuthFilesPage /> },
  { path: '/auth-files/oauth-excluded', element: <AuthFilesOAuthExcludedEditPage /> },
  { path: '/auth-files/oauth-model-alias', element: <AuthFilesOAuthModelAliasEditPage /> },
  { path: '/oauth', element: <OAuthPage /> },
  { path: '/quota', element: <QuotaPage /> },
  { path: '/usage', element: <UsagePage /> },
  { path: '/config', element: <ConfigPage /> },
  { path: '/logs', element: <LogsPage /> },
  { path: '/system', element: <SystemPage /> },
  { path: '*', element: <Navigate to="/" replace /> },
];

export function MainRoutes({ location }: { location?: Location }) {
  return <Suspense fallback={<RouteLoadingFallback />}>{useRoutes(mainRoutes, location)}</Suspense>;
}
