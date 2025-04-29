
import { supabase } from '@/integrations/supabase/client';

// Helper function to call Bible API via edge function
export async function callBibleApi(endpoint: string, params?: Record<string, any>) {
  try {
    const { data, error } = await supabase.functions.invoke('bible-api', {
      body: { endpoint, params }
    });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Bible API error (${endpoint}):`, error);
    throw error;
  }
}
