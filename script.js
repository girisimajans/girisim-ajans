const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
const header = document.querySelector('.site-header');
const navLinks = [...document.querySelectorAll('.nav a')];

menuButton.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', isOpen);
});

navLinks.forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
  });
});

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

const sections = [...document.querySelectorAll('main section[id]')];
const activateNav = () => {
  header.classList.toggle('is-scrolled', window.scrollY > 18);
  const current = sections
    .filter(section => section.getBoundingClientRect().top <= 150)
    .at(-1)?.id;
  navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === '#' + current));
};

window.addEventListener('scroll', activateNav, { passive: true });
activateNav();

document.getElementById('year').textContent = new Date().getFullYear();