
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { Client } from "https://deno.land/x/mysql@v2.11.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse request body
    const { action, params } = await req.json();
    
    // Create MySQL client
    const client = await new Client().connect({
      hostname: "auth-db1918.hstgr.io",
      username: "u756165544_biblia",
      password: "@Biblia963",
      db: "u756165544_biblia",
      port: 3306,
    });

    // Log for debugging
    console.log(`Recebida ação: ${action} com parâmetros:`, params);

    let result;
    switch (action) {
      case 'getVersions':
        result = await getVersions(client);
        break;
      case 'getBooks':
        result = await getBooks(client, params.versionId);
        break;
      case 'getChapters':
        result = await getChapters(client, params.bookId);
        break;
      case 'getVerses':
        result = await getVerses(client, params.chapterId);
        break;
      case 'search':
        result = await searchVerses(client, params.query, params.versionId, params.limit || 10);
        break;
      default:
        throw new Error(`Ação não implementada: ${action}`);
    }

    // Close the connection
    await client.close();

    return new Response(JSON.stringify({
      success: true,
      data: result,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Erro na função:", error);

    return new Response(JSON.stringify({
      success: false,
      error: error.message,
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

// Função para obter todas as versões da Bíblia
async function getVersions(client: Client): Promise<any[]> {
  const result = await client.query(`
    SELECT id, name, abbreviation, language 
    FROM bible_versions 
    ORDER BY language, name
  `);
  
  return result;
}

// Função para obter todos os livros de uma versão
async function getBooks(client: Client, versionId: string): Promise<any[]> {
  // Ajuste a consulta conforme o esquema do seu banco de dados
  const result = await client.query(`
    SELECT id, name, abbreviation, testament, chapter_count 
    FROM bible_books 
    WHERE version_id = ? 
    ORDER BY position
  `, [versionId]);
  
  return result;
}

// Função para obter todos os capítulos de um livro
async function getChapters(client: Client, bookId: string): Promise<any[]> {
  // Ajuste a consulta conforme o esquema do seu banco de dados
  const result = await client.query(`
    SELECT id, number 
    FROM bible_chapters 
    WHERE book_id = ? 
    ORDER BY number
  `, [bookId]);
  
  return result;
}

// Função para obter todos os versículos de um capítulo
async function getVerses(client: Client, chapterId: string): Promise<any[]> {
  // Ajuste a consulta conforme o esquema do seu banco de dados
  const result = await client.query(`
    SELECT id, number, text, reference 
    FROM bible_verses 
    WHERE chapter_id = ? 
    ORDER BY number
  `, [chapterId]);
  
  return result;
}

// Função para pesquisar versículos
async function searchVerses(client: Client, query: string, versionId: string, limit: number): Promise<any> {
  // Ajuste a consulta conforme o esquema do seu banco de dados
  const result = await client.query(`
    SELECT v.id, v.number, v.text, v.reference 
    FROM bible_verses v
    JOIN bible_chapters c ON v.chapter_id = c.id
    JOIN bible_books b ON c.book_id = b.id
    WHERE b.version_id = ? AND v.text LIKE ? 
    LIMIT ?
  `, [versionId, `%${query}%`, limit]);
  
  return {
    verses: result,
    total: result.length
  };
}
