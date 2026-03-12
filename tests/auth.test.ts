import { describe, expect, it } from 'bun:test';
import { buildQueryString } from '../src/auth.js';

describe('buildQueryString', () => {
  it('includes api=json', () => {
    const result = buildQueryString({ act: 'listvs' }, 'mykey', 'mypass');
    expect(result).toContain('api=json');
  });

  it('includes adminapikey', () => {
    const result = buildQueryString({ act: 'listvs' }, 'mykey', 'mypass');
    expect(result).toContain('adminapikey=mykey');
  });

  it('includes adminapipass', () => {
    const result = buildQueryString({ act: 'listvs' }, 'mykey', 'mypass');
    expect(result).toContain('adminapipass=mypass');
  });

  it('does not include api_key (old auth method)', () => {
    const result = buildQueryString({ act: 'listvs' }, 'mykey', 'mypass');
    expect(result).not.toContain('api_key=');
  });

  it('does not include api_sig (old auth method)', () => {
    const result = buildQueryString({ act: 'listvs' }, 'mykey', 'mypass');
    expect(result).not.toContain('api_sig=');
  });

  it('omits undefined values from query string', () => {
    const result = buildQueryString({ act: 'listvs', vpsid: undefined }, 'key', 'pass');
    expect(result).not.toContain('vpsid');
  });

  it('preserves order of params', () => {
    const result = buildQueryString({ act: 'vs', vpsid: '123' }, 'key', 'pass');
    expect(result).toContain('act=vs');
    expect(result).toContain('vpsid=123');
  });
});
