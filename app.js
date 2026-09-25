// =============================================================
//  DessertWall Studio — Shared Application Logic
// =============================================================

// ------ WhatsApp Helper (kept ONLY for bottom button & contact page) ------
function openWhatsApp(message) {
  const num = (appData && appData.business && appData.business.whatsapp) || "7667305677";
  const url = `https://wa.me/${num}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
}

// ------ Navbar scroll effect ------
window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 20);
});

// ------ Hamburger menu ------
function toggleNav() {
  const links = document.getElementById('nav-links');
  const ham = document.getElementById('hamburger');
  if (links) links.classList.toggle('open');
  if (ham) ham.classList.toggle('open');
}

// ------ Toast notifications ------
function showToast(msg, type = '') {
  let c = document.getElementById('toast-container');
  if (!c) {
    c = document.createElement('div');
    c.id = 'toast-container';
    document.body.appendChild(c);
  }
  const t = document.createElement('div');
  t.className = 'toast ' + type;
  t.textContent = msg;
  c.appendChild(t);
  setTimeout(() => t.style.opacity = '0', 2800);
  setTimeout(() => t.remove(), 3200);
}

// =============================================================
//  Running Offer Bar (Car) Below Navbar
// =============================================================
function initRunningOfferBar() {
  const track = document.getElementById('offer-marquee-track');
  if (!track || !appData || !appData.offers) return;

  const activeOffers = appData.offers.filter(o => o.active !== false);
  if (!activeOffers.length) {
    const bar = document.getElementById('running-offer-bar');
    if (bar) bar.style.display = 'none';
    return;
  }

  // Render items and duplicate them for seamless loop
  const buildItemsHtml = (offers) => {
    return offers.map(o => `
      <a href="menu.html${o.linkCategory ? '?cat=' + encodeURIComponent(o.linkCategory) : ''}" class="offer-item" title="${o.description || o.title}">
        <span class="offer-pill">${o.badge || 'OFFER'}</span>
        <span class="offer-text">${o.discountText || o.title}</span>
        <span class="offer-cta">${o.linkText || 'Explore'} →</span>
      </a>
      <span class="offer-sep">•</span>
    `).join('');
  };

  const html = buildItemsHtml(activeOffers) + buildItemsHtml(activeOffers);
  track.innerHTML = html;
}

// =============================================================
//  User Authentication System (Login / Sign-up / Profile)
// =============================================================
const DEMO_USERS = [
  {
    name: "Priya Sharma",
    phone: "9845012345",
    email: "priya.sharma@example.com",
    address: "Flat 402, Green Glen Layout, Bellandur, Bangalore 560103"
  },
  {
    name: "Arjun Mehta",
    phone: "9741288990",
    email: "arjun.m@example.com",
    address: "100ft Road, HAL 2nd Stage, Indiranagar, Bangalore 560038"
  }
];

function getCurrentUser() {
  try {
    const s = localStorage.getItem('hds_current_user');
    if (s) return JSON.parse(s);
  } catch(e) {}
  return null;
}

function setCurrentUser(user) {
  if (user) {
    localStorage.setItem('hds_current_user', JSON.stringify(user));
  } else {
    localStorage.removeItem('hds_current_user');
  }
  updateUserAuthUI();
}

function updateUserAuthUI() {
  const user = getCurrentUser();
  const authContainer = document.getElementById('nav-user-container');
  if (!authContainer) return;

  if (user) {
    const initial = (user.name || 'U').charAt(0).toUpperCase();
    authContainer.innerHTML = `
      <div class="nav-user-wrap">
        <button class="nav-user-logged" onclick="toggleUserDropdown(event)" aria-label="User Account">
          <div class="user-avatar-circle">${initial}</div>
          <span>${user.name.split(' ')[0]}</span>
          <span style="font-size:.7rem;margin-left:2px;">▾</span>
        </button>
        <div class="user-dropdown-menu hidden" id="user-dropdown-menu">
          <div style="padding:10px 18px 6px; font-size:.8rem; color:var(--c-text-muted);">
            Signed in as<br><strong style="color:var(--c-brown);">${user.name}</strong>
          </div>
          <div class="user-dropdown-divider"></div>
          <div class="user-dropdown-item" onclick="openMyOrdersModal()">
            <span>📦</span> My Orders History
          </div>
          <div class="user-dropdown-item" onclick="openCart()">
            <span>🛍️</span> View My Cart
          </div>
          <div class="user-dropdown-divider"></div>
          <div class="user-dropdown-item" onclick="logoutUser()" style="color:#a33;">
            <span>🚪</span> Sign Out
          </div>
        </div>
      </div>
    `;
  } else {
    authContainer.innerHTML = `
      <button class="nav-user-btn" onclick="openAuthModal()" aria-label="Sign In">
        <span>👤</span> <span>Sign In</span>
      </button>
    `;
  }
}

function toggleUserDropdown(e) {
  if (e) e.stopPropagation();
  const menu = document.getElementById('user-dropdown-menu');
  if (menu) menu.classList.toggle('hidden');
}

document.addEventListener('click', (e) => {
  const menu = document.getElementById('user-dropdown-menu');
  if (menu && !menu.classList.contains('hidden')) {
    if (!e.target.closest('.nav-user-wrap')) {
      menu.classList.add('hidden');
    }
  }
});

function openAuthModal() {
  const modal = document.getElementById('auth-modal');
  if (modal) {
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }
}

function closeAuthModal() {
  const modal = document.getElementById('auth-modal');
  if (modal) modal.classList.add('hidden');
  document.body.style.overflow = '';
}

function loginDemoUser(idx) {
  const u = DEMO_USERS[idx] || DEMO_USERS[0];
  setCurrentUser(u);
  closeAuthModal();
  showToast(`Welcome back, ${u.name}!`, 'success');
}

function handleUserLogin(e) {
  if (e) e.preventDefault();
  const name = document.getElementById('auth-name')?.value.trim();
  const phone = document.getElementById('auth-phone')?.value.trim();
  const email = document.getElementById('auth-email')?.value.trim() || '';
  const address = document.getElementById('auth-address')?.value.trim() || '';

  if (!name || !phone) {
    showToast('Please enter your name and phone number', 'error');
    return;
  }

  const user = { name, phone, email, address };
  setCurrentUser(user);
  closeAuthModal();
  showToast(`Welcome, ${name}!`, 'success');
}

function logoutUser() {
  const user = getCurrentUser();
  setCurrentUser(null);
  showToast(user ? `Goodbye, ${user.name}` : 'Logged out', 'success');
}

// ------ Customer Orders History Modal ------
function openMyOrdersModal() {
  const user = getCurrentUser();
  if (!user) {
    openAuthModal();
    return;
  }

  const modal = document.getElementById('my-orders-modal');
  const container = document.getElementById('my-orders-list');
  if (!container || !modal) return;

  const allOrders = typeof getOrders === 'function' ? getOrders() : [];
  // Match orders by customer phone or name
  const userOrders = allOrders.filter(o =>
    (o.customer && o.customer.phone && o.customer.phone.includes(user.phone)) ||
    (o.customer && o.customer.name && o.customer.name.toLowerCase().includes(user.name.toLowerCase()))
  );

  if (!userOrders.length) {
    container.innerHTML = `
      <div style="text-align:center;padding:40px 20px;color:var(--c-text-soft);">
        <div style="font-size:2.5rem;margin-bottom:8px;">📦</div>
        <h4>No Orders Found Yet</h4>
        <p style="font-size:.85rem;margin-top:4px;">You haven't placed an order with this phone number yet.</p>
        <button class="btn btn-primary btn-sm" onclick="closeMyOrdersModal(); window.location.href='menu.html'" style="margin-top:14px;">Browse Menu</button>
      </div>
    `;
  } else {
    container.innerHTML = userOrders.map(o => {
      const statusClass = `status-${o.status.toLowerCase().replace(/\\s+/g, '-')}`;
      return `
        <div class="customer-order-card">
          <div class="customer-order-card-header">
            <div>
              <strong style="color:var(--c-brown);">${o.id}</strong>
              <div style="font-size:.75rem;color:var(--c-text-muted);">${o.date}</div>
            </div>
            <span class="status-badge ${statusClass}">${o.status}</span>
          </div>
          <div style="font-size:.85rem;margin-bottom:10px;">
            ${(o.items || []).map(i => `
              <div style="display:flex;justify-content:space-between;margin-bottom:3px;">
                <span>• ${i.quantity}x ${i.name} (${i.size || 'Standard'})</span>
                <strong>₹${(i.price * i.quantity).toLocaleString()}</strong>
              </div>
            `).join('')}
          </div>
          <div style="display:flex;justify-content:space-between;align-items:center;border-top:1px dashed var(--c-border);padding-top:8px;font-size:.85rem;">
            <span>Mode: <strong>${o.customer.deliveryType === 'delivery' ? 'Delivery' : 'Pickup'}</strong></span>
            <span style="font-weight:700;color:var(--c-brown);font-size:1rem;">Total: ₹${o.total.toLocaleString()}</span>
          </div>
        </div>
      `;
    }).join('');
  }

  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeMyOrdersModal() {
  const modal = document.getElementById('my-orders-modal');
  if (modal) modal.classList.add('hidden');
  document.body.style.overflow = '';
}

// =============================================================
//  Product Card Renderer (No WhatsApp enquiry on products)
// =============================================================
function renderProductCard(p) {
  const badge = p.available
    ? (p.featured ? '<span class="badge-featured">★ Featured</span>' : '')
    : '<span class="badge-unavail">Unavailable</span>';

  return `
    <div class="product-card" id="card-${p.id}">
      <div class="product-card-img">
        <img src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.src='images/hero.jpg'" />
        ${badge}
      </div>
      <div class="product-card-body">
        <div class="product-cat">${p.category}</div>
        <h3 class="product-name">${p.name}</h3>
        <p class="product-desc">${p.description.substring(0, 110)}...</p>
        <div class="product-price">${p.priceLabel}</div>
        <div class="product-actions">
          <button class="btn ${p.available ? 'btn-primary' : 'btn-outline'} btn-sm btn-block" onclick="openProductModal('${p.id}')">
            ${p.available ? 'Order / View Details' : 'View Details'}
          </button>
        </div>
      </div>
    </div>`;
}

// =============================================================
//  Product Modal & Add to Cart
// =============================================================
let currentProduct = null;
let modalQty = 1;

function openProductModal(productId) {
  const p = appData.products.find(x => x.id === productId);
  if (!p) return;
  currentProduct = p;
  modalQty = 1;

  document.getElementById('modal-img').src = p.image;
  document.getElementById('modal-img').alt = p.name;
  document.getElementById('modal-cat').textContent = p.category;
  document.getElementById('modal-name').textContent = p.name;
  document.getElementById('modal-price').textContent = p.priceLabel;
  document.getElementById('modal-desc').textContent = p.description;

  // Unavailable notice
  const unavailNotice = document.getElementById('modal-unavail-notice');
  if (unavailNotice) unavailNotice.classList.toggle('hidden', p.available);

  // Size chips
  const sizeSection = document.getElementById('size-section');
  const sizeChips = document.getElementById('size-chips');
  if (p.sizes && p.sizes.length) {
    sizeSection.style.display = '';
    sizeChips.innerHTML = p.sizes.map((s, i) =>
      `<button class="option-chip${i === 0 ? ' selected' : ''}" onclick="selectChip(this,'size-chips')">${s}</button>`
    ).join('');
  } else if (sizeSection) {
    sizeSection.style.display = 'none';
  }

  // Flavour chips
  const flavSection = document.getElementById('flavour-section');
  const flavChips = document.getElementById('flavour-chips');
  if (p.flavours && p.flavours.length) {
    flavSection.style.display = '';
    flavChips.innerHTML = p.flavours.map((f, i) =>
      `<button class="option-chip${i === 0 ? ' selected' : ''}" onclick="selectChip(this,'flavour-chips')">${f}</button>`
    ).join('');
  } else if (flavSection) {
    flavSection.style.display = 'none';
  }

  // Egg chips
  const eggSection = document.getElementById('egg-section');
  const eggChips = document.getElementById('egg-chips');
  if (p.eggOptions && p.eggOptions.length) {
    eggSection.style.display = '';
    eggChips.innerHTML = p.eggOptions.map((e, i) =>
      `<button class="option-chip${i === 0 ? ' selected' : ''}" onclick="selectChip(this,'egg-chips')">${e}</button>`
    ).join('');
  } else if (eggSection) {
    eggSection.style.display = 'none';
  }

  // Custom section
  const cs = document.getElementById('custom-section');
  if (cs) cs.style.display = p.customizationEnabled ? '' : 'none';
  if (document.getElementById('modal-custom')) document.getElementById('modal-custom').value = '';
  if (document.getElementById('modal-special')) document.getElementById('modal-special').value = '';
  if (document.getElementById('modal-date')) {
    document.getElementById('modal-date').value = '';
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('modal-date').min = today;
  }

  // Prep time
  const prepEl = document.getElementById('modal-prep');
  if (prepEl) {
    prepEl.textContent = p.preparationTime
      ? `⏱ Preparation time: ${p.preparationTime}. Please select a date accordingly.`
      : '';
  }

  // Reset Quantity
  updateModalQtyDisplay();
  updateModalPriceCalculation();

  const addBtn = document.getElementById('modal-add-cart-btn');
  if (addBtn) {
    addBtn.disabled = !p.available;
    addBtn.textContent = p.available ? 'Add to Cart 🛒' : 'Currently Unavailable';
  }

  const modal = document.getElementById('product-modal');
  if (modal) {
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal() {
  const modal = document.getElementById('product-modal');
  if (modal) modal.classList.add('hidden');
  document.body.style.overflow = '';
  currentProduct = null;
}

document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
document.getElementById('product-modal')?.addEventListener('click', function(e) {
  if (e.target === this) closeModal();
});

function selectChip(el, groupId) {
  document.querySelectorAll(`#${groupId} .option-chip`).forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
  updateModalPriceCalculation();
}

