// ============================================
// UTILITAIRE CLASSNAMES
// ============================================

import { clsx, type ClassValue } from 'clsx';

/**
 * Utility pour combiner des classes CSS conditionnelles
 * Remplace classnames/clsx avec une fonction simplifiée
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}
