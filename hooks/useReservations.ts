// ============================================
// HOOK GESTION RÉSERVATIONS
// ============================================

import { useState, useEffect, useCallback } from 'react';
import axiosInstance from '@/lib/axios';
import type { 
  Reservation, 
  ReservationCreateData,
  ReservationUpdateData,
  PaginatedResponse 
} from '@/types';
import { toast } from 'react-toastify';

export const useReservations = (autoFetch = true) => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReservations = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await axiosInstance.get<PaginatedResponse<Reservation>>(
        '/reservations'
      );

      setReservations(response.data.data);
    } catch (err: any) {
      const message = err.response?.data?.message || 'Erreur de chargement';
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createReservation = useCallback(async (data: ReservationCreateData) => {
    try {
      setIsLoading(true);

      const response = await axiosInstance.post<{ data: Reservation }>(
        '/reservations',
        data
      );

      toast.success('Réservation créée avec succès !');
      return response.data.data;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Erreur de création';
      toast.error(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateReservation = useCallback(
    async (id: string, data: ReservationUpdateData) => {
      try {
        setIsLoading(true);

        const response = await axiosInstance.put<{ data: Reservation }>(
          `/reservations/${id}`,
          data
        );

        setReservations((prev) =>
          prev.map((r) => (r.id === id ? response.data.data : r))
        );

        toast.success('Réservation mise à jour !');
        return response.data.data;
      } catch (err: any) {
        const message = err.response?.data?.message || 'Erreur de mise à jour';
        toast.error(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const cancelReservation = useCallback(async (id: string, reason?: string) => {
    try {
      setIsLoading(true);

      await axiosInstance.post(`/reservations/${id}/cancel`, { reason });

      setReservations((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: 'cancelled' as const } : r))
      );

      toast.success('Réservation annulée');
    } catch (err: any) {
      const message = err.response?.data?.message || 'Erreur d\'annulation';
      toast.error(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (autoFetch) {
      fetchReservations();
    }
  }, [autoFetch, fetchReservations]);

  return {
    reservations,
    isLoading,
    error,
    fetchReservations,
    createReservation,
    updateReservation,
    cancelReservation,
  };
};
