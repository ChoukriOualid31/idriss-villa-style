'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Sparkles, Target, Users, Building2, Clock3, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { siteContentApi } from '@/lib/api';

const metrics = [
  { value: '500+', label: 'Biens verifies' },
  { value: '1000+', label: 'Clients accompagnes' },
  { value: '10+', label: 'Annees d experience' },
  { value: '98%', label: 'Satisfaction client' },
];

const values = [
  {
    icon: ShieldCheck,
    title: 'Confiance et transparence',
    text: 'Chaque bien est verifie avant publication pour offrir des informations claires et fiables.',
  },
  {
    icon: Target,
    title: 'Accompagnement cible',
    text: 'Nous adaptons la recherche selon votre budget, votre ville cible et votre calendrier.',
  },
  {
    icon: Sparkles,
    title: 'Experience premium',
    text: 'Un parcours fluide de la premiere visite jusqu a la signature et au suivi post-vente.',
  },
];

const adminFlow = [
  {
    icon: Building2,
    title: 'Gestion des annonces',
    text: 'Creation, edition et archivage des biens avec suivi de performance par fiche.',
  },
  {
    icon: Users,
    title: 'Suivi des clients',
    text: 'Vue centralisee des demandes, leads qualifies et historique des interactions.',
  },
  {
    icon: BarChart3,
    title: 'Pilotage de l activite',
    text: 'Tableaux de bord pour prioriser les actions commerciales et accelerer la conversion.',
  },
  {
    icon: Clock3,
    title: 'Reactivite operationnelle',
    text: 'Traitement rapide des demandes pour reduire les delais entre intention et visite.',
  },
];

export default function AboutPage() {
  const [aboutAdminNote, setAboutAdminNote] = useState(
    'Cette page A propos peut etre mise a jour depuis l espace Admin (contenu, chiffres et sections)'
  );

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await siteContentApi.getPublic();
        const note = response.data?.data?.content?.aboutAdminNote;
        if (note) setAboutAdminNote(note);
      } catch (error) {
        console.error('Error fetching site content:', error);
      }
    };
    fetchContent();
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: "url('/logo-villa-style.jpeg')",
          backgroundRepeat: 'repeat',
          backgroundSize: '140px 140px',
          backgroundPosition: '0 0',
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-dark-950/85 via-dark-950/80 to-dark-950/92" />

      <section className="relative overflow-hidden py-24 sm:py-28">
        <div
          className="pointer-events-none absolute -right-24 -top-16 w-[420px] h-[420px] rounded-full opacity-[0.12] blur-[1px] animate-logo-drift"
          style={{
            backgroundImage: "url('/logo-villa-style.jpeg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div
          className="pointer-events-none absolute -left-24 bottom-0 w-[360px] h-[360px] rounded-full opacity-[0.08] blur-[2px] animate-logo-drift"
          style={{
            animationDelay: '1.2s',
            backgroundImage: "url('/logo-villa-style.jpeg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />

        <div className="pointer-events-none absolute -top-24 left-0 w-80 h-80 rounded-full bg-gold-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 right-0 w-80 h-80 rounded-full bg-blue-500/20 blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl soft-reveal">
            <p className="text-gold-400 text-xs uppercase tracking-[0.2em] mb-4">A propos</p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-semibold text-white leading-[1.06] mb-6">
              Une agence immobiliere moderne, orientee resultat
            </h1>
            <p className="text-gray-300 text-lg leading-relaxed">
              Idriss Villa Style est une agence qui combine expertise terrain, outils digitaux
              et accompagnement humain pour aider chaque client a vendre, acheter ou louer
              dans les meilleures conditions.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 soft-reveal" style={{ animationDelay: '120ms' }}>
            {metrics.map((item) => (
              <div key={item.label} className="surface-panel rounded-2xl p-5 transition-transform duration-300 hover:-translate-y-1">
                <p className="text-2xl sm:text-3xl font-semibold text-white mb-1">{item.value}</p>
                <p className="text-sm text-gray-400">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6">
            {values.map((value, index) => (
              <article key={value.title} className="surface-panel rounded-3xl p-6 soft-reveal" style={{ animationDelay: `${index * 80}ms` }}>
                <value.icon className="w-6 h-6 text-gold-400 mb-4" />
                <h2 className="text-xl font-semibold text-white mb-3">{value.title}</h2>
                <p className="text-gray-300 leading-relaxed">{value.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 soft-reveal">
            <p className="text-gold-400 text-xs uppercase tracking-[0.2em] mb-3">Vision admin</p>
            <h3 className="text-3xl sm:text-4xl font-serif font-semibold text-white mb-3">
              Une operation agence claire et pilotable
            </h3>
            <p className="text-gray-300 max-w-3xl">
              Cote administration, la plateforme est pensee pour reduire les taches manuelles,
              standardiser les processus et donner une vue en temps reel sur la performance commerciale.
            </p>
            <div className="mt-4 inline-flex items-center rounded-full border border-gold-500/35 bg-gold-500/10 px-4 py-2 text-xs text-gold-300 tracking-wide">
              {aboutAdminNote}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {adminFlow.map((item, index) => (
              <div key={item.title} className="surface-panel rounded-2xl p-6 soft-reveal transition-transform duration-300 hover:-translate-y-1" style={{ animationDelay: `${index * 70}ms` }}>
                <div className="w-10 h-10 rounded-xl bg-gold-500/12 border border-gold-500/20 flex items-center justify-center mb-4">
                  <item.icon className="w-5 h-5 text-gold-400" />
                </div>
                <h4 className="text-xl font-semibold text-white mb-2">{item.title}</h4>
                <p className="text-gray-300">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="surface-panel rounded-[2rem] p-8 sm:p-12 text-center soft-reveal">
            <p className="text-xs uppercase tracking-[0.2em] text-gold-400 mb-3">Parlons de votre projet</p>
            <h5 className="text-3xl sm:text-4xl font-serif font-semibold text-white mb-5">
              Besoin d un accompagnement sur mesure ?
            </h5>
            <p className="text-gray-300 max-w-2xl mx-auto mb-8">
              Notre equipe vous propose un plan d action clair avec une selection adaptee a vos objectifs.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/contact">
                <Button size="lg">
                  Contacter l agence
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/properties">
                <Button variant="outline" size="lg">Explorer les biens</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
