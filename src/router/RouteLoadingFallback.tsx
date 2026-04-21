import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export function RouteLoadingFallback() {
  return (
    <div
      aria-busy="true"
      style={{
        minHeight: '40vh',
        display: 'grid',
        placeItems: 'center',
        width: '100%',
      }}
    >
      <LoadingSpinner size={28} />
    </div>
  );
}
