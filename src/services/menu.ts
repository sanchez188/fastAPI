// 🍣 Servicio de Menú - Fastify Modular
import { getSupabaseClient } from "../config/database.js";

export interface MenuItem {
  id_item: string;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: string;
  etiquetas?: string;
}

export class MenuService {
  private supabase: ReturnType<typeof getSupabaseClient> | null = null;

  private getSupabase() {
    if (!this.supabase) {
      this.supabase = getSupabaseClient();
    }
    return this.supabase;
  }

  async buscarItems(filters: {
    seccion?: string;
    filtro_tags?: string;
    texto?: string;
  }): Promise<MenuItem[]> {
    const { seccion, filtro_tags, texto } = filters;

    let query = this.getSupabase().from("menu_items").select("*");

    if (seccion) {
      query = query.ilike("categoria", `%${seccion}%`);
    }

    if (texto) {
      query = query.or(`nombre.ilike.%${texto}%,descripcion.ilike.%${texto}%`);
    }

    if (filtro_tags) {
      const tags = filtro_tags.split(",").map((tag: string) => tag.trim());
      for (const tag of tags) {
        query = query.ilike("etiquetas", `%${tag}%`);
      }
    }

    const { data: items, error } = await query
      .order("categoria")
      .order("nombre");

    if (error) {
      console.error("Error en MenuService.buscarItems:", error);
      throw error;
    }

    return items || [];
  }

  async obtenerItemPorId(id: string): Promise<MenuItem | null> {
    try {
      const { data: item, error } = await this.getSupabase()
        .from("menu_items")
        .select("*")
        .eq("id_item", id)
        .single();

      if (error || !item) return null;
      return item;
    } catch (error) {
      console.error("Error obteniendo item:", error);
      return null;
    }
  }
}

export const menuService = new MenuService();
