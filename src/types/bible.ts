
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
  testamento: 'Antigo' | 'Novo';
}

export interface Chapter {
  id: number;
  livro_id: number;
  numero: number;
}

export interface Verse {
  id: number;
  capitulo_id: number;
  numero: number;
  texto: string;
  versao_id: number;
}
