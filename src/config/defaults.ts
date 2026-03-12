export const DEFAULT_CONFIG = {
  port: 4085,
  https: true,
  rejectUnauthorized: false,
  timeout: 30000,
  debug: false,
} as const;

export const DEFAULT_TASK_POLLING = {
  pollIntervalMs: 2000,
  timeoutMs: 120000,
} as const;