function getSelected(groupId) {
  const sel = document.querySelector(`#${groupId} .option-chip.selected`);
  return sel ? sel.textContent : '';
}

function changeModalQty(delta) {
  modalQty = Math.max(1, modalQty + delta);
  updateModalQtyDisplay();
  updateModalPriceCalculation();
}

function updateModalQtyDisplay() {
  const el = document.getElementById('modal-qty-val');
  if (el) el.textContent = modalQty;
}

function calculateCurrentItemUnitPrice() {
  if (!currentProduct) return 0;
  let base = currentProduct.price || 500;
  const size = getSelected('size-chips');

  // Multiplier for larger cake or box sizes
  if (size.includes('1.5 kg')) base = Math.round(base * 1.45);
  else if (size.includes('2 kg')) base = Math.round(base * 1.9);
  else if (size.includes('2.5 kg')) base = Math.round(base * 2.35);
  else if (size.includes('3 kg')) base = Math.round(base * 2.8);
  else if (size.includes('Box of 9')) base = Math.round(base * 1.35);
  else if (size.includes('Box of 12')) base = Math.round(base * 1.8);
  else if (size.includes('Box of 24')) base = Math.round(base * 3.4);
  else if (size.includes('4-Portion')) base = Math.round(base * 1.6);
  else if (size.includes('8-Portion')) base = Math.round(base * 3.0);

  return base;
}

