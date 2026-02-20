'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { propertyApi } from '@/lib/api';
import { Property } from '@/types';
import { formatPrice, getPropertyTypeLabel, getPropertyStatusLabel } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

export default function AdminPropertiesPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'ADMIN') {
      router.push('/login');
      return;
    }
    fetchProperties();
  }, [isAuthenticated, user, router]);

  const fetchProperties = async () => {
    try {
      const response = await propertyApi.getAll({ limit: 100 });
      setProperties(response.data.data.properties);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette propriété ?')) {
      return;
    }

    try {
      await propertyApi.delete(id);
      setProperties(properties.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error deleting property:', error);
      alert('Erreur lors de la suppression');
    }
  };

  const filteredProperties = properties.filter(p =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isAuthenticated || user?.role !== 'ADMIN') {
    return null;
  }

  return (
    <div className="min-h-screen bg-dark-950">
      {/* Header */}
      <div className="bg-dark-900 border-b border-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-serif font-bold text-white">
                Gestion des biens
              </h1>
              <p className="text-gray-400 mt-1">
                {properties.length} propriété{properties.length > 1 ? 's' : ''} au total
              </p>
            </div>
            <Link href="/admin/properties/new">
              <Button className="flex items-center space-x-2">
                <Plus className="w-5 h-5" />
                <span>Ajouter un bien</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Rechercher un bien..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-dark-800 border border-dark-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold-500"
            />
          </div>
        </div>

        {/* Properties Table */}
        {isLoading ? (
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-dark-800 rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="bg-dark-800 rounded-xl border border-dark-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-dark-900 border-b border-dark-700">
                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">
                      Propriété
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">
                      Type
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">
                      Prix
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">
                      Ville
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">
                      Statut
                    </th>
                    <th className="text-right px-6 py-4 text-sm font-medium text-gray-400">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProperties.map((property) => (
                    <tr
                      key={property.id}
                      className="border-b border-dark-700 last:border-b-0 hover:bg-dark-700/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={property.images?.[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=100'}
                            alt={property.title}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div>
                            <p className="text-white font-medium line-clamp-1">
                              {property.title}
                            </p>
                            <p className="text-gray-400 text-sm">
                              {property.surface} m² • {property.rooms} pièces
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-dark-700 text-gray-300 text-sm rounded-full">
                          {getPropertyTypeLabel(property.type)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-gold-500 font-semibold">
                          {formatPrice(property.price)}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-gray-300">
                        {property.city}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`
                          px-3 py-1 text-sm rounded-full
                          ${property.status === 'FOR_SALE' 
                            ? 'bg-green-500/20 text-green-500' 
                            : 'bg-blue-500/20 text-blue-500'
                          }
                        `}>
                          {getPropertyStatusLabel(property.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end space-x-2">
                          <Link
                            href={`/properties/${property.id}`}
                            className="p-2 text-gray-400 hover:text-gold-500 transition-colors"
                            title="Voir"
                          >
                            <Eye className="w-5 h-5" />
                          </Link>
                          <Link
                            href={`/admin/properties/edit/${property.id}`}
                            className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
                            title="Modifier"
                          >
                            <Edit className="w-5 h-5" />
                          </Link>
                          <button
                            onClick={() => handleDelete(property.id)}
                            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                            title="Supprimer"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredProperties.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-400">
                  {searchQuery ? 'Aucun résultat trouvé' : 'Aucune propriété'}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
