import crypto from 'crypto';

type Params = Record<string, string | number | undefined>;

function generateSignature(apiKey: string, apiPass: string, params: Params): string {
  const sorted = Object.keys(params)
    .filter((k) => params[k] !== undefined)
    .sort()
    .map((k) => `${k}${params[k]}`)
    .join('');
  return crypto.createHash('sha256').update(apiKey + apiPass + sorted).digest('hex');
}

export function buildQueryString(params: Params, apiKey: string, apiPass: string): string {
  const clean: Params = {};
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) {
      clean[key] = value;
    }
  }

  const sig = generateSignature(apiKey, apiPass, clean);

  const urlParams = new URLSearchParams();
  urlParams.set('api', 'json');
  urlParams.set('api_key', apiKey);
  urlParams.set('api_sig', sig);

  for (const [key, value] of Object.entries(clean)) {
    urlParams.set(key, String(value));
  }

  return `?${urlParams.toString()}`;
}
