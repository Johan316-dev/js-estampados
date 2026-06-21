// ── J&S ESTAMPADOS · PRODUCTOS ──
// Las llamadas van a /api/products (una función de Cloudflare Pages que
// vive en el servidor). Ahí, y solo ahí, viven las llaves de JSONBin y
// la contraseña de admin — nunca en este archivo, que cualquier
// visitante puede ver.

const DEFAULT_PRODUCTS = [
  {
    id: 1, name: 'Camiseta DTF Full Color', category: 'camiseta', technique: 'dtf',
    price: 35000, sizes: ['S','M','L','XL'],
    description: 'Estampado DTF de alta resolución en camiseta 100% algodón. Colores vivos y resistentes al lavado.',
    image: '', active: true
  },
  {
    id: 2, name: 'Hoodie Sublimación Total', category: 'hoodie', technique: 'sublimacion',
    price: 95000, sizes: ['S','M','L','XL'],
    description: 'Hoodie con sublimación 360°. El diseño cubre toda la prenda. Colores fotográficos permanentes.',
    image: '', active: true
  },
  {
    id: 3, name: 'Gorra DTF Personalizada', category: 'accesorio', technique: 'dtf',
    price: 28000, sizes: ['Única'],
    description: 'Gorra dad hat con estampado DTF en frente y/o visera. Personalización total.',
    image: '', active: true
  }
];

async function getProducts() {
  try {
    const res = await fetch('/api/products');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const products = await res.json();
    if (!Array.isArray(products)) throw new Error('formato inesperado');
    localStorage.setItem('js_products', JSON.stringify(products));
    return products;
  } catch (e) {
    console.warn('Error cargando productos:', e.message);
    const s = localStorage.getItem('js_products');
    return s ? JSON.parse(s) : DEFAULT_PRODUCTS;
  }
}

// Devuelve true si se guardó bien, 'auth' si la contraseña fue rechazada,
// false si hubo otro error (igual queda guardado localmente).
async function saveProducts(products) {
  localStorage.setItem('js_products', JSON.stringify(products));
  const password = sessionStorage.getItem('js_admin_pw') || '';
  try {
    const res = await fetch('/api/products', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Admin-Password': password
      },
      body: JSON.stringify({ products })
    });
    if (res.status === 401) {
      sessionStorage.removeItem('js_admin_pw');
      return 'auth';
    }
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return true;
  } catch (e) {
    console.warn('Error guardando productos:', e.message);
    return false;
  }
}

function formatPrice(price) {
  return '$ ' + parseInt(price).toLocaleString('es-CO');
}
