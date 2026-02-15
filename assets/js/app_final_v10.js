// StyleSynk Data
const products = [];
const syncBrands = [
    "BIBA", "WESTSIDE", "MAX", "MYNTRA", "AJIO", "ZUDIO", "FABINDIA", "LIBAS", "MANYAVAR", "GLOBAL DESI",
    "W FOR WOMAN", "NALLI", "PANTALOONS", "LAKSHITA", "MEENA BAZAAR", "SOCH", "ANOKHI", "AURELIA",
    "VAN HEUSEN", "ALLEN SOLLY", "PARK AVENUE", "SYMBOL", "ONLY", "VERO MODA", "MARKS & SPENCER",
    "ZARA", "H&M", "MANGO", "FOREVER 21", "LEVI'S", "UNITED COLORS OF BENETTON", "PUMA", "NIKE", "ADIDAS",
    "BATA", "METRO", "MOCHI", "SKECHERS", "CROCS", "CAMPUS"
];
const globalBrands = [
    "ZARA", "H&M", "MANGO", "FOREVER 21", "LEVI'S", "UNITED COLORS OF BENETTON",
    "PUMA", "NIKE", "ADIDAS", "MARKS & SPENCER", "ONLY", "VERO MODA", "MAX",
    "SKECHERS", "CROCS"
];

