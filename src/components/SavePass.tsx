import { useEffect, useState } from "react";

type InstallEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<unknown> };

function platform(): "ios" | "android" | "other" {
  const ua = navigator.userAgent;
  if (/iPhone|iPad|iPod/i.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1)) return "ios";
  if (/Android/i.test(ua)) return "android";
  return "other";
}

export function SavePassActions({ shareUrl }: { shareUrl: string }) {
  const [deferred, setDeferred] = useState<InstallEvent | null>(null);
  const [open, setOpen] = useState<null | "ios" | "android">(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as InstallEvent);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    if (window.matchMedia("(display-mode: standalone)").matches) setInstalled(true);
    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);

  async function onSave() {
    if (deferred) {
      await deferred.prompt();
      setDeferred(null);
      return;
    }
    setOpen(platform() === "android" ? "android" : "ios");
  }

  const waHref = `https://wa.me/?text=${encodeURIComponent(`Mi pase digital CuppingPass: ${shareUrl}`)}`;

  return (
    <div className="mt-6 space-y-3">
      {!installed ? (
        <button onClick={onSave} className="btn-terracotta w-full rounded-md px-6 py-4 text-sm font-medium">
          Guardar en mi pantalla de inicio
        </button>
      ) : null}
      <a
        href={waHref}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full rounded-md border border-border bg-card px-6 py-4 text-center text-sm font-medium transition-colors hover:bg-secondary"
      >
        Enviar a mi WhatsApp
      </a>

      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/40 p-4 sm:items-center"
          onClick={() => setOpen(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Guardar en la pantalla de inicio"
            className="card-surface w-full max-w-sm p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="label-caps">{open === "ios" ? "iPhone · Safari" : "Android · Chrome"}</p>
            <h2 className="mt-2 text-3xl leading-tight">Lleva tu pase como app</h2>
            <ol className="mt-6 space-y-5">
              {(open === "ios"
                ? [
                    [<ShareIcon key="s" />, <>Pulsa el botón <b>"Compartir"</b> en la barra de Safari (el cuadrado con la flecha arriba).</>],
                    [<PlusIcon key="p" />, <>Desliza hacia abajo y selecciona <b>"Añadir a la pantalla de inicio"</b>.</>],
                    [<CheckIcon key="c" />, <>Pulsa <b>"Añadir"</b> arriba a la derecha. ¡Ya tienes tu pase como app!</>],
                  ]
                : [
                    [<DotsIcon key="d" />, <>Pulsa los <b>3 puntos</b> arriba a la derecha de Chrome.</>],
                    [<PlusIcon key="p" />, <>Elige <b>"Añadir a pantalla de inicio"</b>.</>],
                    [<CheckIcon key="c" />, <>Confirma con <b>"Añadir"</b>. ¡Ya tienes tu pase como app!</>],
                  ]
              ).map(([icon, text], i) => (
                <li key={i} className="flex items-start gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary text-terracotta">
                    {icon}
                  </span>
                  <p className="pt-1 text-sm leading-relaxed">
                    <span className="label-caps mr-1">{i + 1}.</span>
                    {text}
                  </p>
                </li>
              ))}
            </ol>
            <button
              onClick={() => setOpen(null)}
              className="btn-terracotta mt-7 w-full rounded-md px-6 py-3 text-sm font-medium"
            >
              Entendido
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

const svg = { width: 20, height: 20, fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, viewBox: "0 0 24 24" };
function ShareIcon() {
  return (<svg {...svg}><path d="M12 3v12M7 8l5-5 5 5" /><path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7" /></svg>);
}
function PlusIcon() {
  return (<svg {...svg}><rect x="4" y="4" width="16" height="16" rx="3" /><path d="M12 8v8M8 12h8" /></svg>);
}
function CheckIcon() {
  return (<svg {...svg}><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>);
}
function DotsIcon() {
  return (<svg {...svg}><circle cx="12" cy="5" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="12" cy="19" r="1" /></svg>);
}
