import type { Logger } from '../logger';

export interface VirtualizorConfig {
  host: string;
  apiKey: string;
  apiPass?: string;
  port?: number;
  https?: boolean;
  rejectUnauthorized?: boolean;
  timeout?: number;
  debug?: boolean;
  logger?: Logger;
  disableUpdateCheck?: boolean;
}

export interface ResolvedConfig {
  host: string;
  apiKey: string;
  apiPass: string;
  port: number;
  https: boolean;
  rejectUnauthorized: boolean;
  timeout: number;
  debug: boolean;
  logger: Logger;
  disableUpdateCheck: boolean;
}
