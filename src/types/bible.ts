
export interface Profile {
  id: string;
  username: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface BibleVersion {
  id: number;
  sigla: string;
  nome: string;
  idioma: string;
  descricao: string | null;
}

export interface Book {
  id: number;
  nome: string;
  abreviacao: string;
  posicao: number;
  testamento: string; // Alterado de 'Antigo' | 'Novo' para string para aceitar o valor do Supabase
}

export interface Chapter {
  id: number;
  livro_id: number;
  numero: number;
}

export interface Verse {
  id: number;
  numero: number;
  texto: string;
  capitulo?: {
    id: number;
    numero: number;
    livro_id: number;
  };
  versao?: {
    sigla: string;
  };
  capitulo_id?: number;
  versao_id?: number;
}
