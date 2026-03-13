export class VirtualizorApiError extends Error {
  readonly code: number;
  readonly details: Record<string, unknown> | undefined;

  constructor(message: string, code: number, details?: Record<string, unknown>) {
    super(message);
    this.name = 'VirtualizorApiError';
    this.code = code;
    this.details = details;
  }

  format(): string {
    return `[API Error ${this.code}] ${this.message}`;
  }
}
