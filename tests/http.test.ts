import { describe, expect, it } from 'bun:test';
import type { Logger } from '../src';
import { VirtualizorApiError } from '../src';
import { HttpClient } from '../src/http.js';
import type { ResolvedConfig } from '../src/types/config.js';

const mockLogger: Logger = {
  debug: () => {},
  info: () => {},
  warn: () => {},
  error: () => {},
};

const config: ResolvedConfig = {
  host: 'localhost',
  apiKey: 'key',
  apiPass: 'pass',
  port: 4085,
  https: true,
  rejectUnauthorized: false,
  timeout: 30000,
  debug: false,
  logger: mockLogger,
  disableUpdateCheck: false,
};

describe('HttpClient', () => {
  it('constructs without throwing', () => {
    expect(() => new HttpClient(config)).not.toThrow();
  });

  it('parseResponse throws VirtualizorApiError when error field present', () => {
    const client = new HttpClient(config);
    expect(() => client.parseResponse({ error: [{ code: 1, msg: 'Invalid API Key' }] })).toThrow(
      VirtualizorApiError,
    );
  });

  it('parseResponse error message matches API error msg', () => {
    const client = new HttpClient(config);
    expect(() => client.parseResponse({ error: [{ code: 1, msg: 'Invalid API Key' }] })).toThrow(
      'Invalid API Key',
    );
  });

  it('parseResponse returns data when no error', () => {
    const client = new HttpClient(config);
    const data = { vs: { '123': { vpsid: '123' } }, time_taken: '0.1' };
    expect(client.parseResponse(data)).toEqual(data);
  });

  it('VirtualizorApiError has correct code', () => {
    const client = new HttpClient(config);
    try {
      client.parseResponse({ error: [{ code: 42, msg: 'Some error' }] });
    } catch (e) {
      expect(e).toBeInstanceOf(VirtualizorApiError);
      expect((e as VirtualizorApiError).code).toBe(42);
    }
  });
});
