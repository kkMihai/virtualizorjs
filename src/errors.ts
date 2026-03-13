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

export class VirtualizorNetworkError extends Error {
  override readonly cause: Error | undefined;

  constructor(message: string, cause?: Error) {
    super(message);
    this.name = 'VirtualizorNetworkError';
    this.cause = cause;
  }

  format(): string {
    return `[Network Error] ${this.message}`;
  }
}

export class VirtualizorTimeoutError extends Error {
  readonly code = 'ETIMEDOUT';
  readonly timeoutMs: number;

  constructor(message: string, timeoutMs: number) {
    super(message);
    this.name = 'VirtualizorTimeoutError';
    this.timeoutMs = timeoutMs;
  }

  format(): string {
    return `[Timeout] ${this.message} (${this.timeoutMs}ms)`;
  }
}

export class VirtualizorNotFoundError extends Error {
  readonly resource: string;
  readonly identifier: string;

  constructor(resource: string, identifier: string) {
    super(`${resource} not found: ${identifier}`);
    this.name = 'VirtualizorNotFoundError';
    this.resource = resource;
    this.identifier = identifier;
  }
}

export class VirtualizorTaskError extends Error {
  readonly taskId: string;
  readonly status: string;

  constructor(taskId: string, status: string) {
    super(`Task ${taskId} ${status}`);
    this.name = 'VirtualizorTaskError';
    this.taskId = taskId;
    this.status = status;
  }
}
