// Checkout URL for the Mac app. Leave empty to send buyers to the contact form.
window.TINY_NUDGE_CHECKOUT_URL = "";

(function () {
  const checkout = (window.TINY_NUDGE_CHECKOUT_URL || "").trim();
  const macForm = "./contact.html?topic=mac";

  document.querySelectorAll("[data-buy-mac]").forEach(function (el) {
    if (checkout) {
      el.href = checkout;
      if (el.dataset.buyLabel !== "keep") el.textContent = "Subscribe — $2.99/year";
    } else {
      el.href = macForm;
    }
  });
})();
