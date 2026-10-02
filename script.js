const body = document.body;
const header = document.querySelector('.site-header');
const menuToggle = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-menu a');
const reelButton = document.querySelector('[data-reel]');
const reelModal = document.querySelector('.reel-modal');
const reelClose = document.querySelector('.reel-close');
const year = document.querySelector('#year');

if (year) year.textContent = new Date().getFullYear();

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 220);
}, { passive: true });

function setMenu(open) {
  menuToggle.classList.toggle('active', open);
  menuToggle.setAttribute('aria-expanded', String(open));
  mobileMenu.classList.toggle('open', open);
  mobileMenu.setAttribute('aria-hidden', String(!open));
  body.classList.toggle('menu-open', open);
}

menuToggle.addEventListener('click', () => setMenu(!mobileMenu.classList.contains('open')));
mobileLinks.forEach(link => link.addEventListener('click', () => setMenu(false)));

function setReel(open) {
  reelModal.classList.toggle('open', open);
  reelModal.setAttribute('aria-hidden', String(!open));
  body.classList.toggle('modal-open', open);
}

reelButton?.addEventListener('click', () => setReel(true));
reelClose?.addEventListener('click', () => setReel(false));
reelModal?.addEventListener('click', (event) => {
  if (event.target === reelModal) setReel(false);
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    if (reelModal.classList.contains('open')) setReel(false);
    if (mobileMenu.classList.contains('open')) setMenu(false);
  }
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

const slides = [...document.querySelectorAll('.testimonial')];
const currentLabel = document.querySelector('[data-slide-current]');
let slideIndex = 0;

function showSlide(index) {
  slideIndex = (index + slides.length) % slides.length;
  slides.forEach((slide, i) => slide.classList.toggle('active', i === slideIndex));
  if (currentLabel) currentLabel.textContent = String(slideIndex + 1).padStart(2, '0');
}

document.querySelector('[data-prev]')?.addEventListener('click', () => showSlide(slideIndex - 1));
document.querySelector('[data-next]')?.addEventListener('click', () => showSlide(slideIndex + 1));

// Subtle custom cursor on fine-pointer devices.
const dot = document.querySelector('.cursor-dot');
const ring = document.querySelector('.cursor-ring');
if (window.matchMedia('(pointer:fine)').matches && dot && ring) {
  let mouseX = innerWidth / 2;
  let mouseY = innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
  });

  const animateRing = () => {
    ringX += (mouseX - ringX) * 0.16;
    ringY += (mouseY - ringY) * 0.16;
    ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
    requestAnimationFrame(animateRing);
  };
  animateRing();

  document.querySelectorAll('a, button').forEach((item) => {
    item.addEventListener('mouseenter', () => {
      ring.style.width = '52px';
      ring.style.height = '52px';
    });
    item.addEventListener('mouseleave', () => {
      ring.style.width = '32px';
      ring.style.height = '32px';
    });
  });
}
