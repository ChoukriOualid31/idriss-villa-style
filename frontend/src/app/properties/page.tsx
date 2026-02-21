'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { PropertyGrid } from '@/components/property/PropertyGrid';
import { PropertyFilters } from '@/components/property/PropertyFilters';
import { useProperties } from '@/hooks/useProperties';
import { Button } from '@/components/ui/Button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { propertyApi } from '@/lib/api';
import { PropertyType } from '@/types';

function PropertiesPageContent() {
  const searchParams = useSearchParams();
  const [cities, setCities] = useState<string[]>([]);
  
  const initialFilters = {
    city: searchParams.get('city') || undefined,
    type: searchParams.get('type') as any || undefined,
    status: searchParams.get('status') as any || undefined,
  };

  const {
    properties,
    pagination,
    isLoading,
    filters,
    fetchProperties,
    updateFilters,
    resetFilters,
  } = useProperties(initialFilters);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await propertyApi.getCities();
        setCities(response.data.data.cities);
      } catch (error) {
        console.error('Error fetching cities:', error);
      }
    };
    fetchCities();
  }, []);

  const typeTabs: { label: string; value?: PropertyType }[] = [
    { label: 'All' },
    { label: 'Villa', value: 'VILLA' },
    { label: 'Maison', value: 'HOUSE' },
    { label: 'Terrain', value: 'LAND' },
    { label: 'Appartement', value: 'APARTMENT' },
    { label: 'Bureau', value: 'OFFICE' },
    { label: 'Commercial', value: 'COMMERCIAL' },
  ];

  return (
    <div className="min-h-screen bg-dark-950">
      {/* Header */}
      <div className="bg-dark-900 border-b border-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-4">
            Nos Biens Immobiliers
          </h1>
          <p className="text-gray-400 max-w-2xl">
            Découvrez notre sélection de propriétés d&apos;exception au Maroc. 
            Utilisez les filtres pour affiner votre recherche.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="mb-8">
          <PropertyFilters
            filters={filters}
            onFilterChange={updateFilters}
            onReset={resetFilters}
            cities={cities}
          />
        </div>

        {/* Quick Type Tabs */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {typeTabs.map((tab) => {
              const active = (filters.type || undefined) === tab.value;
              return (
                <button
                  key={tab.label}
                  onClick={() => updateFilters({ type: tab.value })}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    active
                      ? 'bg-gold-500 text-dark-950'
                      : 'bg-dark-800 text-gray-300 border border-dark-700 hover:bg-dark-700 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-400">
            {isLoading ? (
              'Chargement...'
            ) : (
              <>
                <span className="text-white font-semibold">{pagination.totalCount}</span> propriété
                {pagination.totalCount > 1 ? 's' : ''} trouvée
                {pagination.totalCount > 1 ? 's' : ''}
              </>
            )}
          </p>
        </div>

        {/* Properties Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-dark-800 rounded-xl h-96 animate-pulse" />
            ))}
          </div>
        ) : (
          <PropertyGrid properties={properties} />
        )}

        {/* Pagination */}
        {!isLoading && pagination.totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchProperties(pagination.currentPage - 1)}
              disabled={!pagination.hasPrevPage}
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            
            <div className="flex items-center space-x-2">
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => fetchProperties(page)}
                  className={`
                    w-10 h-10 rounded-lg font-medium transition-colors
                    ${page === pagination.currentPage
                      ? 'bg-gold-500 text-dark-950'
                      : 'bg-dark-800 text-gray-400 hover:bg-dark-700 hover:text-white'
                    }
                  `}
                >
                  {page}
                </button>
              ))}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchProperties(pagination.currentPage + 1)}
              disabled={!pagination.hasNextPage}
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PropertiesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-dark-950" />}>
      <PropertiesPageContent />
    </Suspense>
  );
}
