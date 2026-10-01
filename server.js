const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const products = [
  { id: 1, name: "AeroFit Running Shoes", category: "Fashion", price: 2499, oldPrice: 3499, rating: 4.7, reviews: 328, icon: "👟", badge: "Best Seller", description: "Lightweight running shoes with breathable mesh and responsive cushioning." },
  { id: 2, name: "Pro Wireless Headphones", category: "Electronics", price: 3999, oldPrice: 5999, rating: 4.8, reviews: 512, icon: "🎧", badge: "Popular", description: "Immersive audio, active noise cancellation and 40-hour battery life." },
  { id: 3, name: "SmartFit Watch X2", category: "Electronics", price: 5499, oldPrice: 7999, rating: 4.6, reviews: 247, icon: "⌚", badge: "New", description: "Fitness tracking, notifications, heart-rate monitoring and premium display." },
  { id: 4, name: "Urban Travel Backpack", category: "Fashion", price: 1899, oldPrice: 2799, rating: 4.5, reviews: 186, icon: "🎒", badge: "Deal", description: "Water-resistant laptop backpack with smart compartments for travel." },
  { id: 5, name: "Mechanical RGB Keyboard", category: "Electronics", price: 2999, oldPrice: 4499, rating: 4.8, reviews: 411, icon: "⌨️", badge: "Hot", description: "Tactile mechanical switches, RGB lighting and durable aluminum frame." },
  { id: 6, name: "Minimal Desk Lamp", category: "Home", price: 1299, oldPrice: 1999, rating: 4.4, reviews: 95, icon: "💡", badge: "Value", description: "Modern LED desk lamp with adjustable brightness and warm lighting." },
  { id: 7, name: "Premium Cotton Hoodie", category: "Fashion", price: 1599, oldPrice: 2299, rating: 4.6, reviews: 201, icon: "🧥", badge: "Trending", description: "Soft premium cotton hoodie designed for everyday comfort." },
  { id: 8, name: "Smart Home Speaker", category: "Electronics", price: 2199, oldPrice: 3299, rating: 4.5, reviews: 154, icon: "🔊", badge: "Deal", description: "Compact smart speaker with rich sound and voice assistant support." },
  { id: 9, name: "Ceramic Coffee Set", category: "Home", price: 899, oldPrice: 1299, rating: 4.3, reviews: 74, icon: "☕", badge: "Value", description: "Elegant ceramic coffee cups for a modern kitchen or office." },
  { id: 10, name: "Performance Laptop Stand", category: "Home", price: 1499, oldPrice: 2199, rating: 4.7, reviews: 123, icon: "💻", badge: "Popular", description: "Ergonomic aluminum stand for comfortable desk setups." },
  { id: 11, name: "Everyday Sunglasses", category: "Fashion", price: 999, oldPrice: 1599, rating: 4.2, reviews: 88, icon: "🕶️", badge: "Style", description: "Classic UV-protection sunglasses with lightweight frames." },
  { id: 12, name: "Portable Power Bank", category: "Electronics", price: 1799, oldPrice: 2499, rating: 4.6, reviews: 302, icon: "🔋", badge: "Top Rated", description: "Fast-charging power bank with high capacity and dual USB output." }
];

app.get("/api/health", (req, res) => {
  res.json({ status: "UP", service: "DevShop", version: "1.0.0", timestamp: new Date().toISOString() });
});

app.get("/api/products", (req, res) => {
  const { category, q } = req.query;
  let result = [...products];
  if (category && category !== "All") {
    result = result.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }
  if (q) {
    const search = q.toLowerCase();
    result = result.filter(p =>
      p.name.toLowerCase().includes(search) ||
      p.category.toLowerCase().includes(search) ||
      p.description.toLowerCase().includes(search)
    );
  }
  res.json(result);
});

app.get("/api/products/:id", (req, res) => {
  const product = products.find(p => p.id === Number(req.params.id));
  if (!product) return res.status(404).json({ error: "Product not found" });
  res.json(product);
});

app.post("/api/orders", (req, res) => {
  const { items, customer } = req.body;
  if (!Array.isArray(items) || !items.length) {
    return res.status(400).json({ error: "Order must contain at least one item" });
  }
  const orderId = `DS-${Date.now().toString().slice(-8)}`;
  res.status(201).json({
    success: true,
    orderId,
    message: "Order created successfully",
    customer: customer || {},
    itemCount: items.length
  });
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`DevShop running on port ${PORT}`);
});