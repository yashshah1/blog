$(document).ready(function () {
  console.log(`Why are you here? Don't try and do funny stuff`);
});

function copyToClipboard() {
  navigator.permissions.query({name: "clipboard-write"}).then(result => {
    if (result.state === "granted" || result.state === "prompt") {
      navigator.clipboard.writeText(window.location.href)
    }
  });
}