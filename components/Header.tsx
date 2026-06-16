'use client'

import Link from 'next/link'
import { ShoppingCart, User, Menu, X, Search } from 'lucide-react'
import { useState } from 'react'
import { useCartStore } from '@/store/cartStore'

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const totalItems = useCartStore((state) => state.getTotalItems())

  const navLinks = [
    { href: '/', label: 'Главная' },
    { href: '/catalog', label: 'Меню' },
    { href: '/cart', label: 'Корзина' },
    { href: '/profile', label: 'Профиль' },
  ]

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container-app">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🍕</span>
            <span className="text-xl font-bold text-text">
              Вкус<span className="text-primary">Delivery</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-muted hover:text-primary transition-colors font-medium"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <Link
              href="/catalog"
              className="p-2 text-muted hover:text-primary transition-colors md:hidden"
            >
              <Search size={22} />
            </Link>
            <Link
              href="/cart"
              className="relative p-2 text-muted hover:text-primary transition-colors"
            >
              <ShoppingCart size={22} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-secondary text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
            <Link
              href="/profile"
              className="hidden md:flex p-2 text-muted hover:text-primary transition-colors"
            >
              <User size={22} />
            </Link>
            <button
              className="md:hidden p-2 text-muted"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-white">
          <nav className="container-app py-4 flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-muted hover:text-primary py-2 font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}
