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

// Interactive gallery
const galleryData = {
  identity: {
    title: 'Kurumsal Kimlik',
    items: [
      { cls: 'identity-1', title: 'Logo & Amblem', subtitle: 'Kurumsal Kimlik' },
      { cls: 'identity-2', title: 'Katalog Tasarımı', subtitle: 'Kurumsal Kimlik' },
      { cls: 'identity-3', title: 'Matbu Ürünler', subtitle: 'Kurumsal Kimlik' },
      { cls: 'identity-4', title: 'Marka Uygulamaları', subtitle: 'Kurumsal Kimlik' }
    ]
  },
  print: {
    title: 'Dijital Baskı',
    items: [
      { cls: 'print-1', title: 'Poster Baskı', subtitle: 'Dijital Baskı & Sergileme' },
      { cls: 'print-2', title: 'Rollup & Banner', subtitle: 'Dijital Baskı & Sergileme' },
      { cls: 'print-3', title: 'Foreks & Fotoblok', subtitle: 'Dijital Baskı & Sergileme' },
      { cls: 'print-4', title: 'Özel Ürün Standı', subtitle: 'Dijital Baskı & Sergileme' }
    ]
  },
  outdoor: {
    title: 'Indoor / Outdoor',
    items: [
      { cls: 'outdoor-1', title: 'Tabela Sistemleri', subtitle: 'Indoor / Outdoor' },
      { cls: 'outdoor-2', title: 'Araç Giydirme', subtitle: 'Indoor / Outdoor' },
      { cls: 'outdoor-3', title: 'Cephe Giydirme', subtitle: 'Indoor / Outdoor' },
      { cls: 'outdoor-4', title: 'Billboard & Afiş', subtitle: 'Indoor / Outdoor' }
    ]
  },
  fair: {
    title: 'Fuar & Sergileme',
    items: [
      { cls: 'fair-1', title: 'Fuar Standı', subtitle: 'Fuar & Sergileme' },
      { cls: 'fair-2', title: 'Stand Tasarımı', subtitle: 'Fuar & Sergileme' },
      { cls: 'fair-3', title: 'Kurulum', subtitle: 'Fuar & Sergileme' },
      { cls: 'fair-4', title: 'Sergileme Sistemleri', subtitle: 'Fuar & Sergileme' }
    ]
  },
  web: {
    title: 'Web & Dijital',
    items: [
      { cls: 'web-1', title: 'Web Tasarım', subtitle: 'Web & Dijital' },
      { cls: 'web-2', title: 'Kurumsal Web', subtitle: 'Web & Dijital' },
      { cls: 'web-3', title: 'Dijital Arayüz', subtitle: 'Web & Dijital' },
      { cls: 'web-4', title: 'Dijital Yayın', subtitle: 'Web & Dijital' }
    ]
  }
};

const galleryModal = document.getElementById('galleryModal');
const gallerySlide = document.getElementById('gallerySlide');
const galleryModalTitle = document.getElementById('galleryModalTitle');
const gallerySlideTitle = document.getElementById('gallerySlideTitle');
const gallerySlideSubtitle = document.getElementById('gallerySlideSubtitle');
const galleryCurrent = document.getElementById('galleryCurrent');
const galleryTotal = document.getElementById('galleryTotal');
const galleryDots = document.getElementById('galleryDots');
const galleryPrev = document.querySelector('.gallery-prev');
const galleryNext = document.querySelector('.gallery-next');

let activeGallery = null;
let activeIndex = 0;
let lastGalleryTrigger = null;
let touchStartX = 0;

function renderGallerySlide(animate = true) {
  if (!activeGallery) return;
  const data = galleryData[activeGallery];
  const item = data.items[activeIndex];

  if (animate) gallerySlide.classList.add('is-changing');

  window.setTimeout(() => {
    gallerySlide.className = 'gallery-slide ' + item.cls;
    gallerySlide.setAttribute('aria-label', item.title);
    galleryModalTitle.textContent = data.title;
    gallerySlideTitle.textContent = item.title;
    gallerySlideSubtitle.textContent = item.subtitle;
    galleryCurrent.textContent = String(activeIndex + 1);
    galleryTotal.textContent = String(data.items.length);

    galleryDots.querySelectorAll('.gallery-dot').forEach((dot, index) => {
      dot.classList.toggle('is-active', index === activeIndex);
      dot.setAttribute('aria-current', index === activeIndex ? 'true' : 'false');
    });
  }, animate ? 120 : 0);
}

function buildGalleryDots() {
  const data = galleryData[activeGallery];
  galleryDots.innerHTML = '';
  data.items.forEach((item, index) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'gallery-dot';
    dot.setAttribute('aria-label', (index + 1) + '. görsele git');
    dot.addEventListener('click', () => {
      activeIndex = index;
      renderGallerySlide();
    });
    galleryDots.appendChild(dot);
  });
}

function openGallery(key, trigger) {
  if (!galleryData[key]) return;
  activeGallery = key;
  activeIndex = 0;
  lastGalleryTrigger = trigger;
  buildGalleryDots();
  renderGallerySlide(false);
  galleryModal.classList.add('is-open');
  galleryModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('gallery-open');
  document.querySelector('.gallery-close').focus();
}

function closeGallery() {
  galleryModal.classList.remove('is-open');
  galleryModal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('gallery-open');
  activeGallery = null;
  if (lastGalleryTrigger) lastGalleryTrigger.focus();
}

function moveGallery(direction) {
  if (!activeGallery) return;
  const total = galleryData[activeGallery].items.length;
  activeIndex = (activeIndex + direction + total) % total;
  renderGallerySlide();
}

document.querySelectorAll('.gallery-card').forEach(card => {
  card.addEventListener('click', () => openGallery(card.dataset.gallery, card));
});

document.querySelectorAll('[data-gallery-close]').forEach(el => {
  el.addEventListener('click', closeGallery);
});

galleryPrev.addEventListener('click', () => moveGallery(-1));
galleryNext.addEventListener('click', () => moveGallery(1));

gallerySlide.addEventListener('touchstart', e => {
  touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

gallerySlide.addEventListener('touchend', e => {
  const diff = e.changedTouches[0].screenX - touchStartX;
  if (Math.abs(diff) > 45) moveGallery(diff > 0 ? -1 : 1);
}, { passive: true });

document.addEventListener('keydown', e => {
  if (!galleryModal.classList.contains('is-open')) return;
  if (e.key === 'Escape') closeGallery();
  if (e.key === 'ArrowLeft') moveGallery(-1);
  if (e.key === 'ArrowRight') moveGallery(1);
});
