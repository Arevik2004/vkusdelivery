document.addEventListener('DOMContentLoaded', () => {
    loadOrderConfirmation();
});

function loadOrderConfirmation() {
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('orderId');
    
    if (orderId) {
        document.getElementById('orderNumber').textContent = orderId;
        document.getElementById('orderStatus').textContent = 'Подтвержден';
    } else {
        const lastOrder = localStorage.getItem('lastOrder');
        if (lastOrder) {
            const order = JSON.parse(lastOrder);
            document.getElementById('orderNumber').textContent = order.orderId;
            document.getElementById('orderStatus').textContent = 'Подтвержден';
            localStorage.removeItem('lastOrder');
        } else {
            // Перенаправление на главную, если нет информации о заказе
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 3000);
        }
    }
    
    // Очищаем корзину
    FoodDeliveryAPI.updateCartCount();
}