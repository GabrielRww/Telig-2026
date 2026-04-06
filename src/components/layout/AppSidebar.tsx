import {
  LayoutDashboard, Shield, Radio, Eye, Search, Package, FileText, FilePlus,
  ShoppingCart, Settings, BarChart3, Users, ChevronDown,
  Building2, UserCog, Tag, Box, Truck, Car, CarFront,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem, useSidebar,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const mainItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Contrasenha", url: "/contrasenha", icon: Shield },
  { title: "TJammer Contrasenha", url: "/tjammer", icon: Radio },
  { title: "Acompanhamento", url: "/acompanhamento", icon: Eye },
  { title: "Consulta de Veículos", url: "/veiculos", icon: Search },
  { title: "Estoque", url: "/estoque", icon: Package },
  { title: "Ordem de Serviço", url: "/ordens", icon: FileText },
  { title: "Ordem de Serviço (novo)", url: "/ordens/nova", icon: FilePlus },
  { title: "Pedidos", url: "/pedidos", icon: ShoppingCart },
];

const manutencaoItems = [
  { title: "Empresas", url: "/manutencao/empresas", icon: Building2 },
  { title: "Usuários", url: "/manutencao/usuarios", icon: Users },
  { title: "Técnicos", url: "/manutencao/tecnicos", icon: UserCog },
  { title: "Cat. Técnicos", url: "/manutencao/categorias", icon: Tag },
  { title: "Produtos", url: "/manutencao/produtos", icon: Box },
  { title: "Equipamentos", url: "/manutencao/equipamentos", icon: Truck },
  { title: "Veículos", url: "/manutencao/veiculos", icon: Car },
  { title: "Modelos Veículos", url: "/manutencao/modelos", icon: CarFront },
];

const relatorioItems = [
  { title: "Ordens de Serviço", url: "/relatorios/os", icon: FileText },
  { title: "Placas Retiradas", url: "/relatorios/placas", icon: BarChart3 },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();

  const isManutencaoActive = manutencaoItems.some(i => location.pathname.startsWith(i.url));
  const isRelatorioActive = relatorioItems.some(i => location.pathname.startsWith(i.url));

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <SidebarContent className="bg-sidebar pt-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/50 text-xs uppercase tracking-wider">
            Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/"}
                      className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
                      activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

              {/* Manutenções submenu */}
              {!collapsed && (
                <Collapsible defaultOpen={isManutencaoActive}>
                  <SidebarMenuItem>
                    <CollapsibleTrigger className="w-full">
                      <SidebarMenuButton className="text-sidebar-foreground hover:bg-sidebar-accent w-full">
                        <Settings className="h-4 w-4 shrink-0" />
                        <span className="flex-1 text-left">Manutenções</span>
                        <ChevronDown className="h-3 w-3 transition-transform group-data-[state=open]:rotate-180" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {manutencaoItems.map((item) => (
                          <SidebarMenuSubItem key={item.title}>
                            <SidebarMenuSubButton asChild>
                              <NavLink
                                to={item.url}
                                className="text-sidebar-foreground/70 hover:text-sidebar-accent-foreground"
                                activeClassName="text-sidebar-primary font-medium"
                              >
                                <item.icon className="h-3.5 w-3.5" />
                                <span>{item.title}</span>
                              </NavLink>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              )}

              {/* Relatórios submenu */}
              {!collapsed && (
                <Collapsible defaultOpen={isRelatorioActive}>
                  <SidebarMenuItem>
                    <CollapsibleTrigger className="w-full">
                      <SidebarMenuButton className="text-sidebar-foreground hover:bg-sidebar-accent w-full">
                        <BarChart3 className="h-4 w-4 shrink-0" />
                        <span className="flex-1 text-left">Relatórios</span>
                        <ChevronDown className="h-3 w-3 transition-transform group-data-[state=open]:rotate-180" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {relatorioItems.map((item) => (
                          <SidebarMenuSubItem key={item.title}>
                            <SidebarMenuSubButton asChild>
                              <NavLink
                                to={item.url}
                                className="text-sidebar-foreground/70 hover:text-sidebar-accent-foreground"
                                activeClassName="text-sidebar-primary font-medium"
                              >
                                <item.icon className="h-3.5 w-3.5" />
                                <span>{item.title}</span>
                              </NavLink>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              )}

              {/* Usuários admin */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to="/usuarios"
                    className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                  >
                    <Users className="h-4 w-4 shrink-0" />
                    {!collapsed && <span>Usuários</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
