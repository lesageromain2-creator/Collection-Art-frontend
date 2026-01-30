// ============================================
// CONFIGURATION SUPABASE CLIENT
// ============================================

import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Supabase est optionnel en local - ne pas crasher si les variables ne sont pas définies
const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured && typeof window !== 'undefined') {
  console.warn(
    '⚠️ Supabase non configuré. Définissez NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY dans .env.local pour activer les fonctionnalités Supabase.'
  );
}

// Créer le client Supabase seulement si configuré, sinon null
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    })
  : null;

// Helper pour vérifier si Supabase est disponible
export const isSupabaseAvailable = (): boolean => isSupabaseConfigured && supabase !== null;

// Helper pour uploader des fichiers dans Supabase Storage
export const uploadFile = async (
  bucket: string,
  path: string,
  file: File
): Promise<{ url: string | null; error: Error | null }> => {
  if (!supabase) {
    return { url: null, error: new Error('Supabase non configuré') };
  }

  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) throw error;

    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(data.path);

    return { url: publicUrl, error: null };
  } catch (error) {
    return { url: null, error: error as Error };
  }
};

// Helper pour supprimer des fichiers
export const deleteFile = async (
  bucket: string,
  path: string
): Promise<{ success: boolean; error: Error | null }> => {
  if (!supabase) {
    return { success: false, error: new Error('Supabase non configuré') };
  }

  try {
    const { error } = await supabase.storage.from(bucket).remove([path]);

    if (error) throw error;

    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: error as Error };
  }
};

// Helper pour obtenir l'URL publique d'un fichier
export const getPublicUrl = (bucket: string, path: string): string | null => {
  if (!supabase) {
    console.warn('Supabase non configuré - impossible d\'obtenir l\'URL publique');
    return null;
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(bucket).getPublicUrl(path);

  return publicUrl;
};
