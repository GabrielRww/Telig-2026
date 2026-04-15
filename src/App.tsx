import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AppLayout } from "@/components/layout/AppLayout";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import ServiceOrders from "@/pages/ServiceOrders";
import TJammerContrasenha from "@/pages/TJammerContrasenha";
import Estoque from "@/pages/Estoque";
import ServiceOrderConsulta from "@/pages/ServiceOrdemConsulta";
import Auditoria from "@/pages/Auditoria";
import Contasenha from "@/pages/ContaSenha";
import VeiculosConsulta from "@/pages/manutencoes/VeiculosConsulta";
import Pedidos from "@/pages/Pedidos";
import Empresas from "@/pages/Empresas";
import Usuarios from "@/pages/manutencoes/Usuarios";
import Tecnicos from "@/pages/manutencoes/Tecnicos";
import CategoriasTecnicos from "@/pages/manutencoes/CategoriasTecnicos";
import Produtos from "@/pages/manutencoes/Produtos";
import Equipamentos from "@/pages/manutencoes/Equipamentos";
import Veiculos from "@/pages/manutencoes/Veiculos";
import RelatorioOrdens from "@/pages/relatorios/RelatorioOrdens";
import PlacasRetiradas from "@/pages/relatorios/PlacasRetiradas";
import UsuariosSistema from "@/pages/UsuariosSistema";
import ConfiguracaoSAP from "@/pages/ConfiguracaoSAP";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
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
              <Route path="/relatorios/ordens" element={<RelatorioOrdens />} />
              <Route path="/relatorios/placas-retiradas" element={<PlacasRetiradas />} />
              <Route path="/usuarios" element={<UsuariosSistema />} />
              <Route path="/configuracao/sap" element={<ConfiguracaoSAP />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
