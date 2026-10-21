import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { MobileNav } from './components/layout/MobileNav';
import { LoginView } from './components/auth/LoginView';
import { DashboardView } from './components/dashboard/DashboardView';
import { MaterialsView } from './components/materials/MaterialsView';
import { ToolsView } from './components/tools/ToolsView';
import { EpisView } from './components/epis/EpisView';
import { ProgressView } from './components/progress/ProgressView';
import { EmployeesView } from './components/employees/EmployeesView';
import { OccurrencesView } from './components/occurrences/OccurrencesView';
import { OutsourcedView } from './components/outsourced/OutsourcedView';
import { TransfersView } from './components/transfers/TransfersView';
import { ReportsView } from './components/reports/ReportsView';
import { UsersView } from './components/users/UsersView';
import { WorksView } from './components/works/WorksView';
import { SettingsView } from './components/settings/SettingsView';
import { VisualIdentityView } from './components/branding/VisualIdentityView';
import { QuickActionModals } from './components/modals/QuickActionModals';
import { ConfirmationModal } from './components/common/ConfirmationModal';
import { ToastContainer } from './components/common/ToastContainer';
import { applyThemeVariables, canteiroBrandTheme, getRootThemeCssStyles } from './utils/theme';

const MainAppContent: React.FC = () => {
  const { isLoggedIn, currentTab, companyBranding } = useApp();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Antes do login: padrão original CANTEIRO
  // Após o login: padrão da empresa contratante
  React.useEffect(() => {
    if (isLoggedIn) {
      applyThemeVariables(companyBranding);
    } else {
      applyThemeVariables(canteiroBrandTheme as any);
    }
  }, [isLoggedIn, companyBranding]);

  if (!isLoggedIn) {
    return <LoginView />;
  }

  const rootThemeStyles = getRootThemeCssStyles(companyBranding);

  return (
    <div 
      className="min-h-screen flex flex-col font-sans transition-colors duration-200"
      style={rootThemeStyles}
    >
      {/* Top Header */}
      <div className="print:hidden sticky top-0 z-50">
        <Header onToggleSidebarMobile={() => setIsMobileSidebarOpen(true)} />
      </div>

      {/* Main Content Area: Sidebar + Body */}
      <div className="flex-1 flex min-w-0 print:block">
        {/* Desktop Sidebar + Mobile Drawer */}
        <div className="print:hidden">
          <Sidebar 
            isMobileOpen={isMobileSidebarOpen} 
            onCloseMobile={() => setIsMobileSidebarOpen(false)} 
          />
        </div>

        {/* Viewport Canvas */}
        <main className="flex-1 min-w-0 p-3 sm:p-6 pb-24 md:pb-8 overflow-y-auto print:p-0 print:m-0 print:overflow-visible">
          <div className="max-w-7xl mx-auto w-full print:max-w-none print:w-full">
            {currentTab === 'dashboard' && <DashboardView />}
            {currentTab === 'works' && <WorksView />}
            {currentTab === 'materials' && <MaterialsView />}
            {currentTab === 'tools' && <ToolsView />}
            {currentTab === 'epis' && <EpisView />}
            {currentTab === 'progress' && <ProgressView />}
            {currentTab === 'employees' && <EmployeesView />}
            {currentTab === 'occurrences' && <OccurrencesView />}
            {currentTab === 'outsourced' && <OutsourcedView />}
            {currentTab === 'transfers' && <TransfersView />}
            {currentTab === 'reports' && <ReportsView />}
            {currentTab === 'users' && <UsersView />}
            {currentTab === 'branding' && <VisualIdentityView />}
            {currentTab === 'settings' && <SettingsView />}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation (5 destinations) */}
      <div className="print:hidden">
        <MobileNav />
      </div>

      {/* Quick Action Modals */}
      <div className="print:hidden">
        <QuickActionModals />
      </div>

      {/* Confirmation Modal */}
      <div className="print:hidden">
        <ConfirmationModal />
      </div>

      {/* Toast Feedback */}
      <div className="print:hidden">
        <ToastContainer />
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
