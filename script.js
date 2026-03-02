// ================= DATA =================
let products = [
  {
    id: 1,
    name: "Smart Watch",
    price: 5000,
    category: "Electronics",
    rating: 4.5,
    stock: 10,
    image: "https://picsum.photos/seed/p1/300/300",
  },
  {
    id: 2,
    name: "Running Shoes",
    price: 3500,
    category: "Shoes",
    rating: 4.2,
    stock: 8,
    image: "https://picsum.photos/seed/p2/300/300",
  },
  {
    id: 3,
    name: "Laptop Stand",
    price: 1500,
    category: "Accessories",
    rating: 4.7,
    stock: 15,
    image: "https://picsum.photos/seed/p3/300/300",
  },
  {
    id: 4,
    name: "Wireless Earbuds",
    price: 2500,
    category: "Electronics",
    rating: 4.1,
    stock: 20,
    image: "https://picsum.photos/seed/p4/300/300",
  },
  {
    id: 5,
    name: "Denim Jacket",
    price: 4000,
    category: "Clothing",
    rating: 4.6,
    stock: 5,
    image: "https://picsum.photos/seed/p5/300/300",
  },
  {
    id: 6,
    name: "Gaming Mouse",
    price: 1200,
    category: "Electronics",
    rating: 4.4,
    stock: 12,
    image: "https://picsum.photos/seed/p6/300/300",
  },
  {
    id: 7,
    name: "Sneakers",
    price: 3000,
    category: "Shoes",
    rating: 4.3,
    stock: 7,
    image: "https://picsum.photos/seed/p7/300/300",
  },
  {
    id: 8,
    name: "Backpack",
    price: 1800,
    category: "Accessories",
    rating: 4.8,
    stock: 9,
    image: "https://picsum.photos/seed/p8/300/300",
  },
  {
    id: 9,
    name: "Coffee Mug",
    price: 500,
    category: "Accessories",
    rating: 4.9,
    stock: 50,
    image: "https://picsum.photos/seed/p9/300/300",
  },
  {
    id: 10,
    name: "Sunglasses",
    price: 2000,
    category: "Accessories",
    rating: 4.2,
    stock: 30,
    image: "https://picsum.photos/seed/p10/300/300",
  },
];

// ================= STATE =================
let currentPage = 1;
const itemsPerPage = 6;
let filteredProducts = [...products];

// ================= UTILITIES =================
const getFromStorage = (key) => JSON.parse(localStorage.getItem(key)) || [];
const setToStorage = (key, value) =>
  localStorage.setItem(key, JSON.stringify(value));

// ================= AUTH =================
const signup = (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  let users = getFromStorage("users");
  if (users.find((u) => u.email === email)) {
    alert("User exists!");
    return;
  }
  users.push({ name, email, password });
  setToStorage("users", users);
  alert("Success! Login now.");
  window.location.href = "login.html";
};

const login = (e) => {
  e.preventDefault();
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;
  const users = getFromStorage("users");
  const user = users.find((u) => u.email === email && u.password === password);
  if (user) {
    setToStorage("currentUser", user);
    window.location.href = "index.html";
  } else {
    alert("Wrong credentials");
  }
};

const logout = () => {
  localStorage.removeItem("currentUser");
  window.location.href = "login.html";
};

// ================= UI (FIXED UNDEFINED) =================
const updateNavbar = () => {
  const user = getFromStorage("currentUser");
  const authLinks = document.getElementById("auth-links");

  if (user && authLinks) {
    const userName = user.name || "User"; // FIX: Prevents 'undefined'
    authLinks.innerHTML = `<span style="margin-right:10px;">Hello, ${userName}</span> <button onclick="logout()" class="btn btn-danger">Logout</button>`;
  } else if (authLinks) {
    // Show Login/Signup if not logged in
    authLinks.innerHTML = `<a href="login.html">Login</a> <a href="signup.html">Signup</a>`;
  }

  updateBadges();
};

const updateBadges = () => {
  const cart = getFromStorage("cart") || [];
  const wishlist = getFromStorage("wishlist") || [];
  const cartEl = document.getElementById("cart-count");
  const wishEl = document.getElementById("wishlist-count");
  if (cartEl)
    cartEl.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
  if (wishEl) wishEl.textContent = wishlist.length;
};

