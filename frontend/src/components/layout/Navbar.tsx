'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, User, LogOut, Home, Building, Phone } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/', label: 'Accueil', icon: Home },
    { href: '/properties', label: 'Nos Biens', icon: Building },
    { href: '/contact', label: 'Contact', icon: Phone },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-dark-950/75 backdrop-blur-xl shadow-lg shadow-black/30'
          : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="group flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg shadow-gold-500/25 transition-transform duration-300 group-hover:scale-105 ring-1 ring-gold-500/30">
              <Image
                src="/logo-villa-style.jpeg"
                alt="Idriss Villa Style"
                width={40}
                height={40}
                className="w-full h-full object-cover"
                priority
              />
            </div>
            <div className="hidden sm:block">
              <span className="text-xl font-serif font-semibold tracking-wide text-white">
                Idriss <span className="text-gold-500">Villa</span>
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1 surface-panel rounded-2xl p-1.5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200',
                  isActive(link.href)
                    ? 'text-gold-400 bg-gold-500/12 shadow-inner'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                {user?.role === 'ADMIN' && (
                  <Link
                    href="/admin"
                    className="px-4 py-2 text-sm font-medium text-gold-500 hover:text-gold-400 transition-colors"
                  >
                    Admin
                  </Link>
                )}
                <div className="flex items-center space-x-2 px-4 py-2 bg-dark-800 rounded-lg">
                  <User className="w-4 h-4 text-gold-500" />
                  <span className="text-sm text-white">{user?.name}</span>
                </div>
                <button
                  onClick={logout}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  title="Déconnexion"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
                >
                  Connexion
                </Link>
                <Link
                  href="/register"
                  className="px-5 py-2 bg-gradient-to-r from-gold-600 to-gold-400 text-dark-950 text-sm font-semibold rounded-xl hover:from-gold-500 hover:to-gold-300 transition-all shadow-lg shadow-gold-500/25"
                >
                  S&apos;inscrire
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-gray-300 hover:text-white"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-dark-900/95 backdrop-blur-md border-t border-dark-800">
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    'flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors',
                    isActive(link.href)
                      ? 'bg-gold-500/10 text-gold-500'
                      : 'text-gray-300 hover:bg-dark-800 hover:text-white'
                  )}
                >
                  <link.icon className="w-5 h-5" />
                  <span>{link.label}</span>
                </Link>
              ))}
              
              <div className="border-t border-dark-800 pt-4 mt-4">
                {isAuthenticated ? (
                  <div className="space-y-2">
                    {user?.role === 'ADMIN' && (
                      <Link
                        href="/admin"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center space-x-3 px-4 py-3 text-gold-500 hover:bg-dark-800 rounded-lg"
                      >
                        <User className="w-5 h-5" />
                        <span>Dashboard Admin</span>
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        logout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center space-x-3 px-4 py-3 text-red-500 hover:bg-dark-800 rounded-lg w-full"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Déconnexion</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link
                      href="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-dark-800 rounded-lg"
                    >
                      <User className="w-5 h-5" />
                      <span>Connexion</span>
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center space-x-3 px-4 py-3 bg-gold-500 text-dark-950 rounded-lg font-medium"
                    >
                      <User className="w-5 h-5" />
                      <span>S&apos;inscrire</span>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
