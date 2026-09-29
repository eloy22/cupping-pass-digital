import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

import { supabase } from "@/integrations/supabase/client";
import { recommendedHopper, STAMP_GOAL } from "@/lib/coffee";

const BARISTA_PIN = "2026";

export const Route = createFileRoute("/barista")({
  head: () => ({
    meta: [
      { title: "Barra — CuppingPass" },
      {
        name: "description",
        content:
          "Zona de barra: escanea el pase del cliente, consulta su preparación habitual y añade sellos de fidelidad.",
      },
      { property: "og:title", content: "Barra — CuppingPass" },
      {
        property: "og:description",
        content:
          "Zona de barra: escanea el pase del cliente, consulta su preparación habitual y añade sellos de fidelidad.",
      },
    ],
  }),
  component: Barista,
});

type Customer = {
  id: string;
  full_name: string;
  phone: string;
  usual_order: string;
  milk_type: string;
  flavor_profile: string;
  decaf: boolean;
  stamps: number;
};

function Barista() {
  const [unlocked, setUnlocked] = useState(false);
  return unlocked ? <Counter /> : <PinPad onUnlock={() => setUnlocked(true)} />;
}

function PinPad({ onUnlock }: { onUnlock: () => void }) {
  const [pin, setPin] = useState("");
  const [wrong, setWrong] = useState(false);

  function press(digit: string) {
    setWrong(false);
    const next = (pin + digit).slice(0, 4);
    setPin(next);
    if (next.length === 4) {
      if (next === BARISTA_PIN) onUnlock();
      else {
        setWrong(true);
        setTimeout(() => setPin(""), 350);
      }
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-6 py-14">
      <p className="label-caps text-center">Zona de barra</p>
      <h1 className="mt-2 text-center text-4xl">Introduce el PIN</h1>

      <div className="mt-8 flex justify-center gap-3">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className={
              pin.length > i
                ? "h-3 w-3 rounded-full bg-terracotta"
                : "h-3 w-3 rounded-full border border-border bg-card"
            }
          />
        ))}
      </div>

      <p className="mt-4 h-5 text-center text-sm text-destructive">
        {wrong ? "PIN incorrecto" : ""}
      </p>

      <div className="mt-4 grid grid-cols-3 gap-3">
        {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((d) => (
          <KeyButton key={d} onClick={() => press(d)}>
            {d}
          </KeyButton>
        ))}
        <KeyButton onClick={() => setPin("")}>C</KeyButton>
        <KeyButton onClick={() => press("0")}>0</KeyButton>
        <KeyButton onClick={() => setPin(pin.slice(0, -1))}>←</KeyButton>
      </div>
    </main>
  );
}

function KeyButton({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="card-surface py-5 font-display text-2xl transition-colors hover:bg-secondary"
    >
      {children}
    </button>
  );
}

