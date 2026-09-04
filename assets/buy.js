// One place to change email and checkout.
window.TINY_NUDGE_EMAIL = "satbir.taya84@gmail.com";
// Paste a Polar, Lemon Squeezy, or Stripe Payment Link URL to sell the Mac app.
// Leave empty to fall back to email.
window.TINY_NUDGE_CHECKOUT_URL = "";

(function () {
  const email = (window.TINY_NUDGE_EMAIL || "").trim();
  const checkout = (window.TINY_NUDGE_CHECKOUT_URL || "").trim();
  const buyMailto = email
    ? "mailto:" +
      email +
      "?subject=" +
      encodeURIComponent("TinyNudge for Mac — $2.99/year") +
      "&body=" +
      encodeURIComponent(
        "Hi Satbir,\n\nI would like to buy TinyNudge for Mac ($2.99/year). Please send a payment link and the disk image.\n\nmacOS version:\n"
      )
    : "./contact.html";
  const contactMailto = email ? "mailto:" + email : "./contact.html";

  document.querySelectorAll("[data-buy-mac]").forEach(function (el) {
    if (checkout) {
      el.href = checkout;
      if (el.dataset.buyLabel !== "keep") el.textContent = "Subscribe — $2.99/year";
    } else {
      el.href = buyMailto;
    }
  });

  document.querySelectorAll("[data-contact-email]").forEach(function (el) {
    el.href = contactMailto;
    if (el.dataset.fillEmail === "true" && email) el.textContent = email;
  });
})();
