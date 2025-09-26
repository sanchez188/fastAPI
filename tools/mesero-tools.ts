// 🤖 Herramientas MCP del Mesero - Fastify Modular
import { RestaurantConfig } from "../config/restaurant.js";
import { menuTools } from "./menu-tools.js";

export class MeseroTools {
  static respuestaFueraDeContexto() {
    return {
      content: [
        {
          type: "text",
          text: `¡Hola! 😊 Soy el mesero de ${RestaurantConfig.NOMBRE_RESTAURANTE}. 

Solo puedo ayudarte con:
🍣 Información sobre nuestro menú y platillos
📞 Datos del restaurante (horarios, ubicación, contacto)
🛒 Realizar y consultar pedidos
📋 Gestionar órdenes existentes

¿Te gustaría conocer nuestro menú o hacer algún pedido? ¡Estoy aquí para ayudarte! 🍱

Esperamos servirte pronto! 🥢`,
        },
      ],
    };
  }

  static async consultaMesero(args: any) {
    const pregunta = args.pregunta.trim();

    if (!menuTools.esConsultaValidaRestaurante(pregunta)) {
      return MeseroTools.respuestaFueraDeContexto();
    }

    const preguntaLower = pregunta.toLowerCase();

    if (
      preguntaLower.includes("horario") ||
      preguntaLower.includes("hora") ||
      preguntaLower.includes("abierto")
    ) {
      return {
        content: [
          {
            type: "text",
            text: `¡Claro! 😊 Te cuento sobre nuestros horarios:

🕐 **Horarios de ${RestaurantConfig.NOMBRE_RESTAURANTE}:**
${RestaurantConfig.HORARIO}

¿Hay algo más en lo que te pueda ayudar? 🍣`,
          },
        ],
      };
    }

    if (
      preguntaLower.includes("ubicacion") ||
      preguntaLower.includes("ubicación") ||
      preguntaLower.includes("direccion") ||
      preguntaLower.includes("dirección") ||
      preguntaLower.includes("donde")
    ) {
      return {
        content: [
          {
            type: "text",
            text: `¡Por supuesto! 📍 Aquí tienes nuestra ubicación:

**📍 Dirección:** ${RestaurantConfig.DIRECCION_CORTA}
**🗺️ Google Maps:** ${RestaurantConfig.GOOGLE_MAPS_URL}
**📞 Teléfono:** ${RestaurantConfig.TELEFONO_RESTAURANTE}

¡Te esperamos pronto! 🍱`,
          },
        ],
      };
    }

    if (
      preguntaLower.includes("telefono") ||
      preguntaLower.includes("teléfono") ||
      preguntaLower.includes("contacto") ||
      preguntaLower.includes("llamar")
    ) {
      return {
        content: [
          {
            type: "text",
            text: `¡Perfecto! 📞 Aquí tienes nuestro contacto:

**📞 Teléfono:** ${RestaurantConfig.TELEFONO_RESTAURANTE}

¡Esperamos tu llamada! 😊`,
          },
        ],
      };
    }

    if (
      preguntaLower.includes("menu") ||
      preguntaLower.includes("menú") ||
      preguntaLower.includes("carta") ||
      preguntaLower.includes("comida") ||
      preguntaLower.includes("platillo") ||
      preguntaLower.includes("plato")
    ) {
      return {
        content: [
          {
            type: "text",
            text: `¡Excelente pregunta! 🍣 Para consultar nuestro menú puedes:

• **Búsqueda general:** "buscar menú"
• **Por categoría:** "buscar menú sección entradas"
• **Por ingrediente:** "buscar menú texto salmón"

¡Tenemos una gran variedad de rolls, nigiris, sashimis y más! ¿Te gustaría ver alguna categoría en particular? 🍱`,
          },
        ],
      };
    }

    return {
      content: [
        {
          type: "text",
          text: `¡Claro! 😊 Te ayudo con información sobre ${RestaurantConfig.NOMBRE_RESTAURANTE}:

📞 **Contacto:** ${RestaurantConfig.TELEFONO_RESTAURANTE}
📍 **Ubicación:** ${RestaurantConfig.DIRECCION_CORTA}
🕐 **Horarios:** ${RestaurantConfig.HORARIO}

¿Te gustaría ver nuestro menú, hacer un pedido o conocer más detalles específicos? ¡Estoy aquí para ayudarte! 🍣`,
        },
      ],
    };
  }

  static getRestaurantInfo() {
    return {
      content: [
        {
          type: "text",
          text: `¡Hola! 😊 Te comparto la información de nuestro restaurante:

**🍣 ${RestaurantConfig.NOMBRE_RESTAURANTE}**
📞 **Teléfono:** ${RestaurantConfig.TELEFONO_RESTAURANTE}
📍 **Dirección:** ${RestaurantConfig.DIRECCION_CORTA}
🗺️ **Maps:** ${RestaurantConfig.GOOGLE_MAPS_URL}

**🕐 Horarios de atención:**
${RestaurantConfig.HORARIO}

**💳 Métodos de pago:** Efectivo, Tarjeta
**🚗 Modalidades:** Recoger en local, Servicio a domicilio

¿Te gustaría ver nuestro menú o hacer algún pedido? ¡Estoy aquí para ayudarte! 🍱`,
        },
      ],
    };
  }
}

export const meseroTools = MeseroTools;
