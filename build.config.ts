import { readFileSync } from 'node:fs';
import { defineBuildConfig } from 'unbuild';

const { version } = JSON.parse(readFileSync(new URL('package.json', import.meta.url), 'utf8')) as {
  version: string;
};

export default defineBuildConfig({
  entries: ['./src/index'],
  clean: true,
  declaration: 'compatible',
  sourcemap: false,
  replace: {
    __PACKAGE_VERSION__: JSON.stringify(version),
  },
  rollup: {
    emitCJS: true,
    inlineDependencies: false,
    esbuild: {
      minify: true,
      minifySyntax: true,
      minifyWhitespace: true,
      minifyIdentifiers: true,
      treeShaking: true,
      target: 'esnext',
    },
  },
});
