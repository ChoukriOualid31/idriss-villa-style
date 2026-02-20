'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Upload, X } from 'lucide-react';
import { propertyApi, uploadApi } from '@/lib/api';
import { Button } from '@/components/ui/Button';

export default function EditPropertyPage() {
  const router = useRouter();
  const { id } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    type: 'VILLA',
    status: 'FOR_SALE',
    city: '',
    address: '',
    surface: '',
    rooms: '',
    bathrooms: '',
    featured: false,
  });

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await propertyApi.getById(id as string);
        const property = response.data.data.property;
        
        setFormData({
          title: property.title,
          description: property.description,
          price: property.price.toString(),
          type: property.type,
          status: property.status,
          city: property.city,
          address: property.address,
          surface: property.surface.toString(),
          rooms: property.rooms.toString(),
          bathrooms: property.bathrooms.toString(),
          featured: property.featured,
        });
        
        setUploadedImages(property.images || []);
      } catch (error) {
        console.error('Error fetching property:', error);
        router.push('/admin/properties');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperty();
  }, [id, router]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);

    try {
      const uploadFiles = Array.from(files);
      const response = await uploadApi.uploadImages(uploadFiles);
      const newImages = response.data.data.images.map((img: any) => img.url);
      setUploadedImages([...uploadedImages, ...newImages]);
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Erreur lors du téléchargement des images');
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages(uploadedImages.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await propertyApi.update(id as string, {
        ...formData,
        price: parseFloat(formData.price),
        surface: parseFloat(formData.surface),
        rooms: parseInt(formData.rooms),
        bathrooms: parseInt(formData.bathrooms),
        images: uploadedImages,
      });

      router.push('/admin/properties');
    } catch (error: any) {
      console.error('Error updating property:', error);
      alert(error.response?.data?.message || 'Erreur lors de la modification');
    } finally {
      setIsSubmitting(false);
    }
  };

  const propertyTypes = [
    { value: 'APARTMENT', label: 'Appartement' },
    { value: 'HOUSE', label: 'Maison' },
    { value: 'VILLA', label: 'Villa' },
    { value: 'LAND', label: 'Terrain' },
    { value: 'OFFICE', label: 'Bureau' },
    { value: 'COMMERCIAL', label: 'Commercial' },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-gold-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-950">
      {/* Header */}
      <div className="bg-dark-900 border-b border-dark-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link
            href="/admin/properties"
            className="flex items-center text-gray-400 hover:text-gold-500 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Retour aux biens
          </Link>
          <h1 className="text-3xl font-serif font-bold text-white">
            Modifier le bien
          </h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info */}
          <div className="bg-dark-800 rounded-xl p-6 border border-dark-700">
            <h2 className="text-xl font-semibold text-white mb-6">
              Informations de base
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Titre *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold-500"
                  placeholder="Titre de la propriété"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows={5}
                  className="w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold-500 resize-none"
                  placeholder="Description détaillée de la propriété"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Prix (MAD) *
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                    min="0"
                    className="w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold-500"
                    placeholder="1000000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Type *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
                  >
                    {propertyTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Statut *
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
                  >
                    <option value="FOR_SALE">À Vendre</option>
                    <option value="FOR_RENT">À Louer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    En vedette
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="w-5 h-5 rounded border-dark-700 bg-dark-900 text-gold-500 focus:ring-gold-500"
                    />
                    <span className="text-gray-300">Mettre en vedette</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="bg-dark-800 rounded-xl p-6 border border-dark-700">
            <h2 className="text-xl font-semibold text-white mb-6">
              Localisation
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Ville *
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold-500"
                  placeholder="Tanger"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Adresse *
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold-500"
                  placeholder="123 Rue principale"
                />
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="bg-dark-800 rounded-xl p-6 border border-dark-700">
            <h2 className="text-xl font-semibold text-white mb-6">
              Caractéristiques
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Surface (m²) *
                </label>
                <input
                  type="number"
                  value={formData.surface}
                  onChange={(e) => setFormData({ ...formData, surface: e.target.value })}
                  required
                  min="0"
                  className="w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold-500"
                  placeholder="200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Pièces *
                </label>
                <input
                  type="number"
                  value={formData.rooms}
                  onChange={(e) => setFormData({ ...formData, rooms: e.target.value })}
                  required
                  min="0"
                  className="w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold-500"
                  placeholder="4"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Salles de bain *
                </label>
                <input
                  type="number"
                  value={formData.bathrooms}
                  onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                  required
                  min="0"
                  className="w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold-500"
                  placeholder="2"
                />
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="bg-dark-800 rounded-xl p-6 border border-dark-700">
            <h2 className="text-xl font-semibold text-white mb-6">
              Images
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-dark-700 rounded-lg cursor-pointer hover:border-gold-500 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 text-gray-500 mb-2" />
                    <p className="text-sm text-gray-400">
                      Cliquez pour télécharger des images
                    </p>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, WEBP (max. 5MB)
                    </p>
                  </div>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={isUploading}
                  />
                </label>
              </div>

              {isUploading && (
                <p className="text-center text-gray-400">Téléchargement en cours...</p>
              )}

              {uploadedImages.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {uploadedImages.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center space-x-4">
            <Button
              type="submit"
              isLoading={isSubmitting}
              className="flex-1"
            >
              Enregistrer les modifications
            </Button>
            <Link href="/admin/properties">
              <Button variant="outline" type="button">
                Annuler
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
