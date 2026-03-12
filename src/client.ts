import { DEFAULT_CONFIG } from './config/defaults.js';
import { HttpClient } from './http.js';
import { PlansResource } from './resources/plans.js';
import { TasksResource } from './resources/tasks.js';
import { UsersResource } from './resources/users.js';
import { VpsResource } from './resources/vps.js';
import type { ResolvedConfig, VirtualizorConfig } from './types/config.js';

export class VirtualizorClient {
  readonly vps: VpsResource;
  readonly users: UsersResource;
  readonly plans: PlansResource;
  readonly tasks: TasksResource;

  constructor(config: VirtualizorConfig) {
    const resolved: ResolvedConfig = {
      host: config.host,
      apiKey: config.apiKey,
      apiPass: config.apiPass ?? '',
      port: config.port ?? DEFAULT_CONFIG.port,
      https: config.https ?? DEFAULT_CONFIG.https,
      rejectUnauthorized: config.rejectUnauthorized ?? DEFAULT_CONFIG.rejectUnauthorized,
      timeout: config.timeout ?? DEFAULT_CONFIG.timeout,
      debug: config.debug ?? DEFAULT_CONFIG.debug,
    };
    const http = new HttpClient(resolved);
    this.vps = new VpsResource(http);
    this.users = new UsersResource(http);
    this.plans = new PlansResource(http);
    this.tasks = new TasksResource(http);
  }
}

export function createVirtualizorClient(config: VirtualizorConfig): VirtualizorClient {
  return new VirtualizorClient(config);
}
