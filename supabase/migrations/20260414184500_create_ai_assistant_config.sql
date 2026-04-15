-- Create AI assistant config table used by the OS assistant chat and config dialog.
CREATE TABLE public.ai_assistant_config (
  key TEXT PRIMARY KEY,
  system_prompt TEXT NOT NULL DEFAULT '',
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.ai_assistant_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins and developers can view assistant config"
ON public.ai_assistant_config
FOR SELECT
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin')
  OR public.has_role(auth.uid(), 'developer')
);

CREATE POLICY "Admins and developers can update assistant config"
ON public.ai_assistant_config
FOR UPDATE
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin')
  OR public.has_role(auth.uid(), 'developer')
)
WITH CHECK (
  public.has_role(auth.uid(), 'admin')
  OR public.has_role(auth.uid(), 'developer')
);

INSERT INTO public.ai_assistant_config (key, system_prompt)
VALUES (
  'os_closing_assistant',
  'Você é um assistente de fechamento de OS.'
)
ON CONFLICT (key) DO NOTHING;

CREATE TRIGGER update_ai_assistant_config_updated_at
  BEFORE UPDATE ON public.ai_assistant_config
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
