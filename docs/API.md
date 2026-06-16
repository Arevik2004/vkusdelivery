# API Documentation

## Auth

### POST /api/auth/register
Регистрация нового пользователя.

**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "Иван",
  "phone": "+79991234567"
}
```

### POST /api/auth/login
Вход в систему.

**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### POST /api/auth/logout
Выход из системы.

## Users

### GET /api/users/profile
Получение профиля текущего пользователя. Требует авторизации.

## Products

### GET /api/products
Список блюд.

**Query params:**
- `category` — slug категории
- `search` — поиск по названию/описанию
- `minPrice`, `maxPrice` — ценовой диапазон
- `sortBy` — `name`, `price_asc`, `price_desc`, `rating`, `popular`, `cookingTime`
- `isVegan`, `isSpicy`, `isGlutenFree` — фильтры (true/false)

### GET /api/products/:slug
Детали блюда + похожие товары.

## Categories

### GET /api/categories
Список активных категорий.

## Orders

### GET /api/orders
История заказов текущего пользователя. Требует авторизации.

### POST /api/orders
Создание заказа. Требует авторизации.

**Body:**
```json
{
  "items": [
    {
      "productId": "uuid",
      "quantity": 2,
      "price": 450,
      "modifiers": "[]"
    }
  ],
  "deliveryAddress": "ул. Ленина, д. 10",
  "deliveryTime": "Как можно скорее",
  "paymentMethod": "CASH",
  "comment": "",
  "promoCode": "WELCOME20"
}
```

## Admin

### PATCH /api/admin/products/:id
Обновление блюда. Требует роль ADMIN.

**Body:**
```json
{
  "isActive": false,
  "price": 500
}
```
