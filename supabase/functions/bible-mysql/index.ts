
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
        result = await getBooks(client, params.language);
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

// Função para obter todos os livros de uma linguagem específica (pt ou en)
async function getBooks(client: Client, language: string): Promise<any[]> {
  let tableName = language === 'pt' ? 'tbbiblia_pt' : 'tbbiblia_en';
  
  // Select distinct books from the appropriate table
  const result = await client.query(`
    SELECT DISTINCT liv, livro
    FROM ${tableName}
    ORDER BY CAST(liv AS UNSIGNED)
  `);
  
  return result;
}

// Função para obter todos os capítulos de um livro
async function getChapters(client: Client, bookId: string): Promise<any[]> {
  // Adjust the query based on the table schema
  const result = await client.query(`
    SELECT DISTINCT cap as number, liv as book_id
    FROM tbbiblia_pt
    WHERE liv = ?
    ORDER BY CAST(cap AS UNSIGNED)
  `, [bookId]);
  
  return result.map((chapter: any) => ({
    id: `${chapter.book_id}-${chapter.number}`,
    number: chapter.number,
    book_id: chapter.book_id
  }));
}

// Função para obter todos os versículos de um capítulo
async function getVerses(client: Client, chapterId: string): Promise<any[]> {
  // Split the chapter ID to get book ID and chapter number
  const [bookId, chapterNumber] = chapterId.split('-');
  
  // Adjust the query based on the table schema
  const result = await client.query(`
    SELECT id, liv, cap, ver, texto
    FROM tbbiblia_pt
    WHERE liv = ? AND cap = ?
    ORDER BY CAST(ver AS UNSIGNED)
  `, [bookId, chapterNumber]);
  
  return result.map((verse: any) => ({
    id: verse.id,
    number: parseInt(verse.ver),
    text: verse.texto,
    reference: `${verse.liv}:${verse.cap}:${verse.ver}`
  }));
}

// Função para pesquisar versículos
async function searchVerses(client: Client, query: string, language: string, limit: number): Promise<any> {
  const tableName = language === 'en' ? 'tbbiblia_en' : 'tbbiblia_pt';
  
  // Adjust the query based on the table schema
  const result = await client.query(`
    SELECT id, liv, livro, cap, ver, texto
    FROM ${tableName}
    WHERE texto LIKE ?
    LIMIT ?
  `, [`%${query}%`, limit]);
  
  return {
    verses: result.map((verse: any) => ({
      id: verse.id,
      reference: `${verse.livro} ${verse.cap}:${verse.ver}`,
      text: verse.texto
    })),
    total: result.length
  };
}
