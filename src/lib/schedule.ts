export interface HorarioGeneral {
  dia: string;
  hora: string;
  nota: string;
  days: string;
}

export interface Plan {
  id: string;
  nombre: string;
  precio: string;
  periodo: string;
  caracteristicas: string[];
  destacado: boolean;
  badge: string | null;
}

export interface ClaseSalon {
  hora: string;
  lunes: string;
  martes: string;
  miercoles: string;
  jueves: string;
  viernes: string;
  sabado: string;
  turno?: string;
}

export interface ClassSlot {
  hora: string;
  start: number;
  end: number;
  days: Record<number, string>;
}

export const horariosGenerales: HorarioGeneral[] = [
  {
    dia: "Lunes a Viernes",
    hora: "06:00 a 23:00",
    nota: "Atención Continua",
    days: "1,2,3,4,5",
  },
  {
    dia: "Sábados",
    hora: "08:00 a 20:00",
    nota: "Atención Continua",
    days: "6",
  },
  {
    dia: "Domingos y Feriados",
    hora: "09:00 a 15:00",
    nota: "Horario Especial",
    days: "0",
  },
];

export const planesData: Plan[] = [
  {
    id: "sesion-individual",
    nombre: "PASE DIARIO",
    precio: "Bs. 50",
    periodo: "1 día de acceso",
    caracteristicas: [
      "Acceso completo por 1 día",
      "Gimnasio & Musculación",
      "Uso de lockers y vestuarios",
    ],
    destacado: false,
    badge: null,
  },
  {
    id: "pase-semanal",
    nombre: "PASE SEMANAL",
    precio: "Bs. 170",
    periodo: "7 días consecutivos",
    caracteristicas: [
      "Acceso ilimitado por 7 días",
      "Gimnasio & Musculación",
      "Clases grupales incluidas",
      "Sin compromiso mensual",
    ],
    destacado: false,
    badge: null,
  },
  {
    id: "plan-connect",
    nombre: "PLAN CONNECT",
    precio: "Bs. 399",
    periodo: "Mensual",
    caracteristicas: [
      "Gimnasio & Musculación",
      "Clases grupales ilimitadas",
      "Evaluación mensual",
      "Invitado gratis cada viernes",
      "Acceso a GO by Connect (Achumani)",
    ],
    destacado: true,
    badge: "★ MÁS ELEGIDO",
  },
  {
    id: "plan-viajero",
    nombre: "PLAN VIAJERO",
    precio: "Bs. 575",
    periodo: "30 accesos en 60 días",
    caracteristicas: [
      "Tú decides cuándo entrenar",
      "Más flexibilidad, más resultados",
      "Acceso a todas las instalaciones",
      "Ideal para horarios variables",
    ],
    destacado: false,
    badge: null,
  },
];

export const grillaSalon: ClaseSalon[] = [
  {
    hora: "07:30",
    lunes: "-",
    martes: "-",
    miercoles: "-",
    jueves: "-",
    viernes: "Vinyasa Yoga (Karenine)",
    sabado: "-",
  },
  {
    hora: "09:00",
    lunes: "-",
    martes: "Ashtanga Yoga (Marco)",
    miercoles: "Ashtanga Yoga (Marco)",
    jueves: "Ashtanga Yoga (Marco)",
    viernes: "-",
    sabado: "Body Combat (Cindy)",
  },
  {
    hora: "10:10",
    lunes: "Zumba (Brandon)",
    martes: "Pilates (Gabriela)",
    miercoles: "Zumba (Brandon)",
    jueves: "Pilates (Gabriela)",
    viernes: "-",
    sabado: "Vinyasa Yoga (Karenine 10:30)",
  },
  {
    hora: "11:10",
    lunes: "Core (Cindy)",
    martes: "Body Combat (Cindy)",
    miercoles: "Core (Cindy)",
    jueves: "Body Combat (Cindy)",
    viernes: "Core (Cindy)",
    sabado: "-",
  },
  {
    hora: "16:00",
    lunes: "Kick Boxing (Niños)",
    martes: "-",
    miercoles: "Kick Boxing (Niños)",
    jueves: "-",
    viernes: "Kick Boxing (Niños)",
    sabado: "-",
  },
  {
    hora: "17:00",
    lunes: "-",
    martes: "Comercial Dance (Ana)",
    miercoles: "-",
    jueves: "Comercial Dance (Ana)",
    viernes: "-",
    sabado: "-",
  },
  {
    hora: "18:00",
    turno: "TURNO TARDE",
    lunes: "Body Combat (Cindy)",
    martes: "Zumba (Brandon)",
    miercoles: "Body Combat (Cindy)",
    jueves: "Core (Cindy)",
    viernes: "Zumba (Brandon)",
    sabado: "-",
  },
  {
    hora: "19:10",
    lunes: "Vinyasa Yoga (Karenine)",
    martes: "Hatha Yoga (Gabriela)",
    miercoles: "Yoga Progresivo (Gabriela)",
    jueves: "Yoga Flow (Gabriela)",
    viernes: "Body Combat (Cindy)",
    sabado: "-",
  },
];

const DAY_COLUMNS: Array<{ key: keyof ClaseSalon; dayIndex: number }> = [
  { key: "lunes", dayIndex: 1 },
  { key: "martes", dayIndex: 2 },
  { key: "miercoles", dayIndex: 3 },
  { key: "jueves", dayIndex: 4 },
  { key: "viernes", dayIndex: 5 },
  { key: "sabado", dayIndex: 6 },
];

function timeToMinutes(hora: string): number {
  const [h, m] = hora.split(":").map(Number);
  return h * 60 + (m || 0);
}

export const classSlots: ClassSlot[] = grillaSalon
  .map((row) => {
    const days: Record<number, string> = {};
    for (const { key, dayIndex } of DAY_COLUMNS) {
      const value = row[key] as string;
      if (value && value !== "-") days[dayIndex] = value;
    }
    const start = timeToMinutes(row.hora);
    return { hora: row.hora, start, end: start + 60, days };
  })
  .filter((slot) => Object.keys(slot.days).length > 0);

export const grillaDataDays: Record<number, Array<{ hora: string; clase: string }>> = {};
for (const { key, dayIndex } of DAY_COLUMNS) {
  grillaDataDays[dayIndex] = grillaSalon
    .filter((row) => (row[key] as string) !== "-")
    .map((row) => ({ hora: row.hora, clase: row[key] as string }));
}