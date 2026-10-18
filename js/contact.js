"use strict";

/* KN STUDIO — CONTACT FORM
   Validates the enquiry and opens WhatsApp with a pre-filled message.
   Nothing is sent automatically; the visitor reviews and sends it.
*/
(function initContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  const status = document.getElementById("form-status");
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  // Replace with the studio's WhatsApp number in international format.
  const WHATSAPP_NUMBER = "919081815781";

  const fields = {
    name: document.getElementById("name"),
    email: document.getElementById("email"),
    phone: document.getElementById("phone"),
    business: document.getElementById("business"),
    service: document.getElementById("service"),
    budget: document.getElementById("budget"),
    deadline: document.getElementById("deadline"),
    message: document.getElementById("message"),
    reference: document.getElementById("reference"),
    notes: document.getElementById("notes")
  };

  function value(field) {
    return field ? field.value.trim() : "";
  }

  function showStatus(message, type) {
    if (!status) return;
    status.replaceChildren();
    status.textContent = message;
    status.className = `form-status visible ${type}`;
  }

  function clearStatus() {
    if (!status) return;
    status.replaceChildren();
    status.className = "form-status";
  }

  function markInvalid(field, message) {
    if (field) {
      field.setAttribute("aria-invalid", "true");
      field.focus();
    }
    showStatus(message, "error");
  }

  function validEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function validPhone(phone) {
    const digits = phone.replace(/\D/g, "");
    return /^[+0-9().\s-]+$/.test(phone) && digits.length >= 7 && digits.length <= 15;
  }

  function validUrl(url) {
    if (!url) return true;
    try {
      const parsed = new URL(url);
      return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
      return false;
    }
  }

  function selectedPreferences() {
    return Array.from(form.querySelectorAll('input[name="preferred_contact"]:checked'))
      .map((checkbox) => checkbox.value);
  }

  function validate() {
    form.querySelectorAll('[aria-invalid="true"]').forEach((field) => field.removeAttribute("aria-invalid"));
    clearStatus();

    if (!value(fields.name)) return markInvalid(fields.name, "Please enter your name."), false;
    if (!value(fields.email)) return markInvalid(fields.email, "Please enter your email address."), false;
    if (!validEmail(value(fields.email))) return markInvalid(fields.email, "Please enter a valid email address."), false;
    if (!value(fields.phone)) return markInvalid(fields.phone, "Please enter your WhatsApp or phone number."), false;
    if (!validPhone(value(fields.phone))) return markInvalid(fields.phone, "Please enter a valid phone number, including the country code if needed."), false;
    if (!value(fields.service)) return markInvalid(fields.service, "Please select the service you need."), false;
    if (!value(fields.message)) return markInvalid(fields.message, "Please describe your project."), false;
    if (!validUrl(value(fields.reference))) return markInvalid(fields.reference, "Please enter a valid reference URL beginning with https:// or http://."), false;

    if (selectedPreferences().length === 0) {
      showStatus("Please select at least one contact preference: WhatsApp, Email, or both.", "error");
      const first = form.querySelector('input[name="preferred_contact"]');
      if (first) first.focus();
      return false;
    }
    return true;
  }

  function buildMessage() {
    const preferences = selectedPreferences();
    return [
      "Hello KN Studio!",
      "",
      "I'd like to discuss a project. Here are my details:",
      "",
      `Name: ${value(fields.name)}`,
      `Email: ${value(fields.email)}`,
      `WhatsApp / Phone: ${value(fields.phone)}`,
      `Business / Brand: ${value(fields.business) || "Not provided"}`,
      `Service: ${value(fields.service)}`,
      `Estimated Budget: ${value(fields.budget) || "Not specified"}`,
      `Expected Timeline: ${value(fields.deadline) || "Not specified"}`,
      "",
      "Project Details:",
      value(fields.message),
      "",
      `Reference Website: ${value(fields.reference) || "Not provided"}`,
      `Preferred Contact: ${preferences.join(" and ")}`,
      `Additional Notes: ${value(fields.notes) || "None"}`,
      "",
      "Thank you!"
    ].join("\n");
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!validate()) return;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildMessage())}`;
    const opened = window.open(url, "_blank", "noopener,noreferrer");

    if (opened) {
      showStatus("WhatsApp has opened with your enquiry. Review the message and tap Send when you're ready.", "success");
    } else {
      showStatus("Your enquiry is ready. Use the link below to open WhatsApp.", "success");
      const link = document.createElement("a");
      link.href = url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.className = "whatsapp-fallback";
      link.textContent = "Open WhatsApp ↗";
      status.append(document.createElement("br"), link);
    }
  });

  form.addEventListener("input", (event) => {
    if (event.target.matches('[aria-invalid="true"]')) event.target.removeAttribute("aria-invalid");
    if (status && status.classList.contains("error")) clearStatus();
  });

  form.addEventListener("change", (event) => {
    if (event.target.matches('[aria-invalid="true"]')) event.target.removeAttribute("aria-invalid");
    if (status && status.classList.contains("error")) clearStatus();
  });
})();
