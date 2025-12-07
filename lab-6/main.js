import Ajax from './ajax.js';

const api = new Ajax({
    baseURL: 'https://jsonplaceholder.typicode.com',
    timeout: 5000
});

const fetchDataBtn = document.getElementById('fetchData');
const fetchErrorBtn = document.getElementById('fetchError');
const resetBtn = document.getElementById('reset');
const errorDiv = document.getElementById('error');
const loader = document.getElementById('loader');
const dataList = document.getElementById('dataList');

function showLoader() {
    loader.classList.remove('hidden');
    dataList.innerHTML = '';
    errorDiv.classList.add('hidden');
}

function hideLoader() {
    loader.classList.add('hidden');
}

function showError(message) {
    errorDiv.textContent = message;
    errorDiv.classList.remove('hidden');
}

function hideError() {
    errorDiv.classList.add('hidden');
}

function displayData(posts) {
    dataList.innerHTML = '';
    posts.forEach(post => {
        const li = document.createElement('li');
        li.innerHTML = `
            <strong>${post.title}</strong>
            <p>${post.body}</p>
        `;
        dataList.appendChild(li);
    });
}

function disableButtons() {
    fetchDataBtn.disabled = true;
    fetchErrorBtn.disabled = true;
}

function enableButtons() {
    fetchDataBtn.disabled = false;
    fetchErrorBtn.disabled = false;
}

fetchDataBtn.addEventListener('click', async () => {
    showLoader();
    hideError();
    disableButtons();

    try {
        const posts = await api.get('/posts?_limit=5');
        displayData(posts);
    } catch (error) {
        showError(error.message);
    } finally {
        hideLoader();
        enableButtons();
    }
});

fetchErrorBtn.addEventListener('click', async () => {
    showLoader();
    hideError();
    disableButtons();

    try {
        await api.get('/posts/999999');
    } catch (error) {
        showError(error.message);
    } finally {
        hideLoader();
        enableButtons();
    }
});

resetBtn.addEventListener('click', () => {
    dataList.innerHTML = '';
    hideError();
    hideLoader();
});
