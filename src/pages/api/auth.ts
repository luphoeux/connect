import type { APIRoute } from "astro";

const MOCK_MEMBERS: Record<string, any> = {
  "8337710": {
    ci: "8337710",
    nombre: "Lucas Silva",
    email: "lucas.silva@connect.fit",
    telefono: "+591 76543210",
    plan: "PLAN CONNECT",
    sucursal: "Connect Sur - HQ",
    fecha_inicio: "2026-01-15",
    fecha_caducacion: "2027-02-06T23:59:59.000Z",
    estado: "ACTIVO",
    asistencias_mes: 18,
    foto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400",
    entrenador: "Prof. Mateo Rivas",
    evaluacion_fisica: "Apto - Rendimiento Alto",
    racha_dias: 5,
  },
};

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

    // Check hardcoded member or default fallback member
    const member = MOCK_MEMBERS[cleanedCI] || {
      ci: cleanedCI,
      nombre: "Socio Demo",
      email: `socio.${cleanedCI}@connect.fit`,
      telefono: "+591 70000000",
      plan: "Pase Mensual Standard",
      sucursal: "Connect Sur",
      fecha_inicio: "2026-08-01",
      fecha_caducacion: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      estado: "ACTIVO",
      asistencias_mes: 12,
      foto: null,
      entrenador: "Prof. Staff Connect",
      evaluacion_fisica: "Normal",
      racha_dias: 3,
    };

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
