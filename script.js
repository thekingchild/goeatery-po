const header = document.querySelector("[data-nav]");
const toggle = document.querySelector(".menu-toggle");
const billingOptions = document.querySelectorAll("[data-billing-option]");
const planPrices = document.querySelectorAll("[data-monthly-price][data-annual-price]");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const updateHeaderState = () => {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 12);
};

updateHeaderState();
window.addEventListener("scroll", updateHeaderState, { passive: true });

if (header && toggle) {
  toggle.addEventListener("click", () => {
    const isOpen = header.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  header.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", () => {
      header.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

const setBillingPeriod = (period) => {
  const isAnnual = period === "annual";

  billingOptions.forEach((option) => {
    const isSelected = option.dataset.billingOption === period;
    option.classList.toggle("is-active", isSelected);
    option.setAttribute("aria-checked", String(isSelected));
  });

  planPrices.forEach((price) => {
    const amount = isAnnual ? price.dataset.annualPrice : price.dataset.monthlyPrice;
    const cadence = isAnnual ? "/ year" : "/ month";
    price.innerHTML = `${amount} <span>${cadence}</span>`;
  });
};

billingOptions.forEach((option) => {
  option.addEventListener("click", () => {
    setBillingPeriod(option.dataset.billingOption);
  });

  option.addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;

    event.preventDefault();
    const nextPeriod = event.key === "ArrowRight" ? "annual" : "monthly";
    const nextOption = document.querySelector(`[data-billing-option="${nextPeriod}"]`);
    setBillingPeriod(nextPeriod);
    nextOption?.focus();
  });
});

const revealItems = [
  ...document.querySelectorAll(
    ".hero-copy, .hero-product, .proof-card, .phone-panel, .split-copy, .module-card, .dark-copy, .dark-card, .timeline-card, .workflow-foot, .pricing-card, .faq-list details, .cta-band, .privacy-hero-copy, .privacy-summary, .privacy-highlights article, .privacy-policy-intro, .privacy-policy-grid article, .privacy-contact"
  )
];

const revealAll = () => {
  revealItems.forEach((item) => item.classList.add("is-visible"));
};

revealItems.forEach((item, index) => {
  item.classList.add("revealable");
  item.style.setProperty("--reveal-delay", `${Math.min(index * 45, 180)}ms`);
});

if (reducedMotion || !("IntersectionObserver" in window)) {
  revealAll();
} else {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
  );

  revealItems.forEach((item) => revealObserver.observe(item));

  // Fallback so sections never remain hidden if observation is delayed or blocked.
  window.addEventListener(
    "load",
    () => {
      window.setTimeout(revealAll, 1200);
    },
    { once: true }
  );
}
