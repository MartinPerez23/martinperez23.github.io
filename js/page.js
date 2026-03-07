// Scroll to top visibility
window.addEventListener("scroll", function () {
  const scrollBtn = document.getElementById("scrollToTop");
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
