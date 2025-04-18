import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "rollup-plugin-typescript2";
import { terser } from "rollup-plugin-terser";

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
    plugins: [resolve(), commonjs(), typescript()],
  },
  // ESM 번들
  {
    input: "src/index.ts",
    output: {
      file: "dist/kor-lunar.esm.js",
      format: "esm",
      sourcemap: true,
    },
    plugins: [resolve(), commonjs(), typescript()],
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
    plugins: [resolve(), commonjs(), typescript(), terser()],
  },
];
