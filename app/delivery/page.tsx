import { Truck, Clock, MapPin, Wallet, Package, AlertCircle, CheckCircle2 } from 'lucide-react'

export default function DeliveryPage() {
  return (
    <div className="py-12 lg:py-16">
      <div className="container-app max-w-4xl">
        <h1 className="text-3xl lg:text-4xl font-bold mb-6">Доставка</h1>

        <div className="card p-8 mb-8">
          <p className="text-lg text-muted leading-relaxed">
            ВкусDelivery доставляет ваши любимые блюда быстро и с заботой. Мы работаем ежедневно 
            с <strong>10:00 до 23:00</strong> и доставляем заказы по всему городу.
          </p>
        </div>

        <h2 className="text-2xl font-bold mb-6">Условия доставки</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          {[
            { icon: Truck, title: 'Стоимость доставки', text: '199 ₽. Бесплатно при заказе от 1500 ₽' },
            { icon: Clock, title: 'Время доставки', text: 'В среднем 30–60 минут с момента подтверждения' },
            { icon: MapPin, title: 'Зона доставки', text: 'Доставляем по всему городу и ближайшим районам' },
            { icon: Wallet, title: 'Способы оплаты', text: 'Наличные, карта при получении, онлайн-оплата' },
          ].map((item) => (
            <div key={item.title} className="card p-6">
              <item.icon className="w-10 h-10 text-primary mb-4" />
              <h3 className="font-bold text-lg mb-2">{item.title}</h3>
              <p className="text-muted text-sm">{item.text}</p>
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-bold mb-6">Как оформить доставку</h2>
        <div className="card p-8 mb-8">
          <div className="space-y-6">
            {[
              { step: '1', title: 'Выберите блюда', text: 'Добавьте понравившиеся позиции в корзину' },
              { step: '2', title: 'Укажите адрес', text: 'Введите адрес доставки или выберите на карте' },
              { step: '3', title: 'Выберите время', text: 'Как можно скорее или к конкретному времени' },
              { step: '4', title: 'Подтвердите заказ', text: 'Выберите способ оплаты и оформите заказ' },
            ].map((item) => (
              <div key={item.step} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold flex-shrink-0">
                  {item.step}
                </div>
                <div>
                  <h3 className="font-bold text-lg">{item.title}</h3>
                  <p className="text-muted text-sm">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-6">Важно знать</h2>
        <div className="card p-8 mb-8">
          <div className="space-y-4">
            {[
              'Время доставки может увеличиваться в часы пик и при непогоде',
              'Заказы принимаются ежедневно с 10:00 до 22:30',
              'Курьер свяжется с вами перед доставкой',
              'Если блюдо пришло в ненадлежащем виде — сообщите нам, мы заменим его',
            ].map((text) => (
              <div key={text} className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <p className="text-muted">{text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6 bg-amber-50 border border-amber-100">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0" />
            <div>
              <h3 className="font-bold text-amber-800 mb-1">Бесплатная доставка</h3>
              <p className="text-amber-700 text-sm">
                При заказе от 1500 ₽ доставка бесплатно. Активируйте промокод FREE_DELIVERY 
                и получите бесплатную доставку даже на небольшие заказы.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
