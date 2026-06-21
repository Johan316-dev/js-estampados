// ── J&S ESTAMPADOS · PRODUCTOS ──

const BIN_ID      = '6a370de4f5f4af5e291608e1';
const MASTER_KEY  = '$2a$10$hk39iJUNwxY1ZOmVSmwk3egeEd72A4S.pjpyVnOjppM8EeuXdbe7q';
const ACCESS_KEY  = '$2a$10$cTRNso0H62YgRFXfQXRhkuM8czScfveu1KZ2XKHhTf4eveIoC2i9e';
const BIN_URL     = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

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

function getHeaders(includeContent = false) {
  const h = {
    'X-Master-Key': MASTER_KEY,
    'X-Access-Key': ACCESS_KEY,
    'X-Bin-Meta': 'false'
  };
  if (includeContent) h['Content-Type'] = 'application/json';
  return h;
}

async function getProducts() {
  try {
    const res = await fetch(`${BIN_URL}/latest`, { headers: getHeaders() });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const products = Array.isArray(data) ? data : (data.products || data.record?.products);
    if (Array.isArray(products)) {
      localStorage.setItem('js_products', JSON.stringify(products));
      return products;
    }
    throw new Error('formato inesperado');
  } catch(e) {
    console.warn('JSONBin error:', e.message);
    const s = localStorage.getItem('js_products');
    return s ? JSON.parse(s) : DEFAULT_PRODUCTS;
  }
}

async function saveProducts(products) {
  localStorage.setItem('js_products', JSON.stringify(products));
  try {
    const res = await fetch(BIN_URL, {
      method: 'PUT',
      headers: getHeaders(true),
      body: JSON.stringify({ products })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return true;
  } catch(e) {
    console.warn('Error guardando en JSONBin:', e.message);
    return false;
  }
}

function formatPrice(price) {
  return '$ ' + parseInt(price).toLocaleString('es-CO');
}
