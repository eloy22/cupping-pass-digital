DROP POLICY IF EXISTS "Customer passes are readable" ON public.customers;
DROP POLICY IF EXISTS "Loyalty stamps can be updated" ON public.customers;
REVOKE SELECT, UPDATE, DELETE ON public.customers FROM anon;
REVOKE SELECT, UPDATE, DELETE ON public.customers FROM authenticated;
GRANT INSERT ON public.customers TO anon;
GRANT ALL ON public.customers TO service_role;