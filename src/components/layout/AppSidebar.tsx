import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Shield,
  Radio,
  ClipboardCheck,
  Car,
  Package,
  ClipboardList,
  FileSearch,
  ShoppingCart,
  Settings,
  BarChart3,
  Users,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Building2,
  UserCog,
  Tag,
  Box,
  Cpu,
  CarFront,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MenuItem {
  label: string;
  path?: string;
  icon: React.ElementType;
  children?: { label: string; path: string; icon: React.ElementType }[];
  adminOnly?: boolean;
}

const menuItems: MenuItem[] = [
  { label: "Dashboard", path: "/", icon: LayoutDashboard },
  { label: "Contrasenha", path: "/contasenha", icon: Shield },
  { label: "TJammer Contrasenha", path: "/tjammer", icon: Radio },
  { label: "Auditoria", path: "/auditoria", icon: ClipboardCheck },
  { label: "Consulta de Veículos", path: "/veiculos-consulta", icon: Car },
  { label: "Estoque", path: "/estoque", icon: Package },
  { label: "Ordem de Serviço", path: "/ordens", icon: ClipboardList },
  { label: "OS Consulta", path: "/ordens/consulta", icon: FileSearch },
  { label: "Pedidos", path: "/pedidos", icon: ShoppingCart },
  {
    label: "Manutenções",
    icon: Settings,
    children: [
      { label: "Empresas", path: "/manutencoes/empresas", icon: Building2 },
      { label: "Usuários", path: "/manutencoes/usuarios", icon: Users },
      { label: "Técnicos", path: "/manutencoes/tecnicos", icon: UserCog },
      { label: "Cat. Técnicos", path: "/manutencoes/categorias-tecnicos", icon: Tag },
      { label: "Produtos", path: "/manutencoes/produtos", icon: Box },
      { label: "Equipamentos", path: "/manutencoes/equipamentos", icon: Cpu },
      { label: "Veículos", path: "/manutencoes/veiculos", icon: CarFront },
      { label: "Modelos Veículos", path: "/manutencoes/modelos-veiculos", icon: Car },
    ],
  },
  {
    label: "Relatórios",
    icon: BarChart3,
    children: [
      { label: "Ordens de Serviço", path: "/relatorios/ordens", icon: FileText },
      { label: "Placas Retiradas", path: "/relatorios/placas-retiradas", icon: Car },
    ],
  },
  { label: "Usuários", path: "/usuarios", icon: Users, adminOnly: true },
];

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});
  const location = useLocation();

  const itemBaseClass =
    "group relative flex items-center w-full overflow-hidden px-4 py-2.5 text-sm border-r-2 border-transparent rounded-r-md transition-[background-color,color,border-color,transform] duration-200 ease-out focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-sidebar-active/40 active:translate-y-px";
  const itemTopLineClass =
    "before:pointer-events-none before:absolute before:left-3 before:right-3 before:top-0 before:h-px before:origin-left before:scale-x-0 before:rounded-full before:bg-sidebar-active/0 before:transition-[transform,background-color] before:duration-200";
  const itemIdleClass =
    "text-sidebar-foreground hover:bg-sidebar-hover/80 hover:text-sidebar-active-foreground hover:before:scale-x-100 hover:before:bg-sidebar-active/45";
  const itemActiveClass =
    "text-sidebar-active-foreground bg-sidebar-active/20 border-sidebar-active shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] before:scale-x-100 before:bg-sidebar-active/70";

  const toggleSubmenu = (label: string) => {
    setOpenMenus((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const isActive = (path?: string) => path && location.pathname === path;
  const hasActiveChild = (children?: MenuItem["children"]) =>
    children?.some((c) => location.pathname === c.path);

  return (
    <aside
      className={cn(
        "flex flex-col h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300 flex-shrink-0",
        collapsed ? "w-16" : "w-[260px]"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between h-14 px-4 bg-sidebar-header border-b border-sidebar-border">
        {!collapsed && (
          <span className="text-lg font-bold text-sidebar-active-foreground tracking-wide">
            TELIG <span className="text-sidebar-active">:)</span>
          </span>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-md text-sidebar-foreground hover:bg-sidebar-hover transition-colors"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-2 scrollbar-thin">
        {menuItems.map((item) => {
          if (item.children) {
            const isOpen = openMenus[item.label] || hasActiveChild(item.children);
            return (
              <div key={item.label}>
                <button
                  onClick={() => !collapsed && toggleSubmenu(item.label)}
                  className={cn(
                    itemBaseClass,
                    itemTopLineClass,
                    hasActiveChild(item.children) ? itemActiveClass : itemIdleClass
                  )}
                  title={collapsed ? item.label : undefined}
                >
                  <item.icon size={18} className="flex-shrink-0" />
                  {!collapsed && (
                    <>
                      <span className="ml-3 flex-1 text-left truncate">{item.label}</span>
                      <ChevronDown
                        size={14}
                        className={cn("transition-transform", isOpen && "rotate-180")}
                      />
                    </>
                  )}
                </button>
                {!collapsed && isOpen && (
                  <div className="ml-4 border-l border-sidebar-border">
                    {item.children.map((child) => (
                      <NavLink
                        key={child.path}
                        to={child.path}
                        className={cn(
                          "group relative flex items-center px-4 py-2 text-sm border-l-2 border-transparent rounded-md transition-[background-color,color,border-color,transform] duration-200 ease-out focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-sidebar-active/40 active:translate-y-px before:pointer-events-none before:absolute before:left-3 before:right-3 before:top-0 before:h-px before:origin-left before:scale-x-0 before:rounded-full before:bg-sidebar-active/0 before:transition-[transform,background-color] before:duration-200",
                          isActive(child.path)
                            ? "text-sidebar-active-foreground bg-sidebar-active/20 border-sidebar-active shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] before:scale-x-100 before:bg-sidebar-active/70"
                            : "text-sidebar-foreground hover:bg-sidebar-hover/80 hover:text-sidebar-active-foreground hover:before:scale-x-100 hover:before:bg-sidebar-active/45"
                        )}
                      >
                        <child.icon size={14} className="flex-shrink-0" />
                        <span className="ml-2.5 truncate">{child.label}</span>
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          return (
            <NavLink
              key={item.path}
              to={item.path!}
              end={item.path === "/"}
              className={cn(
                itemBaseClass,
                itemTopLineClass,
                isActive(item.path)
                  ? itemActiveClass
                  : itemIdleClass
              )}
              title={collapsed ? item.label : undefined}
            >
              <item.icon size={18} className="flex-shrink-0" />
              {!collapsed && <span className="ml-3 truncate">{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="px-4 py-3 border-t border-sidebar-border">
          <p className="text-xs text-sidebar-foreground/50">Saeggo do Brasil</p>
          <p className="text-xs text-sidebar-foreground/30">v1.0.0</p>
        </div>
      )}
    </aside>
  );
}
