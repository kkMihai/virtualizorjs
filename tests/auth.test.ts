import { describe, it, expect } from 'bun:test';
import { buildQueryString } from '../src/auth.js';

describe('buildQueryString', () => {
  it('includes api=json', () => {
    const result = buildQueryString({ act: 'listvs' }, 'mykey', 'mypass');
    expect(result).toContain('api=json');
  });

  it('includes api_key', () => {
    const result = buildQueryString({ act: 'listvs' }, 'mykey', 'mypass');
    expect(result).toContain('api_key=mykey');
  });

  it('includes api_sig as 64-char hex string', () => {
    const result = buildQueryString({ act: 'listvs' }, 'mykey', 'mypass');
    const match = result.match(/api_sig=([a-f0-9]+)/);
    expect(match).not.toBeNull();
    expect(match![1]).toHaveLength(64);
  });

  it('generates consistent signature for same inputs', () => {
    const params = { act: 'listvs', vpsid: '123' };
    const r1 = buildQueryString(params, 'key', 'pass');
    const r2 = buildQueryString(params, 'key', 'pass');
    expect(r1).toBe(r2);
  });

  it('generates different signatures for different api passes', () => {
    const params = { act: 'listvs' };
    const r1 = buildQueryString(params, 'key', 'pass1');
    const r2 = buildQueryString(params, 'key', 'pass2');
    expect(r1).not.toBe(r2);
  });

  it('omits undefined values from query string', () => {
    const result = buildQueryString({ act: 'listvs', vpsid: undefined }, 'key', 'pass');
    expect(result).not.toContain('vpsid');
  });

  it('omits undefined values from signature', () => {
    const withUndefined = buildQueryString({ act: 'listvs', vpsid: undefined }, 'key', 'pass');
    const withoutKey = buildQueryString({ act: 'listvs' }, 'key', 'pass');
    const sig1 = withUndefined.match(/api_sig=([a-f0-9]+)/)?.[1];
    const sig2 = withoutKey.match(/api_sig=([a-f0-9]+)/)?.[1];
    expect(sig1).toBe(sig2);
  });
});
