let cartData = null;
let promoDiscount = 0;

document.addEventListener('DOMContentLoaded', () => {
    loadCart();
    initCartEvents();
    FoodDeliveryAPI.updateCartCount();
});

async function loadCart() {
    try {
        cartData = await FoodDeliveryAPI.getCart();
        displayCart();
        updateSummary();
    } catch (error) {
        console.error('Error loading cart:', error);
        showNotification('Ошибка загрузки корзины', 'error');
    }
}

function displayCart() {
    const container = document.getElementById('cartItems');
    if (!container) return;
    
    if (!cartData.items || cartData.items.length === 0) {
        container.innerHTML = '<p style="text-align: center; padding: 2rem;">Ваша корзина пуста</p>';
        return;
    }
    
    container.innerHTML = cartData.items.map(item => `
        <div class="cart-item" data-dish-id="${item.dishId}">
            <img src="${item.imageUrl || 'images/placeholder.jpg'}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-info">
                <h4>${escapeHtml(item.name)}</h4>
                <p class="cart-item-price">${item.price} ₽</p>
            </div>
            <div class="cart-item-quantity">
                <button class="quantity-btn update-quantity" data-dish-id="${item.dishId}" data-change="-1">-</button>
                <span class="quantity-value">${item.quantity}</span>
                <button class="quantity-btn update-quantity" data-dish-id="${item.dishId}" data-change="1">+</button>
                <button class="remove-item" data-dish-id="${item.dishId}">🗑️</button>
            </div>
            <div class="cart-item-total">
                ${item.price * item.quantity} ₽
            </div>
        </div>
    `).join('');
    
    attachCartEvents();
}

function attachCartEvents() {
    document.querySelectorAll('.update-quantity').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const dishId = parseInt(btn.dataset.dishId);
            const change = parseInt(btn.dataset.change);
            const item = cartData.items.find(i => i.dishId === dishId);
            const newQuantity = item.quantity + change;
            
            if (newQuantity >= 1 && newQuantity <= 99) {
                await updateCartItem(dishId, newQuantity);
            } else if (newQuantity < 1) {
                await removeCartItem(dishId);
            }
        });
    });
    
    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const dishId = parseInt(btn.dataset.dishId);
            await removeCartItem(dishId);
        });
    });
}

async function updateCartItem(dishId, quantity) {
    try {
        const result = await FoodDeliveryAPI.updateCartItem(dishId, quantity);
        if (result.status === 'success') {
            await loadCart();
            FoodDeliveryAPI.updateCartCount();
            showNotification('Корзина обновлена', 'success');
        }
    } catch (error) {
        showNotification('Ошибка обновления корзины', 'error');
    }
}

async function removeCartItem(dishId) {
    try {
        const result = await FoodDeliveryAPI.removeFromCart(dishId);
        if (result.status === 'success') {
            await loadCart();
            FoodDeliveryAPI.updateCartCount();
            showNotification('Товар удален из корзины', 'success');
        }
    } catch (error) {
        showNotification('Ошибка удаления товара', 'error');
    }
}

function updateSummary() {
    const subtotal = cartData.subtotal || 0;
    const delivery = subtotal >= 1500 ? 0 : 150;
    const total = subtotal - promoDiscount + delivery;
    
    document.getElementById('subtotal').textContent = `${subtotal} ₽`;
    document.getElementById('delivery').textContent = `${delivery} ₽`;
    document.getElementById('total').textContent = `${total} ₽`;
}

function initCartEvents() {
    const applyPromoBtn = document.getElementById('applyPromo');
    const promoInput = document.getElementById('promoCode');
    const checkoutBtn = document.getElementById('checkoutBtn');
    
    if (applyPromoBtn) {
        applyPromoBtn.addEventListener('click', async () => {
            const code = promoInput.value.trim();
            if (code) {
                await applyPromoCode(code);
            }
        });
    }
    
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cartData.items && cartData.items.length > 0) {
                window.location.href = 'checkout.html';
            } else {
                showNotification('Корзина пуста', 'error');
            }
        });
    }
}

async function applyPromoCode(code) {
    try {
        const result = await FoodDeliveryAPI.applyPromoCode(code);
        if (result.status === 'success') {
            promoDiscount = result.discount;
            updateSummary();
            showNotification(`Промокод применен! Скидка: ${result.discount} ₽`, 'success');
        }
    } catch (error) {
        showNotification('Неверный промокод', 'error');
    }
}