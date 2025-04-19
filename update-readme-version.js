import { readFileSync, writeFileSync } from "fs";
import path from "path";

// package.json에서 version 읽기
const pkg = JSON.parse(readFileSync(path.resolve(process.cwd(), "package.json"), "utf-8"));
const version = pkg.version;

// README.md 로드
const readmePath = path.resolve(process.cwd(), "README.md");
const readme = readFileSync(readmePath, "utf-8");

// 기존 CDN URL(/kor-lunar@버전/ 이 없는 경우) 또는 이전 버전 치환
const updated = readme.replace(
  /cdn\.jsdelivr\.net\/npm\/kor-lunar(?:@[0-9]+\.[0-9]+\.[0-9]+)?\/dist/g,
  `cdn.jsdelivr.net/npm/kor-lunar@${version}/dist`
);

// 덮어쓰기
writeFileSync(readmePath, updated, "utf-8");
console.log(`README.md CDN URL 업데이트 @${version}`);