// ================= SLIDER =================
const initSlider = () => {
  const container = document.querySelector(".slides-container");
  if (!container) return;
  const slides = [
    { img: "https://picsum.photos/seed/s1/1200/400", title: "Welcome" },
    { img: "https://picsum.photos/seed/s2/1200/400", title: "Sale" },
    { img: "https://picsum.photos/seed/s3/1200/400", title: "New Stock" },
  ];
  container.innerHTML = slides
    .map(
      (s) =>
        `<div class="slide" style="background-image:url(${s.img})"><h2>${s.title}</h2></div>`,
    )
    .join("");
  let i = 0;
  setInterval(() => {
    i = (i + 1) % slides.length;
    container.style.transform = `translateX(-${i * 100}%)`;
  }, 3000);
  document.querySelector(".next-btn")?.addEventListener("click", () => {
    i = (i + 1) % slides.length;
    container.style.transform = `translateX(-${i * 100}%)`;
  });
  document.querySelector(".prev-btn")?.addEventListener("click", () => {
    i = (i - 1 + slides.length) % slides.length;
    container.style.transform = `translateX(-${i * 100}%)`;
  });
};

// ================= PRODUCTS =================
const renderProducts = () => {
  const grid = document.getElementById("product-grid");
  if (!grid) return;
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const items = filteredProducts.slice(start, end);

  grid.innerHTML =
    items.length === 0
      ? "<p>No products found.</p>"
      : items
          .map(
            (p) => `
        <div class="product-card" onclick="location.href='product-detail.html?id=${p.id}'">
            <img src="${p.image}" class="product-img">
            <div class="product-info">
                <h3 class="product-title">${p.name}</h3>
                <p class="product-price">Rs. ${p.price}</p>
                <div class="product-rating">${p.rating} ★</div>
            </div>
            <div class="product-actions">
                <button class="btn btn-primary" onclick="event.stopPropagation(); addToCart(${p.id})">Add to Cart</button>
                <button class="btn btn-outline" onclick="event.stopPropagation(); toggleWishlist(${p.id})">❤️</button>
            </div>
        </div>
    `,
          )
          .join("");
  renderPagination();
};

const renderPagination = () => {
  const el = document.getElementById("pagination");
  if (!el) return;
  const total = Math.ceil(filteredProducts.length / itemsPerPage);
  let html = `<button class="page-btn" onclick="changePage(${currentPage - 1})" ${currentPage === 1 ? "disabled" : ""}>Prev</button>`;
  for (let i = 1; i <= total; i++)
    html += `<button class="page-btn ${i === currentPage ? "active" : ""}" onclick="changePage(${i})">${i}</button>`;
  html += `<button class="page-btn" onclick="changePage(${currentPage + 1})" ${currentPage === total ? "disabled" : ""}>Next</button>`;
  el.innerHTML = html;
};
const changePage = (p) => {
  currentPage = p;
  renderProducts();
};

const applyFilters = () => {
  const search =
    document.getElementById("search-input")?.value.toLowerCase() || "";
  const cat = document.getElementById("category-filter")?.value || "All";
  const sort = document.getElementById("sort-filter")?.value || "default";

  filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search) &&
      (cat === "All" || p.category === cat),
  );
  if (sort === "price-asc") filteredProducts.sort((a, b) => a.price - b.price);
  if (sort === "price-desc") filteredProducts.sort((a, b) => b.price - a.price);
  currentPage = 1;
  renderProducts();
};

// ================= CART & WISHLIST LOGIC =================
const addToCart = (id) => {
  let cart = getFromStorage("cart") || [];
  const p = products.find((x) => x.id === id);
  const existing = cart.find((x) => x.id === id);
  if (existing) existing.quantity++;
  else cart.push({ ...p, quantity: 1 });
  setToStorage("cart", cart);
  updateBadges();
  alert("Added to Cart");
};

const toggleWishlist = (id) => {
  let wishlist = getFromStorage("wishlist") || [];
  const p = products.find((x) => x.id === id);
  const exists = wishlist.find((x) => x.id === id);
  if (exists) {
    wishlist = wishlist.filter((x) => x.id !== id);
    alert("Removed from Wishlist");
  } else {
    wishlist.push(p);
    alert("Added to Wishlist");
  }
  setToStorage("wishlist", wishlist);
  updateBadges();
};

const removeItem = (id, key) => {
  let data = getFromStorage(key);
  data = data.filter((x) => x.id !== id);
  setToStorage(key, data);
  updateBadges();
  if (key === "cart") renderCartPage();
  else renderWishlistPage();
};

