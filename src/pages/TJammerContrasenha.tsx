import { useState } from "react";
import { Shield, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function TJammerContrasenha() {
  const [senha, setSenha] = useState("");
  const [comando, setComando] = useState("");
  const [contrasenha, setContrasenha] = useState<string | null>(null);

  const handleGerar = () => {
    // Mock - algoritmo proprietário será implementado
    setContrasenha("A7F3-BK92-X41D");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-foreground">TJammer Contrasenha</h1>

      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Shield size={18} className="text-primary" />
            Gerar Contrasenha de Desbloqueio
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="senha">*Senha do Control</Label>
            <Input
              id="senha"
              type="number"
              placeholder="Ex: 56"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Número exibido pelo equipamento Control no veículo
            </p>
          </div>

          <div className="space-y-2">
            <Label>Selecione o equipamento</Label>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Buscar por número de série do TJammer" className="pl-9" />
            </div>
          </div>

          <div className="space-y-2">
            <Label>*Comando</Label>
            <Select value={comando} onValueChange={setComando}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo de desbloqueio" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bloqueio_permanente">Bloqueio Permanente</SelectItem>
                <SelectItem value="bloqueio_temporizado">Bloqueio Temporizado</SelectItem>
                <SelectItem value="manobra">Manobra</SelectItem>
                <SelectItem value="manutencao">Manutenção</SelectItem>
                <SelectItem value="reset">Reset</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Observação</Label>
            <Textarea placeholder="Motivo do desbloqueio (opcional)" rows={3} />
          </div>

          <Button
            onClick={handleGerar}
            className="w-full"
            disabled={!senha || !comando}
          >
            Gerar Contrasenha
          </Button>

          {contrasenha && (
            <div className="mt-4 p-6 bg-primary/5 border border-primary/20 rounded-lg text-center space-y-3">
              <p className="text-sm text-muted-foreground">Contrasenha gerada:</p>
              <p className="text-3xl font-bold text-primary tracking-widest">
                {contrasenha}
              </p>
              <div className="text-xs text-muted-foreground space-y-1">
                <p>Cliente: <strong>Volare Segurança</strong></p>
                <p>Veículo: <strong>ABC-1234</strong></p>
                <p>Técnico: <strong>Carlos Silva</strong></p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
