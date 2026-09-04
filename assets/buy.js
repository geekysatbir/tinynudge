// Left in place so a cached page that still loads this file does not send
// people to the contact form. New pages do not include this script.
(function () {
  const url = "/downloads/TinyNudge.dmg";
  document.querySelectorAll("[data-buy-mac]").forEach(function (el) {
    el.href = url;
    el.removeAttribute("download");
  });
})();
