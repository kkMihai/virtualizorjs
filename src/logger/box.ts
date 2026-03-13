import { boxChars, colors } from './formatting.js';

interface BoxOptions {
  title?: string;
  borderColor?: 'cyan' | 'yellow' | 'red' | 'green';
  padding?: number;
}

export function createBox(content: string, options: BoxOptions = {}): string {
  const { padding = 1, borderColor = 'cyan' } = options;
  const lines = content.split('\n');
  const maxLineWidth = Math.max(...lines.map((l) => l.length));
  const innerWidth = maxLineWidth + padding * 2;

  const colorFn = colors[borderColor] ?? colors.cyan;

  const horizontal = boxChars.horizontal.repeat(innerWidth);
  const top = `${boxChars.topLeft}${horizontal}${boxChars.topRight}`;
  const bottom = `${boxChars.bottomLeft}${horizontal}${boxChars.bottomRight}`;

  const paddedLines = lines.map((line) => {
    const padded = ' '.repeat(padding) + line + ' '.repeat(padding);
    return `${boxChars.vertical}${padded.padEnd(innerWidth)}${boxChars.vertical}`;
  });

  return [colorFn(top), ...paddedLines.map((l) => colorFn(l)), colorFn(bottom)].join('\n');
}

export function createUpdateBox(current: string, latest: string): string {
  const content = [
    'New version available!',
    '',
    `Current: ${current}`,
    `Latest:  ${latest}`,
    '',
    'Run: npm install virtualizorjs@latest',
  ].join('\n');

  return createBox(content, { borderColor: 'yellow' });
}

export function createErrorBox(title: string, message: string, hint?: string): string {
  const lines = [title, '', message];
  if (hint) {
    lines.push('', hint);
  }
  return createBox(lines.join('\n'), { borderColor: 'red' });
}
