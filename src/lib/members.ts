export interface Member {
  ci: string;
  nombre: string;
  email: string;
  telefono: string;
  plan: string;
  sucursal: string;
  fecha_inicio: string;
  fecha_caducacion: string;
  estado: string;
  asistencias_mes: number;
  foto: string | null;
  entrenador: string;
  evaluacion_fisica: string;
  racha_dias: number;
}

// Lista oficial de socios registrados (fuente temporal hasta integrar la API de socios en Vercel).
const REGISTERED_MEMBERS: Record<string, Member> = {
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

export function findMemberByCI(ci: string): Member | null {
  const cleaned = ci?.toString().trim();
  if (!cleaned) return null;
  return REGISTERED_MEMBERS[cleaned] ?? null;
}