import { VirtualizorApiError } from '../errors.js';
import { colors, symbols } from './formatting.js';

export function formatError(error: Error, verbose = false): string {
  if (error instanceof VirtualizorApiError) {
    const details =
      error.details && verbose ? `\n${colors.dim(JSON.stringify(error.details, null, 2))}` : '';
    return `${symbols.error} ${colors.red(`[API Error ${error.code}]`)} ${error.message}${details}`;
  }

  return `${symbols.error} ${colors.red(error.message)}`;
}
