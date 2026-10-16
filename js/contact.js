
"use strict";

// =============================================
// KN STUDIO — CONTACT FORM
// FormSubmit + WhatsApp + Success Popup
// =============================================

document.addEventListener("DOMContentLoaded", () => {
  const contactForm = document.querySelector("#contact-form");
  const formStatus = document.querySelector("#form-status");
  const currentYear = document.querySelector("#current-year");
  const phoneInput = document.querySelector("#phone");

  const ENQUIRY_EMAIL = "kpworksss007@gmail.com";
  const WHATSAPP_NUMBER = "919081815781";

  // ===========================================
  // FOOTER YEAR
  // ===========================================

  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }

  // ===========================================
  // PHONE COUNTRY SELECTOR
  // ===========================================

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

    phoneInput.addEventListener("input", () => {
      const country = phoneIti.getSelectedCountryData();
      const maxDigits = country.iso2 === "in" ? 10 : 15;

      const digits = phoneInput.value
        .replace(/\D/g, "")
        .slice(0, maxDigits);

      if (phoneInput.value !== digits) {
        phoneInput.value = digits;
      }
    });

    phoneInput.addEventListener("countrychange", () => {
      phoneInput.value = "";

      const country = phoneIti.getSelectedCountryData();

      phoneInput.placeholder =
        country.iso2 === "in"
          ? "Enter 10-digit number"
          : "Enter phone number";
    });
  }

  // ===========================================
  // HELPERS
  // ===========================================

  function setStatus(message) {
    if (formStatus) {
      formStatus.textContent = message;
    }
  }

  function getField(formData, key, fallback = "Not provided") {
    const value = formData.get(key);

    if (typeof value !== "string" || !value.trim()) {
      return fallback;
    }

    return value.trim();
  }

  function getErrorMessage(error) {
    if (error instanceof TypeError) {
      return "Network error. Check your internet connection and try again.";
    }

    return error?.message || "Something went wrong. Please try again.";
  }

  // ===========================================
  // SUCCESS POPUP
  // ===========================================

  const successModal = document.querySelector("#success-modal");
  const successCard = successModal?.querySelector(".success-card");

  let previousFocus = null;

  function openSuccessPopup() {
    if (!successModal) {
      setStatus("Enquiry submitted successfully.");
      return;
    }

    previousFocus = document.activeElement;

    successModal.classList.add("is-visible");
    successModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");

    successCard?.focus();
  }

  
