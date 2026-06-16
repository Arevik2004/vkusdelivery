import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import https from 'https'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

const unsplashImages: Record<string, string[]> = {
  pizza: [
    'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80',
    'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&q=80',
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80',
    'https://images.unsplash.com/photo-1590947132387-155cc02f3212?w=800&q=80',
  ],
  burger: [
    'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80',
    'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&q=80',
    'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=800&q=80',
    'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=800&q=80',
  ],
  sushi: [
    'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&q=80',
    'https://images.unsplash.com/photo-1553621042-f6e147245754?w=800&q=80',
    'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=800&q=80',
    'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800&q=80',
  ],
  salad: [
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80',
    'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80',
    'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&q=80',
    'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=800&q=80',
  ],
  drink: [
    'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=800&q=80',
    'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=800&q=80',
    'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800&q=80',
    'https://images.unsplash.com/photo-1517959105821-eaf2591984ca?w=800&q=80',
  ],
  dessert: [
    'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800&q=80',
    'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=800&q=80',
    'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&q=80',
  ],
}

const categoryToThemealdb: Record<string, string> = {
  pizza: 'Pasta',
  burger: 'Beef',
  sushi: 'Seafood',
  salad: 'Vegetarian',
  drink: 'Miscellaneous',
  dessert: 'Dessert',
}

async function fetchWithRetry(url: string, retries = 3, delay = 1000): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(15000) })
      if (response.ok) return response
      throw new Error(`HTTP ${response.status}`)
    } catch (err) {
      if (i === retries - 1) throw err
      await new Promise((resolve) => setTimeout(resolve, delay * (i + 1)))
    }
  }
  throw new Error('Failed to fetch')
}

async function fetchThemealdbImages(category: string, count: number): Promise<string[]> {
  const themealdbCategory = categoryToThemealdb[category]
  if (!themealdbCategory) return []

  try {
    const response = await fetchWithRetry(
      `https://www.themealdb.com/api/json/v1/1/filter.php?c=${themealdbCategory}`
    )
    const data = await response.json()
    if (!data.meals) return []

    const shuffled = data.meals.sort(() => Math.random() - 0.5)
    return shuffled.slice(0, count).map((meal: any) => meal.strMealThumb)
  } catch (err) {
    console.warn(`⚠️ Не удалось загрузить фото для ${category} с Themealdb:`, err)
    return []
  }
}

const categories = [
  { name: 'Пицца', slug: 'pizza', icon: '🍕' },
  { name: 'Бургеры', slug: 'burger', icon: '🍔' },
  { name: 'Суши', slug: 'sushi', icon: '🍣' },
  { name: 'Салаты', slug: 'salad', icon: '🥗' },
  { name: 'Напитки', slug: 'drink', icon: '🥤' },
  { name: 'Десерты', slug: 'dessert', icon: '🍰' },
]

