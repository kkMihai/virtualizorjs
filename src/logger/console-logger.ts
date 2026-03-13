import { colors, symbols } from './formatting.js';
import type { Logger } from './types.js';

export class ConsoleLogger implements Logger {
  constructor(private readonly prefix = 'Virtualizor') {}

  private timestamp(): string {
    const now = new Date();
    const timeString = now.toISOString().split('T')[1];
    return colors.dim(timeString ? timeString.slice(0, 8) : '00:00:00');
  }

  private tag(): string {
    return colors.cyan(`[${this.prefix}]`);
  }

  debug(message: string, ...args: unknown[]): void {
    console.log(
      this.timestamp(),
      this.tag(),
      colors.dim(symbols.bullet),
      colors.dim(message),
      ...args,
    );
  }

  info(message: string, ...args: unknown[]): void {
    console.log(this.timestamp(), this.tag(), colors.blue(symbols.info), message, ...args);
  }

  warn(message: string, ...args: unknown[]): void {
    console.log(
      this.timestamp(),
      this.tag(),
      colors.yellow(symbols.warning),
      colors.yellow(message),
      ...args,
    );
  }

  error(message: string, error?: Error): void {
    console.error(this.timestamp(), this.tag(), colors.red(symbols.error), colors.red(message));
    if (error?.stack) {
      console.error(colors.dim(error.stack.split('\n').slice(1, 4).join('\n')));
    }
  }

  success(message: string, ...args: unknown[]): void {
    console.log(
      this.timestamp(),
      this.tag(),
      colors.green(symbols.success),
      colors.green(message),
      ...args,
    );
  }
}

export const defaultLogger = new ConsoleLogger();