function updateModalPriceCalculation() {
  const calcEl = document.getElementById('modal-price-calc');
  if (!calcEl || !currentProduct) return;
  const unit = calculateCurrentItemUnitPrice();
  const total = unit * modalQty;
  calcEl.textContent = `Unit Price: ₹${unit.toLocaleString()} × ${modalQty} = ₹${total.toLocaleString()}`;
}

// ------ Add To Cart Action ------
function addCurrentProductToCart() {
  if (!currentProduct) return;
  if (!currentProduct.available) {
    showToast('This item is currently unavailable', 'error');
    return;
  }

  const unitPrice = calculateCurrentItemUnitPrice();
  const size = getSelected('size-chips');
  const flavour = getSelected('flavour-chips');
  const egg = getSelected('egg-chips');
  const customMessage = document.getElementById('modal-custom')?.value.trim() || '';
  const preferredDate = document.getElementById('modal-date')?.value || '';
  const specialNotes = document.getElementById('modal-special')?.value.trim() || '';

  const item = {
    id: currentProduct.id,
    name: currentProduct.name,
    image: currentProduct.image,
    size: size,
    flavour: flavour,
    egg: egg,
    customMessage: customMessage,
    preferredDate: preferredDate,
    specialNotes: specialNotes,
    price: unitPrice,
    quantity: modalQty
  };

  addToCart(item);
  closeModal();
  showToast(`Added ${item.name} to cart!`, 'success');
}

