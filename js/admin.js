// Константы для аутентификации
const ADMIN_USERNAME = 'Admin';
const ADMIN_PASSWORD = 'Online481448';

// Проверка авторизации при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Проверяем, на какой странице мы находимся
    const isLoginPage = window.location.pathname.includes('admin-login.html');
    const isAdminPanel = window.location.pathname.includes('admin-panel.html');
    
    // Проверка авторизации для админ-панели
    if (isAdminPanel) {
        if (!isAuthenticated()) {
            // Если не авторизован, перенаправляем на страницу входа
            window.location.href = 'admin-login.html';
        } else {
            // Инициализация админ-панели
            initAdminPanel();
        }
    }
    
    // Обработка формы входа
    if (isLoginPage) {
        const loginForm = document.getElementById('admin-login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const username = document.getElementById('username').value;
                const password = document.getElementById('password').value;
                const errorMessage = document.getElementById('login-error');
                
                if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
                    // Сохраняем информацию об авторизации
                    localStorage.setItem('admin_auth', JSON.stringify({
                        isAuthenticated: true,
                        timestamp: Date.now()
                    }));
                    
                    // Перенаправляем на админ-панель
                    window.location.href = 'admin-panel.html';
                } else {
                    // Показываем сообщение об ошибке
                    errorMessage.textContent = 'Неверный логин или пароль';
                }
            });
        }
    }
});

// Функция проверки авторизации
function isAuthenticated() {
    const auth = JSON.parse(localStorage.getItem('admin_auth') || '{}');
    const now = Date.now();
    const authExpiration = 24 * 60 * 60 * 1000; // 24 часа
    
    // Проверяем, авторизован ли пользователь и не истек ли срок сессии
    return auth.isAuthenticated && (now - auth.timestamp < authExpiration);
}

// Инициализация админ-панели
function initAdminPanel() {
    // Обработка выхода из админ-панели
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            localStorage.removeItem('admin_auth');
            window.location.href = 'admin-login.html';
        });
    }
    
    // Инициализация графика посещаемости
    initVisitsChart();
    
    // Обработка мобильного меню
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            document.querySelector('.admin-sidebar').classList.toggle('active');
        });
    }
}

// Инициализация графика посещаемости
function initVisitsChart() {
    const chartElement = document.getElementById('visitsChart');
    if (!chartElement) return;
    
    // Данные для графика (пример)
    const visitData = {
        labels: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
        datasets: [{
            label: 'Посетители',
            data: [65, 78, 52, 91, 85, 107, 124],
            borderColor: '#00FFAA',
            backgroundColor: 'rgba(0, 255, 170, 0.1)',
            tension: 0.4,
            fill: true
        }]
    };
    
    // Настройки графика
    const chartConfig = {
        type: 'line',
        data: visitData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        color: '#ffffff'
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#ffffff'
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#ffffff'
                    }
                }
            }
        }
    };
    
    // Создаем график
    new Chart(chartElement, chartConfig);
}

// Функция для обновления данных в реальном времени (имитация)
function updateRealTimeData() {
    // Здесь можно добавить код для получения реальных данных с сервера
    // Например, через fetch API или WebSocket
    
    // Пример обновления данных каждые 30 секунд
    setInterval(() => {
        // Обновление случайных значений для демонстрации
        const cards = document.querySelectorAll('.dashboard-card .value');
        if (cards.length > 0) {
            const visitorCard = cards[0];
            const currentValue = parseInt(visitorCard.textContent);
            const newValue = currentValue + Math.floor(Math.random() * 5);
            visitorCard.textContent = newValue;
        }
    }, 30000);
}