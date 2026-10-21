import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Building2,
  Boxes,
  Wrench,
  Shield,
  Users,
  FileWarning,
  TrendingUp,
  Building,
  ArrowLeftRight,
  FileText,
  UserCog,
  Settings,
  LogOut,
  ChevronRight,
  Info,
  Palette
} from 'lucide-react';
import { getReadableTextColor } from '../../utils/theme';

interface SidebarProps {
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, onCloseMobile }) => {
  const { 
    currentTab, 
    setCurrentTab, 
    currentUser, 
    hasPermission, 
    materials, 
    transfers, 
    tools,
    currentWork,
    companyBranding,
    logoutWithConfirm
  } = useApp();

  const criticalStockCount = materials.filter(m => m.currentStock <= m.minStock).length;
  const toolsInUseCount = tools.filter(t => t.status === 'Em uso').length;
  const pendingTransfersCount = transfers.filter(t => t.status !== 'Encerrado').length;

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Início',
      icon: LayoutDashboard,
      badge: null,
      permission: null,
    },
    {
      id: 'works',
      label: 'Obras',
      icon: Building2,
      badge: null,
      permission: 'works.view',
    },
    {
      id: 'materials',
      label: 'Materiais',
      icon: Boxes,
      badge: criticalStockCount > 0 ? `${criticalStockCount}` : null,
      badgeColor: 'bg-red-500 text-white',
      permission: 'materials.view',
    },
    {
      id: 'tools',
      label: 'Ferramentas',
      icon: Wrench,
      badge: toolsInUseCount > 0 ? `${toolsInUseCount} uso` : null,
      badgeColor: 'bg-slate-800 text-slate-300 border border-slate-700',
      permission: 'tools.view',
    },
    {
      id: 'epis',
      label: 'EPIs',
      icon: Shield,
      badge: null,
      permission: 'epis.view',
    },
    {
      id: 'progress',
      label: 'Andamento da Obra',
      icon: TrendingUp,
      badge: null,
      permission: 'progress.view',
    },
    {
      id: 'employees',
      label: 'Funcionários',
      icon: Users,
      badge: null,
      permission: 'employees.view',
    },
    {
      id: 'occurrences',
      label: 'Ocorrências',
      icon: FileWarning,
      badge: null,
      permission: 'occurrences.view',
    },
    {
      id: 'outsourced',
      label: 'Terceirizadas',
      icon: Building,
      badge: null,
      permission: 'outsourced.view',
    },
    {
      id: 'transfers',
      label: 'Transferências',
      icon: ArrowLeftRight,
      badge: pendingTransfersCount > 0 ? `${pendingTransfersCount}` : null,
      badgeColor: 'bg-slate-800 text-slate-300 border border-slate-700',
      permission: 'transfers.view',
    },
    {
      id: 'reports',
      label: 'Relatórios',
      icon: FileText,
      badge: null,
      permission: 'reports.view',
    },
    {
      id: 'users',
      label: 'Usuários & Acessos',
      icon: UserCog,
      badge: currentUser.role === 'ADM do sistema' ? 'ADM' : null,
      badgeColor: 'bg-emerald-500/20 text-emerald-300',
      permission: 'users.view',
    },
    {
      id: 'branding',
      label: 'Identidade Visual',
      icon: Palette,
      badge: null,
      permission: 'settings.view',
    },
    {
      id: 'settings',
      label: 'Configurações',
      icon: Settings,
      badge: null,
      permission: 'settings.view',
    },
  ];

  const handleSelectTab = (tabId: string) => {
    setCurrentTab(tabId);
    if (onCloseMobile) onCloseMobile();
  };

  const primaryBtnText = companyBranding.buttonPrimaryText || getReadableTextColor(companyBranding.buttonPrimary);

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm md:hidden animate-in fade-in duration-200"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed md:sticky top-0 md:top-16 z-40 md:z-20 h-screen md:h-[calc(100vh-4rem)] w-64 border-r flex flex-col justify-between transition-transform duration-200 ease-in-out select-none print:hidden ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
        style={{
          backgroundColor: 'var(--menu-bg)',
          borderColor: 'var(--border-color)',
        }}
      >
        {/* Top Header inside Mobile Drawer: Tenant brand */}
        <div 
          className="md:hidden flex items-center justify-between p-4 border-b"
          style={{ borderColor: 'var(--border-color)' }}
        >
          <div className="flex items-center gap-2">
            {companyBranding.logoUrl ? (
              <img src={companyBranding.logoUrl} alt="Logo" className="w-6 h-6 object-contain rounded" />
            ) : (
              <Building2 className="w-5 h-5 text-[var(--btn-primary)]" style={{ color: 'var(--btn-primary)' }} />
            )}
            <span className="font-extrabold text-sm tracking-tight text-[var(--title-color)] truncate max-w-[150px]">
              {companyBranding.tradeName || 'Minha Empresa'}
            </span>
          </div>
          <button 
            type="button"
            onClick={onCloseMobile}
            className="p-1 rounded text-[var(--text-secondary)] hover:text-[var(--title-color)]"
          >
            ✕
          </button>
        </div>

        {/* Navigation items list */}
        <div className="flex-1 py-3 px-3 space-y-3 overflow-y-auto">
          {/* Mobile Drawer view: Explicitly highlight Secondary Settings & Modules */}
          <div className="md:hidden space-y-4">
            {/* 1. Configurações & Administração Secundárias */}
            <div>
              <div className="px-3 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-[var(--accent-color)] flex items-center justify-between">
                <span>Configurações & Gestão</span>
              </div>
              <div className="space-y-1">
                {menuItems.filter(i => ['settings', 'branding', 'users', 'reports'].includes(i.id)).map((item) => {
                  const Icon = item.icon;
                  const isAllowed = !item.permission || hasPermission(item.permission as any);
                  const isActive = currentTab === item.id;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => isAllowed && handleSelectTab(item.id)}
                      disabled={!isAllowed}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        isActive
                          ? 'shadow-md font-bold'
                          : isAllowed
                          ? 'text-[var(--text-primary)] hover:bg-[var(--btn-secondary)] hover:text-[var(--title-color)]'
                          : 'text-[var(--text-secondary)] opacity-40 cursor-not-allowed'
                      }`}
                      style={
                        isActive
                          ? {
                              backgroundColor: 'var(--btn-primary)',
                              color: 'var(--btn-primary-text)',
                            }
                          : undefined
                      }
                      title={item.label}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Icon
                          className="w-4 h-4 shrink-0 transition-colors"
                          style={{
                            color: isActive
                              ? 'var(--btn-primary-text)'
                              : isAllowed
                              ? 'var(--icon-color)'
                              : '#64748b',
                          }}
                        />
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.badge && isAllowed && (
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                            isActive ? 'bg-black/30 text-white' : item.badgeColor || 'bg-[var(--btn-secondary)] text-[var(--text-primary)]'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Módulos Operacionais Complementares */}
            <div>
              <div className="px-3 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)] flex items-center justify-between">
                <span>Outros Módulos Operacionais</span>
              </div>
              <div className="space-y-1">
                {menuItems.filter(i => ['progress', 'employees', 'occurrences', 'outsourced', 'transfers'].includes(i.id)).map((item) => {
                  const Icon = item.icon;
                  const isAllowed = !item.permission || hasPermission(item.permission as any);
                  const isActive = currentTab === item.id;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => isAllowed && handleSelectTab(item.id)}
                      disabled={!isAllowed}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        isActive
                          ? 'shadow-md font-bold'
                          : isAllowed
                          ? 'text-[var(--text-primary)] hover:bg-[var(--btn-secondary)] hover:text-[var(--title-color)]'
                          : 'text-[var(--text-secondary)] opacity-40 cursor-not-allowed'
                      }`}
                      style={
                        isActive
                          ? {
                              backgroundColor: 'var(--btn-primary)',
                              color: 'var(--btn-primary-text)',
                            }
                          : undefined
                      }
                      title={item.label}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Icon
                          className="w-4 h-4 shrink-0 transition-colors"
                          style={{
                            color: isActive
                              ? 'var(--btn-primary-text)'
                              : isAllowed
                              ? 'var(--icon-color)'
                              : '#64748b',
                          }}
                        />
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.badge && isAllowed && (
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                            isActive ? 'bg-black/30 text-white' : item.badgeColor || 'bg-[var(--btn-secondary)] text-[var(--text-primary)]'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Atalhos dos Módulos Principais */}
            <div>
              <div className="px-3 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)] opacity-60">
                <span>Módulos Principais (Barra Inferior)</span>
              </div>
              <div className="space-y-1">
                {menuItems.filter(i => ['dashboard', 'works', 'materials', 'tools', 'epis'].includes(i.id)).map((item) => {
                  const Icon = item.icon;
                  const isAllowed = !item.permission || hasPermission(item.permission as any);
                  const isActive = currentTab === item.id;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => isAllowed && handleSelectTab(item.id)}
                      disabled={!isAllowed}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        isActive
                          ? 'shadow-md font-bold'
                          : isAllowed
                          ? 'text-[var(--text-primary)] hover:bg-[var(--btn-secondary)] hover:text-[var(--title-color)]'
                          : 'text-[var(--text-secondary)] opacity-40 cursor-not-allowed'
                      }`}
                      style={
                        isActive
                          ? {
                              backgroundColor: 'var(--btn-primary)',
                              color: 'var(--btn-primary-text)',
                            }
                          : undefined
                      }
                      title={item.label}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Icon
                          className="w-4 h-4 shrink-0 transition-colors"
                          style={{
                            color: isActive
                              ? 'var(--btn-primary-text)'
                              : isAllowed
                              ? 'var(--icon-color)'
                              : '#64748b',
                          }}
                        />
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.badge && isAllowed && (
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                            isActive ? 'bg-black/30 text-white' : item.badgeColor || 'bg-[var(--btn-secondary)] text-[var(--text-primary)]'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Desktop Sidebar: Clean Unified Listing */}
          <div className="hidden md:block space-y-1">
            <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)] flex items-center justify-between">
              <span>Módulos Operacionais</span>
              {companyBranding.tradeName && (
                <span className="text-[9px] font-semibold text-[var(--text-secondary)] opacity-80 truncate max-w-[100px]">
                  {companyBranding.tradeName}
                </span>
              )}
            </div>

            {menuItems.map((item) => {
              const Icon = item.icon;
              const isAllowed = !item.permission || hasPermission(item.permission as any);
              const isActive = currentTab === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => isAllowed && handleSelectTab(item.id)}
                  disabled={!isAllowed}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all group ${
                    isActive
                      ? 'shadow-md font-bold'
                      : isAllowed
                      ? 'text-[var(--text-primary)] hover:bg-[var(--btn-secondary)] hover:text-[var(--title-color)]'
                      : 'text-[var(--text-secondary)] opacity-40 cursor-not-allowed'
                  }`}
                  style={
                    isActive
                      ? {
                          backgroundColor: 'var(--btn-primary)',
                          color: 'var(--btn-primary-text)',
                        }
                      : undefined
                  }
                  title={!isAllowed ? 'Sem permissão de acesso para este cargo' : item.label}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon
                      className="w-4 h-4 shrink-0 transition-colors"
                      style={{
                        color: isActive
                          ? 'var(--btn-primary-text)'
                          : isAllowed
                          ? 'var(--icon-color)'
                          : '#64748b',
                      }}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    {item.badge && isAllowed && (
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                          isActive ? 'bg-black/30 text-white' : item.badgeColor || 'bg-[var(--btn-secondary)] text-[var(--text-primary)]'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                    {!isAllowed && (
                      <span className="text-[9px] px-1 rounded bg-[var(--btn-secondary)] text-[var(--text-secondary)]">
                        Restrito
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer info: Context & Logout */}
        <div 
          className="p-3 border-t space-y-2 bg-black/20"
          style={{ borderColor: 'var(--border-color)' }}
        >
          <div className="px-2 py-1.5 rounded-lg bg-[var(--btn-secondary)] border border-[var(--border-color)] text-[11px] text-[var(--text-secondary)]">
            <div className="font-semibold text-[var(--title-color)] truncate">{currentWork.name}</div>
            <div className="text-[10px] text-[var(--text-secondary)] flex items-center justify-between mt-0.5">
              <span>{currentWork.floors?.length || 0} pavimentos</span>
              <span className="font-medium" style={{ color: 'var(--success-color)' }}>● Em obra</span>
            </div>
          </div>

          <div className="flex items-center justify-between px-2 pt-1 text-[10px] text-[var(--text-secondary)] border-t" style={{ borderColor: 'var(--border-color)' }}>
            <span className="truncate font-medium">{companyBranding.tradeName}</span>
          </div>

          <button
            type="button"
            onClick={logoutWithConfirm}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-[var(--text-secondary)] hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <LogOut className="w-4 h-4" />
              <span>Sair</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-[var(--text-secondary)] opacity-60" />
          </button>
        </div>
      </aside>
    </>
  );
};
