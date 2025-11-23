const STORAGE_KEY = 'shapes-app-state';

class Store {
  #state = {
    shapes: [], // { id, type: 'square'|'circle', color }
  };

  #subscribers = new Map();

  constructor() {
    this.#loadFromLocalStorage();
  }

  get shapes() {
    return [...this.#state.shapes];
  }

  get squaresCount() {
    return this.#state.shapes.filter(s => s.type === 'square').length;
  }

  get circlesCount() {
    return this.#state.shapes.filter(s => s.type === 'circle').length;
  }

  getState() {
    return {
      shapes: [...this.#state.shapes],
      squaresCount: this.squaresCount,
      circlesCount: this.circlesCount,
    };
  }

  addShape(shape) {
    this.#state.shapes.push(shape);
    this.#notify('shapes');
    this.#notify('squaresCount');
    this.#notify('circlesCount');
    this.#saveToLocalStorage();
  }

  removeShape(id) {
    this.#state.shapes = this.#state.shapes.filter(s => s.id !== id);
    this.#notify('shapes');
    this.#notify('squaresCount');
    this.#notify('circlesCount');
    this.#saveToLocalStorage();
  }

  recolorShapes(type, color) {
    this.#state.shapes = this.#state.shapes.map(shape =>
      shape.type === type ? { ...shape, color } : shape
    );
    this.#notify('shapes');
    this.#saveToLocalStorage();
  }

  subscribe(prop, callback) {
    if (!this.#subscribers.has(prop)) {
      this.#subscribers.set(prop, new Set());
    }
    this.#subscribers.get(prop).add(callback);

    if (prop === 'shapes') {
      callback(this.shapes);
    } else if (prop === 'squaresCount') {
      callback(this.squaresCount);
    } else if (prop === 'circlesCount') {
      callback(this.circlesCount);
    }

    return () => this.#subscribers.get(prop).delete(callback);
  }

  #notify(prop) {
    const set = this.#subscribers.get(prop);
    if (set) {
      let value;
      if (prop === 'shapes') {
        value = this.shapes;
      } else if (prop === 'squaresCount') {
        value = this.squaresCount;
      } else if (prop === 'circlesCount') {
        value = this.circlesCount;
      }

      for (const cb of set) {
        cb(value);
      }
    }
  }

  #saveToLocalStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.#state));
    } catch (error) {
      console.error('Błąd zapisu do localStorage:', error);
    }
  }

  #loadFromLocalStorage() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.shapes && Array.isArray(parsed.shapes)) {
          this.#state = parsed;
        }
      }
    } catch (error) {
      console.error('Błąd odczytu z localStorage:', error);
    }
  }
}

export const store = new Store();
