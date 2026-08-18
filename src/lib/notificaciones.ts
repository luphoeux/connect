export interface Notificacion {
  id: string;
  fecha: string;
  fechaFormateada: string;
  titulo: string;
  subtitulo: string;
  resumen: string;
  clases: Array<{ disciplina: string; hora: string; dia: string }>;
  footer: string;
}

// Avisos & comunicados centralizados (últimos 2 meses)
export const NOTIFICACIONES: Notificacion[] = [
  {
    id: "feriado-agosto-1",
    fecha: "2026-08-05",
    fechaFormateada: "5 de Agosto",
    titulo: "CLASES FERIADO (1/2)",
    subtitulo: "6 - 7 DE AGOSTO",
    resumen: "Pilates: Jueves 08:00 | Viernes 09:00",
    clases: [
      { disciplina: "PILATES", hora: "08:00", dia: "JUEVES" },
      { disciplina: "PILATES", hora: "09:00", dia: "VIERNES" },
    ],
    footer: "TRAIN WITH US, CONNECT WITH YOURSELF",
  },
  {
    id: "feriado-agosto-2",
    fecha: "2026-08-05",
    fechaFormateada: "5 de Agosto",
    titulo: "CLASES FERIADO (2/2)",
    subtitulo: "6 - 7 DE AGOSTO",
    resumen: "Body Combat: Jue 10:30 | Core: Vie 10:00 | Comercial Dance: Vie 11:00",
    clases: [
      { disciplina: "BODY COMBAT", hora: "10:30", dia: "JUEVES" },
      { disciplina: "CORE", hora: "10:00", dia: "VIERNES" },
      { disciplina: "COMERCIAL DANCE", hora: "11:00", dia: "VIERNES" },
    ],
    footer: "TRAIN WITH US, CONNECT WITH YOURSELF",
  },
  {
    id: "desafio-verano",
    fecha: "2026-07-20",
    fechaFormateada: "20 de Julio",
    titulo: "DESAFÍO DE VERANO",
    subtitulo: "INSCRIPCIONES ABIERTAS",
    resumen: "8 semanas de entrenamiento intensivo y evaluación nutricional.",
    clases: [
      { disciplina: "TODAS LAS DISCIPLINAS", hora: "06:00 - 23:00", dia: "LUN - SÁB" },
    ],
    footer: "TRANSFORMÁ TU CUERPO EN CONNECT",
  },
];