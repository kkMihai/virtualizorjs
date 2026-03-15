import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
  entries: ['./src/index'],
  clean: true,
  declaration: 'compatible',
  sourcemap: false,
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
  }
});
