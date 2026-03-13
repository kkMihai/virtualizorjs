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
  magenta: (str: string) => colorize(35, str),
  cyan: (str: string) => colorize(36, str),
  white: (str: string) => colorize(37, str),
  gray: (str: string) => colorize(90, str),
  dim: (str: string) => colorize(2, str),
  bold: (str: string) => colorize(1, str),
  underline: (str: string) => colorize(4, str),
  bgRed: (str: string) => colorize(41, str),
  bgGreen: (str: string) => colorize(42, str),
  bgYellow: (str: string) => colorize(43, str),
  bgBlue: (str: string) => colorize(44, str),
  bgCyan: (str: string) => colorize(46, str),
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

export const boxChars = {
  topLeft: '┌',
  topRight: '┐',
  bottomLeft: '└',
  bottomRight: '┘',
  horizontal: '─',
  vertical: '│',
};
