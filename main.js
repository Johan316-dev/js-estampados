// ── J&S ESTAMPADOS · MAIN JS ──

// LOADER
window.addEventListener('load', () => {
  setTimeout(() => document.getElementById('loader').classList.add('hidden'), 1800);
});

// NAVBAR
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

// MOBILE MENU
const burger = document.getElementById('navBurger');
const mobileMenu = document.getElementById('navMobile');
burger.addEventListener('click', () => mobileMenu.classList.toggle('open'));
document.querySelectorAll('.nav-mobile-link').forEach(link => {
  link.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

// REVEAL ON SCROLL
const revealEls = document.querySelectorAll('[data-reveal]');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
    }
  });
}, { threshold: 0.08 });
revealEls.forEach(el => observer.observe(el));

// ── CATÁLOGO ──
let currentFilter = 'all';

async function renderProducts(filter = 'all') {
  const grid = document.getElementById('productsGrid');
  const empty = document.getElementById('emptyState');

  // Mostrar skeleton mientras carga
  grid.innerHTML = Array(3).fill(`
    <div class="product-card" style="pointer-events:none;">
      <div class="product-img-wrap" style="background:var(--black3);animation:shimmer 1.5s infinite;">
        <div class="product-img-placeholder"><div class="ph-logo" style="opacity:0.2;">J<span>&</span>S</div></div>
      </div>
      <div class="product-info">
        <div style="height:8px;background:var(--black3);border-radius:4px;width:60%;margin-bottom:8px;"></div>
        <div style="height:14px;background:var(--black3);border-radius:4px;width:80%;margin-bottom:8px;"></div>
        <div style="height:14px;background:var(--black3);border-radius:4px;width:40%;"></div>
      </div>
    </div>
  `).join('');

  const products = await getProducts();
  currentFilter = filter;

  const filtered = filter === 'all'
    ? products.filter(p => p.active)
    : products.filter(p => p.active && (p.category === filter || p.technique === filter));

  if (filtered.length === 0) {
    grid.innerHTML = '';
    empty.style.display = 'block';
    return;
  }
  empty.style.display = 'none';

  grid.innerHTML = filtered.map(p => `
    <div class="product-card" onclick="openModal(${p.id})">
      <div class="product-img-wrap">
        ${p.image
          ? `<img class="product-img" src="${p.image}" alt="${p.name}" loading="lazy"/>`
          : `<div class="product-img-placeholder">
              <div class="ph-logo">J<span>&amp;</span>S</div>
              <div class="ph-line"></div>
            </div>`
        }
        <div class="product-overlay">
          <div class="overlay-btn">VER DETALLE</div>
        </div>
      </div>
      <div class="product-info">
        <div class="product-cat">${p.technique ? p.technique.toUpperCase() + ' · ' : ''}${p.category.toUpperCase()}</div>
        <div class="product-name">${p.name}</div>
        <div class="product-price">${formatPrice(p.price)}</div>
      </div>
    </div>
  `).join('');
}

// FILTROS
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderProducts(btn.dataset.filter);
  });
});

// ── MODAL ──
async function openModal(id) {
  const products = await getProducts();
  const p = products.find(x => x.id === id);
  if (!p) return;

  const img = document.getElementById('modalImg');
  const placeholder = document.getElementById('modalImgPlaceholder');
  if (p.image) {
    img.src = p.image;
    img.style.display = 'block';
    placeholder.style.display = 'none';
  } else {
    img.style.display = 'none';
    placeholder.style.display = 'flex';
  }

  document.getElementById('modalCat').textContent =
    (p.technique ? p.technique.toUpperCase() + ' · ' : '') + p.category.toUpperCase();
  document.getElementById('modalName').textContent = p.name;
  document.getElementById('modalPrice').textContent = formatPrice(p.price);
  document.getElementById('modalDesc').textContent = p.description;
  document.getElementById('modalSizes').innerHTML =
    p.sizes.map(s => `<div class="size-tag">${s}</div>`).join('');

  const waMsg = encodeURIComponent(`Hola J&S! Me interesa: ${p.name}. Precio: ${formatPrice(p.price)}. ¿Tienen disponibilidad?`);
  document.getElementById('modalWA').href = `https://wa.me/573000000000?text=${waMsg}`;

  document.getElementById('modalOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

document.getElementById('modalClose').addEventListener('click', closeModal);
document.getElementById('modalOverlay').addEventListener('click', e => {
  if (e.target === document.getElementById('modalOverlay')) closeModal();
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

// Shimmer animation
const style = document.createElement('style');
style.textContent = `@keyframes shimmer{0%,100%{opacity:0.4}50%{opacity:0.7}}`;
document.head.appendChild(style);

// INIT
renderProducts();
