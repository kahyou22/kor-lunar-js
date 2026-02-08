import { readFileSync, writeFileSync } from "fs";
import path from "path";

// package.json에서 version 읽기
const pkg = JSON.parse(readFileSync(path.resolve(process.cwd(), "package.json"), "utf-8"));
const version = pkg.version;
const [major, minor] = version.split(".");
const shortVersion = `${major}.${minor}`;

// README.md 로드
const readmePath = path.resolve(process.cwd(), "README.md");
const readme = readFileSync(readmePath, "utf-8");

// 기존 CDN URL(/kor-lunar@버전/ 이 없는 경우) 또는 이전 버전 치환
const cdnPattern = /cdn\.jsdelivr\.net\/npm\/kor-lunar(?:@[^/]+)?\/dist/g;
const matches = readme.match(cdnPattern) ?? [];
const updated = readme.replace(cdnPattern, `cdn.jsdelivr.net/npm/kor-lunar@${shortVersion}/dist`);

// 덮어쓰기
writeFileSync(readmePath, updated, "utf-8");
console.log(`README.md CDN URL 업데이트 @${shortVersion} (치환 ${matches.length}건)`);
