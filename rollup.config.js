import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";

export default [
  // CommonJS 번들
  {
    input: "src/index.ts",
    output: {
      file: "dist/kor-lunar.js",
      format: "cjs",
      exports: "auto",
      sourcemap: true,
    },
    plugins: [typescript()],
  },
  // ESM 번들
  {
    input: "src/index.ts",
    output: {
      file: "dist/kor-lunar.esm.js",
      format: "esm",
      sourcemap: true,
    },
    plugins: [typescript()],
  },
  // Minified IIFE 번들
  {
    input: "src/index.ts",
    output: {
      file: "dist/kor-lunar.min.js",
      format: "iife",
      name: "korLunar",
      sourcemap: true,
    },
    plugins: [typescript(), terser()],
  },
];