function closeSuccessPopup(event) {
  if (!successModal) return;

  // Navigate home only when the BACK TO WEBSITE button is clicked
  if (event?.currentTarget?.classList.contains("success-done")) {
    window.location.href = "../index.html";
    return;
  }

  // Close popup normally when clicking the close button or overlay
  successModal.classList.remove("is-visible");
  successModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");

  if (previousFocus && typeof previousFocus.focus === "function") {
    previousFocus.focus();
  }
}


  successModal
    ?.querySelectorAll("[data-close-modal]")
    .forEach((element) => {
      element.addEventListener("click", closeSuccessPopup);
    });

  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      successModal?.classList.contains("is-visible")
    ) {
      closeSuccessPopup();
    }
  });

  // ===========================================
  // FORM SUBMISSION
  // ===========================================

  if (!contactForm) {
    console.error("KN Studio: #contact-form was not found.");
    return;
  }

  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!contactForm.checkValidity()) {
      contactForm.reportValidity();
      return;
    }

    // Phone library check
    if (!phoneInput || !phoneIti) {
      setStatus(
        "Phone selector did not load. Refresh the page and try again."
      );
      return;
    }

    const selectedCountry = phoneIti.getSelectedCountryData();
    const digits = phoneInput.value.replace(/\D/g, "");

    if (selectedCountry.iso2 === "in" && digits.length !== 10) {
      setStatus("Please enter exactly 10 digits for an Indian mobile number.");
      phoneInput.focus();
      return;
    }

    if (digits.length < 4) {
      setStatus("Please enter a valid phone number.");
      phoneInput.focus();
      return;
    }

    const fullPhoneNumber = `+${selectedCountry.dialCode}${digits}`;

    const submitButton = contactForm.querySelector(
      'button[type="submit"], input[type="submit"]'
    );

    if (contactForm.dataset.submitting === "true") {
      return;
    }

    contactForm.dataset.submitting = "true";

    const originalButtonText = submitButton
      ? (submitButton.tagName === "INPUT"
          ? submitButton.value
          : submitButton.innerHTML)
      : "";

    if (submitButton) {
      submitButton.disabled = true;

      if (submitButton.tagName === "INPUT") {
        submitButton.value = "Sending enquiry...";
      } else {
        submitButton.textContent = "Sending enquiry...";
      }
    }

    let whatsappTab = null;

    try {
      setStatus("Submitting your enquiry...");

      // Read all form values
      const formData = new FormData(contactForm);

      const enquiry = {
        name: getField(formData, "name", ""),
        email: getField(formData, "email", ""),
        phone: fullPhoneNumber,
        business: getField(formData, "business"),
        service: getField(formData, "service", ""),
        budget: getField(formData, "budget", "Not specified"),
        deadline: getField(formData, "deadline", "Not specified"),
        message: getField(formData, "message", ""),
        reference: getField(formData, "reference"),
        notes: getField(formData, "notes")
      };

      // Prepare structured email content
      const emailBody = [
        "NEW PROJECT ENQUIRY — KN STUDIO",
        "",
        "01. CLIENT INFORMATION",
        `Name: ${enquiry.name}`,
        `Email: ${enquiry.email}`,
        `Contact Number: ${enquiry.phone}`,
        `Business / Brand: ${enquiry.business}`,
        "",
        "02. SERVICE REQUIRED",
        enquiry.service,
        "",
        "03. PROJECT REQUIREMENTS",
        enquiry.message,
        "",
        "04. BUDGET & TIMELINE",
        `Budget: ${enquiry.budget}`,
        `Deadline: ${enquiry.deadline}`,
        "",
        "05. REFERENCE WEBSITE",
        enquiry.reference,
        "",
        "06. ADDITIONAL NOTES",
        enquiry.notes
      ].join("\n");

      // Prepare WhatsApp message
      const whatsappMessage = [
        "NEW PROJECT ENQUIRY",
        "KN STUDIO",
        "==============================",
        "",
        "01. CLIENT INFORMATION",
        `Name: ${enquiry.name}`,
        `Email: ${enquiry.email}`,
        `Contact Number: ${enquiry.phone}`,
        `Business / Brand: ${enquiry.business}`,
        "",
        "02. SERVICE REQUIRED",
        enquiry.service,
        "",
        "03. PROJECT REQUIREMENTS",
        enquiry.message,
        "",
        "04. BUDGET & TIMELINE",
        `Budget: ${enquiry.budget}`,
        `Deadline: ${enquiry.deadline}`,
        "",
        "05. REFERENCE WEBSITE",
        enquiry.reference,
        "",
        "06. ADDITIONAL NOTES",
        enquiry.notes,
        "",
        "==============================",
        "Submitted through the KN Studio website."
      ].join("\n");

      const whatsappURL =
        `https://wa.me/${WHATSAPP_NUMBER}` +
        `?text=${encodeURIComponent(whatsappMessage)}`;

      /*
       * Open the WhatsApp tab during the user's submit action,
       * before awaiting the network request.
       */
      try {
        whatsappTab = window.open("about:blank", "_blank");

        if (whatsappTab) {
          whatsappTab.opener = null;
        }
      } catch (popupError) {
        console.warn("WhatsApp tab could not open:", popupError);
      }

      // =========================================
      // FORMSUBMIT REQUEST
      // Send FormData rather than a JSON body.
      // =========================================

      formData.set("phone", enquiry.phone);
      formData.set("business", enquiry.business);
      formData.set("service", enquiry.service);
      formData.set("budget", enquiry.budget);
      formData.set("deadline", enquiry.deadline);
      formData.set("reference", enquiry.reference);
      formData.set("notes", enquiry.notes);
      formData.set("enquiry_details", emailBody);
      formData.set("_subject", `New KN Studio Enquiry — ${enquiry.service}`);
      formData.set("_template", "table");
      formData.set("_replyto", enquiry.email);

      const response = await fetch(
        `https://formsubmit.co/ajax/${ENQUIRY_EMAIL}`,
        {
          method: "POST",
          headers: {
            Accept: "application/json"
          },
          body: formData
        }
      );

      const responseText = await response.text();

      let result;

      try {
        result = JSON.parse(responseText);
      } catch {
        throw new Error(
          `Email service returned an unexpected response (HTTP ${response.status}).`
        );
      }

      console.log("KN Studio FormSubmit HTTP status:", response.status);
      console.log("KN Studio FormSubmit response:", result);

      if (!response.ok) {
        throw new Error(
          result.message ||
          `Email service returned HTTP ${response.status}.`
        );
      }

      // FormSubmit commonly returns success as the string "true".
      const successValue = String(result.success).toLowerCase();

      if (successValue !== "true") {
        throw new Error(
          result.message ||
          "Email service did not confirm the enquiry. Check FormSubmit setup."
        );
      }

      // Email request has been accepted at this point.
      setStatus("Enquiry submitted successfully.");

      // Navigate the already-open tab to WhatsApp.
      if (whatsappTab && !whatsappTab.closed) {
        try {
          whatsappTab.location.replace(whatsappURL);
        } catch (whatsappError) {
          console.warn("Could not open WhatsApp URL:", whatsappError);
          setStatus(
            "Enquiry submitted. Please allow pop-ups to open WhatsApp."
          );
        }
      } else {
        setStatus(
          "Enquiry submitted. Allow pop-ups if you want to open WhatsApp."
        );
      }

      // Show popup only after the email endpoint accepts the request.
      openSuccessPopup();

    } catch (error) {
      console.error("KN Studio enquiry error:", error);

      if (whatsappTab && !whatsappTab.closed) {
        try {
          whatsappTab.close();
        } catch (closeError) {
          console.warn("Could not close temporary tab:", closeError);
        }
      }

      setStatus(getErrorMessage(error));

    } finally {
      contactForm.dataset.submitting = "false";

      if (submitButton) {
        submitButton.disabled = false;

        if (submitButton.tagName === "INPUT") {
          submitButton.value = originalButtonText;
        } else {
          submitButton.innerHTML = originalButtonText;
        }
      }
    }
  });
});
 