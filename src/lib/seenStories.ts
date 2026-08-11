const KEY = "connect_seen_stories";

function storageAvailable(): boolean {
  try {
    return typeof localStorage !== "undefined";
  } catch {
    return false;
  }
}

export function getSeenStories(): string[] {
  if (!storageAvailable()) return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function markStorySeen(id: string | null | undefined): void {
  if (!id || !storageAvailable()) return;
  const seen = getSeenStories();
  if (seen.includes(id)) return;
  seen.push(id);
  try {
    localStorage.setItem(KEY, JSON.stringify(seen));
  } catch {}
}

export function isStorySeen(id: string | null | undefined): boolean {
  if (!id || !storageAvailable()) return false;
  return getSeenStories().includes(id);
}