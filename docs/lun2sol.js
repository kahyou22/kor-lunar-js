(() => {
  const container = document.querySelector("#lunarSolar");
  const output = container.querySelector(".code.result code");
  const exampleCode = container.querySelector(".example-code code");

  const DEFAULT_DATE = { year: 2025, month: 6, day: 1 };

  const flash = (el) => {
    const pre = el.closest("pre");
    pre.classList.remove("updated");
    void pre.offsetWidth;
    pre.classList.add("updated");
  };

  const getInputDate = () => ({
    year: Number(container.querySelector("#lunYear").value) || DEFAULT_DATE.year,
    month: Number(container.querySelector("#lunMonth").value) || DEFAULT_DATE.month,
    day: Number(container.querySelector("#lunDay").value) || DEFAULT_DATE.day,
  });

  const renderExampleCode = () => {
    const { year, month, day } = getInputDate();
    const leapMode = container.querySelector(`input[name="leap"]:checked`).value;

    if (leapMode === "normal") {
      exampleCode.textContent = `// 음력 → 양력 변환 (평달)
const solar = korLunar.toSolar(${year}, ${month}, ${day}, false);
console.log(solar);`;
    } else if (leapMode === "leap") {
      exampleCode.textContent = `// 음력 → 양력 변환 (윤달)
const solar = korLunar.toSolar(${year}, ${month}, ${day}, true);
console.log(solar);`;
    } else {
      const hasLeap = korLunar.LunarTable.isLeapMonth(year, month);
      if (hasLeap) {
        exampleCode.textContent = `// 음력 → 양력 변환 (평달)
const solar = korLunar.toSolar(${year}, ${month}, ${day}, false);
console.log(solar);

// 음력 → 양력 변환 (윤달)
const solarLeap = korLunar.toSolar(${year}, ${month}, ${day}, true);
console.log(solarLeap);`;
      } else {
        exampleCode.textContent = `// ${year}년 ${month}월은 윤달이 없습니다
const solar = korLunar.toSolar(${year}, ${month}, ${day}, false);
console.log(solar);`;
      }
    }

    if (window.Prism) {
      Prism.highlightElement(exampleCode);
    }
    flash(exampleCode);
  };

  const renderResultCode = (value, language = "json") => {
    output.className = `language-${language}`;
    output.textContent = value;
    if (window.Prism) {
      Prism.highlightElement(output);
    }
    flash(output);
  };

  container.querySelector(".btn").addEventListener("click", () => {
    const { year, month, day } = getInputDate();
    const leapMode = container.querySelector(`input[name="leap"]:checked`).value;

    try {
      if (leapMode === "normal") {
        const solar = korLunar.toSolar(year, month, day, false);
        renderResultCode(JSON.stringify(solar, null, 2), "json");
      } else if (leapMode === "leap") {
        const solar = korLunar.toSolar(year, month, day, true);
        renderResultCode(JSON.stringify(solar, null, 2), "json");
      } else {
        const hasLeap = korLunar.LunarTable.isLeapMonth(year, month);
        if (hasLeap) {
          const solar = [
            korLunar.toSolar(year, month, day, false),
            korLunar.toSolar(year, month, day, true),
          ];
          renderResultCode(JSON.stringify(solar, null, 2), "json");
        } else {
          const solar = korLunar.toSolar(year, month, day, false);
          renderResultCode(JSON.stringify(solar, null, 2), "json");
        }
      }
    } catch (error) {
      renderResultCode(error.message, "none");
    }
  });

  container.querySelectorAll(`#lunYear, #lunMonth, #lunDay, input[name="leap"]`).forEach((input) => {
    input.addEventListener("input", renderExampleCode);
    input.addEventListener("change", renderExampleCode);
  });

  container.querySelector("#lunYear").value = DEFAULT_DATE.year;
  container.querySelector("#lunMonth").value = DEFAULT_DATE.month;
  container.querySelector("#lunDay").value = DEFAULT_DATE.day;

  renderExampleCode();
})();

