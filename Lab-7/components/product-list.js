import productsData from '../products.json' with { type: 'json' };
import ProductCard from './product-card.js';

export default class ProductList extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.className = 'products-grid';
    this.render();
  }

  render() {
    productsData.forEach(productData => {
      const productCard = document.createElement('product-card');
      productCard.product = productData;
      this.appendChild(productCard);
    });
  }
}

customElements.define('product-list', ProductList);
