
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const apiKey = Deno.env.get('SCRIPTURE_API_BIBLE_KEY');
const baseUrl = "https://api.scripture.api.bible/v1";

// Cria o cliente Supabase com a chave de serviço para poder inserir dados
const supabaseUrl = Deno.env.get('SUPABASE_URL') as string;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') as string;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function importBooks(bibleId: string) {
  try {
    console.log(`Começando a importar livros para a Bíblia ${bibleId}`);
    
    // Buscar a versão da Bíblia no Supabase
    const { data: versionData, error: versionError } = await supabase
      .from('bible_versions')
      .select('id')
      .eq('version_id', bibleId)
      .single();
    
    if (versionError || !versionData) {
      console.error(`Erro ao buscar versão da Bíblia: ${versionError?.message}`);
      return { success: false, message: `Versão não encontrada: ${bibleId}` };
    }
    
    // Buscar os livros da API
    const response = await fetch(`${baseUrl}/bibles/${bibleId}/books`, {
      headers: { 'api-key': apiKey as string }
    });
    
    if (!response.ok) {
      console.error(`Erro API (${response.status}): ${await response.text()}`);
      return { success: false, message: `Erro na API: ${response.statusText}` };
    }
    
    const data = await response.json();
    const books = data.data;
    
    console.log(`Encontrados ${books.length} livros para importar.`);
    
    // Processar cada livro
    for (const book of books) {
      // Adicionar o livro ao banco de dados
      const { data: bookData, error: bookError } = await supabase
        .from('bible_books')
        .upsert({
          book_id: book.id,
          name: book.name,
          abbreviation: book.abbreviation,
          testament: book.testament,
          version_id: versionData.id
        }, { onConflict: 'book_id, version_id' })
        .select();
      
      if (bookError) {
        console.error(`Erro ao inserir livro ${book.name}: ${bookError.message}`);
        continue;
      }
      
      console.log(`Livro importado: ${book.name}`);
    }
    
    return { success: true, message: `Importados ${books.length} livros com sucesso.` };
  } catch (error) {
    console.error(`Erro ao importar livros: ${error.message}`);
    return { success: false, message: error.message };
  }
}

async function importChapters(bibleId: string, bookId: string) {
  try {
    console.log(`Começando a importar capítulos para o livro ${bookId}`);
    
    // Buscar o livro no Supabase
    const { data: bookData, error: bookError } = await supabase
      .from('bible_books')
      .select('id')
      .eq('book_id', bookId)
      .single();
    
    if (bookError || !bookData) {
      console.error(`Erro ao buscar livro: ${bookError?.message}`);
      return { success: false, message: `Livro não encontrado: ${bookId}` };
    }
    
    // Buscar os capítulos da API
    const response = await fetch(`${baseUrl}/bibles/${bibleId}/books/${bookId}/chapters`, {
      headers: { 'api-key': apiKey as string }
    });
    
    if (!response.ok) {
      console.error(`Erro API (${response.status}): ${await response.text()}`);
      return { success: false, message: `Erro na API: ${response.statusText}` };
    }
    
    const data = await response.json();
    const chapters = data.data;
    
    console.log(`Encontrados ${chapters.length} capítulos para importar.`);
    
    // Atualizar o número de capítulos no livro
    await supabase
      .from('bible_books')
      .update({ chapter_count: chapters.length })
      .eq('id', bookData.id);
    
    // Processar cada capítulo
    for (const chapter of chapters) {
      // Extrair o número de capítulo do ID (formato: GEN.1)
      const chapterNumber = parseInt(chapter.number) || chapter.number === 'intro' ? 0 : parseInt(chapter.number.split('.')[1]);
      
      // Adicionar o capítulo ao banco de dados
      const { data: chapterData, error: chapterError } = await supabase
        .from('bible_chapters')
        .upsert({
          chapter_id: chapter.id,
          number: chapterNumber,
          book_id: bookData.id
        }, { onConflict: 'chapter_id, book_id' })
        .select();
      
      if (chapterError) {
        console.error(`Erro ao inserir capítulo ${chapter.number}: ${chapterError.message}`);
        continue;
      }
      
      console.log(`Capítulo importado: ${chapter.number}`);
    }
    
    return { success: true, message: `Importados ${chapters.length} capítulos com sucesso.` };
  } catch (error) {
    console.error(`Erro ao importar capítulos: ${error.message}`);
    return { success: false, message: error.message };
  }
}

