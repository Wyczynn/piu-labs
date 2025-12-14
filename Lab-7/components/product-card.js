import loadTemplate from '../utils/loadTemplate.js';

let templateCache = null;
let cssCache = null;

export default class ProductCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
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
  }
}

customElements.define('product-card', ProductCard);
