'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Save, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { siteContentApi } from '@/lib/api';
import { Button } from '@/components/ui/Button';

type SiteContentForm = {
  aboutAdminNote: string;
  contactHeaderTitle: string;
  contactHeaderDescription: string;
  contactPhone: string;
  contactEmail: string;
  contactAddress: string;
  contactHours: string;
  instagramUrl: string;
  facebookUrl: string;
  whatsappUrl: string;
};

const defaultValues: SiteContentForm = {
  aboutAdminNote:
    'Cette page A propos peut etre mise a jour depuis l espace Admin (contenu, chiffres et sections).',
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
            aboutAdminNote: content.aboutAdminNote || defaultValues.aboutAdminNote,
            contactHeaderTitle: content.contactHeaderTitle || defaultValues.contactHeaderTitle,
            contactHeaderDescription:
              content.contactHeaderDescription || defaultValues.contactHeaderDescription,
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
          <section className="bg-dark-800 rounded-xl p-6 border border-dark-700">
            <h2 className="text-xl font-semibold text-white mb-4">A propos</h2>
            <label htmlFor="aboutAdminNote" className="block text-sm text-gray-300 mb-2">Note admin affichee sur la page A propos</label>
            <textarea
              id="aboutAdminNote"
              rows={3}
              value={form.aboutAdminNote}
              onChange={handleChange('aboutAdminNote')}
              className="w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-500 resize-none"
            />
          </section>

          <section className="bg-dark-800 rounded-xl p-6 border border-dark-700 space-y-5">
            <h2 className="text-xl font-semibold text-white">Contact</h2>

            <div>
              <label htmlFor="contactHeaderTitle" className="block text-sm text-gray-300 mb-2">Titre</label>
              <input
                id="contactHeaderTitle"
                type="text"
                value={form.contactHeaderTitle}
                onChange={handleChange('contactHeaderTitle')}
                className="w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
              />
            </div>

            <div>
              <label htmlFor="contactHeaderDescription" className="block text-sm text-gray-300 mb-2">Description</label>
              <textarea
                id="contactHeaderDescription"
                rows={3}
                value={form.contactHeaderDescription}
                onChange={handleChange('contactHeaderDescription')}
                className="w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-500 resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="contactPhone" className="block text-sm text-gray-300 mb-2">Telephone</label>
                <input
                  id="contactPhone"
                  type="text"
                  value={form.contactPhone}
                  onChange={handleChange('contactPhone')}
                  className="w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
                />
              </div>
              <div>
                <label htmlFor="contactEmail" className="block text-sm text-gray-300 mb-2">Email</label>
                <input
                  id="contactEmail"
                  type="email"
                  value={form.contactEmail}
                  onChange={handleChange('contactEmail')}
                  className="w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="contactAddress" className="block text-sm text-gray-300 mb-2">Adresse</label>
              <input
                id="contactAddress"
                type="text"
                value={form.contactAddress}
                onChange={handleChange('contactAddress')}
                className="w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
              />
            </div>

            <div>
              <label htmlFor="contactHours" className="block text-sm text-gray-300 mb-2">Horaires</label>
              <input
                id="contactHours"
                type="text"
                value={form.contactHours}
                onChange={handleChange('contactHours')}
                className="w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
              />
            </div>
          </section>

          <section className="bg-dark-800 rounded-xl p-6 border border-dark-700 space-y-5">
            <h2 className="text-xl font-semibold text-white">Reseaux Sociaux</h2>

            <div>
              <label htmlFor="instagramUrl" className="block text-sm text-gray-300 mb-2">Instagram (lien complet)</label>
              <input
                id="instagramUrl"
                type="url"
                value={form.instagramUrl}
                onChange={handleChange('instagramUrl')}
                placeholder="https://instagram.com/votre-compte"
                className="w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
              />
            </div>

            <div>
              <label htmlFor="facebookUrl" className="block text-sm text-gray-300 mb-2">Facebook (lien complet)</label>
              <input
                id="facebookUrl"
                type="url"
                value={form.facebookUrl}
                onChange={handleChange('facebookUrl')}
                placeholder="https://facebook.com/votre-page"
                className="w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
              />
            </div>

            <div>
              <label htmlFor="whatsappUrl" className="block text-sm text-gray-300 mb-2">WhatsApp (lien wa.me)</label>
              <input
                id="whatsappUrl"
                type="url"
                value={form.whatsappUrl}
                onChange={handleChange('whatsappUrl')}
                placeholder="https://wa.me/212600000000"
                className="w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
              />
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
