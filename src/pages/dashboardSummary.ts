import type { Config } from '@/types';

export interface ProviderStats {
  gemini: number | null;
  codex: number | null;
  claude: number | null;
  openai: number | null;
}

export interface DashboardSummary {
  apiKeys: number | null;
  providerStats: ProviderStats;
  providerStatsReady: boolean;
  hasProviderStats: boolean;
  totalProviderKeys: number;
}

const getListLength = (value: unknown): number | null => (Array.isArray(value) ? value.length : null);

export function deriveDashboardSummary(config: Config | null | undefined): DashboardSummary {
  const providerStats: ProviderStats = {
    gemini: getListLength(config?.geminiApiKeys),
    codex: getListLength(config?.codexApiKeys),
    claude: getListLength(config?.claudeApiKeys),
    openai: getListLength(config?.openaiCompatibility),
  };

  const providerCounts = Object.values(providerStats);
  const providerStatsReady = providerCounts.every((count) => count !== null);
  const hasProviderStats = providerCounts.some((count) => count !== null);

  return {
    apiKeys: getListLength(config?.apiKeys),
    providerStats,
    providerStatsReady,
    hasProviderStats,
    totalProviderKeys: providerStatsReady
      ? providerCounts.reduce((sum, count) => sum + (count ?? 0), 0)
      : 0,
  };
}