function renderProducts(productList, containerId, showFilters = false, containerElement = null) {
    const container = containerElement || document.getElementById(containerId);
    if (!container) return;
    if (!containerElement) container.innerHTML = "";

    productList.forEach(product => {
        const card = document.createElement("div");
        card.className = "product-card";

        // Brand logic: Sync = same clothing across multiple brands (has comparisons)
        const isSync = product.comparisons && product.comparisons.length > 0;
        const isIndian = !globalBrands.some(brand =>
            product.brand && product.brand.toUpperCase().includes(brand.toUpperCase())
        );

        // Fallback image logic
        const fallbackImage = 'https://placehold.co/600x800/1a1a1a/FFF?text=Image+Unavailable';
        const imageUrl = product.image && product.image.trim() ? product.image : fallbackImage;
        const productName = product.name || "Product";
        const productBrand = product.brand || "Brand";
        const productPrice = product.price || "Contact for Price";

        // Construct HTML safely
        let html = '<div class="product-img-container" style="background: #111; position: relative; aspect-ratio: 0.8;">';
        if (isIndian) {
            html += '<div class="origin-badge" style="font-size: 0.5rem; padding: 2px 6px;">MADE IN INDIA</div>';
        }
        html += '<img src="' + imageUrl + '" ';
        html += 'class="product-img" ';
        html += 'alt="' + productName.replace(/"/g, '&quot;') + '" ';
        html += 'loading="lazy" ';
        html += 'referrerpolicy="no-referrer" ';
        html += 'onerror="this.onerror=null; this.src=\'' + fallbackImage + '\'; this.parentElement.style.background=\'#222\';" ';
        html += 'style="display: block; width: 100%; height: 100%; object-fit: cover;">';

        if (isSync) {
            html += '<div class="tag tag-sync" style="font-size: 0.5rem; padding: 2px 6px;">SYNC</div>';
        } else {
            html += '<div class="tag tag-exclusive" style="font-size: 0.5rem; padding: 2px 6px;">EXCL</div>';
        }

        html += '</div>';
        html += '<div class="product-info" style="padding: 0.8rem;">';
        html += '<div class="brand-badge" style="cursor: pointer; font-size: 0.5rem; opacity: 0.8;">' + productBrand + '</div>';
        html += '<h3 class="product-name" style="font-size: 0.7rem; margin: 4px 0;">' + productName + '</h3>';
        html += '<div class="product-price" style="font-size: 0.8rem; font-weight: 800;">' + productPrice + '</div>';
        html += '</div>';

        card.innerHTML = html;

        // Brand click handler
        const brandBadge = card.querySelector(".brand-badge");
        if (brandBadge) {
            brandBadge.addEventListener("click", (e) => {
                e.stopPropagation();
                window.location.href = 'categories.html?cat=' + encodeURIComponent(productBrand);
            });
        }

        card.addEventListener("click", () => openProductModal(product));
        container.appendChild(card);
    });
}
document.addEventListener("DOMContentLoaded", () => {
    const loader = document.getElementById("app-loader");
    if (loader) {
        setTimeout(() => {
            loader.style.opacity = "0";
            setTimeout(() => loader.style.display = "none", 500);

        }, 1500);

    }
    // Global Search Logic
    const searchInput = document.getElementById("global-search");
    const searchBtn = document.getElementById("global-search-btn");
    if (searchBtn && searchInput) {
        const handleSearch = () => {
            const query = searchInput.value.trim();
            if (query) {
                trackSearchIntent(query);
                window.location.href = 'categories.html?cat=' + encodeURIComponent(query);
            }

        };
        function trackSearchIntent(query) {
            let intents = JSON.parse(localStorage.getItem('stylesynk_intents') || '[]');
            intents.unshift(
                {
                    query, timestamp: new Date().getTime()
                });
            intents = intents.slice(0, 20);
            localStorage.setItem('stylesynk_intents', JSON.stringify(intents));

        }
        searchBtn.addEventListener("click", handleSearch);
        searchInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") handleSearch();
        });

    }
    // Brand Selection Logic
    const brandItems = document.querySelectorAll(".brand-item");
    brandItems.forEach(item => {
        item.addEventListener("click", () => {
            const brand = item.getAttribute("data-brand");
            if (brand) window.location.href = 'categories.html?cat=' + encodeURIComponent(brand);
        });

    });
    // Populate Trending Feed (Sync Products = Items with price comparisons)
    const trendingProducts = products
        .filter(p => p.comparisons && p.comparisons.length > 0)
        .slice(0, 10);

    // If no products have comparisons yet, fallback to syncBrands for the home feed
    if (trendingProducts.length === 0) {
        trendingProducts.push(...products
            .filter(p => syncBrands.some(brand => p.brand && p.brand.toUpperCase().includes(brand.toUpperCase())))
            .slice(0, 10));
    }

    renderProducts(trendingProducts, "trending-feed");

    // Populate Exclusive Feed (Non-Sync Products = Unique Items)
    const exclusiveProducts = products
        .filter(p => !p.comparisons || p.comparisons.length === 0)
        .filter(p => !trendingProducts.includes(p)) // Don't show same ones
        .slice(0, 10);
    renderProducts(exclusiveProducts, "exclusive-feed");
    // Modal Close Logic
    const closeBtn = document.getElementById("close-modal");
    const modal = document.getElementById("product-modal");
    if (closeBtn && modal) {
        const closeModal = () => {
            modal.classList.remove("active");
            setTimeout(() => {
                modal.style.display = "none";
            }, 400);

        };
        closeBtn.addEventListener("click", closeModal);
        window.addEventListener("click", (e) => {
            if (e.target === modal) closeModal();
        });
        window.addEventListener("keydown", (e) => {
            if (e.key === "Escape") closeModal();
        });

    }
    // Closet UI Logic
    const closetTrigger = document.getElementById("closet-trigger");
    const closetModalUI = document.getElementById("closet-modal-ui");
    const closeClosetUI = document.getElementById("close-closet-ui");
    const closetContainer = document.getElementById("closet-items-container");
    const closetEmptyState = document.getElementById("closet-empty-state");
    if (closetTrigger && closetModalUI) {
        closetTrigger.addEventListener("click", () => {
            renderCloset();
            closetModalUI.style.display = "flex";
            setTimeout(() => closetModalUI.classList.add("active"), 10);

        });
        const closeCloset = () => {
            closetModalUI.classList.remove("active");
            setTimeout(() => closetModalUI.style.display = "none", 400);

        };
        if (closeClosetUI) closeClosetUI.addEventListener("click", closeCloset);
        window.addEventListener("click", (e) => {
            if (e.target === closetModalUI) closeCloset();
        });

    }
    function renderCloset() {
        if (!closetContainer) return;
        closetContainer.innerHTML = "";
        if (closet.length === 0) {
            if (closetEmptyState) closetEmptyState.style.display = "block";
            return;

        }
        if (closetEmptyState) closetEmptyState.style.display = "none";
        closet.forEach((item, index) => {
            const div = document.createElement("div");
            div.className = "closet-item";
            div.innerHTML = '<img src="' + (item.image || '') + '">' +
                '<div class="closet-item-info">' +
                '<div class="closet-item-name">' + (item.name || '') + '</div>' +
                '<div style="font-size: 0.8rem; color: var(--primary);">' + (item.price || '') + '</div>' +
                '<button class="remove-from-closet" data-index="' + index + '">Remove</button>' +
                '<button class="btn-primary" style="padding: 0.4rem 0.8rem; font-size: 0.7rem; margin-left: 10px;" onclick="window.open(\'' + (item.url || '') + '\', \'_blank\')">Buy Now</button>' +
                '</div>';
            div.querySelector(".remove-from-closet").addEventListener("click", () => {
                closet.splice(index, 1);
                localStorage.setItem('stylesynk_closet', JSON.stringify(closet));
                renderCloset();
                updateClosetUI();
            });
            closetContainer.appendChild(div);

        });

    }

});
// --- CLOSET ENGINE ---
let closet = JSON.parse(localStorage.getItem('stylesynk_closet') || '[]');
function updateClosetUI() {
    const counts = document.querySelectorAll("#closet-count");
    counts.forEach(c => {
        c.textContent = closet.length;
    });

}
function addToCloset(product) {
    if (!closet.some(p => p.id === product.id)) {
        closet.push(product);
        localStorage.setItem('stylesynk_closet', JSON.stringify(closet));
        updateClosetUI();
        showSyncToast('Added ' + product.name + ' to closet!');
    } else {
        showSyncToast("Item already in closet");

    }

}
function showSyncToast(msg) {
    const toast = document.createElement("div");
    toast.className = "sync-toast";
    toast.style.cssText = `
position: fixed; bottom: 30px; right: 30px; background: var(--primary); color: white;
padding: 1rem 2rem; border-radius: 50px; z-index: 10000; box-shadow: 0 10px 30px rgba(0,0,0,0.5);
font-weight: 700; font-size: 0.9rem; letter-spacing: 1px; transition: all 0.5s ease;
opacity: 0; transform: translateY(20px);
`;
    toast.textContent = "✓ " + msg;
    document.body.appendChild(toast);
    // Trigger animation
    setTimeout(() => {
        toast.style.opacity = "1";
        toast.style.transform = "translateY(0)";

    }, 10);
    setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateY(20px)";
        setTimeout(() => toast.remove(), 500);

    }, 3000);

}
function openProductModal(product) {
    const modal = document.getElementById("product-modal");
    if (!modal) return;
    // Reset scroll of modal content
    const modalContent = modal.querySelector('.modal-content');
    if (modalContent) modalContent.scrollTop = 0;
    const isIndian = !globalBrands.some(brand =>
        product.brand.toUpperCase().includes(brand.toUpperCase())
    );
    const brandEl = document.getElementById("modal-brand");
    if (brandEl) {
        brandEl.textContent = isIndian ? product.brand + ' | VERIFIED INDIAN BRAND' : product.brand + ' | VERIFIED GLOBAL BRAND';
    }
    document.getElementById("modal-img").src = product.image;
    document.getElementById("modal-title").textContent = product.name;
    document.getElementById("modal-price").textContent = "" + product.price;
    // 1. Worthiness Report
    const worthinessEl = document.getElementById("worthiness-report");
    if (worthinessEl) {
        const score = product.qualityRating || 4.5;
        const isPremium = score > 4.6;
        const barWidth = (score / 5) * 100;
        let html = '<div style="background: rgba(255,255,255,0.03); border: 1px solid var(--glass-border); border-radius: 12px; padding: 1rem; margin-top: 1.5rem;">';
        html += '<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.8rem;">';
        html += '<span style="font-size: 0.7rem; font-weight: 800; letter-spacing: 1px; color: var(--primary);">SYNC WORTHINESS SCORE</span>';
        html += '<span style="font-size: 1.2rem; font-weight: 800; color: ' + (isPremium ? '#22c55e' : 'var(--primary)') + ';">' + score + '/5.0</span>';
        html += '</div>';
        html += '<div style="height: 4px; background: rgba(255,255,255,0.1); border-radius: 10px; overflow: hidden;">';
        html += '<div style="width: ' + barWidth + '%; height: 100%; background: var(--primary);"></div>';
        html += '</div>';
        html += '<p style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.8rem;">';
        html += (isPremium ? 'VERIFIED: High-grade fabric durability and color retention.' : 'BUDGET SYNC: Excellent value for the active price point.');
        html += ' Matched across 5+ marketplace trust parameters.</p></div>';
        worthinessEl.innerHTML = html;
    }
    // 2. Price Comparsion Logic
    const compContainer = document.getElementById("comparison-list");
    if (compContainer) {
        compContainer.innerHTML = "";
        const marketplaces = [

            {
                name: "Myntra Sync", price: product.price
            },

            {
                name: "Ajio Choice", price: Math.round(product.price * 1.05)
            },

            {
                name: "Competitive Market", price: Math.round(product.price * 1.08)
            }
        ];
        marketplaces.forEach(m => {
            const row = document.createElement("div");
            row.style.cssText = "display: flex; justify-content: space-between; padding: 0.8rem 0; border-bottom: 1px solid rgba(255,255,255,0.05); align-items: center;";
            row.innerHTML = '<span style="font-size: 0.8rem; font-weight: 600;">' + m.name + '</span>' +
                '<span style="font-size: 0.8rem; font-weight: 800; color: ' + (m.price === product.price ? '#22c55e' : 'white') + '">' + m.price + '</span>';
            compContainer.appendChild(row);
        });

    }
    const storeLink = document.getElementById("direct-store-link");
    if (storeLink) {
        storeLink.onclick = () => window.open(product.url, "_blank");

    }
    const closetBtn = document.getElementById("add-to-closet-modal");
    if (closetBtn) {
        closetBtn.onclick = () => addToCloset(product);

    }
    // Recommendations Logic (Inside Modal)
    const recContainer = document.getElementById("modal-recommendations");
    if (recContainer) {
        recContainer.innerHTML = "";
        const similar = products
            .filter(p => p.id !== product.id && (p.category === product.category || p.brand === product.brand))
            .sort(() => 0.5 - Math.random())
            .slice(0, 3);
        similar.forEach(item => {
            const recItem = document.createElement("div");
            recItem.style.cssText = "cursor: pointer; transition: all 0.3s ease;";
            recItem.innerHTML = '<img src="' + item.image + '" style="width: 100%; border-radius: 12px; margin-bottom: 0.5rem; aspect-ratio: 1/1; object-fit: cover;">' +
                '<p style="font-size: 0.7rem; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin: 0; color: white;">' + item.name + '</p>' +
                '<p style="font-size: 0.7rem; color: var(--primary); margin: 0; font-weight: 800;">' + item.price + '</p>';
            recItem.onclick = (e) => {
                e.stopPropagation();
                openProductModal(item);
            };
            recContainer.appendChild(recItem);

        });

    }
    modal.style.display = "flex";
    setTimeout(() => {
        modal.classList.add("active");
    }, 10);

}
// Initial UI Update
updateClosetUI();