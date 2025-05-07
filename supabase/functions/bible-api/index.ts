
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const apiKey = Deno.env.get('SCRIPTURE_API_BIBLE_KEY');
const baseUrl = "https://api.scripture.api.bible/v1";

// Cria o cliente Supabase
const supabaseUrl = Deno.env.get('SUPABASE_URL') as string;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') as string;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function fetchFromAPI(endpoint: string, params?: any) {
  let url = `${baseUrl}${endpoint}`;
  
  // Adicionar parâmetros de query string se fornecidos
  if (params) {
    const queryParams = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value) queryParams.append(key, value.toString());
    }
    if (queryParams.toString()) {
      url += `?${queryParams.toString()}`;
    }
  }
  
  console.log(`Buscando: ${url}`);
  
  const response = await fetch(url, {
    headers: { 'api-key': apiKey as string }
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Erro API (${response.status}): ${errorText}`);
    throw new Error(`Erro na API: ${response.statusText}`);
  }
  
  return await response.json();
}

async function fetchFromDatabase(endpoint: string, params?: any) {
  console.log(`Buscando do banco de dados: ${endpoint} com params:`, params);
  
  try {
    // Verificar qual tipo de endpoint estamos processando
    if (endpoint === '/versions') {
      const { data, error } = await supabase
        .from('bible_versions')
        .select('*');
      
      if (error) throw error;
      
      return { data };
    }
    else if (endpoint === '/books') {
      const bibleId = params?.bibleId;
      
      const { data: versionData, error: versionError } = await supabase
        .from('bible_versions')
        .select('id')
        .eq('version_id', bibleId)
        .single();
      
      if (versionError) throw versionError;
      
      const { data, error } = await supabase
        .from('bible_books')
        .select('*')
        .eq('version_id', versionData.id)
        .order('position');
      
      if (error) throw error;
      
      return { data };
    }
    else if (endpoint === '/chapters') {
      const bibleId = params?.bibleId;
      const bookId = params?.bookId;
      
      const { data: bookData, error: bookError } = await supabase
        .from('bible_books')
        .select('id')
        .eq('book_id', bookId)
        .single();
      
      if (bookError) throw bookError;
      
      const { data, error } = await supabase
        .from('bible_chapters')
        .select('*')
        .eq('book_id', bookData.id)
        .order('number');
      
      if (error) throw error;
      
      return { data };
    }
    else if (endpoint === '/verses') {
      const bibleId = params?.bibleId;
      const chapterId = params?.chapterId;
      
      const { data: chapterData, error: chapterError } = await supabase
        .from('bible_chapters')
        .select('id')
        .eq('chapter_id', chapterId)
        .single();
      
      if (chapterError) throw chapterError;
      
      const { data, error } = await supabase
        .from('bible_verses')
        .select('*')
        .eq('chapter_id', chapterData.id)
        .order('number');
      
      if (error) throw error;
      
      return { data };
    }
    else if (endpoint === '/verse') {
      const bibleId = params?.bibleId;
      const verseId = params?.verseId;
      
      const { data: verseData, error: verseError } = await supabase
        .from('bible_verses')
        .select('*')
        .eq('verse_id', verseId)
        .single();
      
      if (verseError) throw verseError;
      
      return { data: verseData };
    }
    else if (endpoint === '/passage') {
      // Para passagens, ainda precisamos usar a API
      return await fetchFromAPI(`/bibles/${params.bibleId}/passages/${params.passageId}`, {});
    }
    else if (endpoint === '/simple-verse') {
      // Para busca simples via bible-api.com
      const reference = params?.reference;
      const translation = params?.translation || 'almeida';
      
      const url = `https://bible-api.com/${encodeURIComponent(reference)}?translation=${translation}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Erro ao buscar versículo: ${response.statusText}`);
      }
      
      return await response.json();
    }
    
    throw new Error(`Endpoint não implementado: ${endpoint}`);
  } catch (error) {
    console.error(`Erro ao buscar do banco de dados: ${error.message}`);
    throw error;
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const { endpoint, params } = await req.json();
    console.log(`Solicitação recebida para endpoint: ${endpoint}`);
    
    let result;
    
    // Primeiro tenta buscar do banco de dados
    try {
      result = await fetchFromDatabase(endpoint, params);
      console.log(`Dados encontrados no banco de dados para ${endpoint}`);
    } catch (dbError) {
      console.log(`Não encontrado no banco de dados, tentando API: ${dbError.message}`);
      
      // Se não encontrou no banco, busca da API
      if (!endpoint.startsWith('/simple-verse')) {
        // Construir o caminho correto da API baseado nos parâmetros
        let apiPath = '';
        if (endpoint === '/versions') {
          apiPath = '/bibles';
        } else if (endpoint === '/books') {
          apiPath = `/bibles/${params.bibleId}/books`;
        } else if (endpoint === '/chapters') {
          apiPath = `/bibles/${params.bibleId}/books/${params.bookId}/chapters`;
        } else if (endpoint === '/verses') {
          apiPath = `/bibles/${params.bibleId}/chapters/${params.chapterId}/verses`;
        } else if (endpoint === '/verse') {
          apiPath = `/bibles/${params.bibleId}/verses/${params.verseId}`;
        } else if (endpoint === '/passage') {
          apiPath = `/bibles/${params.bibleId}/passages/${params.passageId}`;
        } else {
          apiPath = endpoint;
        }
        
        result = await fetchFromAPI(apiPath);
      } else {
        // Para o endpoint simple-verse, relanço o erro para ser tratado pelo catch principal
        throw dbError;
      }
    }
    
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error(`Erro geral: ${error.message}`);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    });
  }
});
