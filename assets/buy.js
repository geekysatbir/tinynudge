// Direct download for the free Mac app.
window.TINY_NUDGE_DOWNLOAD_URL = "./downloads/TinyNudge.dmg";

(function () {
  const url = (window.TINY_NUDGE_DOWNLOAD_URL || "").trim() || "./downloads/TinyNudge.dmg";

  document.querySelectorAll("[data-buy-mac]").forEach(function (el) {
    el.href = url;
    el.setAttribute("download", "TinyNudge.dmg");
    if (el.dataset.buyLabel !== "keep") el.textContent = "Download for Mac — free";
  });
})();