// =============================================================
//  Persistent Cart System & Separate Cart Card
// =============================================================
function getCart() {
  try {
    const s = localStorage.getItem('hds_cart');
    if (s) return JSON.parse(s);
  } catch(e) {}
  return [];
}

function saveCart(cart) {
  try {
    localStorage.setItem('hds_cart', JSON.stringify(cart));
  } catch(e) {}
  updateCartBadge();
  renderCart();
  if (typeof renderAdminCartView === 'function') {
    renderAdminCartView();
  }
}

function updateCartBadge() {
  const cart = getCart();
  const count = cart.reduce((acc, i) => acc + (i.quantity || 1), 0);
  const total = cart.reduce((acc, i) => acc + (i.price * (i.quantity || 1)), 0);

  // Update navbar cart card count and price
  document.querySelectorAll('.cart-badge').forEach(b => {
    b.textContent = count;
  });
  document.querySelectorAll('.nav-cart-total, #nav-cart-total, #nav-cart-val').forEach(el => {
    el.textContent = `₹${total.toLocaleString()}`;
  });

  // Update admin page topbar and card counters if present
  document.querySelectorAll('#admin-topbar-cart-count, #admin-cart-nav-badge, #dash-cart-count').forEach(el => {
    el.textContent = count;
  });
  document.querySelectorAll('#admin-topbar-cart-total, #dash-cart-total').forEach(el => {
    el.textContent = `₹${total.toLocaleString()}`;
  });
  const dashBadge = document.getElementById('dash-cart-status-badge');
  if (dashBadge) {
    dashBadge.textContent = `${count} Item${count === 1 ? '' : 's'}`;
    dashBadge.className = count > 0 ? 'status-badge status-active' : 'status-badge status-inactive';
  }

  // Floating Quick Cart Card (only on non-admin pages)
  updateFloatingCartCard(count, total);

  // Update admin views if on admin page
  if (typeof renderAdminCartView === 'function') {
    renderAdminCartView();
  }
}

