const CARD_COLORS = [
    '#FFB3BA', '#FFDFBA', '#FFFFBA', '#BAFFC9', '#BAE1FF',
    '#FFD4E5', '#D4F1F4', '#C9E4CA', '#FFC8DD', '#E7C6FF'
];

let cards = {};

document.addEventListener('DOMContentLoaded', () => {
    loadFromLocalStorage();
    setupColumns();
    renderAllCards();
});

function setupColumns() {
    document.querySelectorAll('.column').forEach(column => {
        const columnId = column.dataset.columnId;

        column.querySelector('.add-card-btn').onclick = () => addCard(columnId);
        column.querySelector('.color-column-btn').onclick = () => colorColumn(columnId);
        column.querySelector('.sort-btn').onclick = () => sortColumn(columnId);

        column.querySelector('.cards-container').onclick = (e) => {
            const card = e.target.closest('.card');
            if (!card) return;

            const cardId = card.dataset.cardId;

            if (e.target.classList.contains('delete-btn')) {
                deleteCard(cardId);
            } else if (e.target.classList.contains('move-left-btn')) {
                moveCard(cardId, 'left');
            } else if (e.target.classList.contains('move-right-btn')) {
                moveCard(cardId, 'right');
            } else if (e.target.classList.contains('color-card-btn')) {
                colorCard(cardId);
            }
        };

        column.querySelector('.cards-container').oninput = (e) => {
            if (e.target.classList.contains('card-content')) {
                const card = e.target.closest('.card');
                cards[card.dataset.cardId].content = e.target.textContent;
                saveToLocalStorage();
            }
        };
    });
}

function generateId() {
    return 'card_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function getRandomColor() {
    return CARD_COLORS[Math.floor(Math.random() * CARD_COLORS.length)];
}

function addCard(columnId) {
    const cardId = generateId();

    cards[cardId] = {
        id: cardId,
        columnId: columnId,
        content: '',
        color: getRandomColor(),
        timestamp: Date.now()
    };

    saveToLocalStorage();
    renderCard(cardId);
    updateCardCount(columnId);
}

function deleteCard(cardId) {
    const columnId = cards[cardId].columnId;
    delete cards[cardId];

    saveToLocalStorage();
    document.querySelector(`[data-card-id="${cardId}"]`).remove();
    updateCardCount(columnId);
}

function moveCard(cardId, direction) {
    const card = cards[cardId];
    const columns = ['todo', 'inprogress', 'done'];
    const currentIndex = columns.indexOf(card.columnId);

    const newIndex = direction === 'left' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= columns.length) return;

    const oldColumnId = card.columnId;
    card.columnId = columns[newIndex];

    saveToLocalStorage();
    document.querySelector(`[data-card-id="${cardId}"]`).remove();
    renderCard(cardId);

    updateCardCount(oldColumnId);
    updateCardCount(card.columnId);
}

function colorColumn(columnId) {
    Object.values(cards)
        .filter(card => card.columnId === columnId)
        .forEach(card => card.color = getRandomColor());

    saveToLocalStorage();
    renderColumn(columnId);
}

function colorCard(cardId) {
    cards[cardId].color = getRandomColor();
    saveToLocalStorage();
    document.querySelector(`[data-card-id="${cardId}"]`).style.backgroundColor = cards[cardId].color;
}

function sortColumn(columnId) {
    Object.values(cards)
        .filter(card => card.columnId === columnId)
        .sort((a, b) => a.content.localeCompare(b.content))
        .forEach((card, index) => cards[card.id].timestamp = index);

    saveToLocalStorage();
    renderColumn(columnId);
}

function renderCard(cardId) {
    const card = cards[cardId];
    const columns = ['todo', 'inprogress', 'done'];
    const currentIndex = columns.indexOf(card.columnId);

    const cardEl = document.createElement('div');
    cardEl.className = 'card';
    cardEl.dataset.cardId = cardId;
    cardEl.style.backgroundColor = card.color;

    cardEl.innerHTML = `
        <div class="card-header">
            <div class="card-buttons">
                ${currentIndex > 0 ? '<button class="card-btn move-left-btn">←</button>' : ''}
                ${currentIndex < columns.length - 1 ? '<button class="card-btn move-right-btn">→</button>' : ''}
                <button class="card-btn color-card-btn">🎨</button>
            </div>
            <button class="card-btn delete-btn">✕</button>
        </div>
        <div class="card-content" contenteditable="true">${card.content}</div>
    `;

    document.querySelector(`[data-column-id="${card.columnId}"] .cards-container`).appendChild(cardEl);
}

function renderColumn(columnId) {
    const container = document.querySelector(`[data-column-id="${columnId}"] .cards-container`);
    container.innerHTML = '';

    Object.values(cards)
        .filter(card => card.columnId === columnId)
        .sort((a, b) => a.timestamp - b.timestamp)
        .forEach(card => renderCard(card.id));

    updateCardCount(columnId);
}

function renderAllCards() {
    ['todo', 'inprogress', 'done'].forEach(columnId => renderColumn(columnId));
}

function updateCardCount(columnId) {
    const count = Object.values(cards).filter(card => card.columnId === columnId).length;
    document.querySelector(`[data-column-id="${columnId}"] .card-count`).textContent = count;
}

function saveToLocalStorage() {
    localStorage.setItem('kanbanCards', JSON.stringify(cards));
}

function loadFromLocalStorage() {
    const saved = localStorage.getItem('kanbanCards');
    if (saved) {
        try {
            cards = JSON.parse(saved);
        } catch (e) {
            console.error('Błąd wczytywania danych:', e);
            cards = {};
        }
    }
}