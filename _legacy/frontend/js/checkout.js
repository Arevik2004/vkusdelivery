let cartData = null;

document.addEventListener('DOMContentLoaded', () => {
    loadOrderPreview();
    initOrderForm();
});

async function loadOrderPreview() {
    try {
        cartData = await FoodDeliveryAPI.getCart();
        if (!cartData.items || cartData.items.length === 0) {
            window.location.href = 'cart.html';
            return;
        }
        
        displayOrderPreview();
        updateOrderTotal();
    } catch (error) {
        console.error('Error loading order preview:', error);
    }
}

function displayOrderPreview() {
    const container = document.getElementById('orderItemsPreview');
    if (!container) return;
    
    container.innerHTML = cartData.items.map(item => `
        <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee;">
            <span>${escapeHtml(item.name)} x ${item.quantity}</span>
            <span>${item.price * item.quantity} ₽</span>
        </div>
    `).join('');
}

function updateOrderTotal() {
    const subtotal = cartData.subtotal || 0;
    const delivery = subtotal >= 1500 ? 0 : 150;
    const total = subtotal + delivery;
    
    const totalElement = document.getElementById('orderTotal');
    if (totalElement) {
        totalElement.textContent = `${total} ₽`;
    }
}

function initOrderForm() {
    const form = document.getElementById('orderForm');
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (validateForm()) {
            await submitOrder();
        }
    });
    
    addInputValidation();
}

function validateForm() {
    let isValid = true;
    
    const fullName = document.getElementById('fullName').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const address = document.getElementById('address').value.trim();
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked');
    
    if (!fullName) {
        showError('fullNameError', 'Укажите ФИО');
        isValid = false;
    } else {
        clearError('fullNameError');
    }
    
    if (!phone) {
        showError('phoneError', 'Укажите номер телефона');
        isValid = false;
    } else if (!validatePhone(phone)) {
        showError('phoneError', 'Введите корректный номер телефона');
        isValid = false;
    } else {
        clearError('phoneError');
    }
    
    if (!address) {
        showError('addressError', 'Укажите адрес доставки');
        isValid = false;
    } else {
        clearError('addressError');
    }
    
    if (!paymentMethod) {
        showNotification('Выберите способ оплаты', 'error');
        isValid = false;
    }
    
    return isValid;
}

function validatePhone(phone) {
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,15}$/;
    return phoneRegex.test(phone);
}

function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
    }
}

function clearError(elementId) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = '';
    }
}

function addInputValidation() {
    const inputs = ['fullName', 'phone', 'address'];
    inputs.forEach(inputId => {
        const input = document.getElementById(inputId);
        if (input) {
            input.addEventListener('input', () => {
                clearError(`${inputId}Error`);
            });
        }
    });
}

async function submitOrder() {
    const fullName = document.getElementById('fullName').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const address = document.getElementById('address').value.trim();
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked');
    const comment = document.getElementById('comment').value.trim();
    
    const orderData = {
        fullName: fullName,
        phone: phone,
        address: address,
        paymentMethod: paymentMethod ? paymentMethod.value : '',
        comment: comment,
        items: cartData.items,
        total: cartData.subtotal + (cartData.subtotal >= 1500 ? 0 : 150)
    };
    
    try {
        const result = await FoodDeliveryAPI.createOrder(orderData);
        if (result.status === 'success') {
            localStorage.setItem('lastOrder', JSON.stringify(result));
            window.location.href = `confirmation.html?orderId=${result.orderId}`;
        }
    } catch (error) {
        showNotification('Ошибка при оформлении заказа', 'error');
    }
}