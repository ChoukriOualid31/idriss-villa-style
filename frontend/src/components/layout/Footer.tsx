'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Phone, Mail, Instagram, Facebook } from 'lucide-react';
import { siteContentApi } from '@/lib/api';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const [siteInfo, setSiteInfo] = useState({
    instagramUrl: 'https://instagram.com',
    facebookUrl: 'https://facebook.com',
    whatsappUrl: 'https://wa.me/212600000000',
    contactPhone: '+212 600 00 00 00',
    contactEmail: 'contact@idrissvilla.com',
    contactAddress: '123 Avenue Mohammed V, Tanger, Maroc',
  });

  useEffect(() => {
    siteContentApi.getPublic().then((res) => {
      const content = res.data?.data?.content;
      if (content) {
        setSiteInfo({
          instagramUrl: content.instagramUrl || 'https://instagram.com',
          facebookUrl: content.facebookUrl || 'https://facebook.com',
          whatsappUrl: content.whatsappUrl || 'https://wa.me/212600000000',
          contactPhone: content.contactPhone || '+212 600 00 00 00',
          contactEmail: content.contactEmail || 'contact@idrissvilla.com',
          contactAddress: content.contactAddress || '123 Avenue Mohammed V, Tanger, Maroc',
        });
      }
    }).catch(() => {});
  }, []);

  const quickLinks = [
    { href: '/', label: 'Accueil' },
    { href: '/properties', label: 'Nos Biens' },
    { href: '/about', label: 'A propos' },
    { href: '/contact', label: 'Contact' },
  ];

  const propertyTypes = [
    { href: '/properties?type=VILLA', label: 'Villas' },
    { href: '/properties?type=APARTMENT', label: 'Appartements' },
    { href: '/properties?type=HOUSE', label: 'Maisons' },
    { href: '/properties?type=LAND', label: 'Terrains' },
  ];

  return (
    <footer className="relative bg-dark-950 border-t border-dark-800 overflow-hidden">
      <div className="pointer-events-none absolute -top-20 -left-20 w-72 h-72 rounded-full bg-gold-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4 soft-reveal">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl overflow-hidden shadow-lg shadow-gold-500/20 ring-1 ring-gold-500/30">
                <Image
                  src="/logo-villa-style.jpeg"
                  alt="Idriss Villa Style"
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <span className="text-2xl font-serif font-semibold text-white block">
                  Idriss <span className="text-gold-500">Villa</span>
                </span>
                <span className="text-xs text-gray-500 uppercase tracking-wider">Style Immobilier</span>
              </div>
            </Link>

            <p className="text-gray-400 text-sm leading-relaxed">
              Votre partenaire de confiance pour trouver la propriete de vos reves.
              Excellence, qualite et service premium depuis plus de 10 ans.
            </p>

            <div className="flex space-x-4">
              <a
                href={siteInfo.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-dark-800 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gold-500 hover:text-dark-950 transition-all hover:-translate-y-0.5"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href={siteInfo.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-dark-800 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gold-500 hover:text-dark-950 transition-all hover:-translate-y-0.5"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href={siteInfo.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-dark-800 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gold-500 hover:text-dark-950 transition-all hover:-translate-y-0.5"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Liens Rapides</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-400 hover:text-gold-500 transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Types de Biens</h3>
            <ul className="space-y-3">
              {propertyTypes.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-400 hover:text-gold-500 transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-gold-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-400 text-sm">{siteInfo.contactAddress}</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-gold-500 flex-shrink-0" />
                <a
                  href={siteInfo.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-gold-500 transition-colors text-sm"
                >
                  {siteInfo.contactPhone}
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gold-500 flex-shrink-0" />
                <a
                  href={`mailto:${siteInfo.contactEmail}`}
                  className="text-gray-400 hover:text-gold-500 transition-colors text-sm"
                >
                  {siteInfo.contactEmail}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-dark-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <p className="text-gray-500 text-sm">&copy; {currentYear} Idriss Villa Style. Tous droits reserves.</p>
            <div className="flex space-x-6">
              <Link href="/privacy" className="text-gray-500 hover:text-gold-500 transition-colors text-sm">
                Politique de confidentialite
              </Link>
              <Link href="/terms" className="text-gray-500 hover:text-gold-500 transition-colors text-sm">
                Conditions d&apos;utilisation
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
