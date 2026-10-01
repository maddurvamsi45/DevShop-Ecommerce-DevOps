const state = {
  products: [],
  filtered: [],
  cart: JSON.parse(localStorage.getItem("devshop-cart") || "[]"),
  category: "All",
  search: "",
  coupon: 0,
  wishlist: JSON.parse(localStorage.getItem("devshop-wishlist") || "[]")
};

const $ = id => document.getElementById(id);
const money = value => `₹${Number(value).toLocaleString("en-IN")}`;

async function loadProducts() {
  try {
    const response = await fetch("/api/products");
    if (!response.ok) throw new Error("Unable to load products");
    state.products = await response.json();
    applyFilters();
  } catch (error) {
    $("productGrid").innerHTML = `<div class="loading">Unable to load products. Please refresh.</div>`;
  }
}

function applyFilters() {
  state.filtered = state.products.filter(product => {
    const categoryMatch = state.category === "All" || product.category === state.category;
    const search = state.search.toLowerCase();
    const searchMatch = !search ||
      product.name.toLowerCase().includes(search) ||
      product.category.toLowerCase().includes(search) ||
      product.description.toLowerCase().includes(search);
    return categoryMatch && searchMatch;
  });

  const sort = $("sortSelect").value;
  if (sort === "low") state.filtered.sort((a,b) => a.price - b.price);
  if (sort === "high") state.filtered.sort((a,b) => b.price - a.price);
  if (sort === "rating") state.filtered.sort((a,b) => b.rating - a.rating);
  renderProducts();
}

function renderProducts() {
  const grid = $("productGrid");
  if (!state.filtered.length) {
    grid.innerHTML = `<div class="loading">No products found. Try another search.</div>`;
    return;
  }

  grid.innerHTML = state.filtered.map(product => {
    const liked = state.wishlist.includes(product.id);
    return `
      <article class="product-card">
        <div class="product-image">
          <span class="badge">${product.badge}</span>
          <button class="wish ${liked ? "liked" : ""}" onclick="toggleWishlist(${product.id})">${liked ? "♥" : "♡"}</button>
          <span>${product.icon}</span>
        </div>
        <div class="product-info">
          <div class="product-category">${product.category}</div>
          <div class="product-name" title="${product.name}">${product.name}</div>
          <div class="product-desc">${product.description}</div>
          <div class="rating">★★★★★ <span>${product.rating} (${product.reviews})</span></div>
          <div class="product-bottom">
            <div class="price"><strong>${money(product.price)}</strong><span class="old-price">${money(product.oldPrice)}</span></div>
            <button class="add-btn" onclick="addToCart(${product.id})">Add +</button>
          </div>
        </div>
      </article>
    `;
  }).join("");
}

function addToCart(id) {
  const existing = state.cart.find(item => item.id === id);
  if (existing) existing.qty += 1;
  else state.cart.push({ id, qty: 1 });
  saveCart();
  showToast("Added to your cart ✓");
}

function removeFromCart(id) {
  state.cart = state.cart.filter(item => item.id !== id);
  saveCart();
  renderCart();
}

function changeQty(id, amount) {
  const item = state.cart.find(x => x.id === id);
  if (!item) return;
  item.qty += amount;
  if (item.qty <= 0) removeFromCart(id);
  saveCart();
  renderCart();
}

function saveCart() {
  localStorage.setItem("devshop-cart", JSON.stringify(state.cart));
  updateCartCount();
}

function updateCartCount() {
  const count = state.cart.reduce((sum, item) => sum + item.qty, 0);
  $("cartCount").textContent = count;
}

function cartProducts() {
  return state.cart.map(item => {
    const product = state.products.find(p => p.id === item.id);
    return product ? { ...product, qty: item.qty } : null;
  }).filter(Boolean);
}

function renderCart() {
  const items = cartProducts();
  $("cartItemsLabel").textContent = `${items.reduce((s,i) => s+i.qty, 0)} items`;

  if (!items.length) {
    $("cartItems").innerHTML = `<div class="empty">🛒<br><br>Your cart is empty.<br>Add something you love.</div>`;
    $("subtotal").textContent = "₹0";
    $("cartTotal").textContent = "₹0";
    return;
  }

  $("cartItems").innerHTML = items.map(item => `
    <div class="cart-row">
      <div class="cart-thumb">${item.icon}</div>
      <div>
        <h4>${item.name}</h4>
        <p>${money(item.price)} each</p>
        <div class="qty">
          <button onclick="changeQty(${item.id}, -1)">−</button>
          <span>${item.qty}</span>
          <button onclick="changeQty(${item.id}, 1)">+</button>
        </div>
      </div>
      <div style="text-align:right">
        <strong style="font-size:12px">${money(item.price * item.qty)}</strong>
        <br><button class="remove" onclick="removeFromCart(${item.id})">Remove</button>
      </div>
    </div>
  `).join("");

  updateTotals();
}

function updateTotals() {
  const subtotal = cartProducts().reduce((sum, item) => sum + item.price * item.qty, 0);
  const discount = state.coupon ? subtotal * state.coupon : 0;
  const total = Math.max(0, subtotal - discount);
  $("subtotal").textContent = money(subtotal);
  $("cartTotal").textContent = money(total);
}

function toggleModal(id, show = true) {
  $(id).classList.toggle("hidden", !show);
}