// English prompts for AI image generation — must match each product
const productPrompts: Record<string, string> = {
  // Pizza
  margarita: 'professional food photography of margherita pizza with tomato sauce, mozzarella and basil, top view, dark background, appetizing',
  pepperoni: 'professional food photography of pepperoni pizza with spicy salami slices and melted cheese, top view, rustic wooden table',
  hawaiian: 'professional food photography of hawaiian pizza with chicken, pineapple chunks and mozzarella, top view',
  'four-cheese': 'professional food photography of four cheese pizza with melted mozzarella, cheddar, gorgonzola and parmesan, top view',
  meat: 'professional food photography of meat lovers pizza with ham, bacon, pepperoni and beef, top view',
  mexican: 'professional food photography of mexican spicy pizza with jalapeno peppers, chicken and corn, top view',
  calzone: 'professional food photography of calzone folded pizza stuffed with ham and mushrooms, on a plate',
  vegetarian: 'professional food photography of vegetarian pizza with grilled zucchini, eggplant, peppers and tomatoes, top view',
  'bbq-chicken': 'professional food photography of bbq chicken pizza with red onion, cilantro and barbecue sauce, top view',
  seafood: 'professional food photography of seafood pizza with shrimp, mussels and calamari, top view',

  // Burgers
  cheeseburger: 'professional food photography of classic cheeseburger with visible melted cheddar cheese dripping over beef patty, golden cheese slice, sesame bun, side view',
  'double-burger': 'professional food photography of double cheeseburger with two beef patties, double cheese, bacon and vegetables, side view',
  'chicken-burger': 'professional food photography of crispy chicken burger with lettuce, tomato and mayo, side view',
  'spicy-burger': 'professional food photography of spicy burger with jalapeno slices, pepper jack cheese and hot sauce, side view',
  'veggie-burger': 'professional food photography of veggie burger with chickpea patty, avocado, arugula and tomato, side view',
  'egg-burger': 'professional food photography of breakfast burger with fried egg, beef patty, bacon and cheese, side view',
  'bbq-burger': 'professional food photography of bbq burger with onion rings, bacon, cheddar and barbecue sauce, side view',
  'fish-burger': 'professional food photography of fish burger with crispy battered fish fillet, tartar sauce and lettuce, side view',

  // Sushi
  philadelphia: 'professional food photography of philadelphia sushi roll with salmon, cream cheese and avocado, on a wooden board',
  california: 'professional food photography of california sushi roll with crab, avocado, cucumber and tobiko, on a plate',
  unagi: 'professional food photography of unagi sushi roll with grilled eel, cucumber and unagi sauce, on a ceramic plate',
  'classic-set': 'professional food photography of assorted sushi set with nigiri and maki rolls, on a wooden board',
  'gunkan-salmon': 'professional food photography of gunkan sushi with fresh salmon and rice wrapped in nori, on a plate',
  dragon: 'professional food photography of dragon sushi roll with eel, avocado and tobiko on top, on a black plate',
  'spicy-roll': 'professional food photography of spicy salmon sushi roll with spicy sauce and sesame seeds, on a plate',
  'vegan-set': 'professional food photography of vegan sushi rolls with avocado, cucumber and tofu, on a bamboo mat',
  'tempura-roll': 'professional food photography of tempura sushi roll with shrimp tempura and unagi sauce, on a plate',

  // Salads
  'caesar-chicken': 'professional food photography of caesar salad with grilled chicken, romaine lettuce, croutons and parmesan, in a bowl',
  greek: 'professional food photography of greek salad with feta cheese, olives, cucumber, tomato and red onion, in a white bowl',
  'warm-beef-salad': 'professional food photography of warm beef salad with grilled beef slices, mixed greens and teriyaki sauce, in a bowl',
  'tuna-salad': 'professional food photography of tuna salad with boiled egg, fresh vegetables and olives, in a bowl',
  caprese: 'professional food photography of caprese salad with mozzarella, tomato slices, basil and balsamic glaze, on a plate',
  'asian-salad': 'professional food photography of asian shrimp salad with mango, avocado and sesame seeds, in a bowl',
  'tomato-soup': 'professional food photography of creamy tomato soup with basil and croutons, in a bowl',

  // Drinks
  'cola-05': 'professional food photography of cola drink with ice cubes in a glass, dark background',
  'homemade-lemonade': 'professional food photography of fresh lemonade with mint, lemon slices and ice in a glass',
  'orange-fresh': 'professional food photography of freshly squeezed orange juice in a glass with orange slices',
  'mojito-mocktail': 'professional food photography of mojito mocktail with lime, mint and ice in a tall glass',
  milkshake: 'professional food photography of thick vanilla milkshake with whipped cream in a tall glass',
  espresso: 'professional food photography of espresso coffee in a small white cup with golden crema',
  cappuccino: 'professional food photography of cappuccino coffee with milk foam in a white cup',
  'berry-smoothie': 'professional food photography of berry smoothie with strawberries, blueberries and banana in a glass',

  // Desserts
  cheesecake: 'professional food photography of new york cheesecake slice with berry sauce on a plate',
  tiramisu: 'professional food photography of tiramisu dessert with cocoa powder and coffee layers, on a plate',
  'chocolate-fondant': 'professional food photography of chocolate fondant lava cake with molten center, on a plate',
  'ice-cream': 'professional food photography of three scoops of ice cream vanilla chocolate strawberry in a bowl',
  'panna-cotta': 'professional food photography of panna cotta with mango sauce and fresh berries, in a glass',
  'almond-croissant': 'professional food photography of almond croissant with almond cream and powdered sugar, on a plate',
}

const imagesDir = path.join(process.cwd(), 'public', 'images', 'products')

if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true })
}

function getPollinationsImageUrl(slug: string, index: number): string {
  const prompt = productPrompts[slug] || `professional food photography of ${slug.replace(/-/g, ' ')}`
  const encoded = encodeURIComponent(prompt)
  const seed = `${slug}-${index}`.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return `https://image.pollinations.ai/prompt/${encoded}?width=800&height=600&nologo=true&seed=${seed}`
}

function downloadImage(url: string, filePath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(filePath)) {
      resolve()
      return
    }

    const file = fs.createWriteStream(filePath)
    const timeout = setTimeout(() => {
      file.destroy()
      reject(new Error('Download timeout'))
    }, 30000)

    https
      .get(url, { timeout: 30000 }, (response) => {
        if (response.statusCode !== 200) {
          clearTimeout(timeout)
          file.destroy()
          reject(new Error(`Status ${response.statusCode}`))
          return
        }

        response.pipe(file)
        file.on('finish', () => {
          clearTimeout(timeout)
          file.close(() => resolve())
        })
      })
      .on('error', (err) => {
        clearTimeout(timeout)
        file.destroy()
        fs.unlink(filePath, () => {})
        reject(err)
      })
  })
}

