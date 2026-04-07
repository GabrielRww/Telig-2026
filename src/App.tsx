import { lazy } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "@/components/layout/AppLayout";

// Carregamento sob demanda — cada página só é baixada quando acessada
const Dashboard          = lazy(() => import("@/pages/Dashboard"));
const ServiceOrders      = lazy(() => import("@/pages/ServiceOrders"));
const TJammerContrasenha = lazy(() => import("@/pages/TJammerContrasenha"));
const Estoque            = lazy(() => import("@/pages/Estoque"));
const ServiceOrderConsulta = lazy(() => import("@/pages/ServiceOrdemConsulta"));
const Auditoria          = lazy(() => import("@/pages/Auditoria"));
const Contasenha         = lazy(() => import("@/pages/ContaSenha"));
const VeiculosConsulta   = lazy(() => import("@/pages/manutencoes/VeiculosConsulta"));
const Pedidos            = lazy(() => import("@/pages/Pedidos"));
const Empresas           = lazy(() => import("@/pages/Empresas"));
const Usuarios           = lazy(() => import("@/pages/manutencoes/Usuarios"));
const Tecnicos           = lazy(() => import("@/pages/manutencoes/Tecnicos"));
const CategoriasTecnicos = lazy(() => import("@/pages/manutencoes/CategoriasTecnicos"));
const Produtos           = lazy(() => import("@/pages/manutencoes/Produtos"));
const Equipamentos       = lazy(() => import("@/pages/manutencoes/Equipamentos"));
const Veiculos           = lazy(() => import("@/pages/manutencoes/Veiculos"));
const ModelosVeiculos    = lazy(() => import("@/pages/manutencoes/ModelosVeiculo"));
const RelatorioOrdens    = lazy(() => import("@/pages/relatorios/RelatorioOrdens"));
const PlacasRetiradas    = lazy(() => import("@/pages/relatorios/PlacasRetiradas"));
const UsuariosSistema    = lazy(() => import("@/pages/UsuariosSistema"));
const NotFound           = lazy(() => import("@/pages/NotFound"));

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
            <Route path="/contasenha" element={<Contasenha />} />
            <Route path="/tjammer" element={<TJammerContrasenha />} />
            <Route path="/auditoria" element={<Auditoria />} />
            <Route path="/veiculos-consulta" element={<VeiculosConsulta />} />
            <Route path="/estoque" element={<Estoque />} />
            <Route path="/ordens" element={<ServiceOrders />} />
            <Route path="/ordens/consulta" element={<ServiceOrderConsulta />} />
            <Route path="/pedidos" element={<Pedidos />} />
            <Route path="/manutencoes/empresas" element={<Empresas />} />
            <Route path="/manutencoes/usuarios" element={<Usuarios />} />
            <Route path="/manutencoes/tecnicos" element={<Tecnicos />} />
            <Route path="/manutencoes/categorias-tecnicos" element={<CategoriasTecnicos />} />
            <Route path="/manutencoes/produtos" element={<Produtos />} />
            <Route path="/manutencoes/equipamentos" element={<Equipamentos />} />
            <Route path="/manutencoes/veiculos" element={<Veiculos />} />
            <Route path="/manutencoes/modelos-veiculos" element={<ModelosVeiculos />} />
            <Route path="/relatorios/ordens" element={<RelatorioOrdens />} />
            <Route path="/relatorios/placas-retiradas" element={<PlacasRetiradas />} />
            <Route path="/usuarios" element={<UsuariosSistema />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
