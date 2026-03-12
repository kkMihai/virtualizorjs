import type { ApiParams } from './types/common.js';

export function buildQueryString(params: ApiParams, apiKey: string, apiPass: string): string {
  const clean: ApiParams = {};
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) {
      clean[key] = value;
    }
  }

  const urlParams = new URLSearchParams();
  urlParams.set('api', 'json');
  urlParams.set('adminapikey', apiKey);
  urlParams.set('adminapipass', apiPass);

  for (const [key, value] of Object.entries(clean)) {
    urlParams.set(key, String(value));
  }

  return `?${urlParams.toString()}`;
}
