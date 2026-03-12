type Params = Record<string, string | number | undefined>;

export function buildQueryString(params: Params, apiKey: string, apiPass: string): string {
  const clean: Params = {};
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
