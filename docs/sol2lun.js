(() => {
  const container = document.querySelector("#solarLunar");
  const output = container.querySelector(".code.result code");
  const exampleCode = container.querySelector(".example-code code");

  const DEFAULT_DATE = { year: 2025, month: 6, day: 25 };

  const toNumberOrDefault = (value, fallback) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
  };

  const getInputDate = () => {
    const mode = container.querySelector('input[name="sol-type"]:checked').value;

    if (mode === "date") {
      const dateStr = container.querySelector("#solDate").value;
      if (dateStr) {
        const [year, month, day] = dateStr.split("-").map(Number);
        return {
          year: toNumberOrDefault(year, DEFAULT_DATE.year),
          month: toNumberOrDefault(month, DEFAULT_DATE.month),
          day: toNumberOrDefault(day, DEFAULT_DATE.day),
        };
      }
      return DEFAULT_DATE;
    }

    return {
      year: toNumberOrDefault(container.querySelector("#solYear").value, DEFAULT_DATE.year),
      month: toNumberOrDefault(container.querySelector("#solMonth").value, DEFAULT_DATE.month),
      day: toNumberOrDefault(container.querySelector("#sonDay").value, DEFAULT_DATE.day),
    };
  };

  const renderExampleCode = () => {
    const { year, month, day } = getInputDate();
    exampleCode.textContent = `// 양력 → 음력 변환
const lunar = korLunar.toLunar(${year}, ${month}, ${day});
console.log(lunar);`;
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
    // 탭에 따라 입력 형태 결정
    const mode = container.querySelector('input[name="sol-type"]:checked').value;

    let y, m, d;

    if (mode === "date") {
      const dateStr = container.querySelector("#solDate").value;
      if (!dateStr) {
        alert("날짜를 선택해주세요.");
        return;
      }
      [y, m, d] = dateStr.split("-");
    } else {
      y = container.querySelector("#solYear").value;
      m = container.querySelector("#solMonth").value;
      d = container.querySelector("#sonDay").value;
    }

    if (!Number(y) || !Number(m) || !Number(d)) {
      alert("년·월·일을 모두 입력해주세요.");
      return;
    }

    try {
      const lunar = korLunar.toLunar(y, m, d);
      renderResultCode(JSON.stringify(lunar, null, 2), "json");
    } catch (error) {
      renderResultCode(error.message, "none");
    }
  });

  container
    .querySelectorAll('input[name="sol-type"], #solDate, #solYear, #solMonth, #sonDay')
    .forEach((input) => {
      input.addEventListener("input", renderExampleCode);
      input.addEventListener("change", renderExampleCode);
    });

  renderExampleCode();
})();
