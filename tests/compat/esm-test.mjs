/**
 * ESM 런타임 호환성 테스트
 * 빌드된 dist/kor-lunar.esm.js를 import로 불러와서 동작을 검증
 */
import assert from "node:assert/strict";

// default import
import korLunar from "../../dist/kor-lunar.esm.js";

// named import
import { toLunar, toSolar, LunarTable, SolarTable } from "../../dist/kor-lunar.esm.js";

// default import 확인
assert.equal(typeof korLunar, "object", "default import가 객체여야 함");
assert.equal(typeof korLunar.toLunar, "function", "default.toLunar가 함수여야 함");
assert.equal(typeof korLunar.toSolar, "function", "default.toSolar가 함수여야 함");

// named import 확인
assert.equal(typeof toLunar, "function", "toLunar가 함수여야 함");
assert.equal(typeof toSolar, "function", "toSolar가 함수여야 함");
assert.equal(typeof LunarTable, "object", "LunarTable이 객체여야 함");
assert.equal(typeof SolarTable, "object", "SolarTable이 객체여야 함");

// 실제 변환 동작 확인 (2025-01-29 -> 음력 2025-01-01)
const lunar = toLunar(2025, 1, 29);
assert.equal(lunar.year, 2025);
assert.equal(lunar.month, 1);
assert.equal(lunar.day, 1);
assert.equal(lunar.isLeapMonth, false);

// 역변환 확인
const solar = toSolar(2025, 1, 1, false);
assert.equal(solar.year, 2025);
assert.equal(solar.month, 1);
assert.equal(solar.day, 29);

// default export를 통한 변환도 동일한 결과
const lunar2 = korLunar.toLunar(2025, 1, 29);
assert.deepStrictEqual(lunar, lunar2, "named import와 default import의 결과가 같아야 함");

console.log("✅ ESM 런타임 호환성 테스트 통과");
