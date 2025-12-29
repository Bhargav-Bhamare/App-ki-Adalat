document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initSmoothScroll();
  initStatsObserver();
  initAccessButtons();
});

function initMobileMenu() {
  const toggle = document.querySelector('.mobile-menu-toggle');
  const menu = document.querySelector('.nav-menu');

  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      menu.classList.toggle('active');
      toggle.classList.toggle('active');
    });
  }
}

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

/* ---------------- LIVE JUDICIAL DATA FIX ---------------- */

function initStatsObserver() {
  const statsGrid = document.querySelector('.stats-grid');
  const counters = document.querySelectorAll('.stat-value[data-target]');

  if (!statsGrid || counters.length === 0) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        counters.forEach(counter => animateCounter(counter));
        observer.unobserve(statsGrid);
      }
    });
  }, { threshold: 0.4 });

  observer.observe(statsGrid);
}

function animateCounter(element) {
  const target = parseInt(element.dataset.target, 10);
  let current = 0;
  const duration = 2000;
  const step = Math.max(1, Math.floor(target / (duration / 16)));

  function update() {
    current += step;
    if (current < target) {
      element.textContent = current.toLocaleString();
      requestAnimationFrame(update);
    } else {
      element.textContent = target.toLocaleString();
    }
  }

  update();
}

/* ------------------------------------------------------- */

// function initAccessButtons() {
//   document.querySelectorAll('.access-btn').forEach(button => {
//     button.addEventListener('click', () => {
//       alert(
//         'Portal access is under development.\nPlease contact the system administrator.'
//       );
//     });
//   });
// }

window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  navbar.style.boxShadow =
    window.scrollY > 50
      ? '0 4px 12px rgba(0,0,0,0.1)'
      : '0 1px 3px rgba(0,0,0,0.1)';
});