function openProduct(id) {
  const product = state.products.find(p => p.id === id);
  if (!product) return;

  $("productDetail").innerHTML = `
    <div class="product-detail">
      <div class="detail-image">${product.icon}</div>
      <div class="detail-info">
        <div class="product-category">${product.category}</div>
        <h2>${product.name}</h2>
        <div class="rating">★★★★★ ${product.rating} · ${product.reviews} reviews</div>
        <div class="detail-price">${money(product.price)} <span class="old-price">${money(product.oldPrice)}</span></div>
        <p class="desc">${product.description}</p>
        <p style="font-size:11px;color:#12b76a;font-weight:700">✓ In stock · Fast delivery available</p>
        <button class="btn btn-primary full" onclick="addToCart(${product.id});toggleModal('productModal',false)">Add to Cart</button>
      </div>
    </div>
  `;

  toggleModal("productModal");
}

function toggleWishlist(id) {
  if (state.wishlist.includes(id)) {
    state.wishlist = state.wishlist.filter(x => x !== id);
    showToast("Removed from wishlist");
  } else {
    state.wishlist.push(id);
    showToast("Added to wishlist ♥");
  }
  localStorage.setItem("devshop-wishlist", JSON.stringify(state.wishlist));
  renderProducts();
}

function showToast(message) {
  const toast = $("toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}

function startCountdown() {
  let remaining = 2 * 86400 + 14 * 3600 + 38 * 60 + 22;
  setInterval(() => {
    remaining = Math.max(0, remaining - 1);
    const days = Math.floor(remaining / 86400);
    const hours = Math.floor((remaining % 86400) / 3600);
    const minutes = Math.floor((remaining % 3600) / 60);
    const seconds = remaining % 60;
    $("days").textContent = String(days).padStart(2, "0");
    $("hours").textContent = String(hours).padStart(2, "0");
    $("minutes").textContent = String(minutes).padStart(2, "0");
    $("seconds").textContent = String(seconds).padStart(2, "0");
  }, 1000);
}

document.addEventListener("DOMContentLoaded", () => {
  loadProducts();
  updateCartCount();
  startCountdown();

  document.querySelectorAll(".category").forEach(button => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".category").forEach(x => x.classList.remove("active"));
      button.classList.add("active");
      state.category = button.dataset.category;
      applyFilters();
    });
  });

  $("searchInput").addEventListener("input", event => {
    state.search = event.target.value;
    applyFilters();
  });

  $("sortSelect").addEventListener("change", applyFilters);

  $("searchBtn").addEventListener("click", () => {
    $("searchBox").scrollIntoView({ behavior: "smooth", block: "center" });
    $("searchInput").focus();
  });

  $("cartBtn").addEventListener("click", () => {
    renderCart();
    toggleModal("cartModal");
  });

  $("wishlistBtn").addEventListener("click", () => {
    const likedProducts = state.products.filter(p => state.wishlist.includes(p.id));
    if (!likedProducts.length) {
      showToast("Your wishlist is empty");
      return;
    }
    state.search = "";
    state.category = "All";
    $("searchInput").value = "";
    state.filtered = likedProducts;
    renderProducts();
    document.querySelectorAll(".category").forEach(x => x.classList.remove("active"));
    document.querySelector(".category[data-category='All']").classList.add("active");
    $("products").scrollIntoView({ behavior: "smooth" });
    showToast(`${likedProducts.length} wishlist item(s) shown`);
  });

  $("exploreBtn").addEventListener("click", () => {
    $("deals").scrollIntoView({ behavior: "smooth" });
  });

  $("checkoutBtn").addEventListener("click", () => {
    if (!state.cart.length) {
      showToast("Your cart is empty");
      return;
    }
    toggleModal("cartModal", false);
    toggleModal("checkoutModal");
  });

  $("couponBtn").addEventListener("click", () => {
    const code = $("couponInput").value.trim().toUpperCase();
    if (code === "DEVSHOP10") {
      state.coupon = 0.10;
      updateTotals();
      showToast("10% coupon applied ✓");
    } else if (!code) {
      showToast("Enter a coupon code");
    } else {
      state.coupon = 0;
      updateTotals();
      showToast("Invalid coupon code");
    }
  });

  $("checkoutForm").addEventListener("submit", async event => {
    event.preventDefault();
    const form = new FormData(event.target);
    const customer = Object.fromEntries(form.entries());
    const items = cartProducts();

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customer, items })
      });

      if (!response.ok) throw new Error("Order failed");
      const result = await response.json();

      $("checkoutContent").innerHTML = `
        <div class="success">
          <div class="success-icon">🎉</div>
          <p class="eyebrow">ORDER CONFIRMED</p>
          <h2>Thank you, ${customer.name.split(" ")[0]}!</h2>
          <p>Your demo order <strong>${result.orderId}</strong> has been created successfully.</p>
          <button class="btn btn-primary full" onclick="location.reload()">Continue Shopping</button>
        </div>
      `;

      state.cart = [];
      saveCart();
    } catch (error) {
      showToast("Unable to place order. Try again.");
    }
  });

  $("mobileMenu").addEventListener("click", () => {
    document.querySelector("nav").classList.toggle("open");
  });

  document.querySelectorAll("[data-close]").forEach(button => {
    button.addEventListener("click", () => toggleModal(button.dataset.close, false));
  });

  document.querySelectorAll(".modal").forEach(modal => {
    modal.addEventListener("click", event => {
      if (event.target === modal) toggleModal(modal.id, false);
    });
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      document.querySelectorAll(".modal").forEach(modal => modal.classList.add("hidden"));
    }
  });
});