const header = document.querySelector("[data-nav]");
const toggle = document.querySelector(".menu-toggle");
const billingOptions = document.querySelectorAll("[data-billing-option]");
const planPrices = document.querySelectorAll("[data-monthly-price][data-annual-price]");
const changeLogCards = document.querySelectorAll(".change-log-card");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const scrollProgress = document.createElement("div");
const scrollTopButton = document.createElement("button");

scrollProgress.className = "scroll-progress";
scrollProgress.setAttribute("aria-hidden", "true");
document.body.append(scrollProgress);

scrollTopButton.className = "scroll-top";
scrollTopButton.type = "button";
scrollTopButton.textContent = "Top";
scrollTopButton.setAttribute("aria-label", "Back to top");
document.body.append(scrollTopButton);

const updateHeaderState = () => {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 12);
};

const updateScrollEffects = () => {
  updateHeaderState();

  const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;
  scrollProgress.style.transform = `scaleX(${Math.min(Math.max(progress, 0), 1)})`;
  scrollTopButton.classList.toggle("is-visible", window.scrollY > 180);
};

updateScrollEffects();
window.addEventListener("scroll", updateScrollEffects, { passive: true });
window.addEventListener("resize", updateScrollEffects);

scrollTopButton.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
});

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

document.querySelectorAll(".pricing-compare").forEach((drawer) => {
  drawer.addEventListener("toggle", () => {
    if (!drawer.open) return;

    window.requestAnimationFrame(() => {
      const pricingTable = drawer.closest(".pricing-card-table");
      if (!pricingTable) return;

      const headerOffset = (header?.getBoundingClientRect().height || 76) + 18;
      const tableRect = pricingTable.getBoundingClientRect();
      const targetTop = Math.max(window.scrollY + tableRect.top - headerOffset, 0);

      if (tableRect.top < headerOffset || tableRect.top > window.innerHeight * 0.22) {
        window.scrollTo({ top: targetTop, behavior: reducedMotion ? "auto" : "smooth" });
      }
    });
  });
});

changeLogCards.forEach((card) => {
  const version = card.querySelector(".change-log-meta strong")?.textContent?.trim() || "release";
  const title = card.querySelector("h3")?.textContent?.trim() || "release notes";
  const notes = card.querySelector("ul");
  const notesId = `release-${version.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`;

  if (notes) {
    notes.id = notesId;
  }

  card.setAttribute("role", "button");
  card.setAttribute("tabindex", "0");
  card.setAttribute("aria-controls", notesId);
  card.setAttribute("aria-label", `Toggle ${version} ${title}`);
  card.setAttribute("aria-expanded", String(card.classList.contains("is-open")));

  const toggleCard = () => {
    const isOpen = card.classList.toggle("is-open");
    card.setAttribute("aria-expanded", String(isOpen));
  };

  card.addEventListener("click", toggleCard);
  card.addEventListener("keydown", (event) => {
    if (!["Enter", " "].includes(event.key)) return;

    event.preventDefault();
    toggleCard();
  });
});

const revealItems = [
  ...document.querySelectorAll(
    ".hero-copy, .hero-product, .proof-card, .phone-panel, .split-copy, .module-card, .dark-copy, .dark-card, .timeline-card, .workflow-foot, .pricing-card-table, .pricing-plan-card, .faq-list details, .cta-band, .privacy-hero-copy, .privacy-summary, .privacy-highlights article, .privacy-policy-intro, .privacy-policy-grid article, .privacy-contact, .change-log-intro, .change-log-card"
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