function updateFloatingCartCard(count, total) {
  // Prevent floating cart from appearing on admin dashboard
  const isAdmin = window.location.pathname.includes('admin') ||
                  document.querySelector('.admin-container') !== null ||
                  document.querySelector('.admin-topbar') !== null ||
                  document.body.classList.contains('admin-page') ||
                  document.getElementById('admin-clock') !== null;

  let card = document.getElementById('floating-cart-card');
  if (isAdmin) {
    if (card) {
      card.style.display = 'none';
      card.remove();
    }
    return;
  }

  if (!card) {
    card = document.createElement('div');
    card.id = 'floating-cart-card';
    card.className = 'floating-cart-card';
    card.onclick = openCart;
    document.body.appendChild(card);
  }

  if (count > 0) {
    card.style.display = 'flex';
    card.innerHTML = `
      <div class="floating-cart-badge">🛒</div>
      <div class="floating-cart-text">
        <h5>${count} item${count > 1 ? 's' : ''} in Cart</h5>
        <p>Total: <strong>₹${total.toLocaleString()}</strong></p>
      </div>
      <div class="floating-cart-cta">View Cart →</div>
    `;
  } else {
    card.style.display = 'none';
  }
}

function addToCart(newItem) {
  const cart = getCart();
  // Check if identical item exists
  const existingIdx = cart.findIndex(i =>
    i.id === newItem.id &&
    i.size === newItem.size &&
    i.flavour === newItem.flavour &&
    i.egg === newItem.egg &&
    i.customMessage === newItem.customMessage &&
    i.preferredDate === newItem.preferredDate
  );

  if (existingIdx > -1) {
    cart[existingIdx].quantity += newItem.quantity;
  } else {
    cart.push(newItem);
  }

  saveCart(cart);
}

function removeFromCart(idx) {
  const cart = getCart();
  if (idx >= 0 && idx < cart.length) {
    cart.splice(idx, 1);
    saveCart(cart);
  }
}

