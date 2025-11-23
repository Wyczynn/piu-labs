import { store } from './store.js';
import { randomColor, generateId } from './helpers.js';

const shapesContainer = document.getElementById('shapes-container');
const squaresCountEl = document.getElementById('squares-count');
const circlesCountEl = document.getElementById('circles-count');

const addSquareBtn = document.getElementById('add-square');
const addCircleBtn = document.getElementById('add-circle');
const colorSquaresBtn = document.getElementById('color-squares');
const colorCirclesBtn = document.getElementById('color-circles');


export function init() {
  setupEventListeners();
  setupSubscriptions();
}

function setupEventListeners() {
  addSquareBtn.addEventListener('click', () => {
    const shape = {
      id: generateId(),
      type: 'square',
      color: randomColor(),
    };
    store.addShape(shape);
  });

  addCircleBtn.addEventListener('click', () => {
    const shape = {
      id: generateId(),
      type: 'circle',
      color: randomColor(),
    };
    store.addShape(shape);
  });

  colorSquaresBtn.addEventListener('click', () => {
    store.recolorShapes('square', randomColor());
  });

  colorCirclesBtn.addEventListener('click', () => {
    store.recolorShapes('circle', randomColor());
  });

  shapesContainer.addEventListener('click', (e) => {
    const shapeEl = e.target.closest('.shape');
    if (shapeEl) {
      const id = shapeEl.dataset.id;
      store.removeShape(id);
    }
  });
}


function setupSubscriptions() {
  store.subscribe('shapes', (shapes) => {
    updateShapesDisplay(shapes);
  });

  store.subscribe('squaresCount', (count) => {
    squaresCountEl.textContent = count;
  });

  store.subscribe('circlesCount', (count) => {
    circlesCountEl.textContent = count;
  });
}


function updateShapesDisplay(shapes) {
  const emptyMessage = shapesContainer.querySelector('.empty-message');
  if (emptyMessage) {
    emptyMessage.remove();
  }

  if (shapes.length === 0) {
    shapesContainer.innerHTML = '<div class="empty-message">Brak kształtów. Dodaj coś!</div>';
    return;
  }

  const existingShapes = new Map();
  shapesContainer.querySelectorAll('.shape').forEach(el => {
    existingShapes.set(el.dataset.id, el);
  });

  const newShapesMap = new Map(shapes.map(s => [s.id, s]));

  existingShapes.forEach((el, id) => {
    if (!newShapesMap.has(id)) {
      el.remove();
    }
  });

  shapes.forEach((shape, index) => {
    let shapeEl = existingShapes.get(shape.id);

    if (shapeEl) {
      shapeEl.style.backgroundColor = shape.color;
    } else {
      shapeEl = createShapeElement(shape);
      shapesContainer.appendChild(shapeEl);
    }
  });
}

function createShapeElement(shape) {
  const div = document.createElement('div');
  div.className = `shape ${shape.type}`;
  div.style.backgroundColor = shape.color;
  div.dataset.id = shape.id;
  div.title = 'Kliknij, aby usunąć';
  return div;
}
