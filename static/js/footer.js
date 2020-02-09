var darkTheme = document.getElementById("dark-mode-theme");
var darkModeSun = document.getElementById("dark-mode-sun");
var darkModeMoon = document.getElementById("dark-mode-moon");

function setTheme(mode) {
    if (mode === "dark") {
        darkModeSun.style.display = "inline";
        darkModeMoon.style.display = "none";
        darkTheme.disabled = false;
    } else {
        darkModeSun.style.display = "none";
        darkModeMoon.style.display = "inline";
        darkTheme.disabled = true;
    }
}

// If the user clicks the sun icon then flip to lisht mode.
darkModeSun.addEventListener("click", () => {
    if (darkModeSun.style.display === "none") {
        setTheme("dark");
    } else {
        setTheme("light");
    }
});

// If the user clicks the moon icon then flip to dark mode.
darkModeMoon.addEventListener("click", () => {
    if (darkModeMoon.style.display === "none") {
        setTheme("light");
    } else {
        setTheme("dark");
    }
});

// If we can, work out whether we should default to dark or light mode.
const windowMedia = window.matchMedia("(prefers-color-scheme: dark)");
if (windowMedia.matches) {
    setTheme("dark");
} else {
    setTheme("light");
}

if (windowMedia.addEventListener) {
    windowMedia.addEventListener("change", () => {
        if (windowMedia.matches) {
            setTheme("dark");
        } else {
            setTheme("light");
        }
    });
} else if (windowMedia.addListener) {
    windowMedia.addListener(() => {
        if (windowMedia.matches) {
            setTheme("dark");
        } else {
            setTheme("light");
        }
    });
}
