import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const pinSchema = z.object({ pin: z.string().regex(/^\d{4}$/) });
const customerSchema = z.object({
  pin: z.string().regex(/^\d{4}$/),
  id: z.string().uuid(),
});

const CUSTOMER_FIELDS =
  "id, full_name, phone, usual_order, milk_type, flavor_profile, decaf, stamps";

function assertPin(pin: string) {
  const expected = process.env["BARISTA_PIN"] ?? "2026";
  if (pin !== expected) throw new Error("PIN incorrecto");
}

export const verifyBaristaPin = createServerFn({ method: "POST" })
  .inputValidator((input: { pin: string }) => pinSchema.parse(input))
  .handler(async ({ data }) => {
    assertPin(data.pin);
    return { ok: true };
  });

export const getCustomerById = createServerFn({ method: "POST" })
  .inputValidator((input: { pin: string; id: string }) => customerSchema.parse(input))
  .handler(async ({ data }) => {
    assertPin(data.pin);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: customer, error } = await supabaseAdmin
      .from("customers")
      .select(CUSTOMER_FIELDS)
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw new Error("No se pudo cargar el cliente.");
    return customer;
  });

export const addLoyaltyStamp = createServerFn({ method: "POST" })
  .inputValidator((input: { pin: string; id: string }) => customerSchema.parse(input))
  .handler(async ({ data }) => {
    assertPin(data.pin);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: current, error: readError } = await supabaseAdmin
      .from("customers")
      .select("stamps")
      .eq("id", data.id)
      .maybeSingle();
    if (readError || !current) throw new Error("Pase no encontrado.");

    const next = current.stamps >= 5 ? 1 : current.stamps + 1;
    const { data: customer, error } = await supabaseAdmin
      .from("customers")
      .update({ stamps: next })
      .eq("id", data.id)
      .select(CUSTOMER_FIELDS)
      .single();
    if (error) throw new Error("No se pudo actualizar el sello.");
    return customer;
  });
