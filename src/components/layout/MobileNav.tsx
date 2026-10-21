import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Boxes,
  Shield,
  Wrench,
  MoreHorizontal,
  TrendingUp,
  Users,
  FileWarning,
  Building,
  Building2,
  ArrowLeftRight,
  FileText,
  UserCog,
  Settings,
  X
} from 'lucide-react';

export const MobileNav: React.FC = () => {
  const { currentTab, setCurrentTab, hasPermission, materials, tools } = useApp();
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const criticalStockCount = materials.filter(m => m.currentStock <= m.minStock).length;
  const toolsInUseCount = tools.filter(t => t.status === 'Em uso').length;

  const primaryTabs = [
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
      permission: 'materials.view',
    },
    {
      id: 'tools',
      label: 'Ferramentas',
      icon: Wrench,
      badge: toolsInUseCount > 0 ? `${toolsInUseCount}` : null,
      permission: 'tools.view',
    },
    {
      id: 'epis',
      label: 'EPIs',
      icon: Shield,
      badge: null,
      permission: 'epis.view',
    },
  ];

  return (
    <>
      {/* Fixed Bottom Tab Bar para os módulos principais (100% oculto no Desktop) */}
      <nav 
        className="fixed bottom-0 left-0 right-0 z-40 h-16 backdrop-blur-md border-t md:hidden flex items-center justify-around px-1 select-none print:hidden"
        style={{
          backgroundColor: 'var(--menu-bg)',
          borderColor: 'var(--border-color)',
          color: 'var(--text-primary)',
        }}
      >
        {primaryTabs.map((tab) => {
          const Icon = tab.icon;
          const isAllowed = !tab.permission || hasPermission(tab.permission as any);
          const isActive = currentTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => isAllowed && setCurrentTab(tab.id)}
              disabled={!isAllowed}
              className={`relative flex flex-col items-center justify-center flex-1 h-full min-h-[44px] transition-colors ${
                isActive
                  ? 'font-bold'
                  : isAllowed
                  ? 'hover:opacity-80'
                  : 'opacity-40 cursor-not-allowed'
              }`}
              style={{
                color: isActive ? 'var(--btn-primary)' : 'var(--text-secondary)',
              }}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
                {tab.badge && isAllowed && (
                  <span className="absolute -top-1.5 -right-2 px-1 py-0.2 rounded-full bg-red-500 text-[9px] font-black text-white ring-1 ring-slate-900">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] tracking-tight mt-1 leading-none">{tab.label}</span>
              {isActive && (
                <span className="absolute bottom-1 w-6 h-0.5 rounded-full" style={{ backgroundColor: 'var(--btn-primary)' }} />
              )}
            </button>
          );
        })}
      </nav>
    </>
  );
};
