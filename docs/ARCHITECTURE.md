# Архитектура ВкусDelivery

## Общая схема

Приложение построено по принципу **Full-Stack в одном проекте** с использованием Next.js 14 App Router.

```
┌─────────────────┐
│   Пользователь  │
└────────┬────────┘
         │ HTTPS
         ▼
┌─────────────────┐
│   Next.js 14    │  ← React компоненты + API Routes
│   (Frontend)    │
└────────┬────────┘
         │ Prisma Client
         ▼
┌─────────────────┐
│   SQLite DB     │  ← Файловая база данных
└─────────────────┘
```

## Слои приложения

### 1. Presentation Layer (`app/`, `components/`)
- Страницы на React + TypeScript
- Tailwind CSS для стилизации
- Server Components для статичных данных
- Client Components для интерактива (корзина, фильтры, формы)

### 2. API Layer (`app/api/`)
- REST API endpoints
- JWT-аутентификация через httpOnly cookies
- Валидация входных данных

### 3. Data Layer (`lib/`, `prisma/`)
- Prisma ORM для работы с БД
- SQLite для разработки
- Seed-скрипт для заполнения тестовыми данными

### 4. State Management (`store/`)
- Zustand для управления корзиной
- Persist middleware для сохранения в localStorage

## База данных

### Основные сущности
- **User** — пользователи (роли: USER, ADMIN, COURIER)
- **Category** — категории блюд
- **Product** — блюда с КБЖУ, аллергенами, бейджами
- **ProductImage** — фотографии блюд
- **ProductModifier** — модификаторы (добавки, соусы)
- **Cart / CartItem** — корзина
- **Order / OrderItem** — заказы
- **PromoCode** — промокоды
- **Review** — отзывы

## Безопасность

- Пароли хешируются bcrypt (12 раундов)
- JWT-токены в httpOnly cookies
- Защита API роутов через verifyToken
- Проверка роли ADMIN для админских эндпоинтов
