import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";
import dts from "rollup-plugin-dts";
import { writeFileSync, readFileSync, unlinkSync } from "fs";

/**
 * 빌드 완료 후 처리하는 플러그인:
 * 1. .d.ts를 .d.cts, .d.mts로 복사 (Node16/NodeNext moduleResolution 지원)
 * 2. 중간 산출물 .d.ts 파일들을 삭제 (dist 폴더 정리)
 */
const copyDtsPlugin = () => ({
  name: "copy-dts",
  writeBundle() {
    const content = readFileSync("dist/kor-lunar.d.ts", "utf-8");
    writeFileSync("dist/kor-lunar.d.cts", content);
    writeFileSync("dist/kor-lunar.d.mts", content);

    // 중간 산출물 삭제 (tsc가 개별 생성한 .d.ts 파일들)
    const intermediates = [
      "dist/index.d.ts",
      "dist/kor-lunar.d.ts.map",
      "dist/lunar-table.d.ts",
      "dist/solar-table.d.ts",
      "dist/utils.d.ts",
    ];
    for (const file of intermediates) {
      try {
        unlinkSync(file);
      } catch { }
    }
  },
});

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
  // 선언 파일 번들 (.d.ts → 단일 파일로 합침)
  {
    input: "dist/index.d.ts",
    output: {
      file: "dist/kor-lunar.d.ts",
      format: "es",
    },
    plugins: [dts(), copyDtsPlugin()],
  },
];
