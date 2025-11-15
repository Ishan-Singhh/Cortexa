'use client'

import { useState } from 'react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { useClerk, useUser, UserButton } from '@clerk/clerk-react'
import { Link, useLocation } from 'react-router-dom'

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Upload MRI Scan', href: '/upload' },
  { name: 'History', href: '/history' },
  { name: 'About', href: '/about' },
]

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user } = useUser()
  const { openSignIn } = useClerk()
  const location = useLocation()

  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <nav
        aria-label="Global"
        className="flex items-center justify-between p-3 lg:px-8"
      >
        {/* Logo */}
        <div className="flex lg:flex-1">
          <Link to="/" className="-m-1.5 p-1.5 flex items-center space-x-2">
            <img
              alt="Cortexa Logo"
              src="/src/assets/Cortexa_Logo.png"
              className="h-12 w-auto lg:h-18 "
            />
          </Link>
        </div>

        {/* Mobile Toggle Button */}
        <div className="flex lg:hidden">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md p-2.5 text-white hover:bg-white/10"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="sr-only">Open main menu</span>
            {mobileMenuOpen ? (
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>

        <div className="hidden lg:flex lg:gap-x-12">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`text-sm font-semibold transition-colors ${
                location.pathname === item.href
                  ? 'text-violet-400'
                  : 'text-white hover:text-violet-400'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Desktop Auth */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          {user ? (
            <UserButton />
          ) : (
            <button
              onClick={() => openSignIn()}
              className="text-sm font-semibold text-white hover:text-violet-400"
            >
              Log in <span aria-hidden="true">&rarr;</span>
            </button>
          )}
        </div>
      </nav>

      {/* --- Mobile Dropdown Menu --- */}
      {mobileMenuOpen && (
        <div className="lg:hidden w-full bg-gray-900 border-t border-white/10 px-6 py-4 animate-slideDown">
          <div className="flex flex-col space-y-3">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block rounded-lg px-3 py-2 text-base font-semibold transition-colors ${
                  location.pathname === item.href
                    ? 'text-violet-400 bg-white/5'
                    : 'text-white hover:text-violet-400 hover:bg-white/5'
                }`}
              >
                {item.name}
              </Link>
            ))}

            <div className="pt-4 border-t border-white/10">
              {user ? (
                <UserButton />
              ) : (
                <button
                  onClick={() => {
                    openSignIn()
                    setMobileMenuOpen(false)
                  }}
                  className="block w-full text-left rounded-lg px-3 py-2 text-base font-semibold text-white hover:text-violet-400 hover:bg-white/5"
                >
                  Log in →
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
