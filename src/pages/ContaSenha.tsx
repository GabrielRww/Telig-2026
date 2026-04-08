import { useState } from "react";
import { Shield, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export default function Contrasenha() {
  const [senha, setSenha] = useState("");
  const [modelo, setModelo] = useState("");
  const [contrasenha, setContrasenha] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGerar = () => {
    setContrasenha("5829-ABKF-7714");
  };

  const handleCopy = () => {
    if (contrasenha) {
      navigator.clipboard.writeText(contrasenha);
      setCopied(true);
      toast.success("Contrasenha copiada!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-foreground">Contrasenha</h1>

      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Shield size={18} className="text-primary" />
            Gerar Contrasenha de Desbloqueio
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="senha-control">*Senha exibida no equipamento</Label>
            <Input
              id="senha-control"
              type="number"
              placeholder="Ex: 1234"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>*Modelo do equipamento</Label>
            <Select value={modelo} onValueChange={setModelo}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o modelo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tblock_v1">TBlock V1</SelectItem>
                <SelectItem value="tblock_v2">TBlock V2</SelectItem>
                <SelectItem value="tblock_pro">TBlock Pro</SelectItem>
                <SelectItem value="bloqueador_std">Bloqueador Standard</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={handleGerar} className="w-full" disabled={!senha || !modelo}>
            Gerar Contrasenha
          </Button>

          {contrasenha && (
            <div className="mt-4 p-6 bg-primary/5 border border-primary/20 rounded-lg text-center space-y-3">
              <p className="text-sm text-muted-foreground">Contrasenha gerada:</p>
              <p className="text-3xl font-bold text-primary tracking-widest">{contrasenha}</p>
              <Button variant="outline" size="sm" className="gap-2" onClick={handleCopy}>
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? "Copiado" : "Copiar"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
