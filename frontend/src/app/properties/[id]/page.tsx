'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  MapPin, Bed, Bath, Maximize, Calendar, User, 
  ChevronLeft, ChevronRight, Phone, Mail 
} from 'lucide-react';
import { useProperty } from '@/hooks/useProperties';
import { Button } from '@/components/ui/Button';
import { formatPrice, getPropertyTypeLabel, getPropertyStatusLabel, formatDate } from '@/lib/utils';

export default function PropertyDetailPage() {
  const { id } = useParams();
  const { property, isLoading, error } = useProperty(id as string);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-950 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-96 bg-dark-800 rounded-xl" />
            <div className="h-8 bg-dark-800 rounded w-1/2" />
            <div className="h-4 bg-dark-800 rounded w-1/4" />
            <div className="h-32 bg-dark-800 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-dark-950 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-2xl font-bold text-white mb-4">
            Propriété non trouvée
          </h1>
          <p className="text-gray-400 mb-8">
            {error || 'Cette propriété n\'existe pas ou a été supprimée.'}
          </p>
          <Link href="/properties">
            <Button>Retour aux biens</Button>
          </Link>
        </div>
      </div>
    );
  }

  const images = property.images?.length > 0 
    ? property.images 
    : ['https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800'];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="min-h-screen bg-dark-950">
      {/* Breadcrumb */}
      <div className="bg-dark-900 border-b border-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link 
            href="/properties" 
            className="text-gray-400 hover:text-gold-500 transition-colors flex items-center"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Retour aux biens
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Image Gallery */}
        <div className="relative mb-8">
          <div className="relative h-96 md:h-[500px] rounded-xl overflow-hidden">
            <img
              src={images[currentImageIndex]}
              alt={property.title}
              className="w-full h-full object-cover"
            />
            
            {/* Navigation Arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-dark-950/70 hover:bg-dark-950 rounded-full flex items-center justify-center text-white transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-dark-950/70 hover:bg-dark-950 rounded-full flex items-center justify-center text-white transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
            
            {/* Image Counter */}
            <div className="absolute bottom-4 right-4 px-4 py-2 bg-dark-950/70 rounded-lg text-white text-sm">
              {currentImageIndex + 1} / {images.length}
            </div>
          </div>
          
          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex space-x-2 mt-4 overflow-x-auto pb-2">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`
                    flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors
                    ${index === currentImageIndex 
                      ? 'border-gold-500' 
                      : 'border-transparent hover:border-gray-600'
                    }
                  `}
                >
                  <img
                    src={image}
                    alt={`${property.title} - ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Header */}
            <div className="mb-6">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-gold-500 text-dark-950 text-sm font-semibold rounded-full">
                  {getPropertyTypeLabel(property.type)}
                </span>
                <span className={`
                  px-3 py-1 text-sm font-semibold rounded-full
                  ${property.status === 'FOR_SALE' ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'}
                `}>
                  {getPropertyStatusLabel(property.status)}
                </span>
                {property.featured && (
                  <span className="px-3 py-1 bg-gradient-to-r from-gold-400 to-gold-600 text-dark-950 text-sm font-bold rounded-full">
                    En Vedette
                  </span>
                )}
              </div>
              
              <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-2">
                {property.title}
              </h1>
              
              <div className="flex items-center text-gray-400">
                <MapPin className="w-5 h-5 mr-2 text-gold-500" />
                <span>{property.address}, {property.city}</span>
              </div>
            </div>

            {/* Price */}
            <div className="bg-dark-800 rounded-xl p-6 mb-6 border border-dark-700">
              <p className="text-gray-400 text-sm mb-1">Prix</p>
              <p className="text-4xl font-bold text-gold-500">
                {formatPrice(property.price)}
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-dark-800 rounded-xl p-4 text-center border border-dark-700">
                <Bed className="w-6 h-6 text-gold-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">{property.rooms}</p>
                <p className="text-gray-400 text-sm">Pièces</p>
              </div>
              <div className="bg-dark-800 rounded-xl p-4 text-center border border-dark-700">
                <Bath className="w-6 h-6 text-gold-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">{property.bathrooms}</p>
                <p className="text-gray-400 text-sm">Salles de bain</p>
              </div>
              <div className="bg-dark-800 rounded-xl p-4 text-center border border-dark-700">
                <Maximize className="w-6 h-6 text-gold-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">{property.surface}</p>
                <p className="text-gray-400 text-sm">m²</p>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-4">
                Description
              </h2>
              <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                {property.description}
              </p>
            </div>

            {/* Details */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-4">
                Détails
              </h2>
              <div className="bg-dark-800 rounded-xl p-6 border border-dark-700">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 text-gold-500 mr-3" />
                    <div>
                      <p className="text-gray-400 text-sm">Publié le</p>
                      <p className="text-white">{formatDate(property.createdAt)}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <User className="w-5 h-5 text-gold-500 mr-3" />
                    <div>
                      <p className="text-gray-400 text-sm">Annonceur</p>
                      <p className="text-white">{property.user?.name || 'Idriss Villa Style'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-dark-800 rounded-xl p-6 border border-dark-700 sticky top-24">
              <h3 className="text-xl font-semibold text-white mb-6">
                Intéressé par ce bien ?
              </h3>
              
              <div className="space-y-4">
                <a href="tel:+212600000000">
                  <Button fullWidth className="mb-4">
                    <Phone className="w-5 h-5 mr-2" />
                    Appeler maintenant
                  </Button>
                </a>
                
                <a href="mailto:contact@idrissvilla.com">
                  <Button variant="outline" fullWidth>
                    <Mail className="w-5 h-5 mr-2" />
                    Envoyer un email
                  </Button>
                </a>
              </div>
              
              <div className="mt-6 pt-6 border-t border-dark-700">
                <p className="text-gray-400 text-sm text-center">
                  Référence: <span className="text-white">{property.id.slice(0, 8).toUpperCase()}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
