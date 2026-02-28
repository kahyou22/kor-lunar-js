/**
 * CJS 런타임 호환성 테스트
 * 빌드된 dist/kor-lunar.cjs를 require()로 불러와서 동작을 검증
 */
const assert = require("node:assert/strict");

const korLunar = require("../../dist/kor-lunar.cjs");

// named export 확인
assert.equal(typeof korLunar.toLunar, "function", "toLunar가 함수여야 함");
assert.equal(typeof korLunar.toSolar, "function", "toSolar가 함수여야 함");
assert.equal(typeof korLunar.LunarTable, "object", "LunarTable이 객체여야 함");
assert.equal(typeof korLunar.SolarTable, "object", "SolarTable이 객체여야 함");

// default export 확인
assert.equal(typeof korLunar.default, "object", "default export가 객체여야 함");
assert.equal(typeof korLunar.default.toLunar, "function", "default.toLunar가 함수여야 함");
assert.equal(typeof korLunar.default.toSolar, "function", "default.toSolar가 함수여야 함");

// 실제 변환 동작 확인 (2025-01-29 -> 음력 2025-01-01)
const lunar = korLunar.toLunar(2025, 1, 29);
assert.equal(lunar.year, 2025);
assert.equal(lunar.month, 1);
assert.equal(lunar.day, 1);
assert.equal(lunar.isLeapMonth, false);

// 역변환 확인
const solar = korLunar.toSolar(2025, 1, 1, false);
assert.equal(solar.year, 2025);
assert.equal(solar.month, 1);
assert.equal(solar.day, 29);

// default export를 통한 변환도 동일한 결과
const lunar2 = korLunar.default.toLunar(2025, 1, 29);
assert.deepStrictEqual(lunar, lunar2, "named export와 default export의 결과가 같아야 함");

console.log("✅ CJS 런타임 호환성 테스트 통과");
