/**
 * Generic hook for quota data fetching and management.
 */

import { useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import type { AuthFileItem } from '@/types';
import { useQuotaStore } from '@/stores';
import { getStatusFromError } from '@/utils/quota';
import type { QuotaConfig } from './quotaConfigs';
import { loadSequentially } from './loadSequentially';

type QuotaScope = 'page' | 'all';

type QuotaUpdater<T> = T | ((prev: T) => T);

type QuotaSetter<T> = (updater: QuotaUpdater<T>) => void;

interface LoadQuotaResult<TData> {
  name: string;
  status: 'success' | 'error';
  data?: TData;
  error?: string;
  errorStatus?: number;
}

export function useQuotaLoader<TState, TData>(config: QuotaConfig<TState, TData>) {
  const { t } = useTranslation();
  const quota = useQuotaStore(config.storeSelector);
  const setQuota = useQuotaStore((state) => state[config.storeSetter]) as QuotaSetter<
    Record<string, TState>
  >;

  const loadingRef = useRef(false);
  const requestIdRef = useRef(0);

  const loadQuota = useCallback(
    async (
      targets: AuthFileItem[],
      scope: QuotaScope,
      setLoading: (loading: boolean, scope?: QuotaScope | null) => void
    ) => {
      if (loadingRef.current) return;
      loadingRef.current = true;
      const requestId = ++requestIdRef.current;
      setLoading(true, scope);

      try {
        if (targets.length === 0) return;

        await loadSequentially(targets, async (file): Promise<LoadQuotaResult<TData> | null> => {
          if (requestId !== requestIdRef.current) return null;

          setQuota((prev) => ({
            ...prev,
            [file.name]: config.buildLoadingState()
          }));

          try {
            const data = await config.fetchQuota(file, t);
            if (requestId !== requestIdRef.current) return null;

            setQuota((prev) => ({
              ...prev,
              [file.name]: config.buildSuccessState(data)
            }));

            return { name: file.name, status: 'success', data };
          } catch (err: unknown) {
            if (requestId !== requestIdRef.current) return null;

            const message = err instanceof Error ? err.message : t('common.unknown_error');
            const errorStatus = getStatusFromError(err);
            setQuota((prev) => ({
              ...prev,
              [file.name]: config.buildErrorState(message, errorStatus)
            }));

            return { name: file.name, status: 'error', error: message, errorStatus };
          }
        });
      } finally {
        if (requestId === requestIdRef.current) {
          setLoading(false);
          loadingRef.current = false;
        }
      }
    },
    [config, setQuota, t]
  );

  return { quota, loadQuota };
}
