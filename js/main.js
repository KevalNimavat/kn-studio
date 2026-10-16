
"use strict";

document.documentElement.classList.add("js-ready");

// Keep the footer year current automatically.
const yearElement = document.getElementById("year");

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

const reduceMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

// Add a subtle entrance transition when the page loads.
if (!reduceMotion) {
  document.body.classList.add("page-enter");
}

// Prepare suitable content blocks for scroll reveal.
const revealSelectors = [
  ".services-section .section-heading",
  ".service-card",
  ".work-section .section-heading",
  ".project-card",
  ".project-disclaimer",
  ".approach-section > .eyebrow",
  ".approach-content",
  ".approach-points > div",
  ".contact-banner",
  ".about-intro > *",
  ".about-background > *",
  ".skills-section .section-heading",
  ".skill-card",
  ".process-section > *"
];

const revealElements = document.querySelectorAll(
  revealSelectors.join(", ")
);

revealElements.forEach((element, index) => {
  element.classList.add("reveal");

  // Keep related cards from appearing all at once.
  if (element.matches(".service-card, .skill-card, .approach-points > div")) {
    element.classList.add(`reveal-delay-${(index % 3) + 1}`);
  }
});

if (reduceMotion || !("IntersectionObserver" in window)) {
  revealElements.forEach((element) => {
    element.classList.add("is-visible");
  });
} else {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -35px 0px"
    }
  );

  revealElements.forEach((element) => {
    revealObserver.observe(element);
  });
}

// Smooth scrolling for same-page anchor links.
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetId = link.getAttribute("href");

    if (!targetId || targetId === "#") {
      return;
    }

    const target = document.querySelector(targetId);

    if (target) {
      event.preventDefault();

      target.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "start"
      });
    }
  });
});

// Subtle fade for links that navigate to another local HTML page.
// Leave external links, downloads, new tabs and special links alone.
document.querySelectorAll("a[href]").forEach((link) => {
  link.addEventListener("click", (event) => {
    const href = link.getAttribute("href");

    if (
      !href ||
      href.startsWith("#") ||
      href.startsWith("mailto:") ||
      href.startsWith("tel:") ||
      link.target === "_blank" ||
      link.hasAttribute("download") ||
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey ||
      event.altKey ||
      reduceMotion
    ) {
      return;
    }

    let destination;

    try {
      destination = new URL(href, window.location.href);
    } catch {
      return;
    }

    if (
      destination.origin !== window.location.origin ||
      !destination.pathname.endsWith(".html") ||
      destination.href === window.location.href
    ) {
      return;
    }

    event.preventDefault();
    document.body.classList.add("page-leaving");

    window.setTimeout(() => {
      window.location.href = destination.href;
    }, 160);
  });
});

/* Scroll to top whenever the page is loaded or reloaded */
if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

window.addEventListener("load", function () {
  window.scrollTo(0, 0);
});
