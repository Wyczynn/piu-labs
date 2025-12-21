import loadTemplate from '../utils/loadTemplate.js';

let templateCache = null;
let cssCache = null;

export default class ShoppingCart extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._cartItems = [];
  }

  async connectedCallback() {
    if (!templateCache) {
      templateCache = await loadTemplate('./components/shopping-cart.html');
    }
    if (!cssCache) {
      cssCache = await fetch('./components/shopping-cart.css').then(r => r.text());
    }

    // Create style element with CSS
    const style = document.createElement('style');
    style.textContent = cssCache;
    this.shadowRoot.appendChild(style);

    // Append HTML template
    this.shadowRoot.appendChild(templateCache.content.cloneNode(true));

    this.render();
  }

  addItem(item) {
    // For simplicity, not handling quantity - just add each item separately
    this._cartItems.push({
      ...item,
      cartId: Date.now() + Math.random() // unique ID for cart item
    });
    this.render();
  }

  removeItem(cartId) {
    this._cartItems = this._cartItems.filter(item => item.cartId !== cartId);
    this.render();
  }

  render() {
    const cartItemsContainer = this.shadowRoot.getElementById('cartItems');
    const totalPriceElement = this.shadowRoot.getElementById('totalPrice');

    if (!cartItemsContainer || !totalPriceElement) return;

    // Clear current items
    cartItemsContainer.innerHTML = '';

    if (this._cartItems.length === 0) {
      cartItemsContainer.innerHTML = '<p class="empty-cart">Koszyk jest pusty</p>';
      totalPriceElement.textContent = '0.00 zł';
      return;
    }

    // Render each item
    this._cartItems.forEach(item => {
      const itemElement = document.createElement('div');
      itemElement.className = 'cart-item';

      // Build attributes string
      let attributes = [];
      if (item.color) attributes.push(`Kolor: ${item.color}`);
      if (item.size) attributes.push(`Rozmiar: ${item.size}`);
      const attributesText = attributes.length > 0 ? attributes.join(' | ') : '';

      itemElement.innerHTML = `
        ${item.image ? `<img src="${item.image}" alt="${item.name}" class="cart-item-image">` : ''}
        <div class="cart-item-details">
          <p class="cart-item-name">${item.name}</p>
          ${attributesText ? `<p class="cart-item-attributes">${attributesText}</p>` : ''}
          <p class="cart-item-price">${item.price.toFixed(2)} zł</p>
        </div>
        <button class="remove-btn" data-cart-id="${item.cartId}">×</button>
      `;

      // Add remove button listener
      const removeBtn = itemElement.querySelector('.remove-btn');
      removeBtn.addEventListener('click', () => {
        this.removeItem(item.cartId);
      });

      cartItemsContainer.appendChild(itemElement);
    });

    // Calculate and display total
    const total = this._cartItems.reduce((sum, item) => sum + item.price, 0);
    totalPriceElement.textContent = `${total.toFixed(2)} zł`;
  }
}

customElements.define('shopping-cart', ShoppingCart);
