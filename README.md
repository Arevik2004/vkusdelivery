# 🍕 ВкусDelivery

[![Site](https://img.shields.io/badge/🌐_Сайт-vkusnodelivery.ru-22c55e?style=for-the-badge)](https://vkusnodelivery.ru)
[![Status](https://img.shields.io/badge/✅_Статус-в_работе-22c55e?style=for-the-badge)](https://vkusnodelivery.ru)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind](https://img.shields.io/badge/Tailwind_CSS-3.4-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

> **Курсовая работа**  
> *Тема: Разработка веб-приложения для заказа еды*

**🚀 Сайт доступен по адресу:** [https://vkusnodelivery.ru](https://vkusnodelivery.ru)

Современное full-stack веб-приложение для доставки еды с каталогом блюд, корзиной, оформлением заказа, личным кабинетом и админ-панелью. Все фотографии блюд сгенерированы искусственным интеллектом и соответствуют описаниям.

---

## ✨ Возможности

### 👤 Клиентская часть
- 🏠 Главная страница с категориями и популярными блюдами
- 📋 Каталог с фильтрами по категории, цене, особенностям (веган, острое, без глютена)
- 🔍 Поиск блюд
- 📊 Сортировка по цене, рейтингу, популярности, времени приготовления
- 🍽️ Карточка товара с фото, КБЖУ, составом, аллергенами
- 🛒 Корзина с промокодами
- 📦 Оформление заказа с адресом, временем доставки и способом оплаты
- 👤 Профиль пользователя с историей заказов
- 📱 Адаптивный дизайн (mobile-first)

---

## 🛠 Технологический стек

| Категория | Технологии |
|-----------|------------|
| **Frontend + Backend** | Next.js 14 (App Router), TypeScript |
| **Стили** | Tailwind CSS |
| **База данных** | SQLite (Prisma ORM) |
| **Аутентификация** | JWT-токены (jose) |
| **State management** | Zustand |

---

## 📁 Структура проекта

```
.
├── app/                    # Страницы и API routes (Next.js App Router)
│   ├── api/               # REST API endpoints
│   ├── admin/             # Админ-панель
│   ├── cart/              # Корзина
│   ├── catalog/           # Каталог блюд
│   ├── checkout/          # Оформление заказа
│   ├── product/[slug]/    # Страница товара
│   ├── profile/           # Профиль пользователя
│   ├── about/             # О нас
│   ├── delivery/          # Доставка
│   └── page.tsx           # Главная страница
├── components/            # React-компоненты
├── lib/                   # Утилиты (Prisma, auth)
├── prisma/                # Схема БД и seed-данные
│   ├── schema.prisma
│   └── seed.ts
├── store/                 # Zustand store (корзина)
├── types/                 # TypeScript типы
├── public/                # Статические файлы и фото блюд
└── _legacy/               # Старая версия сайта
```

---

## 🍱 Меню

В проекте **48 блюд** в 6 категориях:
- 🍕 10 пицц
- 🍔 9 бургеров
- 🍣 9 суши и роллов
- 🥗 6 салатов
- 🥤 8 напитков
- 🍰 6 десертов

---
📄 Документация
Пояснительная записка, отзыв и другие документы находятся в папке docs/.
---

## 🎁 Промокоды

| Промокод | Описание | Условия |
|----------|----------|---------|
| `WELCOME20` | Скидка 20% | Макс. 500 ₽, от 800 ₽ |
| `FREE_DELIVERY` | Бесплатная доставка | От 1500 ₽ |

---

## 🚚 Доставка

- **Бесплатно** — при заказе от 1500 ₽
- **199 ₽** — при заказе менее 1500 ₽

---

*2026 © ВкусDelivery*