async function importVerses(bibleId: string, chapterId: string) {
  try {
    console.log(`Começando a importar versículos para o capítulo ${chapterId}`);
    
    // Buscar o capítulo no Supabase
    const { data: chapterData, error: chapterError } = await supabase
      .from('bible_chapters')
      .select('id')
      .eq('chapter_id', chapterId)
      .single();
    
    if (chapterError || !chapterData) {
      console.error(`Erro ao buscar capítulo: ${chapterError?.message}`);
      return { success: false, message: `Capítulo não encontrado: ${chapterId}` };
    }
    
    // Buscar os versículos da API
    const response = await fetch(`${baseUrl}/bibles/${bibleId}/chapters/${chapterId}/verses`, {
      headers: { 'api-key': apiKey as string }
    });
    
    if (!response.ok) {
      console.error(`Erro API (${response.status}): ${await response.text()}`);
      return { success: false, message: `Erro na API: ${response.statusText}` };
    }
    
    const data = await response.json();
    const verses = data.data;
    
    console.log(`Encontrados ${verses.length} versículos para importar.`);
    
    // Processar cada versículo
    for (const verse of verses) {
      // Extrair o número de versículo do ID (formato: JHN.3.16)
      const verseNumber = parseInt(verse.id.split('.').pop() || "0");
      
      // Adicionar o versículo ao banco de dados
      const { error: verseError } = await supabase
        .from('bible_verses')
        .upsert({
          verse_id: verse.id,
          number: verseNumber,
          text: verse.text || "",
          reference: verse.reference,
          chapter_id: chapterData.id
        }, { onConflict: 'verse_id, chapter_id' });
      
      if (verseError) {
        console.error(`Erro ao inserir versículo ${verse.id}: ${verseError.message}`);
        continue;
      }
    }
    
    return { success: true, message: `Importados ${verses.length} versículos com sucesso.` };
  } catch (error) {
    console.error(`Erro ao importar versículos: ${error.message}`);
    return { success: false, message: error.message };
  }
}

async function importVerseContent(bibleId: string, verseId: string) {
  try {
    console.log(`Buscar conteúdo do versículo ${verseId}`);
    
    // Buscar o versículo da API
    const response = await fetch(`${baseUrl}/bibles/${bibleId}/verses/${verseId}?content-type=text&include-notes=false&include-titles=false&include-chapter-numbers=false&include-verse-numbers=false&include-verse-spans=false`, {
      headers: { 'api-key': apiKey as string }
    });
    
    if (!response.ok) {
      console.error(`Erro API (${response.status}): ${await response.text()}`);
      return { success: false, message: `Erro na API: ${response.statusText}` };
    }
    
    const data = await response.json();
    const verse = data.data;
    
    return { success: true, content: verse.content, reference: verse.reference };
  } catch (error) {
    console.error(`Erro ao buscar versículo: ${error.message}`);
    return { success: false, message: error.message };
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const url = new URL(req.url);
    const action = url.searchParams.get('action');
    const body = await req.json();
    const { bibleId, bookId, chapterId, verseId } = body;
    
    let result;
    
    switch (action) {
      case 'import_books':
        result = await importBooks(bibleId);
        break;
      case 'import_chapters':
        result = await importChapters(bibleId, bookId);
        break;
      case 'import_verses':
        result = await importVerses(bibleId, chapterId);
        break;
      case 'get_verse_content':
        result = await importVerseContent(bibleId, verseId);
        break;
      default:
        result = { 
          success: false, 
          message: "Ação inválida. Use 'import_books', 'import_chapters', 'import_verses' ou 'get_verse_content'." 
        };
    }
    
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: result.success ? 200 : 400
    });
  } catch (error) {
    console.error(`Erro: ${error.message}`);
    return new Response(JSON.stringify({ success: false, message: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    });
  }
});
