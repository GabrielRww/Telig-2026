import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function OsAssistantConfigDialog() {
  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [canEdit, setCanEdit] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!open) return;

    const loadConfig = async () => {
      const { data } = await supabase
        .from("ai_assistant_config")
        .select("system_prompt")
        .eq("key", "os_closing_assistant")
        .single();
      if (data) setPrompt(data.system_prompt);
    };

    const checkRole = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id);
      const userRoles = roles?.map((r) => r.role) || [];
      setCanEdit(userRoles.includes("admin") || userRoles.includes("developer"));
    };

    loadConfig();
    checkRole();
  }, [open]);

  const save = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase
      .from("ai_assistant_config")
      .update({ system_prompt: prompt, updated_by: user?.id })
      .eq("key", "os_closing_assistant");

    if (error) {
      toast({ title: "Erro", description: "Sem permissão ou erro ao salvar.", variant: "destructive" });
    } else {
      toast({ title: "Salvo", description: "Prompt do assistente atualizado com sucesso." });
      setOpen(false);
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8" title="Configurar Assistente IA">
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Configuração do Assistente IA</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            {canEdit
              ? "Edite o prompt do assistente de fechamento de OS abaixo."
              : "Somente administradores e desenvolvedores podem editar."}
          </p>
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={16}
            disabled={!canEdit}
            className="font-mono text-xs"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
          {canEdit && (
            <Button onClick={save} disabled={loading}>
              {loading ? "Salvando..." : "Salvar"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
