'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, Bed, Bath, Maximize } from 'lucide-react';
import { Card, CardImage, CardContent, CardTitle, CardDescription } from '@/components/ui/Card';
import { formatPrice, getPropertyTypeLabel, getPropertyStatusLabel, truncateText } from '@/lib/utils';
import { Property } from '@/types';

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const imageUrl = property.images?.[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800';

  return (
    <Link href={`/properties/${property.id}`}>
      <Card hover className="h-full flex flex-col">
        {/* Image */}
        <div className="relative h-56 overflow-hidden">
          <CardImage src={imageUrl} alt={property.title} className="h-full" />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex space-x-2">
            <span className="px-3 py-1 bg-gold-500 text-dark-950 text-xs font-semibold rounded-full">
              {getPropertyTypeLabel(property.type)}
            </span>
            <span className={`
              px-3 py-1 text-xs font-semibold rounded-full
              ${property.status === 'FOR_SALE' ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'}
            `}>
              {getPropertyStatusLabel(property.status)}
            </span>
          </div>
          
          {/* Featured Badge */}
          {property.featured && (
            <div className="absolute top-3 right-3">
              <span className="px-3 py-1 bg-gradient-to-r from-gold-400 to-gold-600 text-dark-950 text-xs font-bold rounded-full">
                En Vedette
              </span>
            </div>
          )}
          
          {/* Price Overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-dark-950/90 to-transparent p-4">
            <p className="text-2xl font-bold text-white">
              {formatPrice(property.price)}
            </p>
          </div>
        </div>

        {/* Content */}
        <CardContent className="flex-1 flex flex-col">
          <CardTitle className="line-clamp-1">{property.title}</CardTitle>
          
          <div className="flex items-center text-gray-400 text-sm mb-3">
            <MapPin className="w-4 h-4 mr-1 text-gold-500" />
            <span className="truncate">{property.city}</span>
          </div>
          
          <CardDescription className="line-clamp-2 mb-4 flex-1">
            {truncateText(property.description, 100)}
          </CardDescription>
          
          {/* Features */}
          <div className="flex items-center justify-between pt-4 border-t border-dark-700">
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-gray-400 text-sm">
                <Bed className="w-4 h-4 mr-1 text-gold-500" />
                <span>{property.rooms}</span>
              </div>
              <div className="flex items-center text-gray-400 text-sm">
                <Bath className="w-4 h-4 mr-1 text-gold-500" />
                <span>{property.bathrooms}</span>
              </div>
              <div className="flex items-center text-gray-400 text-sm">
                <Maximize className="w-4 h-4 mr-1 text-gold-500" />
                <span>{property.surface} m²</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
