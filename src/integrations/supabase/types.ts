export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      bible_books: {
        Row: {
          abbreviation: string | null
          book_id: string
          chapter_count: number | null
          created_at: string | null
          id: string
          name: string
          position: number | null
          testament: string | null
          version_id: string | null
        }
        Insert: {
          abbreviation?: string | null
          book_id: string
          chapter_count?: number | null
          created_at?: string | null
          id?: string
          name: string
          position?: number | null
          testament?: string | null
          version_id?: string | null
        }
        Update: {
          abbreviation?: string | null
          book_id?: string
          chapter_count?: number | null
          created_at?: string | null
          id?: string
          name?: string
          position?: number | null
          testament?: string | null
          version_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bible_books_version_id_fkey"
            columns: ["version_id"]
            isOneToOne: false
            referencedRelation: "bible_versions"
            referencedColumns: ["id"]
          },
        ]
      }
      bible_chapters: {
        Row: {
          book_id: string | null
          chapter_id: string
          created_at: string | null
          id: string
          number: number
        }
        Insert: {
          book_id?: string | null
          chapter_id: string
          created_at?: string | null
          id?: string
          number: number
        }
        Update: {
          book_id?: string | null
          chapter_id?: string
          created_at?: string | null
          id?: string
          number?: number
        }
        Relationships: [
          {
            foreignKeyName: "bible_chapters_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "bible_books"
            referencedColumns: ["id"]
          },
        ]
      }
      bible_verses: {
        Row: {
          chapter_id: string | null
          created_at: string | null
          id: string
          number: number
          reference: string | null
          text: string
          verse_id: string
        }
        Insert: {
          chapter_id?: string | null
          created_at?: string | null
          id?: string
          number: number
          reference?: string | null
          text: string
          verse_id: string
        }
        Update: {
          chapter_id?: string | null
          created_at?: string | null
          id?: string
          number?: number
          reference?: string | null
          text?: string
          verse_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bible_verses_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "bible_chapters"
            referencedColumns: ["id"]
          },
        ]
      }
      bible_versions: {
        Row: {
          abbreviation: string
          created_at: string | null
          id: string
          language: string
          name: string
          version_id: string
        }
        Insert: {
          abbreviation: string
          created_at?: string | null
          id?: string
          language: string
          name: string
          version_id: string
        }
        Update: {
          abbreviation?: string
          created_at?: string | null
          id?: string
          language?: string
          name?: string
          version_id?: string
        }
        Relationships: []
      }
      books: {
        Row: {
          abbreviation: string | null
          chapters: number
          id: number
          name: string
          testament: string | null
        }
        Insert: {
          abbreviation?: string | null
          chapters: number
          id?: number
          name: string
          testament?: string | null
        }
        Update: {
          abbreviation?: string | null
          chapters?: number
          id?: number
          name?: string
          testament?: string | null
        }
        Relationships: []
      }
      capitulos: {
        Row: {
          id: number
          livro_id: number | null
          numero: number
        }
        Insert: {
          id?: number
          livro_id?: number | null
          numero: number
        }
        Update: {
          id?: number
          livro_id?: number | null
          numero?: number
        }
        Relationships: [
          {
            foreignKeyName: "capitulos_livro_id_fkey"
            columns: ["livro_id"]
            isOneToOne: false
            referencedRelation: "livros"
            referencedColumns: ["id"]
          },
        ]
      }
      community_categories: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      community_comments: {
        Row: {
          content: string
          created_at: string | null
          id: string
          likes_count: number | null
          post_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          likes_count?: number | null
          post_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          likes_count?: number | null
          post_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      community_posts: {
        Row: {
          category: string
          comments_count: number | null
          content: string
          created_at: string | null
          id: string
          likes_count: number | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          category: string
          comments_count?: number | null
          content: string
          created_at?: string | null
          id?: string
          likes_count?: number | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          category?: string
          comments_count?: number | null
          content?: string
          created_at?: string | null
          id?: string
          likes_count?: number | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      favorite_verses: {
        Row: {
          book: string
          chapter: number
          created_at: string | null
          id: string
          text: string
          user_id: string | null
          verse: number
          version: string
        }
        Insert: {
          book: string
          chapter: number
          created_at?: string | null
          id?: string
          text: string
          user_id?: string | null
          verse: number
          version: string
        }
        Update: {
          book?: string
          chapter?: number
          created_at?: string | null
          id?: string
          text?: string
          user_id?: string | null
          verse?: number
          version?: string
        }
        Relationships: []
      }
      highlighted_verses: {
        Row: {
          color: string
          content: string
          created_at: string
          id: number
          reference: string
          user_id: string | null
          verse_id: string
        }
        Insert: {
          color: string
          content: string
          created_at?: string
          id?: number
          reference: string
          user_id?: string | null
          verse_id: string
        }
        Update: {
          color?: string
          content?: string
          created_at?: string
          id?: number
          reference?: string
          user_id?: string | null
          verse_id?: string
        }
        Relationships: []
      }
      livros: {
        Row: {
          abreviacao: string
          id: number
          nome: string
          posicao: number
          testamento: string
        }
        Insert: {
          abreviacao: string
          id?: number
          nome: string
          posicao: number
          testamento: string
        }
        Update: {
          abreviacao?: string
          id?: number
          nome?: string
          posicao?: number
          testamento?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          id: string
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          id: string
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          id?: string
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          created_at: string | null
          end_date: string | null
          id: string
          is_active: boolean | null
          plan_type: string
          start_date: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          plan_type: string
          start_date?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          plan_type?: string
          start_date?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      tbbiblia_en: {
        Row: {
          cap: string | null
          id: string
          liv: string | null
          livro: string | null
          texto: string | null
          ver: string | null
        }
        Insert: {
          cap?: string | null
          id: string
          liv?: string | null
          livro?: string | null
          texto?: string | null
          ver?: string | null
        }
        Update: {
          cap?: string | null
          id?: string
          liv?: string | null
          livro?: string | null
          texto?: string | null
          ver?: string | null
        }
        Relationships: []
      }
      tbbiblia_pt: {
        Row: {
          cap: string | null
          id: string
          liv: string | null
          livro: string | null
          texto: string | null
          ver: string | null
        }
        Insert: {
          cap?: string | null
          id: string
          liv?: string | null
          livro?: string | null
          texto?: string | null
          ver?: string | null
        }
        Update: {
          cap?: string | null
          id?: string
          liv?: string | null
          livro?: string | null
          texto?: string | null
          ver?: string | null
        }
        Relationships: []
      }
      verse_searches: {
        Row: {
          created_at: string | null
          id: string
          query: string
          user_id: string | null
          version: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          query: string
          user_id?: string | null
          version: string
        }
        Update: {
          created_at?: string | null
          id?: string
          query?: string
          user_id?: string | null
          version?: string
        }
        Relationships: []
      }
      versiculos: {
        Row: {
          capitulo_id: number | null
          id: number
          numero: number
          texto: string
          versao_id: number | null
        }
        Insert: {
          capitulo_id?: number | null
          id?: number
          numero: number
          texto: string
          versao_id?: number | null
        }
        Update: {
          capitulo_id?: number | null
          id?: number
          numero?: number
          texto?: string
          versao_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "versiculos_capitulo_id_fkey"
            columns: ["capitulo_id"]
            isOneToOne: false
            referencedRelation: "capitulos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "versiculos_versao_id_fkey"
            columns: ["versao_id"]
            isOneToOne: false
            referencedRelation: "versoes_biblia"
            referencedColumns: ["id"]
          },
        ]
      }
      versoes_biblia: {
        Row: {
          descricao: string | null
          id: number
          idioma: string
          nome: string
          sigla: string
        }
        Insert: {
          descricao?: string | null
          id?: number
          idioma: string
          nome: string
          sigla: string
        }
        Update: {
          descricao?: string | null
          id?: number
          idioma?: string
          nome?: string
          sigla?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
