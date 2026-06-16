let currentDishes = [];

document.addEventListener('DOMContentLoaded', () => {
    loadCatalogDishes();
    initFilters();
    FoodDeliveryAPI.updateCartCount();
    
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    if (categoryParam) {
        document.getElementById('categoryFilter').value = categoryParam;
        loadCatalogDishes();
    }
});

async function loadCatalogDishes() {
    const filters = getFilters();
    const searchTerm = document.getElementById('searchInput').value;
    
    if (searchTerm) {
        filters.search = searchTerm;
    }
    
    try {
        currentDishes = await FoodDeliveryAPI.getDishes(filters);
        displayDishes(currentDishes);
    } catch (error) {
        console.error('Error loading catalog dishes:', error);
        showNotification('Ошибка загрузки блюд', 'error');
    }
}

function displayDishes(dishes) {
    const container = document.getElementById('catalogDishes');
    if (!container) return;
    
    if (dishes.length === 0) {
        container.innerHTML = '<p style="text-align: center; grid-column: 1/-1;">Блюда не найдены</p>';
        return;
    }
    
    container.innerHTML = dishes.map(dish => createCatalogDishCard(dish)).join('');
}

function createCatalogDishCard(dish) {
    return `
        <div class="dish-card" data-dish-id="${dish.id}">
            <img src="${dish.imageUrl || 'images/placeholder.jpg'}" alt="${dish.name}" class="dish-image">
            <div class="dish-info">
                <h3 class="dish-title">${escapeHtml(dish.name)}</h3>
                <p class="dish-description">${escapeHtml(dish.description)}</p>
                <div class="dish-price">${dish.price} ₽</div>
                <div class="quantity-control">
                    <button class="quantity-btn minus">-</button>
                    <input type="number" class="quantity-input" value="1" min="1" max="99">
                    <button class="quantity-btn plus">+</button>
                </div>
                <button class="btn-add-to-cart" onclick="addToCartHandler(${dish.id}, this)">В корзину</button>
            </div>
        </div>
    `;
}

function getFilters() {
    const category = document.getElementById('categoryFilter').value;
    const minPrice = document.getElementById('minPrice').value;
    const maxPrice = document.getElementById('maxPrice').value;
    const sortBy = document.getElementById('sortBy').value;
    
    const filters = {};
    if (category && category !== 'all') filters.category = category;
    if (minPrice) filters.minPrice = minPrice;
    if (maxPrice) filters.maxPrice = maxPrice;
    if (sortBy) filters.sort = sortBy;
    
    return filters;
}

function initFilters() {
    const applyBtn = document.getElementById('applyFilters');
    const resetBtn = document.getElementById('resetFilters');
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');
    
    if (applyBtn) {
        applyBtn.addEventListener('click', loadCatalogDishes);
    }
    
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            document.getElementById('categoryFilter').value = 'all';
            document.getElementById('minPrice').value = '';
            document.getElementById('maxPrice').value = '';
            document.getElementById('sortBy').value = 'name';
            document.getElementById('searchInput').value = '';
            loadCatalogDishes();
        });
    }
    
    if (searchBtn) {
        searchBtn.addEventListener('click', loadCatalogDishes);
    }
    
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') loadCatalogDishes();
        });
    }
}

async function addToCartHandler(dishId, buttonElement) {
    const card = buttonElement.closest('.dish-card');
    const quantityInput = card.querySelector('.quantity-input');
    const quantity = parseInt(quantityInput.value);
    
    try {
        const result = await FoodDeliveryAPI.addToCart(dishId, quantity);
        if (result.status === 'success') {
            showNotification('Товар добавлен в корзину!', 'success');
            FoodDeliveryAPI.updateCartCount();
            animateAddToCart(buttonElement);
        }
    } catch (error) {
        showNotification('Ошибка при добавлении в корзину', 'error');
    }
}

function animateAddToCart(button) {
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
        button.style.transform = 'scale(1)';
    }, 200);
}