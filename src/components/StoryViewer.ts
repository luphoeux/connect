export interface StoryViewerItem {
  video?: string | null;
  imagen?: string | null;
  duracion_s?: number | null;
}

const DEFAULT_IMAGE_DURATION = 5;

export function openStoryViewer(
  items: StoryViewerItem[],
  start = 0,
  onShow?: (index: number) => void
): void {
  if (!items.length) return;

  let current = Math.max(0, Math.min(start, items.length - 1));
  let raf = 0;
  let destroyed = false;

  const overlay = document.createElement("div");
  overlay.className =
    "fixed inset-0 z-50 bg-black flex items-center justify-center select-none";
  overlay.style.opacity = "0";
  overlay.style.transition = "opacity 0.2s ease";

  const segFills = items
    .map(
      () =>
        `<div class="h-1 flex-1 bg-white/25 rounded overflow-hidden"><div class="seg-fill h-full w-0 bg-white" style="transition: none"></div></div>`
    )
    .join("");

  overlay.innerHTML = `
    <div class="absolute top-0 left-0 right-0 z-30 flex gap-1 p-3">${segFills}</div>
    <button class="story-close absolute top-3 right-3 z-30 text-white/80 hover:text-white p-2 bg-black/40 rounded-full" aria-label="Cerrar">
      <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
    <div class="story-stage z-10 flex items-center justify-center w-full h-full"></div>
    <div class="story-tap-left absolute top-0 bottom-0 left-0 w-1/3 z-20"></div>
    <div class="story-tap-right absolute top-0 bottom-0 right-0 w-1/3 z-20"></div>
  `;

  document.body.appendChild(overlay);
  requestAnimationFrame(() => {
    overlay.style.opacity = "1";
  });

  const fillEls = Array.from(overlay.querySelectorAll<HTMLElement>(".seg-fill"));
  let media: HTMLVideoElement | HTMLImageElement | null = null;

  const stop = () => {
    cancelAnimationFrame(raf);
    if (media instanceof HTMLVideoElement) {
      media.pause();
      media.removeAttribute("src");
      media.load();
    }
    media = null;
  };

  const setFill = (i: number, pct: number) => {
    fillEls.forEach((el, j) => {
      if (j < i) el.style.width = "100%";
      else if (j > i) el.style.width = "0%";
      else el.style.width = `${Math.max(0, Math.min(1, pct)) * 100}%`;
    });
  };

  const show = () => {
    if (destroyed) return;
    stop();
    const item = items[current];
    const stage = overlay.querySelector<HTMLDivElement>(".story-stage")!;
    stage.innerHTML = "";
    onShow?.(current);

    if (item.video) {
      const v = document.createElement("video");
      v.src = item.video;
      v.muted = false;
      v.playsInline = true;
      v.setAttribute("playsinline", "");
      v.className = "max-h-[92vh] max-w-full object-contain";
      v.addEventListener("ended", next);
      stage.appendChild(v);
      media = v;
      v.play().catch(() => {
        v.muted = true;
        v.play().catch(() => {});
      });

      const knownDuration = item.duracion_s && item.duracion_s > 0 ? item.duracion_s : 0;
      const track = () => {
        if (destroyed) return;
        const d = v.duration && isFinite(v.duration) ? v.duration : knownDuration;
        const t = v.currentTime || 0;
        setFill(current, d > 0 ? t / d : 0);
        raf = requestAnimationFrame(track);
      };
      raf = requestAnimationFrame(track);
    } else {
      const img = document.createElement("img");
      img.src = item.imagen || "";
      img.className = "max-h-[92vh] max-w-full object-contain";
      stage.appendChild(img);
      media = img;

      const durMs =
        (item.duracion_s && item.duracion_s > 0 ? item.duracion_s : DEFAULT_IMAGE_DURATION) * 1000;
      const started = Date.now();
      const track = () => {
        if (destroyed) return;
        const elapsed = Date.now() - started;
        setFill(current, Math.min(1, elapsed / durMs));
        if (elapsed >= durMs) {
          next();
        } else {
          raf = requestAnimationFrame(track);
        }
      };
      raf = requestAnimationFrame(track);
    }
  };

  const next = () => {
    if (destroyed) return;
    if (current < items.length - 1) {
      current += 1;
      show();
    } else {
      close();
    }
  };

  const prev = () => {
    if (destroyed) return;
    if (current > 0) {
      current -= 1;
      show();
    } else {
      show();
    }
  };

  const close = () => {
    if (destroyed) return;
    destroyed = true;
    stop();
    document.removeEventListener("keydown", onKey);
    overlay.style.opacity = "0";
    window.setTimeout(() => overlay.remove(), 200);
  };

  const onKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight") next();
    else if (e.key === "ArrowLeft") prev();
    else if (e.key === "Escape") close();
  };
  document.addEventListener("keydown", onKey);

  overlay.querySelector(".story-tap-right")!.addEventListener("click", next);
  overlay.querySelector(".story-tap-left")!.addEventListener("click", prev);
  overlay.querySelector(".story-close")!.addEventListener("click", close);

  let touchX = 0;
  let touchStart = 0;
  overlay.addEventListener(
    "touchstart",
    (e) => {
      touchX = e.changedTouches[0].clientX;
      touchStart = Date.now();
    },
    { passive: true }
  );
  overlay.addEventListener(
    "touchend",
    (e) => {
      const dx = e.changedTouches[0].clientX - touchX;
      const dt = Date.now() - touchStart;
      if (dt < 500 && Math.abs(dx) > 40) {
        if (dx > 0) prev();
        else next();
      }
    },
    { passive: true }
  );

  show();
}