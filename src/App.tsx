import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "@/components/layout/AppLayout";
import Dashboard from "@/pages/Dashboard";
import ServiceOrders from "@/pages/ServiceOrders";
import TJammerContrasenha from "@/pages/TJammerContrasenha";
import Estoque from "@/pages/Estoque";
import ServiceOrderConsulta from "@/pages/ServiceOrdemConsulta";
import { PlaceholderPage } from "@/components/PlaceholderPage";
import NotFound from "@/pages/NotFound";

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
            <Route path="/contasenha" element={<PlaceholderPage title="Contasenha" />} />
            <Route path="/tjammer" element={<TJammerContrasenha />} />
            <Route path="/acompanhamento" element={<PlaceholderPage title="Acompanhamento" />} />
            <Route path="/veiculos-consulta" element={<PlaceholderPage title="Consulta de Veículos" />} />
            <Route path="/estoque" element={<Estoque />} />
            <Route path="/ordens" element={<ServiceOrders />} />
            <Route path="/ordens/consulta" element={<ServiceOrderConsulta />} />
            <Route path="/pedidos" element={<PlaceholderPage title="Pedidos" />} />
            <Route path="/manutencoes/empresas" element={<PlaceholderPage title="Empresas" />} />
            <Route path="/manutencoes/usuarios" element={<PlaceholderPage title="Usuários" />} />
            <Route path="/manutencoes/tecnicos" element={<PlaceholderPage title="Técnicos" />} />
            <Route path="/manutencoes/categorias-tecnicos" element={<PlaceholderPage title="Categorias de Técnicos" />} />
            <Route path="/manutencoes/produtos" element={<PlaceholderPage title="Produtos" />} />
            <Route path="/manutencoes/equipamentos" element={<PlaceholderPage title="Equipamentos" />} />
            <Route path="/manutencoes/veiculos" element={<PlaceholderPage title="Veículos" />} />
            <Route path="/manutencoes/modelos-veiculos" element={<PlaceholderPage title="Modelos de Veículos" />} />
            <Route path="/relatorios/ordens" element={<PlaceholderPage title="Relatório de Ordens de Serviço" />} />
            <Route path="/relatorios/placas-retiradas" element={<PlaceholderPage title="Relatório de Placas Retiradas" description="Detecção automática de placas com possível retirada não registrada." />} />
            <Route path="/usuarios" element={<PlaceholderPage title="Usuários do Sistema" />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
