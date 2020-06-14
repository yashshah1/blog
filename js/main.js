$(document).ready(function () {
	console.log(`Why are you here? Don't try and do funny stuff`);
});

function shareArticle() {
	if (navigator.share)
		navigator.share({
			title: "Blog article",
			url: window.location.href,
		});
	else
		navigator.permissions.query({ name: "clipboard-write" }).then((result) => {
			if (result.state === "granted" || result.state === "prompt") {
				navigator.clipboard.writeText(window.location.href);
				const toast = document.getElementById("toast");
				toast.className = "show";
				setTimeout(function () {
					toast.className = toast.className.replace("show", "");
				}, 3000);
			}
		});
}
