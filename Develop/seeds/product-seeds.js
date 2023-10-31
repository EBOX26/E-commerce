const { Product } = require('../models');

const productData = [
  {
    product_name: 'Plain T-Shirt',
    product_price: 14.99,
    product_stock: 14,
    category_id: 1,
  },
  {
    product_name: 'Running Sneakers',
    product_price: 90.0,
    product_stock: 25,
    category_id: 5,
  },
  {
    product_name: 'Branded Baseball Hat',
    product_price: 22.99,
    product_stock: 12,
    category_id: 4,
  },
  {
    product_name: 'Top 40 Music Compilation Vinyl Record',
    product_price: 12.99,
    product_stock: 50,
    category_id: 3,
  },
  {
    product_name: 'Cargo Shorts',
    product_price: 29.99,
    product_stock: 22,
    category_id: 2,
  },
];

const seedProducts = () => Product.bulkCreate(productData);

module.exports = seedProducts;

