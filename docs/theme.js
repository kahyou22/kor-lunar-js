(() => {
    const STORAGE_KEY = "kor-lunar-theme";

    const getSystemTheme = () =>
        window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

    const getEffectiveTheme = () =>
        localStorage.getItem(STORAGE_KEY) || getSystemTheme();

    const updateIcon = (theme) => {
        const btn = document.getElementById("theme-toggle");
        if (!btn) return;
        const iconName = theme === "dark" ? "sun" : "moon";
        btn.innerHTML = `<i data-lucide="${iconName}"></i>`;
        if (window.lucide) lucide.createIcons({ nodes: [btn] });
    };

    const applyTheme = (theme) => {
        document.documentElement.setAttribute("data-theme", theme);
        updateIcon(theme);
    };

    const toggle = () => {
        const current = document.documentElement.getAttribute("data-theme") || getEffectiveTheme();
        const next = current === "dark" ? "light" : "dark";
        localStorage.setItem(STORAGE_KEY, next);
        applyTheme(next);
    };

    // 즉시 적용 (깜빡임 방지)
    applyTheme(getEffectiveTheme());

    // 시스템 테마 변경 감지
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
        if (!localStorage.getItem(STORAGE_KEY)) {
            applyTheme(getSystemTheme());
        }
    });

    // 토글 버튼 바인딩
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => {
            updateIcon(getEffectiveTheme());
            document.getElementById("theme-toggle").addEventListener("click", toggle);
        });
    } else {
        updateIcon(getEffectiveTheme());
        document.getElementById("theme-toggle")?.addEventListener("click", toggle);
    }
})();
