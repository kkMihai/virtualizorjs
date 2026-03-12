export interface VirtualizorConfig {
  host: string;
  apiKey: string;
  apiPass?: string;
  port?: number;
  https?: boolean;
  rejectUnauthorized?: boolean;
  timeout?: number;
}

export interface ResolvedConfig {
  host: string;
  apiKey: string;
  apiPass: string;
  port: number;
  https: boolean;
  rejectUnauthorized: boolean;
  timeout: number;
}
