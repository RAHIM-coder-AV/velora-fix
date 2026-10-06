CREATE TABLE IF NOT EXISTS public.store_homepage_content (
  id text PRIMARY KEY CHECK (id = 'default'),
  content jsonb NOT NULL CHECK (jsonb_typeof(content) = 'object'),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.store_homepage_content ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'store_homepage_content'
      AND policyname = 'Public can read homepage content'
  ) THEN
    CREATE POLICY "Public can read homepage content"
      ON public.store_homepage_content
      FOR SELECT
      TO anon, authenticated
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'store_homepage_content'
      AND policyname = 'Admins can insert homepage content'
  ) THEN
    CREATE POLICY "Admins can insert homepage content"
      ON public.store_homepage_content
      FOR INSERT
      TO authenticated
      WITH CHECK (
        EXISTS (
          SELECT 1
          FROM public.profiles
          WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'store_homepage_content'
      AND policyname = 'Admins can update homepage content'
  ) THEN
    CREATE POLICY "Admins can update homepage content"
      ON public.store_homepage_content
      FOR UPDATE
      TO authenticated
      USING (
        EXISTS (
          SELECT 1
          FROM public.profiles
          WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
      )
      WITH CHECK (
        EXISTS (
          SELECT 1
          FROM public.profiles
          WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
      );
  END IF;
END;
$$;

GRANT SELECT ON public.store_homepage_content TO anon, authenticated;
GRANT INSERT, UPDATE ON public.store_homepage_content TO authenticated;