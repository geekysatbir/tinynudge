(function () {
  const form = document.getElementById("contact-form");
  if (!form) return;

  const inbox = ["satbir.taya84", "gmail.com"].join("@");
  form.action = "https://formsubmit.co/" + inbox;

  const params = new URLSearchParams(window.location.search);
  const subject = document.getElementById("subject");
  if (subject && params.get("topic") === "mac") {
    subject.value = "Mac app purchase";
  }

  form.addEventListener("submit", function () {
    let hidden = form.querySelector('input[name="_subject"]');
    if (!hidden) {
      hidden = document.createElement("input");
      hidden.type = "hidden";
      hidden.name = "_subject";
      form.appendChild(hidden);
    }
    hidden.value = "TinyNudge: " + (subject && subject.value ? subject.value : "Contact");
  });
})();
