import type { APIRoute } from "astro";

export const prerender = false;

export const GET: APIRoute = async ({ params }) => {
  const { ci } = params;

  if (!ci) {
    return new Response(
      JSON.stringify({ error: "Carnet de identidad requerido." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const mockMember = {
    ci,
    nombre: "Carlos Méndez",
    plan: "Premium Anual",
    fecha_caducacion: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
    foto: null,
  };

  return new Response(JSON.stringify(mockMember), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