async function downloadProductImage(slug: string, index: number): Promise<string | null> {
  const url = getPollinationsImageUrl(slug, index)
  const fileName = `${slug}-${index}.jpg`
  const filePath = path.join(imagesDir, fileName)

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      await downloadImage(url, filePath)
      const stats = fs.statSync(filePath)
      if (stats.size > 5000) {
        return `/images/products/${fileName}`
      }
      throw new Error('File too small')
    } catch (err) {
      console.warn(`⚠️ Попытка ${attempt} не удалась для ${slug}:`, (err as Error).message)
      if (attempt === 3) return null
      await new Promise((resolve) => setTimeout(resolve, 2000 * attempt))
    }
  }
  return null
}

const products = [
  // Pizza
  {
    name: 'Маргарита',
    slug: 'margarita',
    description: 'Классическая итальянская пицца с томатами и моцареллой',
    composition: 'Томатный соус, моцарелла, свежие томаты, базилик, оливковое масло',
    price: 450,
    weight: 450,
    calories: 750,
    protein: 28,
    fat: 22,
    carbs: 98,
    cookingTime: 20,
    category: 'pizza',
    isPopular: true,
    isHit: true,
    isVegan: false,
    allergens: 'молоко, глютен',
  },
  {
    name: 'Пепперони',
    slug: 'pepperoni',
    description: 'Острая пицца с колбасой пепперони и сыром',
    composition: 'Томатный соус, моцарелла, пепперони, орегано',
    price: 590,
    weight: 500,
    calories: 920,
    protein: 38,
    fat: 42,
    carbs: 95,
    cookingTime: 22,
    category: 'pizza',
    isPopular: true,
    isHit: true,
    isSpicy: true,
    allergens: 'молоко, глютен',
  },
  {
    name: 'Гавайская',
    slug: 'hawaiian',
    description: 'Курица, ананасы, моцарелла, томатный соус',
    composition: 'Томатный соус, моцарелла, куриное филе, ананасы',
    price: 550,
    weight: 480,
    calories: 860,
    protein: 35,
    fat: 30,
    carbs: 102,
    cookingTime: 22,
    category: 'pizza',
    allergens: 'молоко, глютен',
  },
  {
    name: 'Четыре сыра',
    slug: 'four-cheese',
    description: 'Дор блю, пармезан, моцарелла, горгонзола',
    composition: 'Сливочный соус, моцарелла, пармезан, дор блю, горгонзола, базилик',
    price: 650,
    weight: 490,
    calories: 980,
    protein: 44,
    fat: 52,
    carbs: 88,
    cookingTime: 23,
    category: 'pizza',
    isPopular: true,
    allergens: 'молоко, глютен',
  },
  {
    name: 'Мясная',
    slug: 'meat',
    description: 'Ветчина, бекон, пепперони, курица, говядина',
    composition: 'Томатный соус, моцарелла, ветчина, бекон, пепперони, курица, говядина',
    price: 720,
    weight: 550,
    calories: 1100,
    protein: 55,
    fat: 48,
    carbs: 96,
    cookingTime: 25,
    category: 'pizza',
    isHit: true,
    allergens: 'молоко, глютен',
  },
  {
    name: 'Мексиканская',
    slug: 'mexican',
    description: 'Острый перец халапеньо, курица, томаты, фасоль',
    composition: 'Томатный соус, моцарелла, курица, халапеньо, томаты, фасоль, кукуруза',
    price: 610,
    weight: 510,
    calories: 890,
    protein: 36,
    fat: 32,
    carbs: 104,
    cookingTime: 24,
    category: 'pizza',
    isSpicy: true,
    allergens: 'молоко, глютен',
  },
  {
    name: 'Кальцоне',
    slug: 'calzone',
    description: 'Закрытая пицца с ветчиной, грибами и сыром',
    composition: 'Тесто, ветчина, шампиньоны, моцарелла, томатный соус',
    price: 580,
    weight: 470,
    calories: 840,
    protein: 34,
    fat: 28,
    carbs: 106,
    cookingTime: 25,
    category: 'pizza',
    allergens: 'молоко, глютен',
  },
  {
    name: 'Вегетарианская',
    slug: 'vegetarian',
    description: 'Сезонные овощи, моцарелла, томатный соус',
    composition: 'Томатный соус, моцарелла, баклажаны, цукини, перец, томаты, грибы',
    price: 520,
    weight: 460,
    calories: 720,
    protein: 24,
    fat: 20,
    carbs: 102,
    cookingTime: 22,
    category: 'pizza',
    isVegan: false,
    allergens: 'молоко, глютен',
  },
  {
    name: 'Барбекю цыпленок',
    slug: 'bbq-chicken',
    description: 'Курица BBQ, красный лук, моцарелла, соус барбекю',
    composition: 'Соус BBQ, моцарелла, куриное филе, красный лук, кинза',
    price: 630,
    weight: 520,
    calories: 940,
    protein: 42,
    fat: 34,
    carbs: 108,
    cookingTime: 23,
    category: 'pizza',
    isPopular: true,
    allergens: 'молоко, глютен',
  },
  {
    name: 'С морепродуктами',
    slug: 'seafood',
    description: 'Креветки, мидии, кальмары, моцарелла, томатный соус',
    composition: 'Томатный соус, моцарелла, креветки, мидии, кальмары, лимон',
    price: 780,
    weight: 500,
    calories: 860,
    protein: 48,
    fat: 26,
    carbs: 98,
    cookingTime: 26,
    category: 'pizza',
    allergens: 'молоко, глютен, моллюски',
  },

  // Burgers
  {
    name: 'Чизбургер',
    slug: 'cheeseburger',
    description: 'Говяжья котлета, сыр чеддер, соленые огурцы, соус BBQ',
    composition: 'Булочка бриошь, говяжья котлета, чеддер, огурцы, лук, соус BBQ',
    price: 390,
    weight: 280,
    calories: 650,
    protein: 32,
    fat: 34,
    carbs: 52,
    cookingTime: 15,
    category: 'burger',
    isPopular: true,
    allergens: 'молоко, глютен, яйцо',
  },
  {
    name: 'Двойной бургер',
    slug: 'double-burger',
    description: 'Две котлеты, двойной сыр, бекон, свежие овощи',
    composition: 'Булочка бриошь, 2 говяжьи котлеты, двойной чеддер, бекон, томаты, салат, соус',
    price: 550,
    weight: 400,
    calories: 1050,
    protein: 58,
    fat: 62,
    carbs: 54,
    cookingTime: 18,
    category: 'burger',
    isHit: true,
    allergens: 'молоко, глютен, яйцо',
  },
  {
    name: 'Чикен бургер',
    slug: 'chicken-burger',
    description: 'Куриная котлета, айсберг, томаты, соус Цезарь',
    composition: 'Булочка бриошь, куриная котлета, айсберг, томаты, соус цезарь, пармезан',
    price: 410,
    weight: 300,
    calories: 620,
    protein: 30,
    fat: 26,
    carbs: 60,
    cookingTime: 15,
    category: 'burger',
    allergens: 'молоко, глютен, яйцо',
  },
  {
    name: 'Острый бургер',
    slug: 'spicy-burger',
    description: 'Котлета с халапеньо, сыр, лук, острый соус',
    composition: 'Булочка бриошь, говяжья котлета, халапеньо, чеддер, красный лук, острый соус',
    price: 430,
    weight: 310,
    calories: 690,
    protein: 33,
    fat: 36,
    carbs: 54,
    cookingTime: 16,
    category: 'burger',
    isSpicy: true,
    allergens: 'молоко, глютен, яйцо',
  },
  {
    name: 'Вегги бургер',
    slug: 'veggie-burger',
    description: 'Котлета из нута, авокадо, рукола, веган соус',
    composition: 'Булочка, котлета из нута, авокадо, рукола, томаты, веган-майонез',
    price: 410,
    weight: 320,
    calories: 540,
    protein: 18,
    fat: 22,
    carbs: 68,
    cookingTime: 15,
    category: 'burger',
    isVegan: true,
    isPopular: true,
    allergens: 'глютен',
  },
  {
    name: 'Бургер с яйцом',
    slug: 'egg-burger',
    description: 'Говяжья котлета, яичница, бекон, сыр гауда',
    composition: 'Булочка бриошь, говяжья котлета, яйцо, бекон, гауда, салат, соус',
    price: 480,
    weight: 340,
    calories: 820,
    protein: 40,
    fat: 48,
    carbs: 52,
    cookingTime: 17,
    category: 'burger',
    allergens: 'молоко, глютен, яйцо',
  },
  {
    name: 'BBQ Бургер',
    slug: 'bbq-burger',
    description: 'Говяжья котлета, луковые кольца, соус BBQ, бекон',
    composition: 'Булочка бриошь, говяжья котлета, луковые кольца, бекон, чеддер, соус BBQ',
    price: 520,
    weight: 360,
    calories: 890,
    protein: 38,
    fat: 50,
    carbs: 64,
    cookingTime: 17,
    category: 'burger',
    isHit: true,
    allergens: 'молоко, глютен, яйцо',
  },
  {
    name: 'Рыбный бургер',
    slug: 'fish-burger',
    description: 'Филе трески в панировке, тартар, салат айсберг',
    composition: 'Булочка бриошь, филе трески, соус тартар, айсберг, лимон',
    price: 450,
    weight: 300,
    calories: 580,
    protein: 26,
    fat: 22,
    carbs: 64,
    cookingTime: 16,
    category: 'burger',
    allergens: 'глютен, рыба, яйцо',
  },

  // Sushi
  {
    name: 'Филадельфия',
    slug: 'philadelphia',
    description: 'Лосось, сливочный сыр, огурец, авокадо',
    composition: 'Рис, нори, лосось, сливочный сыр, огурец, авокадо',
    price: 650,
    weight: 240,
    calories: 420,
    protein: 18,
    fat: 14,
    carbs: 56,
    cookingTime: 18,
    category: 'sushi',
    isPopular: true,
    isHit: true,
    allergens: 'рыба, молоко',
  },
  {
    name: 'Калифорния',
    slug: 'california',
    description: 'Краб, авокадо, огурец, икра тобико',
    composition: 'Рис, нори, краб, авокадо, огурец, икра тобико, кунжут',
    price: 590,
    weight: 230,
    calories: 380,
    protein: 16,
    fat: 12,
    carbs: 54,
    cookingTime: 18,
    category: 'sushi',
    isPopular: true,
    allergens: 'моллюски, рыба, кунжут',
  },
  {
    name: 'Унаги',
    slug: 'unagi',
    description: 'Угорь, огурец, соус унаги, кунжут',
    composition: 'Рис, нори, угорь, огурец, соус унаги, кунжут',
    price: 680,
    weight: 220,
    calories: 360,
    protein: 18,
    fat: 10,
    carbs: 52,
    cookingTime: 18,
    category: 'sushi',
    allergens: 'рыба, кунжут',
  },
  {
    name: "Сет 'Классический'",
    slug: 'classic-set',
    description: 'Филадельфия (6шт) + Калифорния (6шт)',
    composition: 'Филадельфия, Калифорния, имбирь, васаби, соевый соус',
    price: 1190,
    weight: 470,
    calories: 800,
    protein: 34,
    fat: 26,
    carbs: 110,
    cookingTime: 22,
    category: 'sushi',
    isHit: true,
    allergens: 'рыба, молоко, моллюски, кунжут, соя',
  },
  {
    name: 'Гунканы с лососем',
    slug: 'gunkan-salmon',
    description: 'Рис, нори, лосось, сливочный сыр, зеленый лук',
    composition: 'Рис, нори, лосось, сливочный сыр, зеленый лук',
    price: 390,
    weight: 150,
    calories: 240,
    protein: 12,
    fat: 8,
    carbs: 30,
    cookingTime: 15,
    category: 'sushi',
    allergens: 'рыба, молоко',
  },
  {
    name: 'Дракон',
    slug: 'dragon',
    description: 'Угорь, авокадо, икра тобико, соус унаги',
    composition: 'Рис, нори, угорь, авокадо, икра тобико, соус унаги, кунжут',
    price: 720,
    weight: 260,
    calories: 460,
    protein: 20,
    fat: 16,
    carbs: 60,
    cookingTime: 20,
    category: 'sushi',
    isPopular: true,
    allergens: 'рыба, моллюски, кунжут',
  },
  {
    name: 'Спайси ролл',
    slug: 'spicy-roll',
    description: 'Лосось, спайси соус, огурец, кунжут',
    composition: 'Рис, нори, лосось, спайси соус, огурец, кунжут',
    price: 540,
    weight: 210,
    calories: 340,
    protein: 14,
    fat: 10,
    carbs: 48,
    cookingTime: 17,
    category: 'sushi',
    isSpicy: true,
    allergens: 'рыба, кунжут',
  },
  {
    name: 'Веган сет',
    slug: 'vegan-set',
    description: 'Овощные роллы с авокадо, огурцом и тофу',
    composition: 'Рис, нори, авокадо, огурец, тофу, кунжут, васаби',
    price: 560,
    weight: 320,
    calories: 420,
    protein: 14,
    fat: 12,
    carbs: 68,
    cookingTime: 18,
    category: 'sushi',
    isVegan: true,
    allergens: 'кунжут, соя',
  },
  {
    name: 'Темпура ролл',
    slug: 'tempura-roll',
    description: 'Жареный ролл с креветкой и сливочным сыром',
    composition: 'Рис, нори, креветка, сливочный сыр, темпура, соус унаги, кунжут',
    price: 610,
    weight: 250,
    calories: 480,
    protein: 20,
    fat: 18,
    carbs: 62,
    cookingTime: 20,
    category: 'sushi',
    allergens: 'моллюски, молоко, кунжут',
  },

  // Salads
  {
    name: 'Цезарь с курицей',
    slug: 'caesar-chicken',
    description: 'Курица гриль, салат романо, сухарики, пармезан, соус',
    composition: 'Куриное филе, салат романо, сухарики, пармезан, соус цезарь, томаты',
    price: 420,
    weight: 280,
    calories: 380,
    protein: 28,
    fat: 22,
    carbs: 18,
    cookingTime: 12,
    category: 'salad',
    isPopular: true,
    allergens: 'молоко, глютен, яйцо',
  },
  {
    name: 'Греческий',
    slug: 'greek',
    description: 'Фета, маслины, огурец, томаты, перец, оливковое масло',
    composition: 'Фета, маслины, огурец, томаты, красный лук, перец, оливковое масло, орегано',
    price: 390,
    weight: 270,
    calories: 320,
    protein: 14,
    fat: 24,
    carbs: 14,
    cookingTime: 10,
    category: 'salad',
    allergens: 'молоко',
  },
  {
    name: 'Теплый салат с говядиной',
    slug: 'warm-beef-salad',
    description: 'Говядина, микрозелень, соус терияки, орехи',
    composition: 'Говядина гриль, микс салатов, соус терияки, грецкие орехи, томаты черри',
    price: 550,
    weight: 310,
    calories: 420,
    protein: 34,
    fat: 22,
    carbs: 16,
    cookingTime: 15,
    category: 'salad',
    allergens: 'орехи, соя',
  },
  {
    name: 'Салат с тунцом',
    slug: 'tuna-salad',
    description: 'Тунец, яйцо, свежие овощи, оливковое масло',
    composition: 'Тунец, яйцо, салат айсберг, огурец, томаты, маслины, оливковое масло',
    price: 480,
    weight: 290,
    calories: 360,
    protein: 30,
    fat: 18,
    carbs: 12,
    cookingTime: 12,
    category: 'salad',
    allergens: 'рыба, яйцо',
  },
  {
    name: 'Капрезе',
    slug: 'caprese',
    description: 'Моцарелла, томаты, базилик, бальзамический соус',
    composition: 'Моцарелла буффало, томаты, базилик, бальзамический крем, оливковое масло',
    price: 410,
    weight: 250,
    calories: 340,
    protein: 18,
    fat: 26,
    carbs: 10,
    cookingTime: 10,
    category: 'salad',
    isGlutenFree: true,
    allergens: 'молоко',
  },
  {
    name: 'Азиатский салат',
    slug: 'asian-salad',
    description: 'Креветки, манго, авокадо, кунжутный соус',
    composition: 'Креветки, манго, авокадо, огурец, кунжут, соус чили-майо',
    price: 520,
    weight: 280,
    calories: 340,
    protein: 22,
    fat: 16,
    carbs: 28,
    cookingTime: 13,
    category: 'salad',
    allergens: 'моллюски, кунжут, яйцо',
  },

  // Drinks
  {
    name: 'Кола 0.5л',
    slug: 'cola-05',
    description: 'Классическая газировка',
    composition: 'Кола',
    price: 120,
    weight: 500,
    calories: 210,
    protein: 0,
    fat: 0,
    carbs: 53,
    cookingTime: 0,
    category: 'drink',
    allergens: '',
  },
  {
    name: 'Лимонад домашний 0.5л',
    slug: 'homemade-lemonade',
    description: 'Свежий лимонад с мятой и лимоном',
    composition: 'Вода, лимон, мята, сахарный сироп',
    price: 180,
    weight: 500,
    calories: 120,
    protein: 0,
    fat: 0,
    carbs: 30,
    cookingTime: 0,
    category: 'drink',
    isPopular: true,
    allergens: '',
  },
  {
    name: 'Апельсиновый фреш',
    slug: 'orange-fresh',
    description: 'Свежевыжатый апельсиновый сок',
    composition: 'Апельсины',
    price: 220,
    weight: 300,
    calories: 140,
    protein: 2,
    fat: 0,
    carbs: 32,
    cookingTime: 0,
    category: 'drink',
    allergens: '',
  },
  {
    name: 'Мохито безалкогольный',
    slug: 'mojito-mocktail',
    description: 'Мята, лайм, содовая, тростниковый сахар',
    composition: 'Мята, лайм, содовая, тростниковый сахар, лед',
    price: 200,
    weight: 400,
    calories: 90,
    protein: 0,
    fat: 0,
    carbs: 22,
    cookingTime: 0,
    category: 'drink',
    isPopular: true,
    allergens: '',
  },
  {
    name: 'Молочный коктейль',
    slug: 'milkshake',
    description: 'Густой молочный коктейль с ванилью',
    composition: 'Молоко, мороженое, ванильный сироп, взбитые сливки',
    price: 250,
    weight: 350,
    calories: 380,
    protein: 10,
    fat: 18,
    carbs: 46,
    cookingTime: 0,
    category: 'drink',
    allergens: 'молоко',
  },
  {
    name: 'Эспрессо',
    slug: 'espresso',
    description: 'Крепкий черный кофе',
    composition: 'Кофе, вода',
    price: 130,
    weight: 50,
    calories: 5,
    protein: 0,
    fat: 0,
    carbs: 1,
    cookingTime: 0,
    category: 'drink',
    allergens: '',
  },
  {
    name: 'Капучино',
    slug: 'cappuccino',
    description: 'Эспрессо с молочной пенкой',
    composition: 'Кофе, молоко',
    price: 180,
    weight: 250,
    calories: 120,
    protein: 6,
    fat: 6,
    carbs: 10,
    cookingTime: 0,
    category: 'drink',
    allergens: 'молоко',
  },

  // Desserts
  {
    name: 'Чизкейк Нью-Йорк',
    slug: 'cheesecake',
    description: 'Классический чизкейк с ягодным соусом',
    composition: 'Сливочный сыр, яйца, сахар, сливки, ягодный соус',
    price: 290,
    weight: 150,
    calories: 380,
    protein: 8,
    fat: 22,
    carbs: 38,
    cookingTime: 0,
    category: 'dessert',
    isPopular: true,
    allergens: 'молоко, яйцо, глютен',
  },
  {
    name: 'Тирамису',
    slug: 'tiramisu',
    description: 'Итальянский десерт с маскарпоне и кофе',
    composition: 'Маскарпоне, печенье савоярди, кофе, какао, яйца',
    price: 320,
    weight: 160,
    calories: 360,
    protein: 8,
    fat: 20,
    carbs: 36,
    cookingTime: 0,
    category: 'dessert',
    allergens: 'молоко, яйцо, глютен',
  },
  {
    name: 'Шоколадный фондан',
    slug: 'chocolate-fondant',
    description: 'Теплый шоколадный кекс с жидкой сердцевиной',
    composition: 'Темный шоколад, масло, яйца, мука, сахар, ванильное мороженое',
    price: 340,
    weight: 180,
    calories: 480,
    protein: 8,
    fat: 28,
    carbs: 50,
    cookingTime: 12,
    category: 'dessert',
    isHit: true,
    allergens: 'молоко, яйцо, глютен',
  },
  {
    name: 'Мороженое 3 шарика',
    slug: 'ice-cream',
    description: 'Ассорти из трех видов мороженого',
    composition: 'Ванильное, шоколадное, клубничное мороженое',
    price: 220,
    weight: 180,
    calories: 260,
    protein: 6,
    fat: 14,
    carbs: 28,
    cookingTime: 0,
    category: 'dessert',
    allergens: 'молоко',
  },
  {
    name: 'Панна-котта',
    slug: 'panna-cotta',
    description: 'Нежный сливочный десерт с манговым соусом',
    composition: 'Сливки, молоко, сахар, ваниль, желатин, манговый соус',
    price: 270,
    weight: 140,
    calories: 290,
    protein: 6,
    fat: 18,
    carbs: 26,
    cookingTime: 0,
    category: 'dessert',
    allergens: 'молоко',
  },
  {
    name: 'Круассан с миндалем',
    slug: 'almond-croissant',
    description: 'Слоеный круассан с миндальным кремом',
    composition: 'Слоеное тесто, миндальный крем, миндальные лепестки, сахарная пудра',
    price: 240,
    weight: 120,
    calories: 420,
    protein: 8,
    fat: 24,
    carbs: 42,
    cookingTime: 0,
    category: 'dessert',
    isNew: true,
    allergens: 'орехи, молоко, глютен, яйцо',
  },
  {
    name: 'Смузи ягодный',
    slug: 'berry-smoothie',
    description: 'Густой ягодный смузи с бананом',
    composition: 'Клубника, черника, банан, йогурт, мед',
    price: 260,
    weight: 350,
    calories: 180,
    protein: 6,
    fat: 2,
    carbs: 36,
    cookingTime: 0,
    category: 'drink',
    isPopular: true,
    allergens: 'молоко',
  },
  {
    name: 'Томатный суп',
    slug: 'tomato-soup',
    description: 'Крем-суп из томатов с базиликом',
    composition: 'Томаты, сливки, базилик, чеснок, гренки',
    price: 290,
    weight: 300,
    calories: 240,
    protein: 6,
    fat: 14,
    carbs: 22,
    cookingTime: 15,
    category: 'salad',
    isVegan: false,
    allergens: 'молоко, глютен',
  },
]