// ================= PAGES =================
const renderDetailPage = () => {
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get("id"));
  const p = products.find((x) => x.id === id);
  const el = document.getElementById("detail-container");
  if (!p || !el) return;
  el.innerHTML = `
        <div style="display:flex; gap:2rem; flex-wrap:wrap; background:var(--card-bg); padding:2rem; border-radius:10px;">
            <img src="${p.image}" style="max-width:400px; width:100%; border-radius:10px;">
            <div>
                <h1>${p.name}</h1>
                <h2 style="color:var(--primary-color);">Rs. ${p.price}</h2>
                <p>Category: ${p.category}</p>
                <p>Rating: ${p.rating} ★</p><br>
                <button class="btn btn-primary" onclick="addToCart(${p.id})">Add to Cart</button>
                <button class="btn btn-danger" onclick="toggleWishlist(${p.id})">❤️ Wishlist</button>
            </div>
        </div>
    `;
};

const renderCartPage = () => {
  const cart = getFromStorage("cart") || [];
  const el = document.getElementById("cart-items");
  const totalEl = document.getElementById("cart-total");
  if (!el) return;

  let total = 0;
  el.innerHTML =
    cart.length === 0
      ? "<p>Cart is empty</p>"
      : cart
          .map((item) => {
            total += item.price * item.quantity;
            return `
        <div style="display:flex; gap:1rem; background:var(--card-bg); padding:1rem; margin-bottom:1rem; border-radius:5px;">
            <img src="${item.image}" style="width:80px; height:80px; object-fit:cover; border-radius:5px;">
            <div style="flex:1"><h3>${item.name}</h3><p>Rs. ${item.price}</p></div>
            <div style="display:flex; align-items:center; gap:5px;">
                <button class="btn btn-primary" onclick="updateQty(${item.id}, -1)">-</button>
                <span>${item.quantity}</span>
                <button class="btn btn-primary" onclick="updateQty(${item.id}, 1)">+</button>
            </div>
            <button class="btn btn-danger" onclick="removeItem(${item.id}, 'cart')">X</button>
        </div>`;
          })
          .join("");
  if (totalEl) totalEl.textContent = total;
};

const renderWishlistPage = () => {
  const wishlist = getFromStorage("wishlist") || [];
  const el = document.getElementById("wishlist-items");
  if (!el) return;

  el.innerHTML =
    wishlist.length === 0
      ? "<p>Wishlist is empty</p>"
      : wishlist
          .map(
            (item) => `
        <div class="product-card">
            <img src="${item.image}" class="product-img">
            <div class="product-info">
                <h3 class="product-title">${item.name}</h3>
                <p class="product-price">Rs. ${item.price}</p>
            </div>
            <div class="product-actions">
                <button class="btn btn-primary" onclick="addToCart(${item.id})">Move to Cart</button>
                <button class="btn btn-danger" onclick="removeItem(${item.id}, 'wishlist')">Remove</button>
            </div>
        </div>
    `,
          )
          .join("");
};

const updateQty = (id, change) => {
  let cart = getFromStorage("cart");
  let item = cart.find((i) => i.id === id);
  if (item) {
    item.quantity += change;
    if (item.quantity <= 0) cart = cart.filter((i) => i.id !== id);
  }
  setToStorage("cart", cart);
  updateBadges();
  renderCartPage();
};

// ================= THEME =================
const initTheme = () => {
  if (getFromStorage("theme") === "dark")
    document.body.classList.add("dark-mode");
};
const toggleTheme = () => {
  document.body.classList.toggle("dark-mode");
  setToStorage(
    "theme",
    document.body.classList.contains("dark-mode") ? "dark" : "light",
  );
};

// ================= INIT =================
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  updateNavbar();
  initSlider();

  const page = document.body.getAttribute("data-page");
  if (page === "home") {
    renderProducts();
    document
      .getElementById("search-input")
      ?.addEventListener("input", applyFilters);
    document
      .getElementById("category-filter")
      ?.addEventListener("change", applyFilters);
    document
      .getElementById("sort-filter")
      ?.addEventListener("change", applyFilters);
  }
  if (page === "detail") renderDetailPage();
  if (page === "cart") renderCartPage();
  if (page === "wishlist") renderWishlistPage();

  document
    .querySelector(".hamburger")
    ?.addEventListener("click", () =>
      document.querySelector(".nav-links").classList.toggle("active"),
    );
});
