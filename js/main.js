document.addEventListener("DOMContentLoaded", () => {
  let storedTheme = localStorage.getItem("theme") || "dark";
  const body = document.getElementsByTagName("body")[0];
  const themeToggle = document.getElementById("theme-checkbox");
  const sun = document.getElementById("sun-fa");
  const moon = document.getElementById("moon-fa");

  localStorage.setItem("theme", storedTheme);

  themeToggle.checked = storedTheme === "light" ? true : false;

  if (storedTheme === "light") {
    body.classList.remove("dark-mode");
    moon.style.display = "inline-block";
    sun.style.display = "none";
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

async function copyToClipboard() {
  const result = await navigator.permissions.query({ name: "clipboard-write" });
  if (result.state === "granted" || result.state === "prompt")
    navigator.clipboard.writeText(window.location.href);
  return true;
}

async function shareArticle() {
  if (navigator.share)
    await navigator.share({
      title: document.title.split("|")[0].trim(),
      text: "Check this article out!",
      url: window.location.href,
    });
  else await copyToClipboard();
}
