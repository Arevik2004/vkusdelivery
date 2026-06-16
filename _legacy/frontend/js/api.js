// ==========================================
// БАЗА ДАННЫХ БЛЮД (23 штуки) С ИКОНКАМИ
// ==========================================
const DISHES_DB = [
    // Пицца
    { id: 1, name: "Маргарита", description: "Классическая итальянская пицца с томатами и моцареллой", price: 450, category: "pizza", icon: "🍕", weight: "450г", imageUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f8a35c'/%3E%3Ctext x='50%25' y='45%25' font-size='60' text-anchor='middle' dominant-baseline='middle'%3E🍕%3C/text%3E%3Ctext x='50%25' y='65%25' font-size='24' fill='white' text-anchor='middle' font-family='Arial'%3EМаргарита%3C/text%3E%3C/svg%3E" },
    { id: 2, name: "Пепперони", description: "Острая пицца с колбасой пепперони и сыром", price: 520, category: "pizza", icon: "🍕", weight: "500г", imageUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23d9534f'/%3E%3Ctext x='50%25' y='45%25' font-size='60' text-anchor='middle'%3E🍕%3C/text%3E%3Ctext x='50%25' y='65%25' font-size='24' fill='white' text-anchor='middle'%3EПепперони%3C/text%3E%3C/svg%3E" },
    { id: 3, name: "Гавайская", description: "Курица, ананасы, моцарелла, томатный соус", price: 550, category: "pizza", icon: "🍍", weight: "480г", imageUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f0ad4e'/%3E%3Ctext x='50%25' y='45%25' font-size='60' text-anchor='middle'%3E🍍%3C/text%3E%3Ctext x='50%25' y='65%25' font-size='24' fill='white' text-anchor='middle'%3EГавайская%3C/text%3E%3C/svg%3E" },
    { id: 4, name: "Четыре сыра", description: "Дор блю, пармезан, моцарелла, горгонзола", price: 590, category: "pizza", icon: "🧀", weight: "490г", imageUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23ffc107'/%3E%3Ctext x='50%25' y='45%25' font-size='60' text-anchor='middle'%3E🧀%3C/text%3E%3Ctext x='50%25' y='65%25' font-size='24' fill='white' text-anchor='middle'%3EЧетыре сыра%3C/text%3E%3C/svg%3E" },
    { id: 5, name: "Мясная", description: "Ветчина, бекон, пепперони, курица, говядина", price: 650, category: "pizza", icon: "🥓", weight: "550г", imageUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23b52b1d'/%3E%3Ctext x='50%25' y='45%25' font-size='60' text-anchor='middle'%3E🥓%3C/text%3E%3Ctext x='50%25' y='65%25' font-size='24' fill='white' text-anchor='middle'%3EМясная%3C/text%3E%3C/svg%3E" },
    { id: 6, name: "Мексиканская", description: "Острый перец халапеньо, курица, томаты, фасоль", price: 580, category: "pizza", icon: "🌶️", weight: "510г", imageUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23e67e22'/%3E%3Ctext x='50%25' y='45%25' font-size='60' text-anchor='middle'%3E🌶️%3C/text%3E%3Ctext x='50%25' y='65%25' font-size='24' fill='white' text-anchor='middle'%3EМексиканская%3C/text%3E%3C/svg%3E" },
    
    // Бургеры
    { id: 7, name: "Чизбургер", description: "Говяжья котлета, сыр чеддер, соленые огурцы, соус BBQ", price: 320, category: "burger", icon: "🍔", weight: "280г", imageUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23cd7f32'/%3E%3Ctext x='50%25' y='45%25' font-size='60' text-anchor='middle'%3E🍔%3C/text%3E%3Ctext x='50%25' y='65%25' font-size='24' fill='white' text-anchor='middle'%3EЧизбургер%3C/text%3E%3C/svg%3E" },
    { id: 8, name: "Двойной бургер", description: "Две котлеты, двойной сыр, бекон, свежие овощи", price: 480, category: "burger", icon: "🍔", weight: "380г", imageUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23a0522d'/%3E%3Ctext x='50%25' y='45%25' font-size='60' text-anchor='middle'%3E🍔%3C/text%3E%3Ctext x='50%25' y='65%25' font-size='24' fill='white' text-anchor='middle'%3EДвойной бургер%3C/text%3E%3C/svg%3E" },
    { id: 9, name: "Чикен бургер", description: "Куриная котлета, айсберг, томаты, соус Цезарь", price: 350, category: "burger", icon: "🐔", weight: "290г", imageUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23e8b86b'/%3E%3Ctext x='50%25' y='45%25' font-size='60' text-anchor='middle'%3E🐔%3C/text%3E%3Ctext x='50%25' y='65%25' font-size='24' fill='white' text-anchor='middle'%3EЧикен бургер%3C/text%3E%3C/svg%3E" },
    { id: 10, name: "Острый бургер", description: "Котлета с халапеньо, сыр, лук, острый соус", price: 390, category: "burger", icon: "🌶️", weight: "300г", imageUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23d35400'/%3E%3Ctext x='50%25' y='45%25' font-size='60' text-anchor='middle'%3E🌶️%3C/text%3E%3Ctext x='50%25' y='65%25' font-size='24' fill='white' text-anchor='middle'%3EОстрый бургер%3C/text%3E%3C/svg%3E" },
    { id: 11, name: "Вегги бургер", description: "Котлета из нута, авокадо, рукола, веган соус", price: 410, category: "burger", icon: "🥑", weight: "320г", imageUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%236b8e23'/%3E%3Ctext x='50%25' y='45%25' font-size='60' text-anchor='middle'%3E🥑%3C/text%3E%3Ctext x='50%25' y='65%25' font-size='24' fill='white' text-anchor='middle'%3EВегги бургер%3C/text%3E%3C/svg%3E" },
    { id: 12, name: "Бургер с яйцом", description: "Говяжья котлета, яичница, бекон, сыр гауда", price: 450, category: "burger", icon: "🍳", weight: "330г", imageUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f39c12'/%3E%3Ctext x='50%25' y='45%25' font-size='60' text-anchor='middle'%3E🍳%3C/text%3E%3Ctext x='50%25' y='65%25' font-size='24' fill='white' text-anchor='middle'%3EБургер с яйцом%3C/text%3E%3C/svg%3E" },

    // Суши
    { id: 13, name: "Филадельфия", description: "Лосось, сливочный сыр, огурец, авокадо", price: 620, category: "sushi", icon: "🍣", weight: "240г", imageUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23e91e63'/%3E%3Ctext x='50%25' y='45%25' font-size='60' text-anchor='middle'%3E🍣%3C/text%3E%3Ctext x='50%25' y='65%25' font-size='24' fill='white' text-anchor='middle'%3EФиладельфия%3C/text%3E%3C/svg%3E" },
    { id: 14, name: "Калифорния", description: "Краб, авокадо, огурец, икра тобико", price: 590, category: "sushi", icon: "🥑", weight: "230г", imageUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%239c27b0'/%3E%3Ctext x='50%25' y='45%25' font-size='60' text-anchor='middle'%3E🥑%3C/text%3E%3Ctext x='50%25' y='65%25' font-size='24' fill='white' text-anchor='middle'%3EКалифорния%3C/text%3E%3C/svg%3E" },
    { id: 15, name: "Унаги", description: "Угорь, огурец, соус унаги, кунжут", price: 580, category: "sushi", icon: "🐟", weight: "220г", imageUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23007bff'/%3E%3Ctext x='50%25' y='45%25' font-size='60' text-anchor='middle'%3E🐟%3C/text%3E%3Ctext x='50%25' y='65%25' font-size='24' fill='white' text-anchor='middle'%3EУнаги%3C/text%3E%3C/svg%3E" },
    { id: 16, name: "Сет 'Классический'", description: "Филадельфия (6шт) + Калифорния (6шт)", price: 1150, category: "sushi", icon: "📦", weight: "480г", imageUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%236f42c1'/%3E%3Ctext x='50%25' y='45%25' font-size='60' text-anchor='middle'%3E📦%3C/text%3E%3Ctext x='50%25' y='65%25' font-size='24' fill='white' text-anchor='middle'%3EКлассический сет%3C/text%3E%3C/svg%3E" },
    { id: 17, name: "Гунканы с лососем", description: "Рис, нори, лосось, сливочный сыр, зеленый лук", price: 380, category: "sushi", icon: "🐟", weight: "150г", imageUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23fd7e14'/%3E%3Ctext x='50%25' y='45%25' font-size='60' text-anchor='middle'%3E🐟%3C/text%3E%3Ctext x='50%25' y='65%25' font-size='24' fill='white' text-anchor='middle'%3EГунканы%3C/text%3E%3C/svg%3E" },

    // Салаты
    { id: 18, name: "Цезарь с курицей", description: "Курица гриль, салат романо, сухарики, пармезан, соус", price: 420, category: "salad", icon: "🥗", weight: "280г", imageUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%232ecc71'/%3E%3Ctext x='50%25' y='45%25' font-size='60' text-anchor='middle'%3E🥗%3C/text%3E%3Ctext x='50%25' y='65%25' font-size='24' fill='white' text-anchor='middle'%3EЦезарь%3C/text%3E%3C/svg%3E" },
    { id: 19, name: "Греческий", description: "Фета, маслины, огурец, томаты, перец, оливковое масло", price: 390, category: "salad", icon: "🫒", weight: "270г", imageUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%233cb371'/%3E%3Ctext x='50%25' y='45%25' font-size='60' text-anchor='middle'%3E🫒%3C/text%3E%3Ctext x='50%25' y='65%25' font-size='24' fill='white' text-anchor='middle'%3EГреческий%3C/text%3E%3C/svg%3E" },
    { id: 20, name: "Теплый салат с говядиной", description: "Говядина, микрозелень, соус терияки, орехи", price: 550, category: "salad", icon: "🥩", weight: "310г", imageUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23e67e22'/%3E%3Ctext x='50%25' y='45%25' font-size='60' text-anchor='middle'%3E🥩%3C/text%3E%3Ctext x='50%25' y='65%25' font-size='24' fill='white' text-anchor='middle'%3EТеплый салат%3C/text%3E%3C/svg%3E" },
    { id: 21, name: "Оливье с курицей", description: "Классический рецепт с курицей и консервированным горошком", price: 290, category: "salad", icon: "🥔", weight: "250г", imageUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f1c40f'/%3E%3Ctext x='50%25' y='45%25' font-size='60' text-anchor='middle'%3E🥔%3C/text%3E%3Ctext x='50%25' y='65%25' font-size='24' fill='white' text-anchor='middle'%3EОливье%3C/text%3E%3C/svg%3E" },

    // Напитки
    { id: 22, name: "Свежий сок апельсиновый", description: "100% апельсин, без сахара", price: 210, category: "drink", icon: "🧃", volume: "0.4л", imageUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23e67e22'/%3E%3Ctext x='50%25' y='45%25' font-size='60' text-anchor='middle'%3E🧃%3C/text%3E%3Ctext x='50%25' y='65%25' font-size='24' fill='white' text-anchor='middle'%3EАпельсиновый сок%3C/text%3E%3C/svg%3E" },
    { id: 23, name: "Кола", description: "Охлажденный напиток", price: 120, category: "drink", icon: "🥤", volume: "0.5л", imageUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23333'/%3E%3Ctext x='50%25' y='45%25' font-size='60' text-anchor='middle'%3E🥤%3C/text%3E%3Ctext x='50%25' y='65%25' font-size='24' fill='white' text-anchor='middle'%3EКола%3C/text%3E%3C/svg%3E" }
];

// ==========================================
// ГЛОБАЛЬНАЯ ПЕРЕМЕННАЯ КОРЗИНЫ
// ==========================================
let cart = {
    items: [],      // каждый элемент: { dishId, quantity }
    subtotal: 0
};

// ==========================================
// РАБОТА С LOCALSTORAGE
// ==========================================
function loadCartFromStorage() {
    const saved = localStorage.getItem('food_delivery_cart');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            if (parsed.items && Array.isArray(parsed.items)) {
                cart = parsed;
            } else {
                cart = { items: [], subtotal: 0 };
            }
        } catch(e) { 
            console.error('Ошибка загрузки корзины:', e);
            cart = { items: [], subtotal: 0 };
        }
    } else {
        cart = { items: [], subtotal: 0 };
    }
    recalcCart();
    saveCartToStorage();
}

function saveCartToStorage() {
    localStorage.setItem('food_delivery_cart', JSON.stringify(cart));
}

function recalcCart() {
    let sum = 0;
    for (let item of cart.items) {
        const dish = DISHES_DB.find(d => d.id === item.dishId);
        if (dish) sum += dish.price * item.quantity;
    }
    cart.subtotal = sum;
    saveCartToStorage();
}

// Эмуляция задержки сети (для реализма)
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// ==========================================
// API КЛАСС (глобально доступен)
// ==========================================
window.FoodDeliveryAPI = class FoodDeliveryAPI {
    // Получение списка блюд с фильтрацией
    static async getDishes(filters = {}) {
        await delay(300);
        let result = [...DISHES_DB];
        
        if (filters.category && filters.category !== 'all') {
            result = result.filter(d => d.category === filters.category);
        }
        
        if (filters.search) {
            const s = filters.search.toLowerCase();
            result = result.filter(d => 
                d.name.toLowerCase().includes(s) || 
                d.description.toLowerCase().includes(s)
            );
        }
        
        if (filters.minPrice && filters.minPrice !== '') {
            result = result.filter(d => d.price >= parseInt(filters.minPrice));
        }
        if (filters.maxPrice && filters.maxPrice !== '') {
            result = result.filter(d => d.price <= parseInt(filters.maxPrice));
        }
        
        if (filters.limit) {
            result = result.slice(0, parseInt(filters.limit));
        }
        
        if (filters.sort === 'price_asc') {
            result.sort((a,b) => a.price - b.price);
        } else if (filters.sort === 'price_desc') {
            result.sort((a,b) => b.price - a.price);
        } else if (filters.sort === 'name') {
            result.sort((a,b) => a.name.localeCompare(b.name));
        }
        
        return result;
    }
    
    // Добавление в корзину
    static async addToCart(dishId, quantity) {
        await delay(200);
        const existing = cart.items.find(i => i.dishId === dishId);
        if (existing) {
            existing.quantity += quantity;
        } else {
            cart.items.push({ dishId: dishId, quantity: quantity });
        }
        recalcCart();
        this.updateCartCount(); // обновляем счётчик на всех страницах
        return { status: 'success', message: 'Добавлено в корзину' };
    }
    
    // Обновление количества
    static async updateCartItem(dishId, quantity) {
        await delay(200);
        const item = cart.items.find(i => i.dishId === dishId);
        if (item) {
            if (quantity <= 0) {
                cart.items = cart.items.filter(i => i.dishId !== dishId);
            } else {
                item.quantity = quantity;
            }
            recalcCart();
            this.updateCartCount();
        }
        return { status: 'success' };
    }
    
    // Удаление из корзины
    static async removeFromCart(dishId) {
        await delay(200);
        cart.items = cart.items.filter(i => i.dishId !== dishId);
        recalcCart();
        this.updateCartCount();
        return { status: 'success' };
    }
    
    // Получение корзины
    static async getCart() {
        await delay(150);
        const itemsWithDetails = cart.items.map(item => {
            const dish = DISHES_DB.find(d => d.id === item.dishId);
            return {
                dishId: item.dishId,
                quantity: item.quantity,
                name: dish ? dish.name : 'Неизвестно',
                price: dish ? dish.price : 0,
                icon: dish ? dish.icon : '🍽️',
                imageUrl: null
            };
        });
        return { items: itemsWithDetails, subtotal: cart.subtotal };
    }
    
    // Применение промокода
    static async applyPromoCode(code) {
        await delay(400);
        const validCodes = ['ВКУС2024', 'WELCOME', 'СКИДКА20'];
        if (validCodes.includes(code)) {
            let discount = Math.min(cart.subtotal * 0.2, 500);
            return { status: 'success', discount: discount };
        } else {
            throw new Error('Неверный промокод');
        }
    }
    
    // Создание заказа
    static async createOrder(orderData) {
        await delay(600);
        const orderId = 'ORD-' + Math.floor(Math.random() * 10000);
        cart.items = [];
        recalcCart();
        this.updateCartCount();
        return { status: 'success', orderId: orderId };
    }
    
    // Обновление счетчика в корзине (ищет все элементы с id="cartCount")
    static updateCartCount() {
        const totalQty = cart.items.reduce((sum, i) => sum + i.quantity, 0);
        const spans = document.querySelectorAll('#cartCount');
        spans.forEach(span => {
            if (span) span.textContent = totalQty;
        });
    }
};

// Инициализация: загружаем корзину при старте
loadCartFromStorage();
// Дополнительно обновляем счётчик после загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
    FoodDeliveryAPI.updateCartCount();
});

// ==========================================
// ВСПОМОГАТЕЛЬНЫЕ ГЛОБАЛЬНЫЕ ФУНКЦИИ
// ==========================================
window.showNotification = function(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 24px;
        background: ${type === 'success' ? '#2E7D32' : '#D32F2F'};
        color: white;
        border-radius: 8px;
        z-index: 10000;
        font-weight: 500;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        animation: slideInRight 0.3s ease;
    `;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
};

window.escapeHtml = function(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
};

window.addToCartHandler = async function(dishId, buttonElement) {
    const card = buttonElement.closest('.dish-card');
    const quantityInput = card ? card.querySelector('.quantity-input') : null;
    const quantity = quantityInput ? parseInt(quantityInput.value) : 1;
    
    try {
        const result = await FoodDeliveryAPI.addToCart(dishId, quantity);
        if (result.status === 'success') {
            showNotification('✅ Товар добавлен в корзину!', 'success');
            if (buttonElement) {
                buttonElement.style.transform = 'scale(0.95)';
                setTimeout(() => { buttonElement.style.transform = 'scale(1)'; }, 200);
            }
        }
    } catch(error) {
        showNotification('❌ Ошибка при добавлении', 'error');
        console.error(error);
    }
};
