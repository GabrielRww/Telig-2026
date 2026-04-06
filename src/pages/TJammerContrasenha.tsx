import { useState } from "react";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield } from "lucide-react";

const TJammerContrasenha = () => {
  const [resultado, setResultado] = useState<string | null>(null);

  const handleGerar = () => {
    setResultado("A7F3-B92E");
  };

  return (
    <div>
      <Breadcrumb items={[{ label: "TJammer Contrasenha" }]} />
      <h1 className="text-2xl font-bold text-foreground mb-6">TJammer Contrasenha</h1>

      <div className="bg-card rounded-lg border p-6 max-w-xl">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">
              *Senha do Control
            </label>
            <Input type="number" placeholder="Ex: 56" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">
              Selecione o equipamento
            </label>
            <Input placeholder="Buscar por número de série do TJammer..." />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">
              *Comando
            </label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o comando" />
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

          <Button className="w-full gap-2" onClick={handleGerar}>
            <Shield className="h-4 w-4" />
            Gerar Contrasenha
          </Button>

          {resultado && (
            <div className="mt-4 p-6 bg-primary/5 rounded-lg border border-primary/20 text-center">
              <p className="text-sm text-muted-foreground mb-2">Contrasenha gerada:</p>
              <p className="text-4xl font-bold text-primary tracking-wider">{resultado}</p>
              <div className="mt-3 text-xs text-muted-foreground space-y-0.5">
                <p>Cliente: GolSat Rastreamento</p>
                <p>Veículo: ABC-1234</p>
                <p>Técnico: Carlos Silva</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TJammerContrasenha;
