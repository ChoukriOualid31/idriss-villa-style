'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Save, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { siteContentApi } from '@/lib/api';
import { Button } from '@/components/ui/Button';

type SiteContentForm = {
  // A propos
  aboutHeroTitle: string;
  aboutHeroDescription: string;
  aboutAgencyDescription: string;
  aboutAdminNote: string;
  aboutMetric1Value: string;
  aboutMetric1Label: string;
  aboutMetric2Value: string;
  aboutMetric2Label: string;
  aboutMetric3Value: string;
  aboutMetric3Label: string;
  aboutMetric4Value: string;
  aboutMetric4Label: string;
  // Contact
  contactHeaderTitle: string;
  contactHeaderDescription: string;
  contactPhone: string;
  contactEmail: string;
  contactAddress: string;
  contactHours: string;
  // Reseaux sociaux
  instagramUrl: string;
  facebookUrl: string;
  whatsappUrl: string;
};

const defaultValues: SiteContentForm = {
  aboutHeroTitle: 'Une agence immobiliere moderne, orientee resultat',
  aboutHeroDescription:
    'Idriss Villa Style combine expertise terrain, outils digitaux et accompagnement humain pour vous aider a vendre, acheter ou louer dans les meilleures conditions.',
  aboutAgencyDescription:
    'Fondee sur des valeurs de confiance et de transparence, notre agence place chaque client au centre de son action.',
  aboutAdminNote:
    'Cette page A propos peut etre mise a jour depuis l espace Admin (contenu, chiffres et sections).',
  aboutMetric1Value: '500+',
  aboutMetric1Label: 'Biens verifies',
  aboutMetric2Value: '1000+',
  aboutMetric2Label: 'Clients accompagnes',
  aboutMetric3Value: '10+',
  aboutMetric3Label: 'Annees d experience',
  aboutMetric4Value: '98%',
  aboutMetric4Label: 'Satisfaction client',
  contactHeaderTitle: 'Contactez-nous',
  contactHeaderDescription:
    'Notre equipe est a votre disposition pour repondre a toutes vos questions et vous accompagner dans votre projet immobilier.',
  contactPhone: '+212 600 00 00 00',
  contactEmail: 'contact@idrissvilla.com',
  contactAddress: '123 Avenue Mohammed V, Tanger, Maroc',
  contactHours: 'Lun - Ven: 9h00 - 18h00',
  instagramUrl: 'https://instagram.com',
  facebookUrl: 'https://facebook.com',
  whatsappUrl: 'https://wa.me/212600000000',
};

const inputCls = 'w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-500';
const textareaCls = `${inputCls} resize-none`;

