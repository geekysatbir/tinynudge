// Paste a Polar.sh or Lemon Squeezy checkout URL to start charging $2.99/year.
// Leave empty to keep the GitHub Release .dmg as a direct download.
window.TINY_NUDGE_CHECKOUT_URL = "";

(function () {
  const url = (window.TINY_NUDGE_CHECKOUT_URL || "").trim();
  if (!url) return;
  const link = document.getElementById("buy-mac");
  if (!link) return;
  link.href = url;
  link.textContent = "Subscribe — $2.99/year";
})();
