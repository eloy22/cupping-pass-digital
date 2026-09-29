import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import QRCode from "qrcode";

import { supabase } from "@/integrations/supabase/client";
import {
  DECAF_OPTIONS,
  FLAVOR_PROFILES,
  MILK_TYPES,
  STAMP_GOAL,
  USUAL_ORDERS,
} from "@/lib/coffee";

export const Route = createFileRoute("/registro")({
  head: () => ({
    meta: [
      { title: "Crear mi pase — CuppingPass" },
      {
        name: "description",
        content:
          "Alta rápida: dinos qué pides, qué leche prefieres y tu perfil de sabor. Recibirás tu pase digital con código QR.",
      },
      { property: "og:title", content: "Crear mi pase — CuppingPass" },
      {
        property: "og:description",
        content:
          "Alta rápida: dinos qué pides, qué leche prefieres y tu perfil de sabor. Recibirás tu pase digital con código QR.",
      },
    ],
  }),
  component: Registro,
});

type Pass = {
  id: string;
  full_name: string;
  usual_order: string;
  milk_type: string;
  flavor_profile: string;
  decaf: boolean;
  stamps: number;
};

function Registro() {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [usualOrder, setUsualOrder] = useState<string>(USUAL_ORDERS[0]);
  const [milkType, setMilkType] = useState<string>(MILK_TYPES[0]);
  const [flavorProfile, setFlavorProfile] = useState<string>(FLAVOR_PROFILES[0]);
  const [decaf, setDecaf] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pass, setPass] = useState<Pass | null>(null);
  const [qr, setQr] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const name = fullName.trim();
    const tel = phone.trim();
    if (name.length < 2 || name.length > 120) {
      setError("Escribe tu nombre y apellidos.");
      return;
    }
    if (!/^[+0-9\s-]{6,20}$/.test(tel)) {
      setError("Revisa el teléfono móvil.");
      return;
    }

    setSaving(true);
    const id = crypto.randomUUID();
    const { error: dbError } = await supabase.from("customers").insert({
      id,
      full_name: name,
      phone: tel,
      usual_order: usualOrder,
      milk_type: milkType,
      flavor_profile: flavorProfile,
      decaf,
    });
    setSaving(false);

    const data: Pass = {
      id,
      full_name: name,
      usual_order: usualOrder,
      milk_type: milkType,
      flavor_profile: flavorProfile,
      decaf,
      stamps: 0,
    };

    if (dbError) {
      setError("No hemos podido guardar tu pase. Inténtalo de nuevo.");
      return;
    }

    const dataUrl = await QRCode.toDataURL(data.id, {
      margin: 1,
      width: 512,
      color: { dark: "#1F1B16", light: "#FFFFFF" },
    });
    setPass(data);
    setQr(dataUrl);
  }

  if (pass) {
    return (
      <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-14">
        <p className="label-caps">Pase digital</p>
        <h1 className="mt-2 text-4xl">Listo, {pass.full_name.split(" ")[0]}</h1>

        <div className="card-surface mt-8 overflow-hidden">
          <div className="flex items-baseline justify-between border-b border-border px-6 py-4">
            <span className="font-display text-2xl">
              Cupping<span className="text-terracotta">Pass</span>
            </span>
            <span className="label-caps">Miembro</span>
          </div>

          <div className="px-6 py-6">
            <h2 className="text-3xl leading-tight">{pass.full_name}</h2>
            <dl className="mt-6 grid grid-cols-2 gap-5">
              <div>
                <dt className="label-caps">Su habitual</dt>
                <dd className="mt-1 text-sm font-medium">{pass.usual_order}</dd>
              </div>
              <div>
                <dt className="label-caps">Leche</dt>
                <dd className="mt-1 text-sm font-medium">{pass.milk_type}</dd>
              </div>
              <div>
                <dt className="label-caps">Perfil</dt>
                <dd className="mt-1 text-sm font-medium">{pass.flavor_profile}</dd>
              </div>
              <div>
                <dt className="label-caps">Descafeinado</dt>
                <dd className="mt-1 text-sm font-medium">{pass.decaf ? "Sí, al agua" : "No"}</dd>
              </div>
            </dl>
          </div>

          <div className="flex flex-col items-center gap-3 border-t border-border bg-secondary px-6 py-7">
            {qr ? (
              <img src={qr} alt="Código QR de tu pase" className="h-44 w-44 rounded-md bg-card p-2" />
            ) : null}
            <p className="text-center text-xs text-muted-foreground">
              Muestra este código en barra. Meta: {STAMP_GOAL} cafés para el sexto de cortesía.
            </p>
          </div>
        </div>

        <Link to="/" className="mt-8 text-center text-sm text-muted-foreground underline">
          Volver al inicio
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-xl px-6 py-14">
      <p className="label-caps">Alta de cliente</p>
      <h1 className="mt-2 text-5xl leading-none">Tu perfil de café</h1>
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
        Treinta segundos y tu barista sabrá exactamente qué servirte.
      </p>

      <form onSubmit={onSubmit} className="mt-10 space-y-8">
        <div className="space-y-2">
          <label htmlFor="name" className="label-caps block">
            Nombre y apellidos
          </label>
          <input
            id="name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            maxLength={120}
            autoComplete="name"
            className="w-full rounded-md border border-input bg-card px-4 py-3 text-base outline-none focus:border-terracotta"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="phone" className="label-caps block">
            Teléfono móvil
          </label>
          <input
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            inputMode="tel"
            maxLength={20}
            autoComplete="tel"
            className="w-full rounded-md border border-input bg-card px-4 py-3 text-base outline-none focus:border-terracotta"
          />
        </div>

        <ChoiceGroup
          legend="¿Qué sueles pedir?"
          options={[...USUAL_ORDERS]}
          value={usualOrder}
          onChange={setUsualOrder}
        />
        <ChoiceGroup
          legend="Tipo de leche"
          options={[...MILK_TYPES]}
          value={milkType}
          onChange={setMilkType}
        />
        <ChoiceGroup
          legend="Perfil de sabor"
          options={[...FLAVOR_PROFILES]}
          value={flavorProfile}
          onChange={setFlavorProfile}
        />
        <ChoiceGroup
          legend="¿Tomas descafeinado?"
          options={DECAF_OPTIONS.map((o) => o.label)}
          value={decaf ? DECAF_OPTIONS[1].label : DECAF_OPTIONS[0].label}
          onChange={(label) => setDecaf(label === DECAF_OPTIONS[1].label)}
        />

        {error ? <p className="text-sm text-destructive">{error}</p> : null}

        <button
          type="submit"
          disabled={saving}
          className="btn-terracotta w-full rounded-md px-6 py-4 text-sm font-medium disabled:opacity-60"
        >
          {saving ? "Generando…" : "Generar Tarjeta"}
        </button>
      </form>
    </main>
  );
}

function ChoiceGroup({
  legend,
  options,
  value,
  onChange,
}: {
  legend: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <fieldset>
      <legend className="label-caps">{legend}</legend>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((option) => {
          const active = option === value;
          return (
            <button
              key={option}
              type="button"
              onClick={() => onChange(option)}
              className={
                active
                  ? "btn-terracotta rounded-md px-4 py-2.5 text-sm font-medium"
                  : "rounded-md border border-border bg-card px-4 py-2.5 text-sm transition-colors hover:bg-secondary"
              }
            >
              {option}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
