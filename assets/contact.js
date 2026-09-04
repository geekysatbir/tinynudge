(function () {
  const form = document.getElementById("contact-form");
  const status = document.getElementById("form-status");
  const button = form && form.querySelector('button[type="submit"]');
  if (!form || !status || !button) return;

  const inbox = ["satbir.taya84", "gmail.com"].join("@");
  const endpoint = "https://formsubmit.co/ajax/" + inbox;

  const params = new URLSearchParams(window.location.search);
  const subject = document.getElementById("subject");
  if (subject && params.get("topic") === "mac") {
    subject.value = "Mac app help";
  }

  function tn(key, fallback) {
    return (window.TN && window.TN.t && window.TN.t(key)) || fallback;
  }

  function show(kind, text) {
    status.className = "form-status " + kind;
    status.textContent = text;
  }

  form.addEventListener("submit", async function (event) {
    event.preventDefault();
    if (form.querySelector('input[name="_honey"]:checked')) {
      show("ok", tn("page.contact.sent", "Message sent."));
      form.reset();
      return;
    }

    button.disabled = true;
    show("pending", tn("page.contact.sending", "Sending…"));

    const payload = {
      name: form.name.value,
      email: form.email.value,
      _replyto: form.email.value,
      subject: form.subject.value,
      message: form.message.value,
      _subject: "TinyNudge: " + form.subject.value,
      _template: "table",
      _captcha: "false",
    };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(function () {
        return {};
      });
      const msg = String(data.message || data.error || "");

      if (/activat/i.test(msg)) {
        show(
          "warn",
          tn(
            "page.contact.activate",
            "FormSubmit sent an activation email to the site inbox (often in Spam or Promotions). Open it and click Activate Form, then submit again. Until that link is clicked, messages are not delivered."
          )
        );
        return;
      }

      if (data.success === "true" || data.success === true || res.ok) {
        window.location.href = "./contact-thanks.html";
        return;
      }

      show("err", msg || tn("page.contact.fail", "The form service did not accept the message. Wait a minute and try again."));
    } catch (err) {
      show(
        "err",
        tn("page.contact.net", "Could not reach the form service. Check your connection and try again.")
      );
    } finally {
      button.disabled = false;
    }
  });
})();
