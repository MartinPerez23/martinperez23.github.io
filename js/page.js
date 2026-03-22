const CONFIG = {
  WHATSAPP_NUMBER: "5491124735109",
};

function setupHeaderMenu() {
  const header = document.getElementById("spa-header");
  const toggleButton = document.getElementById("mobile-menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");

  if (!header || !toggleButton || !mobileMenu || header.dataset.menuReady === "true") {
    return;
  }

  const setMenuState = (isOpen) => {
    mobileMenu.classList.toggle("is-open", isOpen);
    toggleButton.setAttribute("aria-expanded", String(isOpen));
  };

  const closeMenu = () => {
    setMenuState(false);
  };

  toggleButton.addEventListener("click", (event) => {
    event.stopPropagation();
    const isOpen = toggleButton.getAttribute("aria-expanded") === "true";
    setMenuState(!isOpen);
  });

  header.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      closeMenu();
    }
  });

  document.addEventListener("click", (event) => {
    if (!header.contains(event.target)) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 1023) {
      closeMenu();
    }
  });

  header.dataset.menuReady = "true";
}

window.setupHeaderMenu = setupHeaderMenu;
setupHeaderMenu();

const headerContainer = document.getElementById("header-container");
if (headerContainer) {
  const headerObserver = new MutationObserver(() => {
    setupHeaderMenu();
    const currentHeader = document.getElementById("spa-header");
    if (currentHeader && currentHeader.dataset.menuReady === "true") {
      headerObserver.disconnect();
    }
  });

  headerObserver.observe(headerContainer, { childList: true, subtree: true });
}

// Funcion para abrir WhatsApp con un mensaje predefinido
function abrirWhatsapp(mensaje) {
  const url = `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(mensaje)}`;

  window.open(url, "_blank");
}

// Scroll to top visibility
window.addEventListener("scroll", function () {
  const scrollBtn = document.getElementById("scrollToTop");
  if (!scrollBtn) {
    return;
  }

  if (window.pageYOffset > 300) {
    scrollBtn.classList.remove("opacity-0");
  } else {
    scrollBtn.classList.add("opacity-0");
  }
});

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
});

// Intersection Observer para animaciones
const observerOptions = {
  threshold: 0.15,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver(function (entries) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
    }
  });
}, observerOptions);

document.querySelectorAll(".card-3d").forEach((el) => {
  el.style.opacity = "0";
  el.style.transform = "translateY(30px)";
  el.style.transition =
    "opacity 0.7s cubic-bezier(0.34, 1.56, 0.64, 1), transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)";
  observer.observe(el);
});

// Efecto parallax sutil en hero
let ticking = false;
window.addEventListener("mousemove", function (e) {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;

      document.querySelectorAll(".circuit-line").forEach((el, index) => {
        if (el.offsetParent !== null) {
          const speed = 5 + index * 2;
          el.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
        }
      });

      ticking = false;
    });
    ticking = true;
  }
});

// Form submission
document
  .getElementById("contactForm")
  ?.addEventListener("submit", function (e) {
    e.preventDefault();
    alert("Gracias por tu consulta. Nos comunicaremos en breve.");
    this.reset();
  });
