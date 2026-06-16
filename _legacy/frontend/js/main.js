document.addEventListener('DOMContentLoaded', () => {
    initSlider();
    loadPopularDishes();
    initCategories();
    FoodDeliveryAPI.updateCartCount();
});

function initSlider() {
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    const dotsContainer = document.querySelector('.slider-dots');
    let currentSlide = 0;
    let slideInterval;
    
    // Создание точек
    slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });
    
    function updateSlider() {
        const slider = document.querySelector('.slider');
        slider.style.transform = `translateX(-${currentSlide * 100}%)`;
        document.querySelectorAll('.dot').forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }
    
    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        updateSlider();
    }
    
    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        updateSlider();
    }
    
    function goToSlide(index) {
        currentSlide = index;
        updateSlider();
        resetInterval();
    }
    
    function startInterval() {
        slideInterval = setInterval(nextSlide, 5000);
    }
    
    function resetInterval() {
        clearInterval(slideInterval);
        startInterval();
    }
    
    prevBtn.addEventListener('click', () => {
        prevSlide();
        resetInterval();
    });
    
    nextBtn.addEventListener('click', () => {
        nextSlide();
        resetInterval();
    });
    
    startInterval();
}

async function loadPopularDishes() {
    try {
        const dishes = await FoodDeliveryAPI.getDishes({ limit: 6 });
        const container = document.getElementById('popularDishes');
        if (container) {
            container.innerHTML = dishes.map(dish => createDishCard(dish)).join('');
        }
    } catch (error) {
        console.error('Error loading popular dishes:', error);
    }
}

function initCategories() {
    const categories = document.querySelectorAll('.category-card');
    categories.forEach(category => {
        category.addEventListener('click', () => {
            const categoryValue = category.dataset.category;
            window.location.href = `catalog.html?category=${categoryValue}`;
        });
    });
}

function createDishCard(dish) {
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

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Инициализация обработчиков для quantity контролов
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('quantity-btn')) {
        const btn = e.target;
        const input = btn.parentElement.querySelector('.quantity-input');
        let value = parseInt(input.value);
        
        if (btn.classList.contains('minus') && value > 1) {
            value--;
        } else if (btn.classList.contains('plus') && value < 99) {
            value++;
        }
        
        input.value = value;
    }
});
