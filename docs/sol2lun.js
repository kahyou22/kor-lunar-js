(() => {
  const container = document.querySelector("#solarLunar");
  const output = container.querySelector(".code");

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
      output.textContent = JSON.stringify(lunar, null, 2);
    } catch (error) {
      output.textContent = error.message;
    }
  });
})();
