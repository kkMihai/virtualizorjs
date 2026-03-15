const isWindows = process.platform === 'win32';
const supportsColor = process.env.NO_COLOR === undefined && process.stdout.isTTY;

function colorize(code: number, str: string): string {
  return supportsColor ? `\x1b[${code}m${str}\x1b[0m` : str;
}

export const colors = {
  red: (str: string) => colorize(31, str),
  green: (str: string) => colorize(32, str),
  yellow: (str: string) => colorize(33, str),
  blue: (str: string) => colorize(34, str),
  cyan: (str: string) => colorize(36, str),
  dim: (str: string) => colorize(2, str),
};

export const symbols = {
  success: isWindows ? '√' : '✔',
  error: isWindows ? '×' : '✖',
  warning: isWindows ? '‼' : '⚠',
  info: isWindows ? 'i' : 'ℹ',
  bullet: '●',
  arrow: '→',
  chevron: '›',
  pointer: '❯',
  star: '★',
};
