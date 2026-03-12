import http from 'node:http';
import https from 'node:https';
import { buildQueryString } from './auth.js';
import type { VirtualizorResponse } from './types/common.js';
import type { ResolvedConfig } from './types/config.js';

export class VirtualizorApiError extends Error {
  readonly code: number;

  constructor(message: string, code: number) {
    super(message);
    this.name = 'VirtualizorApiError';
    this.code = code;
  }
}

type Params = Record<string, string | number | undefined>;

export class HttpClient {
  constructor(private readonly config: ResolvedConfig) {}

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
    queryParams: Params = {},
    bodyParams: Params = {},
  ): Promise<T> {
    const allQueryParams: Params = { act, ...queryParams };
    const qs = buildQueryString(allQueryParams, this.config.apiKey, this.config.apiPass);

    const path = `/index.php${qs}`;

    const bodyString = Object.entries(bodyParams)
      .filter(([, v]) => v !== undefined)
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
      .join('&');

    const data = await this.rawRequest(path, bodyString || undefined);
    return this.parseResponse(data as T);
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
      ...(this.config.https
        ? { agent: new https.Agent({ rejectUnauthorized: this.config.rejectUnauthorized }) }
        : {}),
    };

    return new Promise((resolve, reject) => {
      const req = transport.request(options, (res) => {
        let raw = '';
        res.on('data', (chunk: Buffer) => {
          raw += chunk.toString();
        });
        res.on('end', () => {
          // Handle redirect (302) - usually means auth failed
          if (res.statusCode === 302 || res.statusCode === 301) {
            reject(
              new Error(
                `Redirect detected (status ${res.statusCode}). Authentication failed. ` +
                  `Check your API credentials. Location: ${res.headers.location}`,
              ),
            );
            return;
          }

          try {
            resolve(JSON.parse(raw) as VirtualizorResponse);
          } catch {
            console.debug('[Virtualizor] Raw response (first 500 chars):', raw.slice(0, 500));
            reject(new Error(`Failed to parse response: ${raw.slice(0, 200)}`));
          }
        });
      });

      req.setTimeout(this.config.timeout, () => {
        req.destroy(new Error(`Request timed out after ${this.config.timeout}ms`));
      });

      req.on('error', reject);

      if (body) {
        req.write(body);
      }

      req.end();
    });
  }
}
