'use client';

import React from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { PropertyType, PropertyStatus, PropertyFilters as Filters } from '@/types';

interface PropertyFiltersProps {
  filters: Filters;
  onFilterChange: (filters: Filters) => void;
  onReset: () => void;
  cities: string[];
}

export function PropertyFilters({ filters, onFilterChange, onReset, cities }: PropertyFiltersProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const propertyTypes: { value: PropertyType; label: string }[] = [
    { value: 'APARTMENT', label: 'Appartement' },
    { value: 'HOUSE', label: 'Maison' },
    { value: 'VILLA', label: 'Villa' },
    { value: 'LAND', label: 'Terrain' },
    { value: 'OFFICE', label: 'Bureau' },
    { value: 'COMMERCIAL', label: 'Commercial' },
  ];

  const propertyStatuses: { value: PropertyStatus; label: string }[] = [
    { value: 'FOR_SALE', label: 'À Vendre' },
    { value: 'FOR_RENT', label: 'À Louer' },
  ];

  const hasActiveFilters = Object.values(filters).some(v => v !== undefined && v !== '');

  return (
    <div className="bg-dark-800 rounded-xl p-6 border border-dark-700">
      {/* Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Rechercher une propriété..."
            value={filters.search || ''}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            className="w-full pl-12 pr-4 py-3 bg-dark-900 border border-dark-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold-500"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2"
        >
          <Filter className="w-5 h-5" />
          <span>Filtres</span>
          {hasActiveFilters && (
            <span className="ml-2 px-2 py-0.5 bg-gold-500 text-dark-950 text-xs rounded-full">
              Actifs
            </span>
          )}
        </Button>
        {hasActiveFilters && (
          <Button variant="ghost" onClick={onReset} className="flex items-center space-x-2">
            <X className="w-5 h-5" />
            <span>Réinitialiser</span>
          </Button>
        )}
      </div>

      {/* Advanced Filters */}
      {isOpen && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-6 border-t border-dark-700 animate-fade-in">
          {/* City */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Ville
            </label>
            <select
              value={filters.city || ''}
              onChange={(e) => onFilterChange({ city: e.target.value || undefined })}
              className="w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
            >
              <option value="">Toutes les villes</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Type de bien
            </label>
            <select
              value={filters.type || ''}
              onChange={(e) => onFilterChange({ type: (e.target.value as PropertyType) || undefined })}
              className="w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
            >
              <option value="">Tous les types</option>
              {propertyTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Statut
            </label>
            <select
              value={filters.status || ''}
              onChange={(e) => onFilterChange({ status: (e.target.value as PropertyStatus) || undefined })}
              className="w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
            >
              <option value="">Tous les statuts</option>
              {propertyStatuses.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Prix maximum
            </label>
            <select
              value={filters.maxPrice || ''}
              onChange={(e) => onFilterChange({ maxPrice: e.target.value ? parseInt(e.target.value) : undefined })}
              className="w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
            >
              <option value="">Sans limite</option>
              <option value="500000">500 000 MAD</option>
              <option value="1000000">1 000 000 MAD</option>
              <option value="2000000">2 000 000 MAD</option>
              <option value="5000000">5 000 000 MAD</option>
              <option value="10000000">10 000 000 MAD</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
