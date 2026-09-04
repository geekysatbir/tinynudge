// Paste a Polar.sh or Lemon Squeezy checkout URL when charging $2.99/year.
// Leave empty until checkout exists. Do not link GitHub releases from the site.
window.TINY_NUDGE_CHECKOUT_URL = "";

(function () {
  const url = (window.TINY_NUDGE_CHECKOUT_URL || "").trim();
  if (!url) return;
  const link = document.getElementById("buy-mac");
  if (!link) return;
  link.href = url;
  link.textContent = "Subscribe — $2.99/year";
})();
