export interface GymStory {
  id: string;
  title: string;
  date: string;
  gradient: string;
  video?: string | null;
  imagen?: string | null;
  duracion_s?: number | null;
}

export interface StoryManifestEntry {
  id: string;
  video: string | null;
  imagen: string | null;
  media_type?: "video" | "photo";
  fechaDescarga: string | null;
  duracion_s?: number | null;
}

export interface GymPost {
  id: string;
  message: string;
  image?: string;
  created_time: string;
  permalink_url?: string;
}

const FACEBOOK_PAGE_ID = import.meta.env.FACEBOOK_PAGE_ID;
const FACEBOOK_ACCESS_TOKEN = import.meta.env.FACEBOOK_ACCESS_TOKEN;

const DEMO_STORIES: GymStory[] = [
  {
    id: "s1",
    title: "Cada rep cuenta",
    date: "Hace 2h",
    gradient: "linear-gradient(160deg, #3a3a3a 0%, #1d1d1d 100%)",
  },
  {
    id: "s2",
    title: "WOD de la semana",
    date: "Hace 5h",
    gradient: "linear-gradient(160deg, #e68842 0%, #7a3f14 100%)",
  },
  {
    id: "s3",
    title: "Nuevos equipos",
    date: "Ayer",
    gradient: "linear-gradient(160deg, #2b2b2b 0%, #121212 100%)",
  },
  {
    id: "s4",
    title: "Clase de spinning",
    date: "Ayer",
    gradient: "linear-gradient(160deg, #4a4a4a 0%, #1d1d1d 100%)",
  },
  {
    id: "s5",
    title: "Summer challenge",
    date: "Hace 3 días",
    gradient: "linear-gradient(160deg, #e68842 0%, #121212 100%)",
  },
  {
    id: "s6",
    title: "Resultados reales",
    date: "Hace 4 días",
    gradient: "linear-gradient(160deg, #3a3a3a 0%, #2b2b2b 100%)",
  },
];

const DEMO_POSTS: GymPost[] = [
  {
    id: "p1",
    message:
      "El Desafío de Verano ya está en marcha. 8 semanas de entrenamiento intensivo, seguimiento semanal y una comunidad que te empuja. Consultá en recepción cómo sumarte.",
    image: "linear-gradient(160deg, #2b2b2b 0%, #121212 100%)",
    created_time: "2026-08-08T15:00:00Z",
    permalink_url: "https://www.facebook.com/profile.php?id=100076283411100",
  },
  {
    id: "p2",
    message:
      "Horarios de agosto. Mismo empuje, más flexibilidad. Recordá que tu plan se valida con tu carnet en la entrada.",
    image: "linear-gradient(160deg, #e68842 0%, #7a3f14 100%)",
    created_time: "2026-08-05T20:30:00Z",
    permalink_url: "https://www.facebook.com/profile.php?id=100076283411100",
  },
  {
    id: "p3",
    message:
      "Nueva zona de peso libre. Más espacio, más discos, mismas ganas de romperla. Te esperamos esta semana.",
    image: "linear-gradient(160deg, #3a3a3a 0%, #1d1d1d 100%)",
    created_time: "2026-07-30T12:00:00Z",
    permalink_url: "https://www.facebook.com/profile.php?id=100076283411100",
  },
];

export function usesLiveFacebook(): boolean {
  return Boolean(FACEBOOK_PAGE_ID && FACEBOOK_ACCESS_TOKEN);
}

export async function getStories(): Promise<GymStory[]> {
  const downloaded = await getDownloadedStories();
  if (downloaded.length === 0) {
    return DEMO_STORIES;
  }
  return downloaded;
}

import fs from "node:fs";
import path from "node:path";

export async function getDownloadedStories(): Promise<GymStory[]> {
  try {
    const jsonPath = path.join(process.cwd(), "public", "stories", "index.json");
    if (!fs.existsSync(jsonPath)) return [];
    const content = fs.readFileSync(jsonPath, "utf-8");
    const entries: StoryManifestEntry[] = JSON.parse(content);
    return entries.map((entry, i) => ({
      id: entry.id,
      title: entry.video ? `Historia · Video` : `Historia · Foto`,
      date: formatManifestDate(entry.fechaDescarga),
      gradient: i % 2 === 0 ? "linear-gradient(160deg, #3a3a3a 0%, #1d1d1d 100%)" : "linear-gradient(160deg, #2b2b2b 0%, #121212 100%)",
      video: entry.video ? `/stories/${entry.video}` : null,
      imagen: entry.imagen ? `/stories/${entry.imagen}` : null,
      duracion_s: entry.duracion_s ?? null,
    }));
  } catch (err) {
    console.error("[facebook] error reading stories index.json", err);
    return [];
  }
}

function formatManifestDate(iso: string | null): string {
  if (!iso) return "Reciente";
  const date = new Date(iso);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays <= 0) return "Hoy";
  if (diffDays === 1) return "Ayer";
  if (diffDays < 7) return `Hace ${diffDays} días`;
  return date.toLocaleDateString("es-BO", { day: "numeric", month: "short" });
}

export async function getPosts(): Promise<GymPost[]> {
  if (!usesLiveFacebook()) {
    return DEMO_POSTS;
  }

  const res = await fetch(
    `https://graph.facebook.com/v21.0/${FACEBOOK_PAGE_ID}/posts` +
      `?fields=message,created_time,permalink_url,full_picture` +
      `&limit=6&access_token=${FACEBOOK_ACCESS_TOKEN}`
  );

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    console.error("[facebook] getPosts failed", err);
    return DEMO_POSTS;
  }

  const data = (await res.json()) as { data: Array<{
    id: string;
    message?: string;
    created_time: string;
    permalink_url?: string;
    full_picture?: string;
  }> };

  return data.data
    .filter((p) => p.message || p.full_picture)
    .map((p) => ({
      id: p.id,
      message: p.message ?? "",
      image: p.full_picture,
      created_time: p.created_time,
      permalink_url: p.permalink_url,
    }));
}