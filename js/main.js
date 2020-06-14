document.addEventListener("DOMContentLoaded", () => {
  let storedTheme = localStorage.getItem("theme");
  const body = document.getElementsByTagName("body")[0];
  const themeToggle = document.getElementById("theme-checkbox");
  if (!storedTheme) {
    storedTheme = "light";
    localStorage.setItem("theme", storedTheme);
    themeToggle.checked = true;
  }
  themeToggle.checked = storedTheme === "light" ? true : false;
  if (!themeToggle.checked) body.classList.add("dark-mode");
  themeToggle.addEventListener("change", () => {
    if (themeToggle.checked) {
      body.classList.remove("dark-mode");
      localStorage.setItem("theme", "light");
    } else {
      body.classList.add("dark-mode");
      localStorage.setItem("theme", "dark");
    }
  });
});

$(document).ready(function () {
  console.log(`Why are you here? Don't try and do funny stuff`);
});

function copyToClipboard() {
  navigator.permissions.query({ name: "clipboard-write" }).then((result) => {
    if (result.state === "granted" || result.state === "prompt") {
      navigator.clipboard.writeText(window.location.href);
    }
  });
}
