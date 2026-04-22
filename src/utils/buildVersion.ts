export const DEFAULT_UPSTREAM_OWNER = 'router-for-me';

const GITHUB_OWNER_PATTERN = /github\.com[:/](?<owner>[^/]+)\/[^/]+?(?:\.git)?$/i;

export function normalizeForkVersionLabel(value?: string | null): string {
  return (value ?? '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function parseGitHubOwnerFromRemote(remoteUrl?: string | null): string | null {
  const match = (remoteUrl ?? '').trim().match(GITHUB_OWNER_PATTERN);
  return match?.groups?.owner ?? null;
}

export function isPlainReleaseVersion(version?: string | null): boolean {
  return /^v?\d+\.\d+\.\d+$/.test((version ?? '').trim());
}

export function isForkSpecificVersion(version: string, forkLabel: string): boolean {
  const normalizedVersion = version.trim().toLowerCase();
  const normalizedLabel = normalizeForkVersionLabel(forkLabel);

  if (!normalizedVersion) {
    return false;
  }

  return (
    normalizedVersion.includes('+fork.') ||
    normalizedVersion.includes('-fork.') ||
    (normalizedLabel ? normalizedVersion.includes(normalizedLabel) : false)
  );
}

export function formatBuildVersion(options: {
  rawVersion?: string | null;
  originRemoteUrl?: string | null;
  forkLabel?: string | null;
  upstreamOwner?: string | null;
}): string {
  const rawVersion = (options.rawVersion ?? '').trim() || 'dev';
  const upstreamOwner = normalizeForkVersionLabel(
    options.upstreamOwner ?? DEFAULT_UPSTREAM_OWNER
  );
  const originOwner = normalizeForkVersionLabel(
    parseGitHubOwnerFromRemote(options.originRemoteUrl) ?? ''
  );
  const forkLabel = normalizeForkVersionLabel(options.forkLabel) || originOwner;
  const isForkRepo = Boolean(forkLabel) && forkLabel !== upstreamOwner;

  if (!isForkRepo || isForkSpecificVersion(rawVersion, forkLabel)) {
    return rawVersion;
  }

  return rawVersion === 'dev' ? `dev+fork.${forkLabel}` : `${rawVersion}+fork.${forkLabel}`;
}
