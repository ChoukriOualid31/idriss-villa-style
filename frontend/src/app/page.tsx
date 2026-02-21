'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Building, Users, Award, TrendingUp, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { PropertyCard } from '@/components/property/PropertyCard';
import { useFeaturedProperties } from '@/hooks/useProperties';

export default function HomePage() {
  const { properties: featuredProperties, isLoading } = useFeaturedProperties(6);

  const stats = [
    { icon: Building, value: '500+', label: 'Biens disponibles' },
    { icon: Users, value: '1000+', label: 'Clients satisfaits' },
    { icon: Award, value: '10+', label: 'Annees d experience' },
    { icon: TrendingUp, value: '98%', label: 'Taux de satisfaction' },
  ];

  return (
    <div className="min-h-screen">
      <section className="relative min-h-[92vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920)' }}>
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-[#090d13]/70 to-[#07090d]" />
        </div>

        <div className="pointer-events-none absolute -left-24 top-24 w-72 h-72 rounded-full bg-gold-500/20 blur-3xl animate-float-slow" />
        <div className="pointer-events-none absolute right-0 top-8 w-80 h-80 rounded-full bg-blue-400/20 blur-3xl animate-float-slow" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 soft-reveal">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full surface-panel text-sm text-gold-300 mb-6">
                <Sparkles className="w-4 h-4" />
                Immobilier premium au Maroc
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-semibold text-white leading-[1.05] mb-6">
                Un espace de vie
                <br />
                <span className="gradient-text">qui vous ressemble</span>
              </h1>

              <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mb-10">
                Recherche intelligente, biens verifies et experience fluide de la visite a la signature.
                Idriss Villa Style vous accompagne sur chaque decision.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                <Link href="/properties">
                  <Button size="lg" className="w-full sm:w-auto animate-glow-pulse">
                    Explorer les biens
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    Parler a un conseiller
                  </Button>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 soft-reveal" style={{ animationDelay: '120ms' }}>
              <div className="surface-panel rounded-3xl p-6 sm:p-7">
                <p className="text-xs uppercase tracking-[0.22em] text-gray-400 mb-4">Vue du marche</p>
                <div className="h-px bg-gradient-to-r from-transparent via-gold-500/70 to-transparent pulse-line mb-6" />
                <div className="grid grid-cols-2 gap-4">
                  {stats.map((stat) => (
                    <div key={stat.label} className="bg-dark-900/75 rounded-2xl p-4 border border-dark-700/80">
                      <stat.icon className="w-5 h-5 text-gold-400 mb-3" />
                      <p className="text-2xl sm:text-3xl font-semibold text-white mb-1">{stat.value}</p>
                      <p className="text-xs text-gray-400 leading-relaxed">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 soft-reveal">
            <p className="text-gold-500 font-medium tracking-wider uppercase mb-2">Selections</p>
            <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-white mb-4">Biens en vedette</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Des proprietes soigneusement selectionnees avec un niveau de finition eleve.
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-dark-800/80 rounded-xl h-96 animate-pulse" />
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                {featuredProperties.map((property, index) => (
                  <div key={property.id} className="soft-reveal" style={{ animationDelay: `${index * 70}ms` }}>
                    <PropertyCard property={property} />
                  </div>
                ))}
              </div>
              <div className="text-center soft-reveal" style={{ animationDelay: '160ms' }}>
                <Link href="/properties">
                  <Button variant="outline" size="lg">
                    Voir tous les biens
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="surface-panel rounded-[2rem] p-8 sm:p-12 text-center soft-reveal">
            <p className="text-xs uppercase tracking-[0.2em] text-gold-400 mb-3">Accompagnement premium</p>
            <h3 className="text-3xl sm:text-4xl font-serif font-semibold text-white mb-5">
              Pret a accelerer votre projet immobilier ?
            </h3>
            <p className="text-gray-300 max-w-2xl mx-auto mb-8">
              Nous preparons pour vous une selection personnalisee selon votre budget, vos quartiers cibles et votre calendrier.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/contact">
                <Button size="lg">Demarrer maintenant</Button>
              </Link>
              <Link href="/properties">
                <Button variant="ghost" size="lg">Voir le catalogue</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
