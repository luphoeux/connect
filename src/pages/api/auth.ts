import type { APIRoute } from "astro";
import { findMemberByCI } from "../../lib/members";

export const POST: APIRoute = async ({ request }) => {
  try {
    const { ci } = await request.json();
    const cleanedCI = ci?.toString().trim();

    if (!cleanedCI) {
      return new Response(
        JSON.stringify({ error: "El número de carnet es requerido." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const member = findMemberByCI(cleanedCI);

    if (!member) {
      return new Response(
        JSON.stringify({
          error: "Carnet no encontrado. Verifica el número o consulta en recepción.",
        }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify(member), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return new Response(
      JSON.stringify({ error: "Error interno del servidor." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};