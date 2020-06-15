document.addEventListener("DOMContentLoaded", () => {
  let storedTheme = localStorage.getItem("theme");
  const body = document.getElementsByTagName("body")[0];
  const themeToggle = document.getElementById("theme-checkbox");
  const sun = document.getElementById("sun-fa");
  const moon = document.getElementById("moon-fa");

  if (!storedTheme) {
    storedTheme = "light";
    localStorage.setItem("theme", storedTheme);
  }
  themeToggle.checked = storedTheme === "light" ? true : false;
  if (!themeToggle.checked) {
    body.classList.add("dark-mode");
    moon.style.display = "none";
    sun.style.display = "inline-block";
  }

  themeToggle.addEventListener("change", () => {
    body.classList.add("change");
    setTimeout(function () {
      body.classList.remove("change");
    }, 1000);
    if (themeToggle.checked) {
      body.classList.remove("dark-mode");
      localStorage.setItem("theme", "light");

      moon.style.display = "inline-block";
      sun.style.display = "none";
    } else {
      body.classList.add("dark-mode");
      localStorage.setItem("theme", "dark");

      moon.style.display = "none";
      sun.style.display = "inline-block";
    }
  });
});

$(document).ready(function () {
  console.log(`Why are you here? Don't try and do funny stuff`);
});

function copyToClipboard() {
  navigator.permissions.query({ name: "clipboard-write" }).then(result => {
    if (result.state === "granted" || result.state === "prompt") {
      navigator.clipboard.writeText(window.location.href);
    }
  });
}
