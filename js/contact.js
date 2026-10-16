
"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#contact-form");
  const status = document.querySelector("#form-status");
  const year = document.querySelector("#current-year");
  const phoneInput = document.querySelector("#phone");
  const successPanel = document.querySelector("#success-panel");
  const WHATSAPP_NUMBER = "919081815781";

  if (year) year.textContent = new Date().getFullYear();

  let phoneIti = null;

  if (phoneInput && typeof window.intlTelInput === "function") {
    phoneIti = window.intlTelInput(phoneInput, {
      initialCountry: "in",
      separateDialCode: true,
      nationalMode: true,
      formatOnDisplay: false,
      autoPlaceholder: "off",
      countryOrder: ["in", "us", "gb"]
    });

    phoneInput.addEventListener("countrychange", () => {
      phoneInput.value = "";
      const country = phoneIti.getSelectedCountryData();
      phoneInput.placeholder =
        country.iso2 === "in" ? "Enter 10-digit number" : "Enter phone number";
    });

    phoneInput.addEventListener("input", () => {
      const country = phoneIti.getSelectedCountryData();
      const maxDigits = country.iso2 === "in" ? 10 : 15;
      phoneInput.value = phoneInput.value.replace(/\D/g, "").slice(0, maxDigits);
    });
  }

  const otherPairs = [
    ["service", "service-other"],
    ["budget", "budget-other"],
    ["deadline", "deadline-other"],
    ["project-type", "project-type-other"],
    ["preferred-contact", "preferred-contact-other"]
  ];

  otherPairs.forEach(([selectId, inputId]) => {
    const select = document.getElementById(selectId);
    const input = document.getElementById(inputId);
    if (!select || !input) return;

    const updateOther = () => {
      const visible = select.value === "Other";
      input.hidden = !visible;
      input.required = visible;
      if (!visible) input.value = "";
    };

    select.addEventListener("change", updateOther);
    updateOther();
  });

  function setStatus(message, type = "") {
    if (!status) return;
    status.textContent = message;
    status.classList.toggle("is-error", type === "error");
    status.classList.toggle("is-success", type === "success");
  }

  function effectiveValue(data, selectName, otherName) {
    const selected = String(data.get(selectName) || "").trim();

    if (selected !== "Other") {
      return selected || "Not specified";
    }

    return String(data.get(otherName) || "").trim() || "Other (not specified)";
  }

  function encodeFormData(data) {
    return data.toString().replace(/%20/g, "+");
  }

  if (!form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    setStatus("");

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    if (!phoneInput || !phoneIti) {
      setStatus(
        "Phone selector did not load. Refresh the page and try again.",
        "error"
      );
      return;
    }

    const country = phoneIti.getSelectedCountryData();
    const digits = phoneInput.value.replace(/\D/g, "");

    if (
      (country.iso2 === "in" && digits.length !== 10) ||
      digits.length < 4
    ) {
      setStatus(
        country.iso2 === "in"
          ? "Please enter exactly 10 digits for an Indian mobile number."
          : "Please enter a valid phone number.",
        "error"
      );
      phoneInput.focus();
      return;
    }

    const sendMethod =
      form.querySelector('input[name="send_method"]:checked')?.value;

    if (!["whatsapp", "email", "both"].includes(sendMethod)) {
      setStatus("Please choose WhatsApp, Email, or Both.", "error");
      return;
    }

    if (form.dataset.submitting === "true") return;
    form.dataset.submitting = "true";

    const submitButton = form.querySelector('button[type="submit"]');

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.querySelector("span:first-child").textContent =
        "SUBMITTING ENQUIRY...";
    }

    // Open a tab immediately in response to the user's submit action.
    let whatsappTab = null;

    if (sendMethod === "whatsapp" || sendMethod === "both") {
      try {
        whatsappTab = window.open("about:blank", "_blank");
      } catch (_) {
        whatsappTab = null;
      }
    }

    try {
      const raw = new FormData(form);
      const fullPhone = `+${country.dialCode}${digits}`;

      const service = effectiveValue(raw, "service", "service_other");
      const budget = effectiveValue(raw, "budget", "budget_other");
      const deadline = effectiveValue(raw, "deadline", "deadline_other");
      const projectType = effectiveValue(
        raw, "project_type", "project_type_other"
      );
      const preferredContact = effectiveValue(
        raw, "preferred_contact", "preferred_contact_other"
      );

      const submission = new URLSearchParams();

      submission.set("form-name", "contact-enquiry");
      submission.set("name", String(raw.get("name") || "").trim());
      submission.set("email", String(raw.get("email") || "").trim());
      submission.set("phone", fullPhone);
      submission.set("business", String(raw.get("business") || "").trim());

      submission.set("service", service);
      submission.set("service_other", String(raw.get("service_other") || "").trim());
      submission.set("budget", budget);
      submission.set("budget_other", String(raw.get("budget_other") || "").trim());
      submission.set("deadline", deadline);
      submission.set("deadline_other", String(raw.get("deadline_other") || "").trim());

      submission.set("project_type", projectType);
      submission.set(
        "project_type_other",
        String(raw.get("project_type_other") || "").trim()
      );

      submission.set("preferred_contact", preferredContact);
      submission.set(
        "preferred_contact_other",
        String(raw.get("preferred_contact_other") || "").trim()
      );

      submission.set("message", String(raw.get("message") || "").trim());
      submission.set("reference", String(raw.get("reference") || "").trim());
      submission.set("notes", String(raw.get("notes") || "").trim());
      submission.set("send_method", sendMethod);
      submission.set("bot-field", String(raw.get("bot-field") || ""));
      submission.set("subject", `New KN Studio enquiry — ${service}`);

      // Netlify Forms submission: no Outlook/Gmail app is opened.
      const response = await fetch("/", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
        },
        body: encodeFormData(submission)
      });

      if (!response.ok) {
        throw new Error(
          `Netlify returned HTTP ${response.status}. Check form detection and redeploy.`
        );
      }

      const whatsappMessage = [
        "NEW PROJECT ENQUIRY — KN STUDIO",
        "",
        `Name: ${String(raw.get("name") || "").trim()}`,
        `Email: ${String(raw.get("email") || "").trim()}`,
        `WhatsApp / Phone: ${fullPhone}`,
        `Business / Brand: ${String(raw.get("business") || "").trim() || "Not provided"}`,
        "",
        `Service: ${service}`,
        `Budget: ${budget}`,
        `Deadline: ${deadline}`,
        `Project type: ${projectType}`,
        `Preferred contact: ${preferredContact}`,
        "",
        "Project requirements:",
        String(raw.get("message") || "").trim(),
        "",
        `Reference website: ${String(raw.get("reference") || "").trim() || "Not provided"}`,
        `Additional notes: ${String(raw.get("notes") || "").trim() || "Not provided"}`
      ].join("\n");

      if (sendMethod === "whatsapp" || sendMethod === "both") {
        const whatsappURL =
          `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`;

        if (whatsappTab && !whatsappTab.closed) {
          whatsappTab.location.replace(whatsappURL);
        } else {
          setStatus(
            "Enquiry submitted, but your browser blocked the WhatsApp tab. Allow pop-ups and use the WhatsApp link on this page.",
            "error"
          );
        }
      }

      if (successPanel) {
        successPanel.hidden = false;
        successPanel.scrollIntoView({
          behavior: "smooth",
          block: "nearest"
        });
      }

      if (sendMethod === "email") {
        setStatus(
          "Enquiry submitted to Netlify. Email delivery depends on your configured Netlify notification settings.",
          "success"
        );
      } else if (sendMethod === "both") {
        setStatus(
          "Enquiry submitted to Netlify. WhatsApp is opening with your message ready; press Send in WhatsApp. Email notification depends on your Netlify settings.",
          "success"
        );
      } else {
        setStatus(
          "Enquiry submitted to Netlify. WhatsApp is opening with your message ready; press Send in WhatsApp.",
          "success"
        );
      }

      form.reset();

      otherPairs.forEach(([selectId, inputId]) => {
        const select = document.getElementById(selectId);
        const input = document.getElementById(inputId);

        if (select && input) {
          input.hidden = select.value !== "Other";
          input.required = select.value === "Other";
        }
      });

      if (phoneIti) phoneIti.setCountry("in");

    } catch (error) {
      console.error("KN Studio form submission error:", error);

      if (whatsappTab && !whatsappTab.closed) {
        try { whatsappTab.close(); } catch (_) {}
      }

      setStatus(
        error.message || "Could not submit the enquiry. Check your connection and try again.",
        "error"
      );

    } finally {
      form.dataset.submitting = "false";

      if (submitButton) {
        submitButton.disabled = false;
        submitButton.querySelector("span:first-child").textContent =
          "SUBMIT ENQUIRY";
      }
    }
  });
});
