// CRITICAL: This is a minimal emergency file to make the app work
// Full product catalog will be restored separately

const products = [];
const indianBrands = ['BIBA', 'WESTSIDE', 'MYNTRA', 'AJIO', 'ZUDIO'];
const trendingLabels = [];

function renderProducts(list, id) {
    const container = document.getElementById(id);
    if (!container) return;
    container.innerHTML = '<p>Loading products...</p>';
}

function openProductModal(product) {
    alert('Product: ' + product.name);
}

document.addEventListener('DOMContentLoaded', () => {
    const loader = document.getElementById('app-loader');
    if (loader) {
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => loader.style.display = 'none', 500);
        }, 1000);
    }
});
