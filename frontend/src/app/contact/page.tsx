'use client';

import React, { useEffect, useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { siteContentApi } from '@/lib/api';

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [siteContent, setSiteContent] = useState({
    contactHeaderTitle: 'Contactez-nous',
    contactHeaderDescription:
      'Notre equipe est a votre disposition pour repondre a toutes vos questions et vous accompagner dans votre projet immobilier.',
    contactPhone: '+212 600 00 00 00',
    contactEmail: 'contact@idrissvilla.com',
    contactAddress: '123 Avenue Mohammed V, Tanger, Maroc',
    contactHours: 'Lun - Ven: 9h00 - 18h00',
  });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await siteContentApi.getPublic();
        const content = response.data?.data?.content;
        if (!content) return;

        setSiteContent({
          contactHeaderTitle: content.contactHeaderTitle,
          contactHeaderDescription: content.contactHeaderDescription,
          contactPhone: content.contactPhone,
          contactEmail: content.contactEmail,
          contactAddress: content.contactAddress,
          contactHours: content.contactHours,
        });
      } catch (error) {
        console.error('Error fetching contact content:', error);
      }
    };

    fetchContent();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSubmitted(true);
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    });
  };

  const contactInfo = [
    {
      icon: Phone,
      title: 'Telephone',
      content: siteContent.contactPhone,
      href: `tel:${siteContent.contactPhone.replace(/\s+/g, '')}`,
    },
    {
      icon: Mail,
      title: 'Email',
      content: siteContent.contactEmail,
      href: `mailto:${siteContent.contactEmail}`,
    },
    {
      icon: MapPin,
      title: 'Adresse',
      content: siteContent.contactAddress,
      href: '#',
    },
    {
      icon: Clock,
      title: 'Horaires',
      content: siteContent.contactHours,
      href: '#',
    },
  ];

  return (
    <div className="min-h-screen bg-dark-950 relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: "url('/logo-villa-style.jpeg')",
          backgroundRepeat: 'repeat',
          backgroundSize: '140px 140px',
          backgroundPosition: '0 0',
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-dark-950/80 via-dark-950/84 to-dark-950/92" />

      <div className="bg-dark-900 border-b border-dark-800 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-4">
            {siteContent.contactHeaderTitle}
          </h1>
          <p className="text-gray-400 max-w-2xl">{siteContent.contactHeaderDescription}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-dark-800 rounded-xl p-6 border border-dark-700">
              <h2 className="text-xl font-semibold text-white mb-6">Informations de contact</h2>

              <div className="space-y-6">
                {contactInfo.map((item, index) => (
                  <a key={index} href={item.href} className="flex items-start space-x-4 group">
                    <div className="w-12 h-12 bg-gold-500/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-gold-500/20 transition-colors">
                      <item.icon className="w-5 h-5 text-gold-500" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">{item.title}</p>
                      <p className="text-white group-hover:text-gold-500 transition-colors">{item.content}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-dark-800 rounded-xl p-6 md:p-8 border border-dark-700">
              <h2 className="text-xl font-semibold text-white mb-6">Envoyez-nous un message</h2>

              {isSubmitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send className="w-8 h-8 text-green-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Message envoye !</h3>
                  <p className="text-gray-400">Nous vous repondrons dans les plus brefs delais.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Nom complet *</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold-500"
                        placeholder="Votre nom"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Email *</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        className="w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold-500"
                        placeholder="votre@email.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Telephone</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold-500"
                        placeholder="+212 600 00 00 00"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Sujet *</label>
                      <input
                        type="text"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        required
                        className="w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold-500"
                        placeholder="Sujet de votre message"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Message *</label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                      rows={6}
                      className="w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold-500 resize-none"
                      placeholder="Votre message..."
                    />
                  </div>

                  <Button type="submit" fullWidth isLoading={isSubmitting}>
                    <Send className="w-5 h-5 mr-2" />
                    Envoyer le message
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
