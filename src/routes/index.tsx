import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CuppingPass — Pase digital de café de especialidad" },
      {
        name: "description",
        content:
          "Registra tu perfil de café y consigue tu pase digital de fidelidad. Cada quinto café es cortesía de la casa.",
      },
      { property: "og:title", content: "CuppingPass — Pase digital de café de especialidad" },
      {
        property: "og:description",
        content:
          "Registra tu perfil de café y consigue tu pase digital de fidelidad. Cada quinto café es cortesía de la casa.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-6 py-16">
      <p className="label-caps">Cafetería de especialidad</p>
      <h1 className="mt-4 text-6xl leading-[0.95] sm:text-7xl">
        Cupping<span className="text-terracotta">Pass</span>
      </h1>
      <p className="mt-6 max-w-lg text-base leading-relaxed text-muted-foreground">
        Tu pase digital de cata y fidelidad. Cuéntanos cómo tomas el café, recibe tu tarjeta con
        código QR y deja que el barista prepare lo tuyo sin preguntar dos veces.
      </p>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link
          to="/registro"
          className="btn-terracotta inline-flex items-center rounded-md px-6 py-3 text-sm font-medium"
        >
          Crear mi pase
        </Link>
        <Link
          to="/barista"
          className="inline-flex items-center rounded-md border border-border bg-card px-6 py-3 text-sm font-medium transition-colors hover:bg-secondary"
        >
          Acceso barista
        </Link>
      </div>

      <div className="mt-16 grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-3">
        {[
          { n: "01", t: "Regístrate", d: "Un formulario breve con tu preparación y tu perfil." },
          { n: "02", t: "Muestra el QR", d: "Tu pase vive en el móvil, sin apps ni plásticos." },
          { n: "03", t: "Quinto gratis", d: "Cinco sellos y el siguiente espresso es cortesía." },
        ].map((s) => (
          <div key={s.n} className="bg-card p-6">
            <span className="label-caps">{s.n}</span>
            <h3 className="mt-3 text-2xl">{s.t}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.d}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
