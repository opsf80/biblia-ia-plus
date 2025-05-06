
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Headers CORS para permitir requisições do frontend
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// API da Bíblia
const SCRIPTURE_API_KEY = Deno.env.get("SCRIPTURE_API_BIBLE_KEY") || "";
const SCRIPTURE_API_URL = "https://api.scripture.api.bible/v1";

// Nova API da Bíblia (bible-api.com)
const BIBLE_API_URL = "https://bible-api.com";

serve(async (req) => {
  // Tratando requisições OPTIONS (CORS preflight)
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Extrair os parâmetros do corpo da requisição
    let body;
    try {
      body = await req.json();
    } catch (e) {
      return new Response(JSON.stringify({ error: "Invalid request body" }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const { endpoint, params } = body;
    
    if (!endpoint) {
      return new Response(JSON.stringify({ error: "Missing endpoint parameter" }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Tratando o novo endpoint para a bible-api.com
    if (endpoint === '/simple-verse') {
      if (!params?.reference) {
        return new Response(JSON.stringify({ error: "Parâmetro reference é obrigatório" }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      const translation = params.translation || 'almeida';
      const reference = encodeURIComponent(params.reference);
      
      // Construir URL para a bible-api.com
      const url = `${BIBLE_API_URL}/${reference}?translation=${translation}`;
      
      console.log(`Requisitando bible-api.com: ${url}`);
      
      try {
        const response = await fetch(url);
        
        if (!response.ok) {
          if (response.status === 404) {
            return new Response(JSON.stringify({ 
              error: "Versículo não encontrado", 
              details: "A referência bíblica informada não foi encontrada"
            }), {
              status: 404,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
          }
          
          return new Response(JSON.stringify({ 
            error: "Erro ao acessar a API da Bíblia",
            details: `Status: ${response.status}`
          }), {
            status: response.status,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }
        
        const data = await response.json();
        return new Response(JSON.stringify(data), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      } catch (error) {
        console.error("Erro ao acessar bible-api.com:", error);
        return new Response(JSON.stringify({ 
          error: "Erro ao acessar a API da Bíblia",
          details: error.message
        }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    }

    // Tratando diferentes endpoints da API original
    let apiUrl = "";
    let queryParams = "";
    let includeContent = false;

    switch (endpoint) {
      case "/versions":
        // Listar versões disponíveis
        apiUrl = `${SCRIPTURE_API_URL}/bibles`;
        break;
        
      case "/books":
        // Listar livros de uma versão específica
        if (!params?.bibleId) {
          return new Response(JSON.stringify({ error: "Parâmetro bibleId é obrigatório" }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }
        apiUrl = `${SCRIPTURE_API_URL}/bibles/${params.bibleId}/books`;
        break;
        
      case "/chapters":
        // Listar capítulos de um livro específico
        if (!params?.bibleId || !params?.bookId) {
          return new Response(JSON.stringify({ error: "Parâmetros bibleId e bookId são obrigatórios" }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }
        apiUrl = `${SCRIPTURE_API_URL}/bibles/${params.bibleId}/books/${params.bookId}/chapters`;
        break;
        
      case "/verses":
        // Buscar versículos de um capítulo específico
        if (!params?.bibleId || !params?.chapterId) {
          return new Response(JSON.stringify({ error: "Parâmetros bibleId e chapterId são obrigatórios" }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }
        apiUrl = `${SCRIPTURE_API_URL}/bibles/${params.bibleId}/chapters/${params.chapterId}/verses`;
        includeContent = true;
        break;
        
      case "/verse":
        // Buscar um versículo específico
        if (!params?.bibleId || !params?.verseId) {
          return new Response(JSON.stringify({ error: "Parâmetros bibleId e verseId são obrigatórios" }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }
        apiUrl = `${SCRIPTURE_API_URL}/bibles/${params.bibleId}/verses/${params.verseId}`;
        includeContent = true;
        break;
        
      case "/search":
        // Buscar versículos por palavras-chave
        if (!params?.bibleId || !params?.query) {
          return new Response(JSON.stringify({ error: "Parâmetros bibleId e query são obrigatórios" }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }
        apiUrl = `${SCRIPTURE_API_URL}/bibles/${params.bibleId}/search`;
        queryParams = `?query=${encodeURIComponent(params.query)}`;
        if (params.limit) queryParams += `&limit=${params.limit}`;
        if (params.offset) queryParams += `&offset=${params.offset}`;
        break;
        
      case "/passage":
        // Buscar uma passagem específica
        if (!params?.bibleId || !params?.passageId) {
          return new Response(JSON.stringify({ error: "Parâmetros bibleId e passageId são obrigatórios" }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }
        apiUrl = `${SCRIPTURE_API_URL}/bibles/${params.bibleId}/passages/${encodeURIComponent(params.passageId)}`;
        includeContent = true;
        break;
        
      default:
        return new Response(JSON.stringify({ error: "Endpoint não suportado" }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }

    // Para endpoints que precisam de conteúdo, adicione o parâmetro includeContent
    if (includeContent && !queryParams.includes('includeContent')) {
      queryParams = queryParams ? `${queryParams}&include-content=true` : `?include-content=true`;
    }

    // Fazendo a requisição para a API da Bible
    console.log(`Requisitando: ${apiUrl}${queryParams}`);
    
    const response = await fetch(`${apiUrl}${queryParams}`, {
      method: "GET",
      headers: {
        "api-key": SCRIPTURE_API_KEY,
        "Content-Type": "application/json"
      }
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Erro na API:", data);
      return new Response(JSON.stringify({ 
        error: "Erro ao acessar a API da Bíblia",
        details: data
      }), {
        status: response.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Retornando os dados da API
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error("Erro na Edge Function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
