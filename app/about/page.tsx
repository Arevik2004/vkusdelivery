import { Truck, ChefHat, Award, HeartHandshake, MapPin, Clock, ShieldCheck, Phone } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="py-12 lg:py-16">
      <div className="container-app max-w-4xl">
        <h1 className="text-3xl lg:text-4xl font-bold mb-6">О нас</h1>

        <div className="card p-8 mb-8">
          <p className="text-lg text-muted leading-relaxed mb-6">
            <strong>ВкусDelivery</strong> — это современный сервис доставки еды, который объединяет любовь к 
            вкусной кухне и заботу о каждом клиенте. Мы начали свой путь с небольшой кухни и большой мечты: 
            сделать так, чтобы качественная еда была доступна каждому — быстро, удобно и по честной цене.
          </p>
          <p className="text-muted leading-relaxed mb-6">
            Сегодня ВкусDelivery — это команда профессиональных поваров, операторов и курьеров, которые 
            ежедневно готовят и доставляют сотни заказов. В нашем меню — пицца на тонком тесте, сочные 
            бургеры, свежие суши и роллы, лёгкие салаты, домашние напитки и аппетитные десерты.
          </p>
          <p className="text-muted leading-relaxed">
            Мы используем только свежие ингредиенты, контролируем качество на каждом этапе приготовления 
            и тщательно упаковываем заказы, чтобы еда доехала до вас горячей и красивой.
          </p>
        </div>

        <h2 className="text-2xl font-bold mb-6">Наши преимущества</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          {[
            { icon: ChefHat, title: 'Свежие ингредиенты', text: 'Закупаем продукты ежедневно у проверенных поставщиков' },
            { icon: Clock, title: 'Быстрая доставка', text: 'Среднее время доставки — 30–60 минут' },
            { icon: MapPin, title: 'Удобное оформление', text: 'Выбирайте адрес на карте или вводите вручную' },
            { icon: ShieldCheck, title: 'Контроль качества', text: 'Проверяем каждый заказ перед отправкой' },
            { icon: Truck, title: 'Собственные курьеры', text: 'Наши курьеры знают город и ценят ваше время' },
            { icon: HeartHandshake, title: 'Забота о клиентах', text: 'Работаем с 10:00 до 23:00 без выходных' },
          ].map((item) => (
            <div key={item.title} className="card p-6">
              <item.icon className="w-10 h-10 text-primary mb-4" />
              <h3 className="font-bold text-lg mb-2">{item.title}</h3>
              <p className="text-muted text-sm">{item.text}</p>
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-bold mb-6">Почему выбирают нас</h2>
        <div className="card p-8 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            {[
              { number: '50+', label: 'блюд в меню' },
              { number: '30 мин', label: 'среднее время доставки' },
              { number: '4.9', label: 'средний рейтинг' },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl font-bold text-primary mb-1">{stat.number}</div>
                <div className="text-muted text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Award className="text-primary" />
            Наша миссия
          </h2>
          <p className="text-muted leading-relaxed">
            Мы верим, что хорошая еда — это не только вкус, но и эмоции. Каждый заказ для нас — это 
            возможность сделать ваш день чуточку лучше: будь то семейный ужин, обед в офис или поздний 
            перекус после учёбы. Мы не просто доставляем еду — мы доставляем удовольствие.
          </p>
        </div>
      </div>
    </div>
  )
}