async function main() {
  console.log('🌱 Начинаем заполнение базы данных...')

  // Clean database
  await prisma.review.deleteMany()
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.cartItem.deleteMany()
  await prisma.cart.deleteMany()
  await prisma.productImage.deleteMany()
  await prisma.productModifier.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()
  await prisma.address.deleteMany()
  await prisma.user.deleteMany()
  await prisma.promoCode.deleteMany()

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12)
  const admin = await prisma.user.create({
    data: {
      email: 'admin@vkusdelivery.ru',
      password: adminPassword,
      name: 'Администратор',
      role: 'ADMIN',
    },
  })
  console.log('✅ Создан админ:', admin.email)

  // Create test user
  const userPassword = await bcrypt.hash('user123', 12)
  const user = await prisma.user.create({
    data: {
      email: 'user@vkusdelivery.ru',
      password: userPassword,
      name: 'Иван Петров',
      phone: '+7 (999) 123-45-67',
      role: 'USER',
    },
  })
  console.log('✅ Создан пользователь:', user.email)

  // Create categories
  const categoryMap: Record<string, string> = {}
  for (const cat of categories) {
    const created = await prisma.category.create({
      data: {
        name: cat.name,
        slug: cat.slug,
        icon: cat.icon,
        image: unsplashImages[cat.slug]?.[0] || '',
        sortOrder: categories.indexOf(cat),
      },
    })
    categoryMap[cat.slug] = created.id
    console.log('✅ Создана категория:', cat.name)
  }

  // Create products with AI-generated matching images
  console.log('🖼️ Генерируем и скачиваем фото блюд с помощью AI...')
  console.log('⏳ Это может занять несколько минут...')
  let productCount = 0

  for (const product of products) {
    const categoryId = categoryMap[product.category]
    if (!categoryId) continue

    const localImages: string[] = []
    for (let i = 0; i < 1; i++) {
      const localPath = await downloadProductImage(product.slug, i)
      if (localPath) {
        localImages.push(localPath)
      }
      // Delay to avoid Pollinations rate limiting
      await new Promise((resolve) => setTimeout(resolve, 4000))
    }

    // Fallback to placeholder if no images downloaded
    const images = localImages.length > 0
      ? localImages
      : [`/images/placeholders/${product.category}.svg`]


    const created = await prisma.product.create({
      data: {
        categoryId,
        name: product.name,
        slug: product.slug,
        description: product.description,
        composition: product.composition,
        price: product.price,
        weight: product.weight,
        calories: product.calories,
        protein: product.protein,
        fat: product.fat,
        carbs: product.carbs,
        cookingTime: product.cookingTime,
        isPopular: product.isPopular || false,
        isHit: product.isHit || false,
        isNew: Math.random() > 0.85,
        isVegan: product.isVegan || false,
        isSpicy: product.isSpicy || false,
        isGlutenFree: product.isGlutenFree || false,
        allergens: product.allergens || null,
        images: {
          create: images.map((url, idx) => ({
            url,
            altText: product.name,
            isMain: idx === 0,
            sortOrder: idx,
          })),
        },
        modifiers: {
          create: [
            {
              type: 'ADDON',
              name: 'Дополнительный соус',
              price: 49,
            },
            {
              type: 'ADDON',
              name: 'Больше начинки',
              price: 99,
            },
          ],
        },
      },
    })
    productCount++
    console.log('✅ Создан продукт:', created.name)
  }

  // Create promo codes
  await prisma.promoCode.create({
    data: {
      code: 'WELCOME20',
      type: 'PERCENT',
      value: 20,
      minOrderAmount: 800,
      maxDiscount: 500,
      validFrom: new Date('2026-01-01'),
      validUntil: new Date('2026-12-31'),
      usageLimit: 1000,
    },
  })
  await prisma.promoCode.create({
    data: {
      code: 'FREE_DELIVERY',
      type: 'FREE_DELIVERY',
      value: 0,
      minOrderAmount: 1500,
      validFrom: new Date('2026-01-01'),
      validUntil: new Date('2026-12-31'),
    },
  })
  console.log('✅ Созданы промокоды')

  // Create sample order
  const productsList = await prisma.product.findMany({ take: 3 })
  const order = await prisma.order.create({
    data: {
      userId: user.id,
      status: 'DELIVERED',
      totalAmount: productsList.reduce((sum, p) => sum + p.price, 0),
      deliveryFee: 0,
      discount: 0,
      finalAmount: productsList.reduce((sum, p) => sum + p.price, 0),
      deliveryAddress: 'ул. Ленина, д. 10, кв. 5',
      deliveryTime: 'Как можно скорее',
      paymentMethod: 'CASH',
      paymentStatus: 'PAID',
      items: {
        create: productsList.map((p) => ({
          productId: p.id,
          quantity: 1,
          price: p.price,
        })),
      },
    },
  })
  console.log('✅ Создан тестовый заказ:', order.id)

  console.log(`\n🎉 База данных заполнена! Создано ${productCount} блюд.`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
