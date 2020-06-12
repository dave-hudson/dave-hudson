var darkTheme = document.getElementById("dark-mode-theme");
var darkModeSun = document.getElementById("dark-mode-sun");
var darkModeMoon = document.getElementById("dark-mode-moon");
const windowMedia = window.matchMedia("(prefers-color-scheme: dark)");

function setDarkTheme(dark) {
    if (dark === true) {
        darkModeSun.style.display = "";
        darkModeMoon.style.display = "none";
        darkTheme.disabled = false;
        if (windowMedia.matches) {
            localStorage.removeItem("darkTheme");
        } else {
            localStorage.setItem("darkTheme", "dark");
        }
    } else {
        darkModeSun.style.display = "none";
        darkModeMoon.style.display = "";
        darkTheme.disabled = true;
        if (!windowMedia.matches) {
            localStorage.removeItem("darkTheme");
        } else {
            localStorage.setItem("darkTheme", "light");
        }
    }
}

// If the user clicks the sun icon then flip to light mode.
darkModeSun.addEventListener("click", () => {
    if (darkModeSun.style.display === "none") {
        setDarkTheme(true);
    } else {
        setDarkTheme(false);
    }
});

// If the user clicks the moon icon then flip to dark mode.
darkModeMoon.addEventListener("click", () => {
    if (darkModeMoon.style.display === "none") {
        setDarkTheme(false);;
    } else {
        setDarkTheme(true);
    }
});

// If we can, work out whether we should default to dark or light mode.
var localDarkTheme = localStorage.getItem("darkTheme");
if (localDarkTheme === null) {
    setDarkTheme(windowMedia.matches);
} else {
    setDarkTheme(localDarkTheme === "dark");
}

if (windowMedia.addEventListener) {
    windowMedia.addEventListener("change", () => {
        setDarkTheme(windowMedia.matches);
    });
} else if (windowMedia.addListener) {
    windowMedia.addListener(() => {
        setDarkTheme(windowMedia.matches);
    });
}
