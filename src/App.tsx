import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "@/components/layout/AppLayout";
import { PlaceholderPage } from "@/components/PlaceholderPage";
import Dashboard from "./pages/Dashboard";
import ServiceOrders from "./pages/ServiceOrders";
import TJammerContrasenha from "./pages/TJammerContrasenha";
import Estoque from "./pages/Estoque";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/contrasenha" element={<PlaceholderPage title="Contrasenha" breadcrumbs={[{ label: "Contrasenha" }]} />} />
            <Route path="/tjammer" element={<TJammerContrasenha />} />
            <Route path="/acompanhamento" element={<PlaceholderPage title="Acompanhamento" breadcrumbs={[{ label: "Acompanhamento" }]} />} />
            <Route path="/veiculos" element={<PlaceholderPage title="Consulta de Veículos" breadcrumbs={[{ label: "Consulta de Veículos" }]} />} />
            <Route path="/estoque" element={<Estoque />} />
            <Route path="/ordens" element={<ServiceOrders />} />
            <Route path="/ordens/nova" element={<PlaceholderPage title="Nova Ordem de Serviço" breadcrumbs={[{ label: "Ordens de Serviço", href: "/ordens" }, { label: "Nova OS" }]} />} />
            <Route path="/pedidos" element={<PlaceholderPage title="Pedidos" breadcrumbs={[{ label: "Pedidos" }]} />} />
            <Route path="/manutencao/empresas" element={<PlaceholderPage title="Empresas" breadcrumbs={[{ label: "Manutenções" }, { label: "Empresas" }]} />} />
            <Route path="/manutencao/usuarios" element={<PlaceholderPage title="Usuários" breadcrumbs={[{ label: "Manutenções" }, { label: "Usuários" }]} />} />
            <Route path="/manutencao/tecnicos" element={<PlaceholderPage title="Técnicos" breadcrumbs={[{ label: "Manutenções" }, { label: "Técnicos" }]} />} />
            <Route path="/manutencao/categorias" element={<PlaceholderPage title="Categorias de Técnicos" breadcrumbs={[{ label: "Manutenções" }, { label: "Categorias" }]} />} />
            <Route path="/manutencao/produtos" element={<PlaceholderPage title="Produtos" breadcrumbs={[{ label: "Manutenções" }, { label: "Produtos" }]} />} />
            <Route path="/manutencao/equipamentos" element={<PlaceholderPage title="Equipamentos" breadcrumbs={[{ label: "Manutenções" }, { label: "Equipamentos" }]} />} />
            <Route path="/manutencao/veiculos" element={<PlaceholderPage title="Veículos" breadcrumbs={[{ label: "Manutenções" }, { label: "Veículos" }]} />} />
            <Route path="/manutencao/modelos" element={<PlaceholderPage title="Modelos de Veículos" breadcrumbs={[{ label: "Manutenções" }, { label: "Modelos" }]} />} />
            <Route path="/relatorios/os" element={<PlaceholderPage title="Relatório de OS" breadcrumbs={[{ label: "Relatórios" }, { label: "Ordens de Serviço" }]} />} />
            <Route path="/relatorios/placas" element={<PlaceholderPage title="Placas Retiradas" breadcrumbs={[{ label: "Relatórios" }, { label: "Placas Retiradas" }]} />} />
            <Route path="/usuarios" element={<PlaceholderPage title="Usuários" breadcrumbs={[{ label: "Usuários" }]} />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
