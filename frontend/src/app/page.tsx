'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Building, Users, Award, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { PropertyCard } from '@/components/property/PropertyCard';
import { useFeaturedProperties } from '@/hooks/useProperties';

export default function HomePage() {
  const { properties: featuredProperties, isLoading } = useFeaturedProperties(6);

  const stats = [
    { icon: Building, value: '500+', label: 'Biens disponibles' },
    { icon: Users, value: '1000+', label: 'Clients satisfaits' },
    { icon: Award, value: '10+', label: 'Années d\'expérience' },
    { icon: TrendingUp, value: '98%', label: 'Taux de satisfaction' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920)',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-dark-950/70 via-dark-950/50 to-dark-950" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-slide-up">
            <p className="text-gold-500 font-medium tracking-wider uppercase mb-4">
              Immobilier de Luxe au Maroc
            </p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-white mb-6 leading-tight">
              Trouvez la propriété<br />
              <span className="gradient-text">de vos rêves</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto mb-10">
              Idriss Villa Style vous accompagne dans la recherche de votre bien immobilier 
              idéal au Maroc. Villas, appartements, terrains et plus.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/properties">
                <Button size="lg" className="w-full sm:w-auto">
                  Découvrir nos biens
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Nous contacter
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-gold-500 rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-gold-500 rounded-full" />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-dark-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-14 h-14 bg-gold-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-7 h-7 text-gold-500" />
                </div>
                <p className="text-3xl sm:text-4xl font-bold text-white mb-1">
                  {stat.value}
                </p>
                <p className="text-gray-400 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-gold-500 font-medium tracking-wider uppercase mb-2">
              Nos Sélections
            </p>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-4">
              Biens en Vedette
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Découvrez nos propriétés d&apos;exception sélectionnées pour vous.
              Des biens uniques dans les meilleures localisations.
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-dark-800 rounded-xl h-96 animate-pulse" />
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                {featuredProperties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
              <div className="text-center">
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

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-gold-600/20 to-gold-500/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-6">
            Prêt à trouver votre bien idéal ?
          </h2>
          <p className="text-gray-300 text-lg mb-8">
            Notre équipe d&apos;experts est à votre disposition pour vous accompagner 
            dans votre recherche immobilière.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/properties">
              <Button size="lg">Explorer les biens</Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg">
                Prendre rendez-vous
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
