(() => {
  const container = document.querySelector("#solarLunar");
  const output = container.querySelector(".code.result code");
  const exampleCode = container.querySelector(".example-code code");

  const DEFAULT_DATE = { year: 2025, month: 6, day: 25 };

  const flash = (el) => {
    const pre = el.closest("pre");
    pre.classList.remove("updated");
    void pre.offsetWidth;
    pre.classList.add("updated");
  };

  const getInputDate = () => {
    const mode = container.querySelector(`input[name="sol-type"]:checked`).value;

    if (mode === "date") {
      const dateStr = container.querySelector("#solDate").value;
      if (dateStr) {
        const [year, month, day] = dateStr.split("-").map(Number);
        return {
          year: Number(year) || DEFAULT_DATE.year,
          month: Number(month) || DEFAULT_DATE.month,
          day: Number(day) || DEFAULT_DATE.day,
        };
      }
      return DEFAULT_DATE;
    }

    return {
      year: Number(container.querySelector("#solYear").value) || DEFAULT_DATE.year,
      month: Number(container.querySelector("#solMonth").value) || DEFAULT_DATE.month,
      day: Number(container.querySelector("#solDay").value) || DEFAULT_DATE.day,
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

    try {
      const lunar = korLunar.toLunar(year, month, day);
      renderResultCode(JSON.stringify(lunar, null, 2), "json");
    } catch (error) {
      renderResultCode(error.message, "none");
    }
  });

  container
    .querySelectorAll(`input[name="sol-type"], #solDate, #solYear, #solMonth, #solDay`)
    .forEach((input) => {
      input.addEventListener("input", renderExampleCode);
      input.addEventListener("change", renderExampleCode);
    });

  container.querySelector("#solDate").value = `${DEFAULT_DATE.year}-${String(DEFAULT_DATE.month).padStart(2, "0")}-${String(DEFAULT_DATE.day).padStart(2, "0")}`;
  container.querySelector("#solYear").value = DEFAULT_DATE.year;
  container.querySelector("#solMonth").value = DEFAULT_DATE.month;
  container.querySelector("#solDay").value = DEFAULT_DATE.day;

  renderExampleCode();
})();
