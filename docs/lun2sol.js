(() => {
  const container = document.querySelector("#lunarSolar");
  const output = container.querySelector(".code.result code");
  const exampleCode = container.querySelector(".example-code code");

  const DEFAULT_DATE = { year: 2025, month: 6, day: 1 };

  const toNumberOrDefault = (value, fallback) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
  };

  const getInputDate = () => ({
    year: toNumberOrDefault(container.querySelector("#lunYear").value, DEFAULT_DATE.year),
    month: toNumberOrDefault(container.querySelector("#lunMonth").value, DEFAULT_DATE.month),
    day: toNumberOrDefault(container.querySelector("#sonDay").value, DEFAULT_DATE.day),
  });

  const renderExampleCode = () => {
    const { year, month, day } = getInputDate();
    const leapMode = container.querySelector('input[name="leap"]:checked').value;

    if (leapMode === "normal") {
      exampleCode.textContent = `// 음력 → 양력 변환 (평달)
const solar = korLunar.toSolar(${year}, ${month}, ${day}, false);
console.log(solar);`;
    } else if (leapMode === "leap") {
      exampleCode.textContent = `// 음력 → 양력 변환 (윤달)
const solar = korLunar.toSolar(${year}, ${month}, ${day}, true);
console.log(solar);`;
    } else {
      exampleCode.textContent = `// 음력 → 양력 변환 (평달)
const solar = korLunar.toSolar(${year}, ${month}, ${day}, false);
console.log(solar);

// 음력 → 양력 변환 (윤달)
const solarLeap = korLunar.toSolar(${year}, ${month}, ${day}, true);
console.log(solarLeap);`;
    }

    if (window.Prism) {
      Prism.highlightElement(exampleCode);
    }
  };

  const renderResultCode = (value, language = "json") => {
    output.className = `language-${language}`;
    output.textContent = value;
    if (window.Prism) {
      Prism.highlightElement(output);
    }
  };

  container.querySelector(".btn").addEventListener("click", () => {
    const y = container.querySelector("#lunYear").value;
    const m = container.querySelector("#lunMonth").value;
    const d = container.querySelector("#sonDay").value;
    const leapMode = container.querySelector('input[name="leap"]:checked').value;

    if (!Number(y) || !Number(m) || !Number(d)) {
      alert("년·월·일을 모두 입력해주세요.");
      return;
    }

    try {
      if (leapMode === "normal") {
        const solar = korLunar.toSolar(y, m, d, false);
        renderResultCode(JSON.stringify(solar, null, 2), "json");
      }
      if (leapMode === "leap") {
        const solar = korLunar.toSolar(y, m, d, true);
        renderResultCode(JSON.stringify(solar, null, 2), "json");
      }
      if (leapMode === "all") {
        const solar = [korLunar.toSolar(y, m, d, false), korLunar.toSolar(y, m, d, true)];
        renderResultCode(JSON.stringify(solar, null, 2), "json");
      }
    } catch (error) {
      renderResultCode(error.message, "none");
    }
  });

  container.querySelectorAll("#lunYear, #lunMonth, #sonDay, input[name='leap']").forEach((input) => {
    input.addEventListener("input", renderExampleCode);
    input.addEventListener("change", renderExampleCode);
  });

  renderExampleCode();
})();