function Counter() {
  const [scanning, setScanning] = useState(false);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function loadCustomer(id: string) {
    setMessage(null);
    const { data, error } = await supabase
      .from("customers")
      .select("id, full_name, phone, usual_order, milk_type, flavor_profile, decaf, stamps")
      .eq("id", id)
      .maybeSingle();

    if (error || !data) {
      setMessage("Pase no encontrado.");
      return;
    }
    setCustomer(data);
  }

  async function addStamp() {
    if (!customer) return;
    setBusy(true);
    const next = customer.stamps >= STAMP_GOAL ? 1 : customer.stamps + 1;
    const { data, error } = await supabase
      .from("customers")
      .update({ stamps: next })
      .eq("id", customer.id)
      .select("id, full_name, phone, usual_order, milk_type, flavor_profile, decaf, stamps")
      .single();
    setBusy(false);
    if (error || !data) {
      setMessage("No se pudo actualizar el sello.");
      return;
    }
    setCustomer(data);
  }

  const hopper = customer ? recommendedHopper(customer.flavor_profile) : null;
  const complete = customer ? customer.stamps >= STAMP_GOAL : false;

  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <div className="flex items-center justify-between">
        <p className="label-caps">Barra · CuppingPass</p>
        <button
          type="button"
          onClick={() => {
            setCustomer(null);
            setScanning(true);
          }}
          className="btn-terracotta rounded-md px-4 py-2 text-sm font-medium"
        >
          Escanear pase
        </button>
      </div>

      {scanning ? (
        <Scanner
          onResult={(id) => {
            setScanning(false);
            void loadCustomer(id);
          }}
          onCancel={() => setScanning(false)}
        />
      ) : null}

      {message ? <p className="mt-6 text-sm text-destructive">{message}</p> : null}

      {!customer && !scanning ? (
        <div className="card-surface mt-8 px-6 py-14 text-center">
          <h2 className="text-3xl">Sin cliente en pantalla</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Pulsa «Escanear pase» y apunta la cámara al código QR del cliente.
          </p>
        </div>
      ) : null}

      {customer ? (
        <section className="mt-8 space-y-6">
          <div>
            <p className="label-caps">Hola de nuevo</p>
            <h1 className="mt-1 text-6xl leading-none">{customer.full_name}</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {customer.decaf ? "Descafeinado al agua" : "Cafeína normal"} · {customer.phone}
            </p>
          </div>

          <div className="grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2">
            <div className="bg-card p-6">
              <span className="label-caps">Preparación habitual</span>
              <p className="mt-2 font-display text-3xl">{customer.usual_order}</p>
            </div>
            <div className="bg-card p-6">
              <span className="label-caps">Tipo de leche</span>
              <p className="mt-2 font-display text-3xl">{customer.milk_type}</p>
            </div>
          </div>

          {hopper ? (
            <div className="rounded-lg border border-terracotta/40 bg-accent p-6">
              <span className="label-caps">Tolva recomendada del día</span>
              <p className="mt-2 font-display text-3xl text-terracotta">{hopper.name}</p>
              <p className="mt-1 text-sm font-medium">{hopper.origin}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Notas: {hopper.notes} · Perfil del cliente: {customer.flavor_profile}
              </p>
            </div>
          ) : null}

          <div className="card-surface p-6">
            <div className="flex items-baseline justify-between">
              <span className="label-caps">Fidelidad</span>
              <span className="text-sm text-muted-foreground">
                {Math.min(customer.stamps, STAMP_GOAL)} / {STAMP_GOAL}
              </span>
            </div>
            <div className="mt-4 flex gap-3">
              {Array.from({ length: STAMP_GOAL }).map((_, i) => {
                const filled = i < customer.stamps;
                return (
                  <span
                    key={i}
                    className={
                      filled
                        ? "flex h-14 w-14 items-center justify-center rounded-full bg-terracotta font-display text-xl text-terracotta-foreground"
                        : "flex h-14 w-14 items-center justify-center rounded-full border border-dashed border-border bg-secondary font-display text-xl text-muted-foreground"
                    }
                  >
                    {i + 1}
                  </span>
                );
              })}
            </div>

            <button
              type="button"
              onClick={addStamp}
              disabled={busy}
              className="btn-terracotta mt-6 w-full rounded-md px-6 py-3.5 text-sm font-medium disabled:opacity-60"
            >
              {busy ? "Guardando…" : complete ? "Canjear y empezar de nuevo" : "Añadir sello"}
            </button>
          </div>

          {complete ? (
            <div className="rounded-lg border border-success/40 bg-success/10 p-6">
              <p className="font-display text-3xl text-success">¡Café de cortesía disponible!</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {customer.full_name} ha completado {STAMP_GOAL} cafés. Invita a la casa y reinicia la
                tarjeta al servirlo.
              </p>
            </div>
          ) : null}
        </section>
      ) : null}
    </main>
  );
}

function Scanner({
  onResult,
  onCancel,
}: {
  onResult: (id: string) => void;
  onCancel: () => void;
}) {
  const containerId = "cupping-qr-reader";
  const [error, setError] = useState<string | null>(null);
  const [manual, setManual] = useState("");
  const stopRef = useRef<(() => Promise<void>) | null>(null);

  useEffect(() => {
    let cancelled = false;
    let instance: { stop: () => Promise<void>; clear: () => void } | null = null;

    (async () => {
      try {
        const { Html5Qrcode } = await import("html5-qrcode");
        if (cancelled) return;
        const scanner = new Html5Qrcode(containerId);
        instance = scanner as unknown as { stop: () => Promise<void>; clear: () => void };
        stopRef.current = async () => {
          try {
            await scanner.stop();
            scanner.clear();
          } catch {
            /* already stopped */
          }
        };
        await scanner.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 240, height: 240 } },
          (decoded) => {
            void stopRef.current?.().then(() => onResult(decoded.trim()));
          },
          () => {
            /* per-frame misses are expected */
          },
        );
      } catch {
        if (!cancelled) setError("No se pudo abrir la cámara. Introduce el ID a mano.");
      }
    })();

    return () => {
      cancelled = true;
      if (stopRef.current) void stopRef.current();
      else instance?.clear();
    };
  }, [onResult]);

  return (
    <div className="card-surface mt-8 p-5">
      <div className="flex items-center justify-between">
        <span className="label-caps">Escaneando código QR</span>
        <button
          type="button"
          onClick={onCancel}
          className="text-sm text-muted-foreground underline"
        >
          Cancelar
        </button>
      </div>

      <div id={containerId} className="mt-4 overflow-hidden rounded-md bg-secondary" />

      {error ? (
        <div className="mt-4 space-y-3">
          <p className="text-sm text-destructive">{error}</p>
          <div className="flex gap-2">
            <input
              value={manual}
              onChange={(e) => setManual(e.target.value)}
              placeholder="ID del cliente"
              className="flex-1 rounded-md border border-input bg-card px-3 py-2 text-sm outline-none focus:border-terracotta"
            />
            <button
              type="button"
              onClick={() => onResult(manual.trim())}
              className="btn-terracotta rounded-md px-4 py-2 text-sm font-medium"
            >
              Buscar
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
