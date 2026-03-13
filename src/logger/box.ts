import {boxChars, colors} from './formatting.js';

interface BoxOptions {
  title?: string;
  borderColor?: 'cyan' | 'yellow' | 'red' | 'green' | 'blue' | 'magenta';
  padding?: number;
  margin?: number;
}

export function createBox(content: string, options: BoxOptions = {}): string {
  const { padding = 1, margin = 0, borderColor = 'cyan' } = options;
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

  const boxContent = [colorFn(top), ...paddedLines.map((l) => colorFn(l)), colorFn(bottom)].join(
    '\n',
  );

  if (margin > 0) {
    const marginLines = ' '.repeat(margin);
    return boxContent
        .split('\n')
        .map((line) => marginLines + line)
        .join('\n');
  }

  return boxContent;
}

export function createUpdateBox(current: string, latest: string): string {
  const content = [
    '╔═════════════════════════════════════╗',
    '║         🚀 UPDATE AVAILABLE 🚀       ║',
    '╠═════════════════════════════════════╣',
    '║                                      ║',
    `║   Current version: ${current.padEnd(18)} ║`,
    `║   Latest version:  ${latest.padEnd(17)} ║`,
    '║                                      ║',
    '║   To update, run:                    ║',
    '║   npm install virtualizorjs@latest   ║',
    '║                                      ║',
    '╚═════════════════════════════════════╝',
  ].join('\n');

  return colors.yellow(content);
}

export function createErrorBox(title: string, message: string, hint?: string): string {
  const content = [
    '╔═════════════════════════════════════╗',
    '║            ❌ ERROR OCCURRED ❌       ║',
    '╠═════════════════════════════════════╣',
    '║                                      ║',
    `║   ${title.padEnd(34)}║`,
    '║                                      ║',
    `║   ${message.padEnd(34)}║`,
    '║                                      ║',
    hint ? `║   💡 ${hint.padEnd(29)}║` : '',
    hint ? '║                                      ║' : '',
    '╚═════════════════════════════════════╝',
  ]
    .filter((line) => line !== undefined)
    .join('\n');

  return colors.red(content);
}
