import { type Logger, colors, createUpdateBox, symbols } from './logger';

const REGISTRY_URL = 'https://registry.npmjs.org/virtualizorjs/latest';

interface NpmRegistryResponse {
  version: string;
}

async function fetchNpmRegistry(timeout: number): Promise<NpmRegistryResponse> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(REGISTRY_URL, { signal: controller.signal });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return (await response.json()) as Promise<NpmRegistryResponse>;
  } finally {
    clearTimeout(timeoutId);
  }
}

function isNewerVersion(current: string, latest: string): boolean {
  const c = current.split('.').map(Number);
  const l = latest.split('.').map(Number);
  return (
    (l[0] ?? 0) > (c[0] ?? 0) ||
    ((l[0] ?? 0) === (c[0] ?? 0) && (l[1] ?? 0) > (c[1] ?? 0)) ||
    ((l[0] ?? 0) === (c[0] ?? 0) && (l[1] ?? 0) === (c[1] ?? 0) && (l[2] ?? 0) > (c[2] ?? 0))
  );
}

let updateChecked = false;

export async function checkForUpdates(
  currentVersion: string,
  logger: Logger,
  options?: { timeout?: number; force?: boolean },
): Promise<void> {
  if (updateChecked && !options?.force) return;
  updateChecked = true;

  try {
    const response = await fetchNpmRegistry(options?.timeout ?? 2000);
    const latestVersion = response.version;

    if (!isNewerVersion(currentVersion, latestVersion)) return;

    logger.warn(`Update available: ${currentVersion} → ${latestVersion}`);
    console.log();
    console.log(createUpdateBox(currentVersion, latestVersion));
    console.log();
  } catch {
    // Silently fail
  }
}
