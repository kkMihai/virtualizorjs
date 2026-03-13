import { DEFAULT_CONFIG } from './config/defaults.js';
import { VirtualizorApiError } from './errors.js';
import { HttpClient } from './http.js';
import { type Logger, defaultLogger } from './logger';
import { PlansResource } from './resources/plans.js';
import { TasksResource } from './resources/tasks.js';
import { UsersResource } from './resources/users.js';
import { VpsResource } from './resources/vps.js';
import type { ResolvedConfig, VirtualizorConfig } from './types/config.js';
import { checkForUpdates } from './utils/update-check';

const PACKAGE_VERSION = require('../package.json').version as string;

export class VirtualizorClient {
  readonly vps: VpsResource;
  readonly users: UsersResource;
  readonly plans: PlansResource;
  readonly tasks: TasksResource;
  readonly logger: Logger;

  constructor(config: VirtualizorConfig) {
    const logger = config.logger ?? defaultLogger;
    this.logger = logger;

    const resolved: ResolvedConfig = {
      host: config.host,
      apiKey: config.apiKey,
      apiPass: config.apiPass ?? '',
      port: config.port ?? DEFAULT_CONFIG.port,
      https: config.https ?? DEFAULT_CONFIG.https,
      rejectUnauthorized: config.rejectUnauthorized ?? DEFAULT_CONFIG.rejectUnauthorized,
      timeout: config.timeout ?? DEFAULT_CONFIG.timeout,
      debug: config.debug ?? DEFAULT_CONFIG.debug,
      logger,
      disableUpdateCheck: config.disableUpdateCheck ?? false,
    };

    const http = new HttpClient(resolved);
    this.vps = new VpsResource(http);
    this.users = new UsersResource(http);
    this.plans = new PlansResource(http);
    this.tasks = new TasksResource(http);

    if (!resolved.disableUpdateCheck) {
      checkForUpdates(PACKAGE_VERSION, logger).catch(() => {});
    }
  }
}

export function createVirtualizorClient(config: VirtualizorConfig): VirtualizorClient {
  return new VirtualizorClient(config);
}

export { VirtualizorApiError };
