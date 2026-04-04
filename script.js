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
// 2. ВІДГУКИ РОБОТОДАВЦІВ (FETCH API)
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
        container.innerHTML = '<p style="color: #555; font-style: italic;">Не вдалося завантажити коментарі.</p>';
        console.error("Помилка завантаження відгуків:", error);
    }
}

// ==========================================
// 3. МОДАЛЬНЕ ВІКНО З ФОРМОЮ
// ==========================================
function initModal() {
    const modal = document.getElementById('contactModal');
    const closeBtn = document.querySelector('.close-button');

    // Для тестування можеш змінити 60000 (1 хв) на 3000 (3 сек), щоб не чекати довго
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
// 5. ОБРОБКА ВІДПРАВКИ ФОРМИ НА СВІЙ БЕКЕНД
// ==========================================
function initFormHandler() {
    const form = document.querySelector('#contactModal form');

    form.addEventListener('submit', async (event) => {
        event.preventDefault(); // Забороняємо браузеру перезавантажувати сторінку

        // Збираємо введені дані з форми
        const formData = new FormData(form);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            subject: formData.get('subject'),
            message: formData.get('message')
        };

        const submitBtn = form.querySelector('.submit-btn');
        submitBtn.innerText = 'Відправка...';
        submitBtn.disabled = true; // Блокуємо кнопку, щоб не натиснули двічі

        try {
            // Відправляємо запит на наш бекенд (Node.js)
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data) // Перетворюємо об'єкт у формат JSON
            });

            const result = await response.json();

            if (response.ok && result.success) {
                alert('Лист успішно відправлено на вашу пошту!');
                form.reset(); // Очищаємо поля форми
                document.getElementById('contactModal').style.display = 'none'; // Ховаємо форму
            } else {
                alert('Виникла помилка: ' + (result.error || 'Перевірте правильність заповнення полів.'));
            }
        } catch (error) {
            console.error('Помилка відправки:', error);
            alert('Помилка зв\'язку з сервером. Переконайтеся, що бекенд запущено.');
        } finally {
            // Повертаємо кнопці початковий вигляд
            submitBtn.innerText = 'Відправити';
            submitBtn.disabled = false;
        }
    });
}

// ==========================================
// ЗАПУСК УСІХ ФУНКЦІЙ ПРИ ЗАВАНТАЖЕННІ
// ==========================================
window.onload = () => {
    saveSystemInfo();
    loadComments();
    initModal();
    initTheme();
    initFormHandler(); // Додали запуск обробника форми
};
