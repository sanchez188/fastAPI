// 🗄️ Configuración de Base de Datos - Fastify Modular
import { createClient, SupabaseClient } from "@supabase/supabase-js";

export class DatabaseConfig {
  private static instance: SupabaseClient | null = null;

  static getInstance(): SupabaseClient {
    if (!DatabaseConfig.instance) {
      const supabaseUrl = process.env.SUPABASE_URL;
      const supabaseKey = process.env.SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseKey) {
        throw new Error("❌ SUPABASE_URL y SUPABASE_ANON_KEY son requeridas");
      }

      DatabaseConfig.instance = createClient(supabaseUrl, supabaseKey);
      console.log("✅ Supabase client configurado");
    }

    return DatabaseConfig.instance;
  }
}

export const getSupabaseClient = () => DatabaseConfig.getInstance();
