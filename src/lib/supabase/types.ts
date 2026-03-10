export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          role: "admin" | "customer";
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          role?: "admin" | "customer";
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          role?: "admin" | "customer";
          full_name?: string | null;
          avatar_url?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          icon_url: string | null;
          is_coming_soon: boolean;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          icon_url?: string | null;
          is_coming_soon?: boolean;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          name?: string;
          slug?: string;
          icon_url?: string | null;
          is_coming_soon?: boolean;
          sort_order?: number;
        };
        Relationships: [];
      };
      templates: {
        Row: {
          id: string;
          title: string;
          slug: string;
          description: string | null;
          price: number;
          category_id: string | null;
          is_featured: boolean;
          is_new: boolean;
          status: "published" | "draft" | "wip";
          file_type: string | null;
          file_size: string | null;
          product_type: string | null;
          rating: number;
          sales_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          description?: string | null;
          price?: number;
          category_id?: string | null;
          is_featured?: boolean;
          is_new?: boolean;
          status?: "published" | "draft" | "wip";
          file_type?: string | null;
          file_size?: string | null;
          product_type?: string | null;
          rating?: number;
          sales_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          slug?: string;
          description?: string | null;
          price?: number;
          category_id?: string | null;
          is_featured?: boolean;
          is_new?: boolean;
          status?: "published" | "draft" | "wip";
          file_type?: string | null;
          file_size?: string | null;
          product_type?: string | null;
          rating?: number;
          sales_count?: number;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "templates_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          }
        ];
      };
      template_images: {
        Row: {
          id: string;
          template_id: string;
          image_url: string;
          alt_text: string | null;
          sort_order: number;
          is_primary: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          template_id: string;
          image_url: string;
          alt_text?: string | null;
          sort_order?: number;
          is_primary?: boolean;
          created_at?: string;
        };
        Update: {
          image_url?: string;
          alt_text?: string | null;
          sort_order?: number;
          is_primary?: boolean;
        };
        Relationships: [
          {
            foreignKeyName: "template_images_template_id_fkey";
            columns: ["template_id"];
            isOneToOne: false;
            referencedRelation: "templates";
            referencedColumns: ["id"];
          }
        ];
      };
      reviews: {
        Row: {
          id: string;
          template_id: string | null;
          author_name: string;
          author_role: string | null;
          author_avatar: string | null;
          rating: number;
          content: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          template_id?: string | null;
          author_name: string;
          author_role?: string | null;
          author_avatar?: string | null;
          rating?: number;
          content: string;
          created_at?: string;
        };
        Update: {
          template_id?: string | null;
          author_name?: string;
          author_role?: string | null;
          author_avatar?: string | null;
          rating?: number;
          content?: string;
        };
        Relationships: [
          {
            foreignKeyName: "reviews_template_id_fkey";
            columns: ["template_id"];
            isOneToOne: false;
            referencedRelation: "templates";
            referencedColumns: ["id"];
          }
        ];
      };
      faqs: {
        Row: {
          id: string;
          question: string;
          answer: string;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          question: string;
          answer: string;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          question?: string;
          answer?: string;
          sort_order?: number;
        };
        Relationships: [];
      };
      orders: {
        Row: {
          id: string;
          user_id: string | null;
          template_id: string | null;
          status: "pending" | "completed" | "refunded" | "cancelled";
          total_amount: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          template_id?: string | null;
          status?: "pending" | "completed" | "refunded" | "cancelled";
          total_amount: number;
          created_at?: string;
        };
        Update: {
          status?: "pending" | "completed" | "refunded" | "cancelled";
          total_amount?: number;
        };
        Relationships: [
          {
            foreignKeyName: "orders_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "orders_template_id_fkey";
            columns: ["template_id"];
            isOneToOne: false;
            referencedRelation: "templates";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      user_role: "admin" | "customer";
      template_status: "published" | "draft" | "wip";
      order_status: "pending" | "completed" | "refunded" | "cancelled";
    };
    CompositeTypes: Record<string, never>;
  };
};

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];

export type InsertTables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];

export type UpdateTables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];

export type Profile = Tables<"profiles">;
export type Category = Tables<"categories">;
export type Template = Tables<"templates">;
export type TemplateImage = Tables<"template_images">;
export type Review = Tables<"reviews">;
export type FAQ = Tables<"faqs">;
export type Order = Tables<"orders">;

export type TemplateWithCategory = Template & {
  categories: Pick<Category, "name" | "slug" | "icon_url"> | null;
};

export type TemplateWithDetails = Template & {
  categories: Pick<Category, "name" | "slug" | "icon_url"> | null;
  template_images: TemplateImage[];
};

export type TemplateListItem = Template & {
  categories: Pick<Category, "name" | "icon_url"> | null;
  template_images: Pick<TemplateImage, "image_url" | "is_primary">[];
};
