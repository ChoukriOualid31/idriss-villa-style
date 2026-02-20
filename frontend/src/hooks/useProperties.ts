'use client';

import { useState, useEffect, useCallback } from 'react';
import { propertyApi } from '@/lib/api';
import { Property, PropertyFilters, PropertyListResponse } from '@/types';

export function useProperties(initialFilters?: PropertyFilters) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    limit: 12,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<PropertyFilters>(initialFilters || {});

  const fetchProperties = useCallback(async (page = 1, newFilters?: PropertyFilters) => {
    setIsLoading(true);
    setError(null);

    try {
      const currentFilters = newFilters || filters;
      const response = await propertyApi.getAll({
        page,
        limit: 12,
        ...currentFilters,
      });

      const data: PropertyListResponse = response.data.data;
      setProperties(data.properties);
      setPagination(data.pagination);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors du chargement des propriétés');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  const updateFilters = useCallback((newFilters: PropertyFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({});
  }, []);

  useEffect(() => {
    fetchProperties(1);
  }, [filters]);

  return {
    properties,
    pagination,
    isLoading,
    error,
    filters,
    fetchProperties,
    updateFilters,
    resetFilters,
  };
}

export function useProperty(id: string) {
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperty = async () => {
      if (!id) return;
      
      setIsLoading(true);
      setError(null);

      try {
        const response = await propertyApi.getById(id);
        setProperty(response.data.data.property);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Propriété non trouvée');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  return { property, isLoading, error };
}

export function useFeaturedProperties(limit = 6) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await propertyApi.getFeatured(limit);
        setProperties(response.data.data.properties);
      } catch (error) {
        console.error('Error fetching featured properties:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeatured();
  }, [limit]);

  return { properties, isLoading };
}
