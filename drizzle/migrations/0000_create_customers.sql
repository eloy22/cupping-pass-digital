CREATE TABLE public.customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  phone text NOT NULL,
  usual_order text NOT NULL,
  milk_type text NOT NULL,
  flavor_profile text NOT NULL,
  decaf boolean NOT NULL DEFAULT false,
  stamps integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.customers TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.customers TO authenticated;
GRANT ALL ON public.customers TO service_role;

ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can register as a customer"
  ON public.customers FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Customer passes are readable"
  ON public.customers FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Loyalty stamps can be updated"
  ON public.customers FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);