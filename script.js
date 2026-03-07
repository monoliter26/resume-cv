// ==========================================
// 1. ЗБЕРЕЖЕННЯ ДАНИХ У LOCALSTORAGE
// ==========================================
function saveSystemInfo() {
    const info = {
        browser: navigator.userAgent,
        platform: navigator.platform
    };

    localStorage.setItem('userSystemInfo', JSON.stringify(info));

    const footer = document.getElementById('main-footer');
    const savedData = JSON.parse(localStorage.getItem('userSystemInfo'));
    
    const infoText = document.createElement('p');
    infoText.style.fontSize = '0.8em';
    infoText.style.color = '#888';
    infoText.style.marginTop = '10px';
    infoText.innerText = `Ваша система: ${savedData.platform} | Браузер: ${savedData.browser}`;
    
    footer.appendChild(infoText);
}

// ==========================================
// 2. ВІДГУКИ РОБОТОДАВЦІВ (FETCH API) - БЕЗ РЕЗЕРВНИХ ДАНИХ
// ==========================================
async function loadComments() {
    const variant = 12; // Твій 12-й варіант
    const container = document.getElementById('comments-container');

    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${variant}/comments`);
        
        if (!response.ok) throw new Error("Помилка мережі");
        
        const comments = await response.json();
        container.innerHTML = ''; 
        
        // Виводимо перші 3 справжні коментарі з сервера
        comments.slice(0, 3).forEach(comment => {
            const card = document.createElement('div');
            card.className = 'comment-card';
            card.innerHTML = `<p><strong>Email: ${comment.email}</strong></p><p>${comment.body}</p>`;
            container.appendChild(card);
        });

    } catch (error) {
        // Якщо помилка - просто виводимо текст, без ніяких фейкових коментарів
        container.innerHTML = '<p style="color: #555; font-style: italic;">Не вдалося завантажити коментарі.</p>';
        console.error("Помилка завантаження відгуків:", error);
    }
}

// ==========================================
// 3. МОДАЛЬНЕ ВІКНО З ФОРМОЮ (ЧЕРЕЗ 1 ХВИЛИНУ)
// ==========================================
function initModal() {
    const modal = document.getElementById('contactModal');
    const closeBtn = document.querySelector('.close-button');

    setTimeout(() => {
        modal.style.display = 'block';
    }, 60000);

    closeBtn.onclick = () => {
        modal.style.display = 'none';
    };

    window.onclick = (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };
}

// ==========================================
// 4. ПЕРЕМИКАННЯ ТЕМИ (ДЕНЬ/НІЧ)
// ==========================================
function initTheme() {
    const themeBtn = document.getElementById('theme-toggle');
    const currentHour = new Date().getHours();
    
    if (currentHour < 7 || currentHour >= 21) {
        document.body.classList.add('dark-theme');
    }

    themeBtn.onclick = () => {
        document.body.classList.toggle('dark-theme');
    };
}

// ==========================================
// ЗАПУСК УСІХ ФУНКЦІЙ ПРИ ЗАВАНТАЖЕННІ
// ==========================================
window.onload = () => {
    saveSystemInfo();
    loadComments();
    initModal();
    initTheme();
};