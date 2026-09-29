<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

# Project rules

- Routes: `/` landing, `/registro` (customer sign-up + digital pass), `/barista` (PIN-gated counter view). Keeps the two user surfaces separate and shareable.
- Coffee option lists, loyalty goal, and hopper recommendations live in `src/lib/coffee.ts` — single source of truth shared by both views.
- The barista PIN is a client-side gate only (`BARISTA_PIN` in `src/routes/barista.tsx`); it is convenience, not authentication.
- `customers` table is readable/writable by anonymous visitors because the app has no user accounts; keep only non-sensitive fields there.
- QR generation uses `qrcode`; camera scanning uses `html5-qrcode` imported dynamically inside an effect so SSR never loads it.
