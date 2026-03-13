import http from 'node:http';
import https from 'node:https';
import { buildQueryString } from './auth.js';
import { VirtualizorApiError } from './errors.js';
import type { Logger } from './logger';
import type { ApiParams, VirtualizorResponse } from './types/common.js';
import type { ResolvedConfig } from './types/config.js';

const CONNECTION_TIMEOUT = 5000;

export class HttpClient {
  private readonly agent: http.Agent | https.Agent;
  private readonly logger: Logger;

  constructor(private readonly config: ResolvedConfig) {
    const AgentClass = config.https ? https.Agent : http.Agent;
    this.agent = new AgentClass({
      keepAlive: true,
      maxSockets: 50,
      maxFreeSockets: 10,
      scheduling: 'lifo',
      ...(config.https ? { rejectUnauthorized: config.rejectUnauthorized } : {}),
    });
    this.logger = config.logger;
  }

  parseResponse<T extends VirtualizorResponse>(data: T): T {
    if (data.error && data.error.length > 0) {
      const first = data.error[0];
      if (first) {
        throw new VirtualizorApiError(first.msg, first.code);
      }
    }
    return data;
  }

  async request<T extends VirtualizorResponse>(
    act: string,
    queryParams: ApiParams = {},
    bodyParams: ApiParams = {},
  ): Promise<T> {
    const allQueryParams: ApiParams = { act, ...queryParams };
    const qs = buildQueryString(allQueryParams, this.config.apiKey, this.config.apiPass);

    if (this.config.debug) {
      const redactedQs = qs
        .replace(/adminapikey=[^&]*/, 'adminapikey=[REDACTED]')
        .replace(/adminapipass=[^&]*/, 'adminapipass=[REDACTED]');
      this.logger.debug(`Request: act=${act} path=/index.php${redactedQs}`);
    }

    const path = `/index.php${qs}`;

    const bodyString = Object.entries(bodyParams as Record<string, unknown>)
      .filter(([, v]) => v !== undefined)
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
      .join('&');

    try {
      const data = await this.rawRequest(path, bodyString || undefined);
      return this.parseResponse(data as T);
    } catch (err) {
      // Log the error when debug is enabled
      if (this.config.debug) {
        if (err instanceof VirtualizorApiError) {
          this.logger.error(`[Virtualizor] ● Error: [API Error ${err.code}] ${err.message}`);
        } else {
          this.logger.error(`[Virtualizor] ● Error: ${(err as Error).message}`);
        }
      }
      // Re-throw the error so callers can still handle it
      throw err;
    }
  }

  private validateJsonDepth(obj: unknown, depth = 0): void {
    const MAX_DEPTH = 100;
    if (depth > MAX_DEPTH) {
      throw new VirtualizorApiError('JSON depth limit exceeded', -32000);
    }
    if (typeof obj === 'object' && obj !== null) {
      if (Array.isArray(obj)) {
        for (const item of obj) {
          this.validateJsonDepth(item, depth + 1);
        }
      } else {
        for (const value of Object.values(obj as Record<string, unknown>)) {
          this.validateJsonDepth(value, depth + 1);
        }
      }
    }
  }

  destroy(): void {
    this.agent.destroy();
  }

  private rawRequest(path: string, body?: string): Promise<VirtualizorResponse> {
    const transport = this.config.https ? https : http;
    const options: https.RequestOptions = {
      host: this.config.host,
      port: this.config.port,
      path,
      method: body ? 'POST' : 'GET',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        ...(body ? { 'Content-Length': Buffer.byteLength(body) } : {}),
      },
      agent: this.agent,
    };

    return new Promise((resolve, reject) => {
      const req = transport.request(options, (res) => {
        const chunks: Buffer[] = [];

        res.on('data', (chunk: Buffer) => {
          chunks.push(chunk);
        });

        res.on('end', () => {
          const raw = Buffer.concat(chunks).toString('utf8');

          if (res.statusCode === 302 || res.statusCode === 301) {
            reject(
              new VirtualizorApiError(
                `Redirect detected (status ${res.statusCode}). Authentication failed. Location: ${res.headers.location}`,
                res.statusCode,
              ),
            );
            return;
          }

          try {
            const parsed = JSON.parse(raw);
            this.validateJsonDepth(parsed);
            resolve(parsed as VirtualizorResponse);
          } catch (err) {
            // Log the error when debug is enabled
            if (this.config.debug) {
              if (err instanceof VirtualizorApiError) {
                this.logger.error(`[Virtualizor] ● Error: [API Error ${err.code}] ${err.message}`);
              } else {
                this.logger.error(`[Virtualizor] ● Error: ${(err as Error).message}`);
              }
            }
            // Re-throw the error so callers can still handle it
            reject(
              new VirtualizorApiError(
                `Failed to parse response: ${(err as Error).message ?? 'Invalid JSON'}`,
                -32700,
              ),
            );
          }
        });

        res.on('error', (err) => {
          // Log the error when debug is enabled
          if (this.config.debug) {
            this.logger.error('[Virtualizor] ● Error: Response stream error', err as Error);
          }
          reject(
            new VirtualizorApiError(
              `Response stream error: ${(err as Error).message ?? 'Unknown error'}`,
              -32000,
            ),
          );
        });
      });

      const connectionTimer = setTimeout(() => {
        req.destroy(
          new VirtualizorApiError(`Connection timeout after ${CONNECTION_TIMEOUT}ms`, -32000),
        );
      }, CONNECTION_TIMEOUT);

      const requestTimer = setTimeout(() => {
        req.destroy(
          new VirtualizorApiError(`Request timed out after ${this.config.timeout}ms`, -32000),
        );
      }, this.config.timeout);

      req.once('socket', (socket) => {
        if (socket.connecting) {
          socket.once('connect', () => clearTimeout(connectionTimer));
        } else {
          clearTimeout(connectionTimer);
        }
      });

      req.once('close', () => {
        clearTimeout(connectionTimer);
        clearTimeout(requestTimer);
      });

      req.on('error', (err) => {
        if (err instanceof VirtualizorApiError) {
          reject(err);
        } else {
          reject(new VirtualizorApiError(`Request error ${err}`, -32000));
        }
      });

      if (body) {
        req.write(body);
      }

      req.end();
    });
  }
}
