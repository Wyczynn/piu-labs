import loadTemplate from '../utils/loadTemplate.js';

let templateCache = null;
let cssCache = null;

export default class ProductCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._product = null;
    this._selectedColor = null;
    this._selectedSize = null;
  }

  set product(value) {
    this._product = value;
    this.render();
  }

  get product() {
    return this._product;
  }

  async connectedCallback() {
    if (!templateCache) {
      templateCache = await loadTemplate('./components/product-card.html');
    }
    if (!cssCache) {
      cssCache = await fetch('./components/product-card.css').then(r => r.text());
    }

    // Create style element with CSS
    const style = document.createElement('style');
    style.textContent = cssCache;
    this.shadowRoot.appendChild(style);

    // Append HTML template
    this.shadowRoot.appendChild(templateCache.content.cloneNode(true));

    // If product data was set before connection, render it
    if (this._product) {
      this.render();
    }

    this.setupEventListeners();
  }

  render() {
    if (!this._product || !this.shadowRoot.querySelector('.content')) return;

    const product = this._product;

    // Set image
    const imageSlot = this.shadowRoot.querySelector('slot[name="image"]');
    if (imageSlot) {
      const img = document.createElement('img');
      img.src = product.image;
      img.alt = product.name;
      img.slot = 'image';
      this.appendChild(img);
    }

    // Set name
    const nameSlot = this.shadowRoot.querySelector('slot[name="name"]');
    if (nameSlot) {
      const span = document.createElement('span');
      span.textContent = product.name;
      span.slot = 'name';
      this.appendChild(span);
    }

    // Set price
    const priceSlot = this.shadowRoot.querySelector('slot[name="price"]');
    if (priceSlot) {
      const span = document.createElement('span');
      span.textContent = `${product.price.toFixed(2)} zł`;
      span.slot = 'price';
      this.appendChild(span);
    }

    // Set promo if exists
    if (product.promo) {
      const promoSlot = this.shadowRoot.querySelector('slot[name="promo"]');
      if (promoSlot) {
        const span = document.createElement('span');
        span.textContent = product.promo;
        span.slot = 'promo';
        this.appendChild(span);
      }
    }

    // Set colors if exists
    if (product.colors && product.colors.length > 0) {
      product.colors.forEach(color => {
        const span = document.createElement('span');
        span.className = 'color-dot';
        span.style.background = color.hex;
        if (color.hex === '#FFFFFF') {
          span.style.borderColor = '#999';
        }
        span.title = color.name;
        span.slot = 'colors';
        span.dataset.color = color.name;
        this.appendChild(span);
      });
    }

    // Set sizes if exists
    if (product.sizes && product.sizes.length > 0) {
      product.sizes.forEach(size => {
        const span = document.createElement('span');
        span.className = 'size-btn';
        span.textContent = size;
        span.slot = 'sizes';
        span.dataset.size = size;
        this.appendChild(span);
      });
    }
  }

  setupEventListeners() {
    // Handle color selection
    this.addEventListener('click', (e) => {
      if (e.target.classList.contains('color-dot')) {
        this.querySelectorAll('.color-dot').forEach(dot => dot.classList.remove('selected'));
        e.target.classList.add('selected');
        this._selectedColor = e.target.dataset.color;
      }
    });

    // Handle size selection
    this.addEventListener('click', (e) => {
      if (e.target.classList.contains('size-btn')) {
        this.querySelectorAll('.size-btn').forEach(btn => btn.classList.remove('selected'));
        e.target.classList.add('selected');
        this._selectedSize = e.target.dataset.size;
      }
    });

    // Handle add to cart button
    const addToCartBtn = this.shadowRoot.querySelector('.add-to-cart');
    if (addToCartBtn) {
      addToCartBtn.addEventListener('click', () => {
        this.addToCart();
      });
    }
  }

  addToCart() {
    if (!this._product) return;

    const cartItem = {
      id: this._product.id,
      name: this._product.name,
      price: this._product.price,
      color: this._selectedColor,
      size: this._selectedSize,
      image: this._product.image
    };

    // Emit custom event
    this.dispatchEvent(new CustomEvent('add-to-cart', {
      detail: cartItem,
      bubbles: true,
      composed: true
    }));

    // Visual feedback
    const addToCartBtn = this.shadowRoot.querySelector('.add-to-cart');
    if (addToCartBtn) {
      const originalText = addToCartBtn.textContent;
      addToCartBtn.textContent = 'Dodano! ✓';
      addToCartBtn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';

      setTimeout(() => {
        addToCartBtn.textContent = originalText;
      }, 1000);
    }
  }
}

customElements.define('product-card', ProductCard);
