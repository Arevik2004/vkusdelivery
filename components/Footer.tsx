import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-white border-t mt-12">
      <div className="container-app py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🍕</span>
              <span className="text-lg font-bold text-text">
                Вкус<span className="text-primary">Delivery</span>
              </span>
            </Link>
            <p className="text-sm text-muted">
              Быстрая доставка вкусной еды. Пицца, бургеры, суши, салаты и многое другое.
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-4">Меню</h4>
            <ul className="space-y-2 text-sm text-muted">
              <li><Link href="/catalog?category=pizza" className="hover:text-primary">Пицца</Link></li>
              <li><Link href="/catalog?category=burger" className="hover:text-primary">Бургеры</Link></li>
              <li><Link href="/catalog?category=sushi" className="hover:text-primary">Суши</Link></li>
              <li><Link href="/catalog?category=salad" className="hover:text-primary">Салаты</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Помощь</h4>
            <ul className="space-y-2 text-sm text-muted">
              <li><Link href="/about" className="hover:text-primary">О нас</Link></li>
              <li><Link href="/delivery" className="hover:text-primary">Доставка</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Контакты</h4>
            <ul className="space-y-2 text-sm text-muted">
              <li>📞 8 (800) 555-35-35</li>
              <li>✉️ info@vkusdelivery.ru</li>
              <li>🕒 Ежедневно 10:00–23:00</li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-6 text-center text-sm text-muted">
          © 2026 ВкусDelivery. Все права защищены.
        </div>
      </div>
    </footer>
  )
}
