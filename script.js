const header = document.querySelector("[data-nav]");
const toggle = document.querySelector(".menu-toggle");
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

const revealItems = [
  ...document.querySelectorAll(
    ".hero-copy, .hero-product, .proof-card, .phone-panel, .split-copy, .module-card, .dark-copy, .dark-card, .timeline-card, .workflow-foot, .pricing-card, .faq-list details, .cta-band"
  )
];

revealItems.forEach((item, index) => {
  item.classList.add("revealable");
  item.style.setProperty("--reveal-delay", `${Math.min(index * 45, 180)}ms`);
});

if (reducedMotion) {
  revealItems.forEach((item) => item.classList.add("is-visible"));
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
}