export default function AdminContentPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState('');
  const [error, setError] = useState('');
  const [form, setForm] = useState<SiteContentForm>(defaultValues);

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || user?.role !== 'ADMIN')) {
      router.push('/login');
      return;
    }

    const fetchContent = async () => {
      try {
        const response = await siteContentApi.getPublic();
        const content = response.data?.data?.content;
        if (content) {
          setForm({
            aboutHeroTitle: content.aboutHeroTitle || defaultValues.aboutHeroTitle,
            aboutHeroDescription: content.aboutHeroDescription || defaultValues.aboutHeroDescription,
            aboutAgencyDescription: content.aboutAgencyDescription || defaultValues.aboutAgencyDescription,
            aboutAdminNote: content.aboutAdminNote || defaultValues.aboutAdminNote,
            aboutMetric1Value: content.aboutMetric1Value || defaultValues.aboutMetric1Value,
            aboutMetric1Label: content.aboutMetric1Label || defaultValues.aboutMetric1Label,
            aboutMetric2Value: content.aboutMetric2Value || defaultValues.aboutMetric2Value,
            aboutMetric2Label: content.aboutMetric2Label || defaultValues.aboutMetric2Label,
            aboutMetric3Value: content.aboutMetric3Value || defaultValues.aboutMetric3Value,
            aboutMetric3Label: content.aboutMetric3Label || defaultValues.aboutMetric3Label,
            aboutMetric4Value: content.aboutMetric4Value || defaultValues.aboutMetric4Value,
            aboutMetric4Label: content.aboutMetric4Label || defaultValues.aboutMetric4Label,
            contactHeaderTitle: content.contactHeaderTitle || defaultValues.contactHeaderTitle,
            contactHeaderDescription: content.contactHeaderDescription || defaultValues.contactHeaderDescription,
            contactPhone: content.contactPhone || defaultValues.contactPhone,
            contactEmail: content.contactEmail || defaultValues.contactEmail,
            contactAddress: content.contactAddress || defaultValues.contactAddress,
            contactHours: content.contactHours || defaultValues.contactHours,
            instagramUrl: content.instagramUrl || defaultValues.instagramUrl,
            facebookUrl: content.facebookUrl || defaultValues.facebookUrl,
            whatsappUrl: content.whatsappUrl || defaultValues.whatsappUrl,
          });
        }
      } catch (fetchError) {
        console.error('Error fetching site content:', fetchError);
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated && user?.role === 'ADMIN') {
      fetchContent();
    }
  }, [authLoading, isAuthenticated, router, user]);

  const handleChange =
    (field: keyof SiteContentForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      setSaved('');
      setError('');
    };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaved('');
    setError('');
    try {
      await siteContentApi.updateAdmin(form);
      setSaved('Contenu mis a jour avec succes.');
    } catch (saveError: any) {
      setError(saveError?.response?.data?.message || 'Erreur lors de la mise a jour.');
    } finally {
      setIsSaving(false);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-gold-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'ADMIN') return null;

  return (
    <div className="min-h-screen bg-dark-950">
      <div className="bg-dark-900 border-b border-dark-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-serif font-bold text-white">Contenu du site</h1>
              <p className="text-gray-400 mt-1">
                Modifiez les textes des pages A propos et Contact sans toucher au code.
              </p>
            </div>
            <Link
              href="/admin"
              className="inline-flex items-center px-4 py-2 border border-dark-700 rounded-lg text-gray-300 hover:text-white hover:border-gold-500/40 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour admin
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSave} className="space-y-6">

          {/* ── A propos : Hero ── */}
          <section className="bg-dark-800 rounded-xl p-6 border border-dark-700 space-y-5">
            <div>
              <h2 className="text-xl font-semibold text-white">Page A propos — Hero</h2>
              <p className="text-xs text-gray-500 mt-1">Titre principal et description visible en haut de la page.</p>
            </div>

            <div>
              <label htmlFor="aboutHeroTitle" className="block text-sm text-gray-300 mb-2">Titre principal</label>
              <input
                id="aboutHeroTitle"
                type="text"
                value={form.aboutHeroTitle}
                onChange={handleChange('aboutHeroTitle')}
                className={inputCls}
              />
            </div>

            <div>
              <label htmlFor="aboutHeroDescription" className="block text-sm text-gray-300 mb-2">Sous-titre / accroche</label>
              <textarea
                id="aboutHeroDescription"
                rows={3}
                value={form.aboutHeroDescription}
                onChange={handleChange('aboutHeroDescription')}
                className={textareaCls}
              />
            </div>

            <div>
              <label htmlFor="aboutAgencyDescription" className="block text-sm text-gray-300 mb-2">Description de l agence (section Notre histoire)</label>
              <textarea
                id="aboutAgencyDescription"
                rows={4}
                value={form.aboutAgencyDescription}
                onChange={handleChange('aboutAgencyDescription')}
                className={textareaCls}
              />
            </div>

            <div>
              <label htmlFor="aboutAdminNote" className="block text-sm text-gray-300 mb-2">Note admin (badge visible sur la page)</label>
              <textarea
                id="aboutAdminNote"
                rows={2}
                value={form.aboutAdminNote}
                onChange={handleChange('aboutAdminNote')}
                className={textareaCls}
              />
            </div>
          </section>

          {/* ── A propos : Chiffres cles ── */}
          <section className="bg-dark-800 rounded-xl p-6 border border-dark-700 space-y-5">
            <div>
              <h2 className="text-xl font-semibold text-white">Chiffres cles</h2>
              <p className="text-xs text-gray-500 mt-1">Les 4 statistiques affichees sous le titre hero.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="aboutMetric1Value" className="block text-sm text-gray-300 mb-2">Chiffre 1 — valeur</label>
                <input id="aboutMetric1Value" type="text" value={form.aboutMetric1Value} onChange={handleChange('aboutMetric1Value')} className={inputCls} placeholder="500+" />
              </div>
              <div>
                <label htmlFor="aboutMetric1Label" className="block text-sm text-gray-300 mb-2">Chiffre 1 — label</label>
                <input id="aboutMetric1Label" type="text" value={form.aboutMetric1Label} onChange={handleChange('aboutMetric1Label')} className={inputCls} placeholder="Biens verifies" />
              </div>

              <div>
                <label htmlFor="aboutMetric2Value" className="block text-sm text-gray-300 mb-2">Chiffre 2 — valeur</label>
                <input id="aboutMetric2Value" type="text" value={form.aboutMetric2Value} onChange={handleChange('aboutMetric2Value')} className={inputCls} placeholder="1000+" />
              </div>
              <div>
                <label htmlFor="aboutMetric2Label" className="block text-sm text-gray-300 mb-2">Chiffre 2 — label</label>
                <input id="aboutMetric2Label" type="text" value={form.aboutMetric2Label} onChange={handleChange('aboutMetric2Label')} className={inputCls} placeholder="Clients accompagnes" />
              </div>

              <div>
                <label htmlFor="aboutMetric3Value" className="block text-sm text-gray-300 mb-2">Chiffre 3 — valeur</label>
                <input id="aboutMetric3Value" type="text" value={form.aboutMetric3Value} onChange={handleChange('aboutMetric3Value')} className={inputCls} placeholder="10+" />
              </div>
              <div>
                <label htmlFor="aboutMetric3Label" className="block text-sm text-gray-300 mb-2">Chiffre 3 — label</label>
                <input id="aboutMetric3Label" type="text" value={form.aboutMetric3Label} onChange={handleChange('aboutMetric3Label')} className={inputCls} placeholder="Annees d experience" />
              </div>

              <div>
                <label htmlFor="aboutMetric4Value" className="block text-sm text-gray-300 mb-2">Chiffre 4 — valeur</label>
                <input id="aboutMetric4Value" type="text" value={form.aboutMetric4Value} onChange={handleChange('aboutMetric4Value')} className={inputCls} placeholder="98%" />
              </div>
              <div>
                <label htmlFor="aboutMetric4Label" className="block text-sm text-gray-300 mb-2">Chiffre 4 — label</label>
                <input id="aboutMetric4Label" type="text" value={form.aboutMetric4Label} onChange={handleChange('aboutMetric4Label')} className={inputCls} placeholder="Satisfaction client" />
              </div>
            </div>
          </section>

          {/* ── Contact ── */}
          <section className="bg-dark-800 rounded-xl p-6 border border-dark-700 space-y-5">
            <div>
              <h2 className="text-xl font-semibold text-white">Page Contact</h2>
              <p className="text-xs text-gray-500 mt-1">Informations affichees sur la page Contact et dans le footer.</p>
            </div>

            <div>
              <label htmlFor="contactHeaderTitle" className="block text-sm text-gray-300 mb-2">Titre</label>
              <input id="contactHeaderTitle" type="text" value={form.contactHeaderTitle} onChange={handleChange('contactHeaderTitle')} className={inputCls} />
            </div>

            <div>
              <label htmlFor="contactHeaderDescription" className="block text-sm text-gray-300 mb-2">Description</label>
              <textarea id="contactHeaderDescription" rows={3} value={form.contactHeaderDescription} onChange={handleChange('contactHeaderDescription')} className={textareaCls} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="contactPhone" className="block text-sm text-gray-300 mb-2">Telephone</label>
                <input id="contactPhone" type="text" value={form.contactPhone} onChange={handleChange('contactPhone')} className={inputCls} />
              </div>
              <div>
                <label htmlFor="contactEmail" className="block text-sm text-gray-300 mb-2">Email</label>
                <input id="contactEmail" type="email" value={form.contactEmail} onChange={handleChange('contactEmail')} className={inputCls} />
              </div>
            </div>

            <div>
              <label htmlFor="contactAddress" className="block text-sm text-gray-300 mb-2">Adresse</label>
              <input id="contactAddress" type="text" value={form.contactAddress} onChange={handleChange('contactAddress')} className={inputCls} />
            </div>

            <div>
              <label htmlFor="contactHours" className="block text-sm text-gray-300 mb-2">Horaires</label>
              <input id="contactHours" type="text" value={form.contactHours} onChange={handleChange('contactHours')} className={inputCls} />
            </div>
          </section>

          {/* ── Reseaux Sociaux ── */}
          <section className="bg-dark-800 rounded-xl p-6 border border-dark-700 space-y-5">
            <h2 className="text-xl font-semibold text-white">Reseaux Sociaux</h2>

            <div>
              <label htmlFor="instagramUrl" className="block text-sm text-gray-300 mb-2">Instagram (lien complet)</label>
              <input id="instagramUrl" type="url" value={form.instagramUrl} onChange={handleChange('instagramUrl')} placeholder="https://instagram.com/votre-compte" className={inputCls} />
            </div>

            <div>
              <label htmlFor="facebookUrl" className="block text-sm text-gray-300 mb-2">Facebook (lien complet)</label>
              <input id="facebookUrl" type="url" value={form.facebookUrl} onChange={handleChange('facebookUrl')} placeholder="https://facebook.com/votre-page" className={inputCls} />
            </div>

            <div>
              <label htmlFor="whatsappUrl" className="block text-sm text-gray-300 mb-2">WhatsApp (lien wa.me)</label>
              <input id="whatsappUrl" type="url" value={form.whatsappUrl} onChange={handleChange('whatsappUrl')} placeholder="https://wa.me/212600000000" className={inputCls} />
            </div>
          </section>

          {saved && (
            <p className="text-sm text-green-400 bg-green-500/10 border border-green-500/30 rounded-lg px-4 py-3">
              {saved}
            </p>
          )}
          {error && (
            <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3">
              {error}
            </p>
          )}

          <Button type="submit" isLoading={isSaving}>
            <Save className="w-4 h-4 mr-2" />
            Enregistrer les modifications
          </Button>
        </form>
      </div>
    </div>
  );
}
