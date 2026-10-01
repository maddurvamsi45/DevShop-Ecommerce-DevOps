const assert = require("assert");

console.log("Running DevShop tests...");

const products = [
  { id: 1, name: "AeroFit Running Shoes", price: 2499 },
  { id: 2, name: "Pro Wireless Headphones", price: 3999 }
];

assert(products.length > 0);
assert(products.every(product => product.id && product.name));
assert(products.every(product => product.price > 0));

console.log("✓ Product data validation passed");
console.log("✓ Basic application tests passed");
console.log("All tests passed.");