import { LogOut, User, Bell } from "lucide-react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

const breadcrumbMap: Record<string, string> = {
  "/": "Dashboard",
  "/contasenha": "Contasenha",
  "/tjammer": "TJammer Contrasenha",
  "/auditoria": "Auditoria",
  "/veiculos-consulta": "Consulta de Veículos",
  "/estoque": "Estoque",
  "/ordens": "Ordens de Serviço",
  "/ordens/consulta": "Consulta de OS",
  "/pedidos": "Pedidos",
  "/manutencoes/empresas": "Manutenções / Empresas",
  "/manutencoes/usuarios": "Manutenções / Usuários",
  "/manutencoes/tecnicos": "Manutenções / Técnicos",
  "/manutencoes/categorias-tecnicos": "Manutenções / Categorias de Técnicos",
  "/manutencoes/produtos": "Manutenções / Produtos",
  "/manutencoes/equipamentos": "Manutenções / Equipamentos",
  "/manutencoes/veiculos": "Manutenções / Veículos",
  "/manutencoes/modelos-veiculos": "Manutenções / Modelos de Veículos",
  "/relatorios/ordens": "Relatórios / Ordens de Serviço",
  "/relatorios/placas-retiradas": "Relatórios / Placas Retiradas",
  "/usuarios": "Usuários do Sistema",
};

export function AppHeader() {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const currentPage = breadcrumbMap[location.pathname] || "Página";

  return (
    <motion.header
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="h-14 bg-card flex items-center justify-between px-6 border-b border-border flex-shrink-0"
      style={{ boxShadow: "var(--shadow-sm)" }}
    >
      <div className="flex items-center gap-2 text-sm">
        <span className="text-muted-foreground">TELIG</span>
        <span className="text-border">/</span>
        <span className="text-foreground font-medium">{currentPage}</span>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" className="relative text-muted-foreground hover:text-foreground">
          <Bell size={16} />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-primary rounded-full" />
        </Button>
        <div className="h-5 w-px bg-border mx-1" />
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
            <User size={14} className="text-primary" />
          </div>
          <span className="hidden sm:inline font-medium text-foreground/80">
            {user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Usuário"}
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={signOut}
          className="text-muted-foreground hover:text-destructive transition-colors"
          title="Sair"
        >
          <LogOut size={16} />
        </Button>
      </div>
    </motion.header>
  );
}
