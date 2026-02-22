'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Sparkles, Target, Users, Building2, Clock3, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { siteContentApi } from '@/lib/api';
import { SiteContent } from '@/types';

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

const adminFlowDelays = ['', 'reveal-delay-70', 'reveal-delay-140', 'reveal-delay-210'];
const valuesDelays = ['', 'reveal-delay-80', 'reveal-delay-160'];

const DEFAULTS = {
  aboutHeroTitle: 'Une agence immobiliere moderne, orientee resultat',
  aboutHeroDescription:
    'Idriss Villa Style combine expertise terrain, outils digitaux et accompagnement humain pour vous aider a vendre, acheter ou louer dans les meilleures conditions.',
  aboutAgencyDescription:
    'Fondee sur des valeurs de confiance et de transparence, notre agence place chaque client au centre de son action. Nous mettons notre connaissance du marche local au service de vos projets immobiliers, qu il s agisse d une premiere acquisition ou d un investissement strategique.',
  aboutAdminNote:
    'Cette page A propos peut etre mise a jour depuis l espace Admin (contenu, chiffres et sections)',
  aboutMetric1Value: '500+',
  aboutMetric1Label: 'Biens verifies',
  aboutMetric2Value: '1000+',
  aboutMetric2Label: 'Clients accompagnes',
  aboutMetric3Value: '10+',
  aboutMetric3Label: 'Annees d experience',
  aboutMetric4Value: '98%',
  aboutMetric4Label: 'Satisfaction client',
};

export default function AboutPage() {
  const [content, setContent] = useState<Partial<SiteContent>>(DEFAULTS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    siteContentApi
      .getPublic()
      .then((res) => {
        const data = res.data?.data?.content;
        if (data) setContent(data);
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  const c = content as typeof DEFAULTS;

  const metrics = [
    { value: c.aboutMetric1Value || DEFAULTS.aboutMetric1Value, label: c.aboutMetric1Label || DEFAULTS.aboutMetric1Label },
    { value: c.aboutMetric2Value || DEFAULTS.aboutMetric2Value, label: c.aboutMetric2Label || DEFAULTS.aboutMetric2Label },
    { value: c.aboutMetric3Value || DEFAULTS.aboutMetric3Value, label: c.aboutMetric3Label || DEFAULTS.aboutMetric3Label },
    { value: c.aboutMetric4Value || DEFAULTS.aboutMetric4Value, label: c.aboutMetric4Label || DEFAULTS.aboutMetric4Label },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">

      {/* ── Logo tiled background ── */}
      <div className="bg-logo-pattern pointer-events-none fixed inset-0 opacity-[0.035]" />
      <div className="pointer-events-none fixed inset-0 bg-gradient-to-b from-dark-950/90 via-dark-950/82 to-dark-950/95" />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden py-28 sm:py-36">
        {/* Floating logo orbs */}
        <div className="logo-orb animate-logo-drift pointer-events-none absolute -right-20 -top-20 w-[460px] h-[460px] rounded-full opacity-[0.13] blur-[2px]" />
        <div className="logo-orb animate-logo-drift orb-delay-1 pointer-events-none absolute -left-28 bottom-0 w-[380px] h-[380px] rounded-full opacity-[0.09] blur-[3px]" />
        <div className="logo-orb animate-logo-drift orb-delay-2 pointer-events-none absolute left-1/2 top-1/3 w-[220px] h-[220px] rounded-full opacity-[0.05] blur-[2px]" />

        {/* Glow blobs */}
        <div className="pointer-events-none absolute -top-32 left-0 w-96 h-96 rounded-full bg-gold-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 right-0 w-96 h-96 rounded-full bg-blue-500/15 blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl soft-reveal">
            <p className="text-gold-400 text-xs uppercase tracking-[0.22em] mb-5 flex items-center gap-2">
              <span className="inline-block w-8 h-px bg-gold-500/60" />
              A propos de nous
            </p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-semibold text-white leading-[1.06] mb-6">
              {c.aboutHeroTitle || DEFAULTS.aboutHeroTitle}
            </h1>
            <p className="text-gray-300 text-lg leading-relaxed mb-8">
              {c.aboutHeroDescription || DEFAULTS.aboutHeroDescription}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/contact">
                <Button size="lg">
                  Nous contacter
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/properties">
                <Button variant="outline" size="lg">Explorer nos biens</Button>
              </Link>
            </div>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 soft-reveal reveal-delay-120">
            {metrics.map((item) => (
              <div
                key={item.label}
                className="surface-panel rounded-2xl p-6 transition-transform duration-300 hover:-translate-y-1 text-center group"
              >
                <p className="text-3xl sm:text-4xl font-bold text-white mb-1 group-hover:text-gold-400 transition-colors">
                  {item.value}
                </p>
                <p className="text-sm text-gray-400">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Notre histoire ── */}
      <section className="py-16 sm:py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="soft-reveal">
              <p className="text-gold-400 text-xs uppercase tracking-[0.2em] mb-3">Notre histoire</p>
              <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-white mb-6 leading-snug">
                Une agence batie sur la confiance
              </h2>
              <p className="text-gray-300 leading-relaxed text-base">
                {c.aboutAgencyDescription || DEFAULTS.aboutAgencyDescription}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 soft-reveal reveal-delay-100">
              {values.map((v, i) => (
                <article
                  key={v.title}
                  className={`surface-panel rounded-2xl p-5 flex items-start gap-4 soft-reveal ${valuesDelays[i]}`}
                >
                  <div className="w-10 h-10 rounded-xl bg-gold-500/12 border border-gold-500/20 flex items-center justify-center flex-shrink-0">
                    <v.icon className="w-5 h-5 text-gold-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1 text-sm">{v.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{v.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Vision admin ── */}
      <section className="py-14 sm:py-16 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10 soft-reveal">
            <p className="text-gold-400 text-xs uppercase tracking-[0.2em] mb-3">Vision admin</p>
            <h3 className="text-3xl sm:text-4xl font-serif font-semibold text-white mb-3">
              Une operation agence claire et pilotable
            </h3>
            <p className="text-gray-300 max-w-3xl">
              La plateforme est pensee pour reduire les taches manuelles, standardiser les processus
              et donner une vue en temps reel sur la performance commerciale.
            </p>
            {loaded && (c.aboutAdminNote || DEFAULTS.aboutAdminNote) && (
              <div className="mt-5 inline-flex items-center rounded-full border border-gold-500/35 bg-gold-500/10 px-4 py-2 text-xs text-gold-300 tracking-wide">
                {c.aboutAdminNote || DEFAULTS.aboutAdminNote}
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {adminFlow.map((item, index) => (
              <div
                key={item.title}
                className={`surface-panel rounded-2xl p-6 soft-reveal transition-transform duration-300 hover:-translate-y-1 ${adminFlowDelays[index]}`}
              >
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

      {/* ── CTA ── */}
      <section className="py-16 sm:py-24 relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="surface-panel rounded-[2rem] p-8 sm:p-14 text-center soft-reveal relative overflow-hidden">
            <div className="pointer-events-none absolute -top-10 -right-10 w-40 h-40 rounded-full bg-gold-500/15 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-blue-500/10 blur-2xl" />
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
