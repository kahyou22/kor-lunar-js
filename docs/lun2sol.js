(() => {
  const container = document.querySelector("#lunarSolar");
  const output = container.querySelector(".code");

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
        output.textContent = JSON.stringify(solar, null, 2);
      }
      if (leapMode === "leap") {
        const solar = korLunar.toSolar(y, m, d, true);
        output.textContent = JSON.stringify(solar, null, 2);
      }
      if (leapMode === "all") {
        const solar = [korLunar.toSolar(y, m, d, false), korLunar.toSolar(y, m, d, true)];
        output.textContent = JSON.stringify(solar, null, 2);
      }
    } catch (error) {
      output.textContent = error.message;
    }
  });
})();
