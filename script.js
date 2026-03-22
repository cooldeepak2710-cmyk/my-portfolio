const body = document.body;
const menuToggle = document.querySelector(".menu-toggle");
const navPanel = document.querySelector(".nav-panel");
const navLinks = document.querySelectorAll(".nav-panel a");
const previewButton = document.getElementById("preview-cv-btn");
const cvModal = document.getElementById("cv-modal");
const modalClose = document.querySelector(".modal-close");
const modalBackdrop = document.querySelector(".modal-backdrop");
const cursorDot = document.querySelector(".cursor-dot");
const cursorRing = document.querySelector(".cursor-ring");
const contactForm = document.querySelector(".contact-form");
const typingText = document.getElementById("typing-text");
const revealItems = document.querySelectorAll(".reveal");
const tiltItems = document.querySelectorAll(".tilt-card");
const magneticItems = document.querySelectorAll(".magnetic");
const clickableItems = document.querySelectorAll("a, button, input, textarea");
const sections = document.querySelectorAll("main section[id]");

const typingPhrases = [
  "Software Developer | AI & ML Student | Video Editor",
  "Building interactive web experiences",
  "Exploring AI, ML, and creative motion design"
];

let typingPhraseIndex = 0;
let typingCharIndex = 0;
let isDeleting = false;

function setMenu(open) {
  menuToggle.classList.toggle("is-open", open);
  navPanel.classList.toggle("is-open", open);
  menuToggle.setAttribute("aria-expanded", String(open));
  body.classList.toggle("menu-open", open);
}

if (menuToggle) {
  menuToggle.addEventListener("click", () => {
    const open = !menuToggle.classList.contains("is-open");
    setMenu(open);
  });
}

navLinks.forEach((link) => {
  link.addEventListener("click", () => setMenu(false));
});

function setModal(open) {
  cvModal.classList.toggle("is-open", open);
  cvModal.setAttribute("aria-hidden", String(!open));
  body.classList.toggle("modal-open", open);
}

previewButton?.addEventListener("click", () => setModal(true));
modalClose?.addEventListener("click", () => setModal(false));
modalBackdrop?.addEventListener("click", () => setModal(false));

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    setModal(false);
    setMenu(false);
  }
});

if (typingText) {
  const tick = () => {
    const phrase = typingPhrases[typingPhraseIndex];
    if (isDeleting) {
      typingCharIndex -= 1;
    } else {
      typingCharIndex += 1;
    }

    typingText.textContent = phrase.slice(0, typingCharIndex);

    let timeout = isDeleting ? 45 : 80;
    if (!isDeleting && typingCharIndex === phrase.length) {
      timeout = 1400;
      isDeleting = true;
    } else if (isDeleting && typingCharIndex === 0) {
      isDeleting = false;
      typingPhraseIndex = (typingPhraseIndex + 1) % typingPhrases.length;
      timeout = 250;
    }

    window.setTimeout(tick, timeout);
  };

  tick();
}

if (window.gsap) {
  gsap.registerPlugin(window.ScrollTrigger);

  // Remove the default hidden reveal state for the hero, then animate its parts intentionally.
  gsap.set(".hero .reveal", {
    opacity: 1,
    y: 0
  });

  gsap.from(".site-header", {
    y: -60,
    opacity: 0,
    duration: 1,
    ease: "power3.out"
  });

  gsap.from(".hero-title .line", {
    yPercent: 110,
    opacity: 0,
    duration: 1.15,
    stagger: 0.14,
    ease: "power4.out"
  });

  gsap.from(".hero-subtitle, .hero-description, .hero-actions, .hero-metrics .metric-card", {
    y: 30,
    opacity: 0,
    duration: 0.9,
    delay: 0.45,
    stagger: 0.12,
    ease: "power3.out"
  });

  gsap.from(".profile-orb, .floating-chip", {
    scale: 0.9,
    opacity: 0,
    duration: 1.2,
    stagger: 0.16,
    ease: "power3.out",
    delay: 0.35
  });

  revealItems.forEach((item, index) => {
    gsap.to(item, {
      y: 0,
      opacity: 1,
      duration: 0.9,
      ease: "power3.out",
      delay: index % 3 * 0.05,
      scrollTrigger: {
        trigger: item,
        start: "top 86%"
      }
    });
  });
}

tiltItems.forEach((card) => {
  // Lightweight pointer tilt keeps cards interactive without an extra dependency.
  card.addEventListener("mousemove", (event) => {
    const rect = card.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    const rotateY = (px - 0.5) * 12;
    const rotateX = (0.5 - py) * 12;

    card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
  });
});

magneticItems.forEach((item) => {
  // Buttons and pills track the pointer slightly for a magnetic neon feel.
  item.addEventListener("mousemove", (event) => {
    const rect = item.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    item.style.transform = `translate(${x * 0.12}px, ${y * 0.12}px)`;
  });

  item.addEventListener("mouseleave", () => {
    item.style.transform = "";
  });
});

if (cursorDot && cursorRing && window.innerWidth > 700) {
  const cursor = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
    ringX: window.innerWidth / 2,
    ringY: window.innerHeight / 2
  };

  document.addEventListener("mousemove", (event) => {
    cursor.x = event.clientX;
    cursor.y = event.clientY;
  });

  clickableItems.forEach((item) => {
    item.addEventListener("mouseenter", () => cursorRing.classList.add("active"));
    item.addEventListener("mouseleave", () => cursorRing.classList.remove("active"));
  });

  const renderCursor = () => {
    // The ring lags behind the dot to create the trailing cursor effect.
    cursor.ringX += (cursor.x - cursor.ringX) * 0.18;
    cursor.ringY += (cursor.y - cursor.ringY) * 0.18;

    cursorDot.style.left = `${cursor.x}px`;
    cursorDot.style.top = `${cursor.y}px`;
    cursorRing.style.left = `${cursor.ringX}px`;
    cursorRing.style.top = `${cursor.ringY}px`;

    requestAnimationFrame(renderCursor);
  };

  renderCursor();
}

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const id = entry.target.getAttribute("id");
    navLinks.forEach((link) => {
      const active = link.getAttribute("href") === `#${id}`;
      link.classList.toggle("active", active);
    });
  });
}, {
  rootMargin: "-35% 0px -50% 0px",
  threshold: 0.1
});

sections.forEach((section) => sectionObserver.observe(section));

contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const submitButton = contactForm.querySelector('button[type="submit"]');
  submitButton.textContent = "Message queued";
  submitButton.setAttribute("disabled", "disabled");

  window.setTimeout(() => {
    submitButton.textContent = "Send Message";
    submitButton.removeAttribute("disabled");
    contactForm.reset();
  }, 1800);
});