function updateCartItemQty(idx, delta) {
  const cart = getCart();
  if (idx >= 0 && idx < cart.length) {
    cart[idx].quantity = Math.max(1, cart[idx].quantity + delta);
    saveCart(cart);
  }
}

function openCart() {
  const overlay = document.getElementById('cart-overlay');
  const drawer = document.getElementById('cart-drawer');
  if (overlay && drawer) {
    renderCart();
    overlay.classList.add('open');
    drawer.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function closeCart() {
  const overlay = document.getElementById('cart-overlay');
  const drawer = document.getElementById('cart-drawer');
  if (overlay && drawer) {
    overlay.classList.remove('open');
    drawer.classList.remove('open');
    document.body.style.overflow = '';
  }
}

function renderCart() {
  const container = document.getElementById('cart-items-container');
  const footer = document.getElementById('cart-footer');
  if (!container) return;

  const cart = getCart();

  if (!cart.length) {
    container.innerHTML = `
      <div class="cart-empty">
        <div class="cart-empty-icon"><img src="images/logo.jpg" style="border-radius: 50px;">  </div>
        <h3>Your Cart is Empty</h3>
        <p>Explore our delicious cakes, brownies and cupcakes to fill it up!</p>
        <button class="btn btn-primary btn-sm" onclick="closeCart(); window.location.href='menu.html'" style="margin-top:16px;">
          Browse Menu
        </button>
      </div>
    `;
    if (footer) footer.style.display = 'none';
    return;
  }

  if (footer) footer.style.display = '';

  let subtotal = 0;
  container.innerHTML = cart.map((item, idx) => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;
    const metaParts = [];
    if (item.size) metaParts.push(item.size);
    if (item.flavour) metaParts.push(item.flavour);
    if (item.egg) metaParts.push(item.egg);
    if (item.preferredDate) metaParts.push(`Date: ${item.preferredDate}`);
    if (item.customMessage) metaParts.push(`"${item.customMessage}"`);

    return `
      <div class="cart-item-card">
        <img src="${item.image || 'images/hero.jpg'}" alt="${item.name}" class="cart-item-img" onerror="this.src='images/hero.jpg'" />
        <div class="cart-item-info">
          <h4 class="cart-item-title">${item.name}</h4>
          <div class="cart-item-meta">${metaParts.join(' · ')}</div>
          <div class="cart-item-price">₹${itemTotal.toLocaleString()} <span style="font-weight:400;font-size:.78rem;color:var(--c-text-muted)">(₹${item.price})</span></div>
          <div class="cart-item-controls">
            <div class="qty-stepper">
              <button class="qty-btn" onclick="updateCartItemQty(${idx}, -1)">−</button>
              <span class="qty-val">${item.quantity}</span>
              <button class="qty-btn" onclick="updateCartItemQty(${idx}, 1)">+</button>
            </div>
            <button class="cart-item-remove" onclick="removeFromCart(${idx})">Remove</button>
          </div>
        </div>
      </div>
    `;
  }).join('');

  // Delivery & Free delivery threshold (₹499)
  const freeThreshold = 499;
  const isFreeDelivery = subtotal >= freeThreshold;
  const deliveryFee = isFreeDelivery ? 0 : 50;
  const total = subtotal + deliveryFee;

  const promoCallout = document.getElementById('cart-promo-callout');
  if (promoCallout) {
    if (isFreeDelivery) {
      promoCallout.innerHTML = `🎉 <strong>Free Delivery unlocked!</strong> You qualify for zero delivery charge.`;
    } else {
      const needed = freeThreshold - subtotal;
      promoCallout.innerHTML = `🚚 Add <strong>₹${needed.toLocaleString()}</strong> more to unlock <strong>FREE Delivery</strong>!`;
    }
  }

  const subtotalEl = document.getElementById('cart-subtotal');
  if (subtotalEl) subtotalEl.textContent = `₹${subtotal.toLocaleString()}`;

  const deliveryEl = document.getElementById('cart-delivery');
  if (deliveryEl) deliveryEl.textContent = isFreeDelivery ? 'FREE' : `₹${deliveryFee}`;

  const totalEl = document.getElementById('cart-total');
  if (totalEl) totalEl.textContent = `₹${total.toLocaleString()}`;
}

// =============================================================
//  Checkout & Instant Order Creation
// =============================================================
function openCheckout() {
  const cart = getCart();
  if (!cart.length) {
    showToast('Your cart is empty!', 'error');
    return;
  }
  closeCart();

  let subtotal = 0;
  cart.forEach(i => subtotal += (i.price * i.quantity));
  const freeThreshold = 499;
  const deliveryFee = subtotal >= freeThreshold ? 0 : 50;
  const total = subtotal + deliveryFee;

  const summaryEl = document.getElementById('checkout-order-summary');
  if (summaryEl) {
    summaryEl.innerHTML = `
      <div style="background:var(--c-pink-subtle);border:1px solid var(--c-pink-border);border-radius:var(--radius-sm);padding:14px;margin-bottom:16px;">
        <div style="font-weight:600;color:var(--c-brown);margin-bottom:6px;">Order Summary (${cart.length} unique item${cart.length > 1 ? 's' : ''}):</div>
        ${cart.map(i => `<div style="display:flex;justify-content:space-between;font-size:.85rem;color:var(--c-text-soft);margin-bottom:3px;">
          <span>${i.quantity}x ${i.name} (${i.size || 'Regular'})</span>
          <span>₹${(i.price * i.quantity).toLocaleString()}</span>
        </div>`).join('')}
        <div style="border-top:1px dashed var(--c-border);margin-top:8px;padding-top:8px;display:flex;justify-content:space-between;font-weight:700;color:var(--c-brown);">
          <span>Total Payable:</span>
          <span>₹${total.toLocaleString()}</span>
        </div>
      </div>
    `;
  }

  const minDate = new Date().toISOString().split('T')[0];
  const dateInput = document.getElementById('checkout-date');
  if (dateInput) {
    dateInput.min = minDate;
    if (!dateInput.value) dateInput.value = minDate;
  }

  // Pre-fill logged in user info if available
  const user = getCurrentUser();
  if (user) {
    const nameEl = document.getElementById('checkout-name');
    const phoneEl = document.getElementById('checkout-phone');
    const emailEl = document.getElementById('checkout-email');
    const addrEl = document.getElementById('checkout-address');

    if (nameEl && !nameEl.value) nameEl.value = user.name || '';
    if (phoneEl && !phoneEl.value) phoneEl.value = user.phone || '';
    if (emailEl && !emailEl.value) emailEl.value = user.email || '';
    if (addrEl && !addrEl.value) addrEl.value = user.address || '';
  }

  const modal = document.getElementById('checkout-modal');
  if (modal) {
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }
}

function closeCheckout() {
  const modal = document.getElementById('checkout-modal');
  if (modal) modal.classList.add('hidden');
  document.body.style.overflow = '';
}

function submitOrder(e) {
  if (e) e.preventDefault();
  const cart = getCart();
  if (!cart.length) {
    showToast('Your cart is empty', 'error');
    return;
  }

  const name = document.getElementById('checkout-name')?.value.trim();
  const phone = document.getElementById('checkout-phone')?.value.trim();
  const email = document.getElementById('checkout-email')?.value.trim() || '';
  const deliveryType = document.querySelector('input[name="delivery-type"]:checked')?.value || 'delivery';
  const address = document.getElementById('checkout-address')?.value.trim() || (deliveryType === 'pickup' ? 'Direct Studio Pickup' : '');
  const preferredDate = document.getElementById('checkout-date')?.value || '';
  const timeSlot = document.getElementById('checkout-time')?.value || 'Afternoon (1 PM - 4 PM)';
  const paymentMethod = document.getElementById('checkout-payment')?.value || 'UPI';
  const notes = document.getElementById('checkout-notes')?.value.trim() || '';

  if (!name || !phone) {
    showToast('Please enter your Name and Mobile Number', 'error');
    return;
  }

  if (deliveryType === 'delivery' && !address) {
    showToast('Please enter your delivery address', 'error');
    return;
  }

  let subtotal = 0;
  cart.forEach(i => subtotal += (i.price * i.quantity));
  const deliveryFee = subtotal >= 499 ? 0 : 50;
  const total = subtotal + deliveryFee;

  const now = new Date();
  const orderId = `ORD-${now.getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
  const dateStr = now.toISOString().replace('T', ' ').substring(0, 16);

  const orderData = {
    id: orderId,
    date: dateStr,
    customer: {
      name,
      phone,
      email,
      address,
      deliveryType,
      preferredDate,
      timeSlot
    },
    items: cart,
    subtotal,
    deliveryFee,
    discount: 0,
    total,
    paymentMethod,
    status: 'Pending',
    notes
  };

  // If user is logged in, sync latest address
  const currUser = getCurrentUser();
  if (currUser && currUser.phone === phone) {
    currUser.address = address;
    setCurrentUser(currUser);
  }

  // Add order to orders repository
  if (typeof addOrder === 'function') {
    addOrder(orderData);
  }

  // Clear cart
  saveCart([]);
  closeCheckout();

  // Show celebratory success modal
  showOrderSuccess(orderData);
}

function showOrderSuccess(order) {
  const successModal = document.getElementById('order-success-modal');
  const detailsEl = document.getElementById('order-success-details');
  if (detailsEl) {
    detailsEl.innerHTML = `
      <div style="font-size:1.15rem;font-weight:700;color:var(--c-brown);margin-bottom:8px;">
        Order ID: <span style="color:var(--c-gold);">${order.id}</span>
      </div>
      <p style="color:var(--c-text-soft);font-size:.9rem;margin-bottom:18px;">
        Thank you, <strong>${order.customer.name}</strong>! Your order has been placed successfully and sent to our kitchen.
      </p>
      <div style="background:var(--c-cream);border:1px solid var(--c-border);border-radius:var(--radius-sm);padding:14px;text-align:left;font-size:.85rem;margin-bottom:20px;">
        <div><strong>Delivery Type:</strong> ${order.customer.deliveryType === 'delivery' ? 'Home Delivery' : 'Pickup at Studio'}</div>
        <div><strong>Preferred Date:</strong> ${order.customer.preferredDate || 'Earliest available'} (${order.customer.timeSlot})</div>
        <div><strong>Payment:</strong> ${order.paymentMethod}</div>
        <div style="margin-top:6px;font-weight:700;color:var(--c-brown);">Total Amount: ₹${order.total.toLocaleString()}</div>
      </div>
      <p style="font-size:.82rem;color:var(--c-text-muted);margin-bottom:20px;">
        Our head baker will confirm your order preparation shortly. For special queries, feel free to chat with us anytime via WhatsApp at the bottom of the page.
      </p>
    `;
  }

  if (successModal) {
    successModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }
}

function closeOrderSuccess() {
  const successModal = document.getElementById('order-success-modal');
  if (successModal) successModal.classList.add('hidden');
  document.body.style.overflow = '';
}

// =============================================================
//  Gallery Lightbox
// =============================================================
let galleryItems = [];
let currentGalleryIdx = 0;

function openLightbox(items, idx) {
  galleryItems = items;
  currentGalleryIdx = idx;
  renderLightbox();
  const lb = document.getElementById('lightbox');
  if (lb) {
    lb.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }
}

function closeLightbox() {
  const lb = document.getElementById('lightbox');
  if (lb) lb.classList.add('hidden');
  document.body.style.overflow = '';
}

function renderLightbox() {
  const item = galleryItems[currentGalleryIdx];
  if (!item) return;
  const img = document.getElementById('lb-img');
  const title = document.getElementById('lb-title');
  const desc = document.getElementById('lb-desc');
  if (img) { img.src = item.image; img.alt = item.title; }
  if (title) title.textContent = item.title;
  if (desc) desc.textContent = `${item.occasion ? item.occasion + ' · ' : ''}${item.description}`;
}

function lightboxNav(dir) {
  currentGalleryIdx = (currentGalleryIdx + dir + galleryItems.length) % galleryItems.length;
  renderLightbox();
}

document.addEventListener('keydown', e => {
  const lb = document.getElementById('lightbox');
  if (!lb || lb.classList.contains('hidden')) return;
  if (e.key === 'ArrowLeft') lightboxNav(-1);
  if (e.key === 'ArrowRight') lightboxNav(1);
  if (e.key === 'Escape') closeLightbox();
});

// =============================================================
//  Shared DOM Initializer
// =============================================================
document.addEventListener('DOMContentLoaded', () => {
  initRunningOfferBar();
  updateCartBadge();
  updateUserAuthUI();
});
