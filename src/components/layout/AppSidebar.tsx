import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, ShieldCheck, ClipboardCheck, Car, Package,
  ClipboardList, FileSearch, ShoppingCart, Settings, BarChart3, Users,
  ChevronDown, ChevronLeft, ChevronRight, Building2, UserCog, Tag,
  Box, Cpu, CarFront, FileText, Wallet, TrendingUp, TrendingDown, PieChart,
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
  { label: "Contasenha", path: "/contasenha", icon: ShieldCheck },
  { label: "TJammer", path: "/tjammer", icon: ShieldCheck },
  { label: "Auditoria", path: "/auditoria", icon: ClipboardCheck },
  { label: "Consulta Veículos", path: "/veiculos-consulta", icon: Car },
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
    ],
  },
  {
    label: "Financeiro",
    icon: Wallet,
    children: [
      { label: "Notas Fiscais", path: "/financeiro/notas-fiscais", icon: FileText },
      { label: "Contas a Receber", path: "/financeiro/contas-receber", icon: TrendingUp },
      { label: "Contas a Pagar", path: "/financeiro/contas-pagar", icon: TrendingDown },
      { label: "Relatório Financeiro", path: "/financeiro/relatorio", icon: PieChart },
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
      <div
        className="flex items-center justify-between h-14 px-4 border-b border-sidebar-border"
        style={{ background: "hsl(var(--sidebar-header))" }}
      >
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm font-semibold tracking-[0.28em] text-white"
          >
            TELIG
          </motion.span>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-sidebar-border bg-sidebar-hover text-sidebar-foreground/90 shadow-sm transition-all duration-200 hover:bg-primary hover:text-white"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 scrollbar-thin space-y-0.5 px-2">
        {menuItems.map((item, idx) => {
          if (item.children) {
            const isOpen = openMenus[item.label] || hasActiveChild(item.children);
            const activeChild = hasActiveChild(item.children);
            return (
              <div key={item.label}>
                <button
                  onClick={() => !collapsed && toggleSubmenu(item.label)}
                  className={cn(
                    "group flex items-center w-full py-2 text-sm rounded-lg transition-all duration-200",
                    collapsed ? "justify-center px-2" : "px-3",
                    activeChild
                      ? "text-white bg-sidebar-hover"
                      : "text-sidebar-foreground hover:bg-sidebar-hover hover:text-white"
                  )}
                  title={collapsed ? item.label : undefined}
                >
                  <span
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-lg border transition-all duration-200 shrink-0",
                      activeChild
                        ? "border-primary/20 bg-primary/10 text-primary"
                        : "border-sidebar-border/80 bg-sidebar-header/70 text-sidebar-foreground/80 group-hover:border-sidebar-hover group-hover:bg-sidebar-hover group-hover:text-white"
                    )}
                  >
                    <item.icon size={16} className="flex-shrink-0" />
                  </span>
                  {!collapsed && (
                    <>
                      <span className="ml-3 flex-1 text-left truncate">{item.label}</span>
                      <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                        <ChevronDown size={14} />
                      </motion.div>
                    </>
                  )}
                </button>
                <AnimatePresence>
                  {!collapsed && isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden ml-3 mt-0.5 border-l border-sidebar-border/50 pl-1"
                    >
                      {item.children.map((child) => (
                        <NavLink
                          key={child.path}
                          to={child.path}
                          className={cn(
                            "group flex items-center py-1.5 text-sm rounded-lg transition-all duration-200 my-0.5",
                            collapsed ? "justify-center px-2" : "px-3",
                            isActive(child.path)
                              ? "text-white bg-primary/20 font-medium"
                              : "text-sidebar-foreground hover:bg-sidebar-hover hover:text-white"
                          )}
                        >
                          <span
                            className={cn(
                              "flex h-7 w-7 items-center justify-center rounded-md border transition-all duration-200 shrink-0",
                              isActive(child.path)
                                ? "border-primary/20 bg-primary/10 text-primary"
                                : "border-sidebar-border/80 bg-sidebar-header/70 text-sidebar-foreground/80 group-hover:border-sidebar-hover group-hover:bg-sidebar-hover group-hover:text-white"
                            )}
                          >
                            <child.icon size={13} className="flex-shrink-0" />
                          </span>
                          <span className="ml-2.5 truncate">{child.label}</span>
                          {isActive(child.path) && (
                            <motion.div
                              layoutId="sidebar-active-dot"
                              className="ml-auto w-1.5 h-1.5 rounded-full bg-primary"
                            />
                          )}
                        </NavLink>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          }

          return (
            <NavLink
              key={item.path}
              to={item.path!}
              end={item.path === "/"}
              className={cn(
                "group flex items-center py-2 text-sm rounded-lg transition-all duration-200",
                collapsed ? "justify-center px-2" : "px-3",
                isActive(item.path)
                  ? "text-white bg-primary/20 font-medium"
                  : "text-sidebar-foreground hover:bg-sidebar-hover hover:text-white"
              )}
              title={collapsed ? item.label : undefined}
            >
              <span
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-lg border transition-all duration-200 shrink-0",
                  isActive(item.path)
                    ? "border-primary/20 bg-primary/10 text-primary"
                    : "border-sidebar-border/80 bg-sidebar-header/70 text-sidebar-foreground/80 group-hover:border-sidebar-hover group-hover:bg-sidebar-hover group-hover:text-white"
                )}
              >
                <item.icon size={16} className="flex-shrink-0" />
              </span>
              {!collapsed && <span className="ml-3 truncate">{item.label}</span>}
              {!collapsed && isActive(item.path) && (
                <motion.div
                  layoutId="sidebar-active-indicator"
                  className="ml-auto w-1.5 h-1.5 rounded-full bg-primary"
                />
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="px-4 py-3 border-t border-sidebar-border">
          <p className="text-xs text-sidebar-foreground/40">Saeggo do Brasil</p>
          <p className="text-[10px] text-sidebar-foreground/25 mt-0.5">v1.0.0</p>
        </div>
      )}
    </aside>
  );
}
