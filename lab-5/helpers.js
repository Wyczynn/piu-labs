/**
 * Generuje losowy kolor w formacie hex
 * @returns {string} Kolor w formacie #RRGGBB
 */
export function randomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

/**
 * Generuje unikalny identyfikator
 * @returns {string} Unikalny ID
 */
export function generateId() {
  return `shape-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
