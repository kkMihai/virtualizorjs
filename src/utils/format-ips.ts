export type IpsInput = string[] | Record<string, string> | string | undefined | null;

export type FormatIpsOptions = {
  /**
   * Choose the return type. Defaults to 'array'.
   * - 'array' returns string[]
   * - 'string' returns a joined string using `separator`
   */
  as?: 'array' | 'string';
  /** Separator used when returning a string. Defaults to ', '. */
  separator?: string;
};

/**
 * formatIps
 * - Default behavior: return an array of IP strings (string[])
 * - If options.as === 'string' it returns a joined string using options.separator
 */
export function formatIps(ips: IpsInput): string[];
export function formatIps(ips: IpsInput, options: FormatIpsOptions & { as: 'string' }): string;
export function formatIps(ips: IpsInput, options?: FormatIpsOptions): string | string[] {
  const as = options?.as ?? 'array';
  const separator = options?.separator ?? ', ';

  if (!ips) {
    return as === 'array' ? [] : '';
  }

  let result: string[] = [];

  if (Array.isArray(ips)) {
    result = ips.filter(Boolean);
  } else if (typeof ips === 'string') {
    const str = ips.trim();
    if (str === '') {
      result = [];
    } else if (str.includes(',')) {
      result = str.split(',').map(s => s.trim()).filter(Boolean);
    } else if (/\s+/.test(str)) {
      result = str.split(/\s+/).map(s => s.trim()).filter(Boolean);
    } else {
      result = [str];
    }
  } else if (typeof ips === 'object') {
    result = Object.values(ips).filter(Boolean);
  }

  return as === 'array' ? result : result.join(separator);
}
