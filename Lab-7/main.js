import './components/product-card.js';
import './components/product-list.js';
import './components/shopping-cart.js';

// Handle add-to-cart events
document.addEventListener('add-to-cart', (event) => {
  const shoppingCart = document.querySelector('shopping-cart');
  if (shoppingCart) {
    shoppingCart.addItem(event.detail);
  }
});
