import React, { createContext, useContext, useState, useMemo, ReactNode } from 'react';
import {
  User,
  Work,
  Floor,
  ConstructionArea,
  Material,
  Tool,
  Epi,
  EpiDelivery,
  MaterialMovement,
  ConstructionService,
  ServiceStatus,
  LocationServiceStatus,
  ServiceLocationProgress,
  ServiceProofPhoto,
  Occurrence,
  TransferRequest,
  TransferType,
  OperationalAlert,
  Employee,
  OutsourcedCompany,
  OutsourcedEmployee,
  PermissionKey,
  CompanyBranding,
  TenantCompany,
  UserStatus,
  CustomAllowanceType,
  FractionalContribution,
  MaterialDebtBalance,
  MaterialAccountTransaction,
} from '../types';
import {
  mockCompany,
  defaultCompanyBranding,
  mockWorks,
  mockAreas,
  mockUsers,
  mockMaterials,
  mockMaterialMovements,
  mockTools,
  mockEpis,
  mockEpiDeliveries,
  mockEmployees,
  mockOccurrences,
  mockServices,
  mockOutsourced,
  mockTransfers,
  mockAlerts,
  generateFloors,
  allPermissions,
} from '../mock/data';
import { initialTenants } from '../mock/tenants';
import { applyThemeVariables, getReadableTextColor, enforceStrictTypography } from '../utils/theme';

interface Toast {
  id: string;
  type: 'success' | 'warning' | 'info' | 'error';
  title: string;
  message?: string;
}

export interface ConfirmationModalState {
  isOpen: boolean;
  title: string;
  message: string;
  warningDetails?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
}

interface AppContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: (val: boolean) => void;
  currentUser: User;
  setCurrentUser: (user: User) => void;
  switchUserById: (userId: string) => void;
  logoutWithConfirm: () => void;
  switchUser: () => void;
  works: Work[];
  currentWork: Work;
  setCurrentWork: (work: Work) => void;
  availableWorks: Work[];
  currentTab: string;
  setCurrentTab: (tab: string) => void;

  // Multi-Company Isolation & Tenants (Requirement 6 & 19)
  tenants: TenantCompany[];
  currentTenantId: string;
  switchTenant: (tenantId: string) => void;
  setUserDefinitivePassword: (userId: string, newPassword: string) => void;
  changeUserPassword: (userId: string, currentPassword: string, newPassword: string) => boolean;

  // Company and Branding (White-label & Visual Identity)
  companyBranding: CompanyBranding;
  updateCompanyBranding: (branding: Partial<CompanyBranding>, options?: { silent?: boolean }) => void;
  registerFirstAccess: (params: {
    companyName: string;
    tradeName: string;
    cnpj?: string;
    adminName: string;
    adminEmail: string;
    adminPassword?: string;
    logoUrl?: string;
    bgPrimary?: string;
    bgSecondary?: string;
    menuBg?: string;
    buttonPrimary?: string;
    buttonPrimaryText?: string;
    buttonSecondary?: string;
    textPrimary?: string;
    textSecondary?: string;
    textTitles?: string;
    accentColor?: string;
    borderColor?: string;
    iconColor?: string;
    linkColor?: string;
    successColor?: string;
    warningColor?: string;
    errorColor?: string;
    primaryColor?: string;
    secondaryColor?: string;
  }) => void;
  
  // Users state
  users: User[];
  addUser: (userData: Omit<User, 'id'>) => void;
  editUser: (id: string, data: Partial<User>) => void;
  toggleUserActive: (id: string) => void;
  
  // Data lists with state
  materials: Material[];
  materialMovements: MaterialMovement[];
  tools: Tool[];
  epis: Epi[];
  epiDeliveries: EpiDelivery[];
  employees: Employee[];
  occurrences: Occurrence[];
  services: ConstructionService[];
  areas: ConstructionArea[];
  outsourced: OutsourcedCompany[];
  transfers: TransferRequest[];
  alerts: OperationalAlert[];

  // Permission checker helper (Rule 7 & 42)
  hasPermission: (key: PermissionKey) => boolean;

  // Confirmation dialog handler (Rule 9 & 51)
  confirmModal: ConfirmationModalState;
  requestConfirmation: (params: {
    title: string;
    message: string;
    warningDetails?: string;
    confirmLabel?: string;
    cancelLabel?: string;
    isDestructive?: boolean;
    onConfirm: () => void;
  }) => void;
  closeConfirmation: () => void;

  // Operational Actions (Stock, Custody, PPE)
  addMaterialEntry: (data: {
    materialId: string;
    quantity: number;
    origin?: 'Compra' | 'Transferência' | 'Outro';
    documentRef?: string;
    notes?: string;
  }) => boolean;

  addMaterialExit: (data: {
    materialId: string;
    quantity: number;
    destination?: 'Uso geral' | 'Funcionário';
    employeeId?: string;
    employeeName?: string;
    notes?: string;
  }) => boolean;

  adjustMaterialStock: (data: {
    materialId: string;
    newQuantity: number;
    reason: string;
    notes?: string;
  }) => boolean;

  deliverTool: (data: {
    toolId: string;
    employeeId: string;
    employeeName: string;
    notes?: string;
  }) => boolean;

  returnTool: (data: {
    toolId: string;
    condition: 'Nova' | 'Boa' | 'Usada' | 'Danificada';
    notes?: string;
  }) => boolean;

  deliverEpi: (data: {
    employeeId: string;
    employeeName: string;
    epiId: string;
    quantity: number;
    movementType: 'Fornecimento' | 'Troca';
    notes?: string;
  }) => boolean;

  addOccurrence: (data: {
    employeeId: string;
    employeeName: string;
    type: Occurrence['type'];
    date: string;
    startDate?: string;
    daysCount?: number;
    returnDate?: string;
    startTime?: string;
    endTime?: string;
    hours?: number;
    isAllowed: boolean;
    allowanceType?: Occurrence['allowanceType'];
    reason: string;
    notes?: string;
    hasAttachment?: boolean;
    attachmentName?: string;
    attachmentUrl?: string;
    attachmentType?: string;
    attachmentSize?: string;
  }) => boolean;

  // Custom Company Allowance Types
  customAllowanceTypes: CustomAllowanceType[];
  addCustomAllowanceType: (name: string, description?: string) => CustomAllowanceType;
  deleteCustomAllowanceType: (id: string) => void;

  updateServiceStatus: (serviceId: string, newStatus: ConstructionService['status']) => void;

  // Golden Rule 6: Administration of all entities (Create, Edit, Inactivate, Reactivate)
  createMaterial: (data: Omit<Material, 'id' | 'updatedAt' | 'isActive' | 'companyId'> & { companyId?: string }) => void;
  editMaterial: (id: string, data: Partial<Material>) => void;
  toggleMaterialActive: (id: string) => void;
  deleteMaterial: (id: string) => void;

  createTool: (data: Omit<Tool, 'id' | 'updatedAt' | 'isActive' | 'companyId'> & { companyId?: string }) => void;
  editTool: (id: string, data: Partial<Tool>) => void;
  toggleToolActive: (id: string) => void;
  deleteTool: (id: string) => void;

  createEpi: (data: Omit<Epi, 'id' | 'isActive' | 'companyId'> & { companyId?: string }) => void;
  editEpi: (id: string, data: Partial<Epi>) => void;
  toggleEpiActive: (id: string) => void;
  deleteEpi: (id: string) => void;

  createEmployee: (data: Omit<Employee, 'id' | 'companyId'> & { companyId?: string }) => void;
  editEmployee: (id: string, data: Partial<Employee>) => void;
  toggleEmployeeActive: (id: string) => void;
  deleteEmployee: (id: string) => void;

  createService: (data: Omit<ConstructionService, 'id' | 'isActive' | 'companyId'> & { companyId?: string }) => void;
  editService: (id: string, data: Partial<ConstructionService>) => void;
  toggleServiceActive: (id: string) => void;
  deleteService: (id: string) => void;
  updateServiceLocationStatus: (
    serviceId: string,
    locationId: string,
    locationName: string,
    status: LocationServiceStatus
  ) => void;
  toggleServiceLocationApplied: (
    serviceId: string,
    locationId: string,
    locationName: string
  ) => void;
  addServiceProofPhoto: (
    serviceId: string,
    photo: Omit<ServiceProofPhoto, 'id'>
  ) => void;
  removeServiceProofPhoto: (
    serviceId: string,
    photoId: string
  ) => void;

  createArea: (name: string) => void;
  editArea: (id: string, name: string) => void;
  toggleAreaActive: (id: string) => void;
  deleteArea: (id: string) => void;

  createFloor: (name: string, level: number, targetWorkId?: string) => void;
  editFloor: (id: string, name: string, targetWorkId?: string) => void;
  toggleFloorActive: (id: string, targetWorkId?: string) => void;
  reorderFloors: (workId: string, orderedFloorIds: string[]) => void;
  deleteFloor: (floorId: string, targetWorkId?: string) => void;

  createOutsourced: (data: Omit<OutsourcedCompany, 'id' | 'isActive' | 'companyId'> & { companyId?: string }) => void;
  editOutsourced: (id: string, data: Partial<OutsourcedCompany>) => void;
  toggleOutsourcedActive: (id: string) => void;
  deleteOutsourced: (id: string) => void;
  addEmployeeToOutsourced: (companyId: string, employee: Omit<OutsourcedEmployee, 'id'>) => void;
  editEmployeeInOutsourced: (companyId: string, employeeId: string, data: Partial<OutsourcedEmployee>) => void;
  removeEmployeeFromOutsourced: (companyId: string, employeeId: string) => void;

  createWork: (data: {
    name: string;
    code?: string;
    address: string;
    city: string;
    state: string;
    type: Work['type'];
    totalFloors: number;
    hasGroundFloor: boolean;
    hasBasements: boolean;
    basementCount: number;
    floors?: Floor[];
    typology?: string;
    interventionType?: 'Construção do Zero (Desde a Fundação)' | 'Reforma / Retrofit';
    services?: ConstructionService[];
  }) => Work;
  editWork: (id: string, data: Partial<Work>) => void;
  toggleWorkActive: (id: string) => void;
  deleteWork: (id: string) => void;
  saveWorkMapStructure: (params: {
    workId: string;
    interventionType: 'Construção do Zero (Desde a Fundação)' | 'Reforma / Retrofit';
    typology: string;
    floors: Floor[];
    services: ConstructionService[];
  }) => void;

  // Transfers Management (Section 33)
  createTransferRequest: (data: {
    originWorkId: string;
    originWorkName: string;
    destinationWorkId: string;
    destinationWorkName: string;
    itemType: string;
    materialName: string;
    unit?: string;
    requestedQuantity: number;
    type?: TransferType;
    notes?: string;
  }) => TransferRequest;
  approveTransferRequest: (
    transferId: string,
    data: {
      itemType: string;
      materialName: string;
      approvedQuantity: number;
      notes?: string;
    }
  ) => void;
  cancelTransferRequest: (transferId: string, reason?: string) => void;
  // Fractional Transfers & Material Current Account (Conta-Corrente & Logística Fracionada)
  createBroadcastRequest: (data: {
    originWorkId: string;
    originWorkName: string;
    itemType: string;
    materialName: string;
    unit?: string;
    requestedQuantity: number;
    deliveryAddress?: string;
    targetWarehouseManager?: string;
    type?: TransferType;
    notes?: string;
  }) => TransferRequest;
  contributeToTransferRequest: (
    requestId: string,
    contribution: {
      supplyingWorkId: string;
      supplyingWorkName: string;
      supplyingWorkAddress: string;
      warehouseManagerName: string;
      warehouseManagerPhone?: string;
      quantity: number;
      notes?: string;
    }
  ) => void;
  materialDebts: MaterialDebtBalance[];
  materialTransactions: MaterialAccountTransaction[];
  settleDebtBalance: (debtId: string, quantityToSettle: number, notes?: string) => void;

  // Quick Action Modal helper
  activeQuickAction: 'entry' | 'exit' | 'epi' | 'tool' | 'occurrence' | 'service' | null;
  openQuickAction: (action: 'entry' | 'exit' | 'epi' | 'tool' | 'occurrence' | 'service') => void;
  closeQuickAction: () => void;

  // Toasts
  toasts: Toast[];
  showToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Multi-Company Tenant state (Requirement 6 & 19)
  const [tenants, setTenants] = useState<TenantCompany[]>(initialTenants);
  const [currentTenantId, setCurrentTenantId] = useState<string>(initialTenants[0].id);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User>(initialTenants[0].users[0]);
  const [currentWorkId, setCurrentWorkId] = useState<string>(initialTenants[0].works[0]?.id || '');
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  
  // Company & Branding state
  const [companyBranding, setCompanyBranding] = useState<CompanyBranding>(initialTenants[0].branding);

  // Users state
  const [users, setUsers] = useState<User[]>(initialTenants[0].users);
  
  // Dynamic state scoped to active company
  const [works, setWorks] = useState<Work[]>(initialTenants[0].works);
  const [materials, setMaterials] = useState<Material[]>(initialTenants[0].materials);
  const [materialMovements, setMaterialMovements] = useState<MaterialMovement[]>(initialTenants[0].materialMovements);
  const [tools, setTools] = useState<Tool[]>(initialTenants[0].tools);
  const [epis, setEpis] = useState<Epi[]>(initialTenants[0].epis);
  const [epiDeliveries, setEpiDeliveries] = useState<EpiDelivery[]>(initialTenants[0].epiDeliveries || []);
  const [employees, setEmployees] = useState<Employee[]>(initialTenants[0].employees);
  const [occurrences, setOccurrences] = useState<Occurrence[]>(initialTenants[0].occurrences || []);
  const [customAllowanceTypes, setCustomAllowanceTypes] = useState<CustomAllowanceType[]>(() => {
    return (initialTenants[0].customAllowanceTypes) || [
      {
        id: 'allowance-casamento',
        companyId: 'comp-01',
        name: 'Abono - Casamento (Gala)',
        description: 'Afastamento remunerado de até 3 dias consecutivos por casamento.',
        createdAt: '2026-01-01',
      },
      {
        id: 'allowance-luto',
        companyId: 'comp-01',
        name: 'Abono - Luto (Nojo)',
        description: 'Afastamento remunerado em caso de falecimento de familiar direto.',
        createdAt: '2026-01-01',
      },
      {
        id: 'allowance-sangue',
        companyId: 'comp-01',
        name: 'Abono - Doação de Sangue',
        description: 'Dispensado 1 dia por ano devidamente comprovado.',
        createdAt: '2026-01-01',
      },
      {
        id: 'allowance-eleitoral',
        companyId: 'comp-01',
        name: 'Abono - Convocação Judicial / TRE',
        description: 'Dias de convocação pela Justiça Eleitoral ou Júri.',
        createdAt: '2026-01-01',
      },
    ];
  });
  const [services, setServices] = useState<ConstructionService[]>(initialTenants[0].services || []);
  const [areas, setAreas] = useState<ConstructionArea[]>(initialTenants[0].areas || []);
  const [outsourced, setOutsourced] = useState<OutsourcedCompany[]>(initialTenants[0].outsourced || []);
  const [transfers, setTransfers] = useState<TransferRequest[]>(initialTenants[0].transfers || []);
  const [alerts, setAlerts] = useState<OperationalAlert[]>(initialTenants[0].alerts || []);

  // Material Current Account (Conta-Corrente & Saldo Devedor)
  const [materialDebts, setMaterialDebts] = useState<MaterialDebtBalance[]>([]);
  const [materialTransactions, setMaterialTransactions] = useState<MaterialAccountTransaction[]>([]);

  const [activeQuickAction, setActiveQuickAction] = useState<AppContextType['activeQuickAction']>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Apply CSS Variables automatically whenever branding changes
  React.useEffect(() => {
    applyThemeVariables(companyBranding);
  }, [companyBranding]);

  // Confirmation dialog state
  const [confirmModal, setConfirmModal] = useState<ConfirmationModalState>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  const requestConfirmation = (params: {
    title: string;
    message: string;
    warningDetails?: string;
    confirmLabel?: string;
    cancelLabel?: string;
    isDestructive?: boolean;
    onConfirm: () => void;
  }) => {
    setConfirmModal({
      isOpen: true,
      title: params.title,
      message: params.message,
      warningDetails: params.warningDetails,
      confirmLabel: params.confirmLabel || 'Confirmar',
      cancelLabel: params.cancelLabel || 'Cancelar',
      isDestructive: params.isDestructive ?? false,
      onConfirm: () => {
        params.onConfirm();
        closeConfirmation();
      },
    });
  };

  const closeConfirmation = () => {
    setConfirmModal((prev) => ({ ...prev, isOpen: false }));
  };

  const showToast = (toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Switch tenant environment (Test Isolation Requirement 19)
  const switchTenant = (tenantId: string) => {
    const target = tenants.find((t) => t.id === tenantId);
    if (!target) return;

    setCurrentTenantId(target.id);
    setCompanyBranding(target.branding);
    setUsers(target.users);
    setCurrentUser(target.users[0]);
    setWorks(target.works);
    setMaterials(target.materials);
    setMaterialMovements(target.materialMovements || []);
    setTools(target.tools);
    setEpis(target.epis);
    setEpiDeliveries(target.epiDeliveries || []);
    setEmployees(target.employees);
    setServices(target.services || []);
    setOccurrences(target.occurrences || []);
    setAreas(target.areas || []);
    setCustomAllowanceTypes(target.customAllowanceTypes || []);
    setOutsourced(target.outsourced || []);
    setTransfers(target.transfers || []);
    setAlerts(target.alerts || []);
    setCurrentWorkId(target.works[0]?.id || '');

    applyThemeVariables(target.branding);

    showToast({
      type: 'info',
      title: 'Ambiente alternado com isolamento total',
      message: `Visualizando dados exclusivos de: ${target.tradeName}`,
    });
  };

  // Determine available works based on user's authorized workIds
  const availableWorks = useMemo(() => {
    if (works.length === 0) return [];
    if (currentUser.role === 'ADM do sistema' || currentUser.workIds.length === 0) {
      return works;
    }
    return works.filter((w) => currentUser.workIds.includes(w.id));
  }, [works, currentUser]);

  // Current active work object with safe fallback when works.length === 0
  const currentWork: Work = useMemo(() => {
    if (works.length === 0) {
      return {
        id: '',
        companyId: currentTenantId || currentUser.companyId || 'comp-01',
        name: 'Nenhuma obra cadastrada',
        address: 'Nenhum endereço',
        city: '—',
        state: '—',
        type: 'Outro',
        totalFloors: 0,
        hasGroundFloor: false,
        hasBasements: false,
        basementCount: 0,
        status: 'Paralisada',
        floors: [],
        isActive: false,
      };
    }
    const found = availableWorks.find((w) => w.id === currentWorkId);
    if (found) return found;
    return availableWorks[0] || works[0];
  }, [availableWorks, currentWorkId, works]);

  const setCurrentWork = (work: Work) => {
    setCurrentWorkId(work.id);
  };

  const switchUserById = (userId: string) => {
    const targetUser = users.find((u) => u.id === userId);
    if (targetUser) {
      setCurrentUser(targetUser);
      if (!targetUser.workIds.includes(currentWorkId) && targetUser.workIds.length > 0) {
        setCurrentWorkId(targetUser.defaultWorkId || targetUser.workIds[0] || works[0]?.id || '');
      }
      showToast({
        type: 'info',
        title: `Perfil alterado para ${targetUser.role}`,
        message: `${targetUser.name} (${targetUser.permissions.length} permissões ativas)`,
      });
    }
  };

  const updateCompanyBranding = (branding: Partial<CompanyBranding>, options?: { silent?: boolean }) => {
    setCompanyBranding((prev) => {
      const merged = { ...prev, ...branding };
      // Also update in tenant list
      setTenants((prevTenants) =>
        prevTenants.map((t) => (t.id === currentTenantId ? { ...t, branding: merged } : t))
      );
      applyThemeVariables(merged);
      return merged;
    });

    if (!options?.silent) {
      showToast({
        type: 'success',
        title: 'Identidade visual salva',
        message: 'Todas as cores personalizadas foram propagadas em todo o sistema da empresa.',
      });
    }
  };

  const setUserDefinitivePassword = (userId: string, newPassword: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          return {
            ...u,
            status: 'Ativo' as UserStatus,
            provisionalPassword: undefined,
            requiresPasswordChange: false,
          };
        }
        return u;
      })
    );
    if (currentUser.id === userId) {
      setCurrentUser((prev) => ({
        ...prev,
        status: 'Ativo' as UserStatus,
        provisionalPassword: undefined,
        requiresPasswordChange: false,
      }));
    }
    showToast({
      type: 'success',
      title: 'Senha definida com sucesso',
      message: 'Sua senha pessoal foi registrada. Acesso liberado ao sistema!',
    });
  };

  const changeUserPassword = (userId: string, currentPassword: string, newPassword: string): boolean => {
    showToast({
      type: 'success',
      title: 'Senha alterada com sucesso',
      message: 'Sua nova senha pessoal foi registrada com segurança.',
    });
    return true;
  };

  const registerFirstAccess = (params: {
    companyName: string;
    tradeName: string;
    cnpj?: string;
    adminName: string;
    adminEmail: string;
    adminPassword?: string;
    logoUrl?: string;
    bgPrimary?: string;
    bgSecondary?: string;
    menuBg?: string;
    buttonPrimary?: string;
    buttonPrimaryText?: string;
    buttonSecondary?: string;
    textPrimary?: string;
    textSecondary?: string;
    textTitles?: string;
    accentColor?: string;
    borderColor?: string;
    iconColor?: string;
    linkColor?: string;
    successColor?: string;
    warningColor?: string;
    errorColor?: string;
    primaryColor?: string;
    secondaryColor?: string;
  }) => {
    const newCompanyId = `comp-${Date.now()}`;
    const newBranding: CompanyBranding = {
      companyName: params.companyName,
      tradeName: params.tradeName,
      cnpj: params.cnpj || '',
      logoUrl: params.logoUrl || '',
      bgPrimary: params.bgPrimary || '#090d16',
      bgSecondary: params.bgSecondary || '#0f172a',
      menuBg: params.menuBg || '#090d16',
      buttonPrimary: params.buttonPrimary || params.primaryColor || '#2563eb',
      buttonPrimaryText: params.buttonPrimaryText || '#ffffff',
      buttonSecondary: params.buttonSecondary || '#1e293b',
      textPrimary: params.textPrimary || '#f8fafc',
      textSecondary: params.textSecondary || '#94a3b8',
      textTitles: params.textTitles || '#ffffff',
      accentColor: params.accentColor || '#3b82f6',
      borderColor: params.borderColor || '#1e293b',
      iconColor: params.iconColor || '#60a5fa',
      linkColor: params.linkColor || '#38bdf8',
      successColor: params.successColor || '#10b981',
      warningColor: params.warningColor || '#f59e0b',
      errorColor: params.errorColor || '#ef4444',
      themePreset: 'personalizado',
      primaryColor: params.primaryColor || params.buttonPrimary || '#2563eb',
      secondaryColor: params.secondaryColor || '#0f172a',
    };

    const newAdmin: User = {
      id: `user-adm-${Date.now()}`,
      name: params.adminName,
      email: params.adminEmail.toLowerCase(),
      role: 'ADM do sistema',
      companyId: newCompanyId,
      workIds: [], // EMPTY! Clean environment as requested
      defaultWorkId: '',
      permissions: allPermissions.map(p => p.key),
      isActive: true,
      status: 'Ativo',
    };

    const newTenant: TenantCompany = {
      id: newCompanyId,
      name: params.companyName,
      tradeName: params.tradeName,
      cnpj: params.cnpj || '',
      logoUrl: params.logoUrl || '',
      planTier: 'basic',
      branding: newBranding,
      works: [], // EMPTY! Clean environment
      employees: [], // EMPTY!
      materials: [], // EMPTY!
      materialMovements: [],
      tools: [], // EMPTY!
      toolMovements: [],
      epis: [], // EMPTY!
      epiDeliveries: [],
      occurrences: [], // EMPTY!
      services: [], // EMPTY!
      areas: [],
      outsourced: [], // EMPTY!
      transfers: [], // EMPTY!
      alerts: [],
      users: [newAdmin],
    };

    setTenants(prev => [...prev, newTenant]);
    setCurrentTenantId(newCompanyId);
    setCompanyBranding(newBranding);
    setCurrentUser(newAdmin);
    setUsers([newAdmin]);
    setWorks([]);
    setEmployees([]);
    setMaterials([]);
    setMaterialMovements([]);
    setTools([]);
    setEpis([]);
    setEpiDeliveries([]);
    setServices([]);
    setOccurrences([]);
    setAreas([]);
    setOutsourced([]);
    setTransfers([]);
    setAlerts([]);
    setCurrentWorkId('');
    setIsLoggedIn(true);

    applyThemeVariables(newBranding);

    showToast({
      type: 'success',
      title: 'Ambiente da Empresa Criado',
      message: `Bem-vindo, ${params.adminName}! O ambiente de ${params.tradeName} está pronto e limpo.`,
    });
  };

  const logoutWithConfirm = () => {
    requestConfirmation({
      title: 'Deseja sair do sistema?',
      message: 'Você precisará entrar novamente para acessar suas obras.',
      confirmLabel: 'Sair',
      cancelLabel: 'Cancelar',
      isDestructive: true,
      onConfirm: () => {
        setIsLoggedIn(false);
      },
    });
  };

  const switchUser = () => {
    setIsLoggedIn(false);
  };

  const addUser = (userData: Omit<User, 'id'>) => {
    const newUser: User = {
      ...userData,
      id: `user-${Date.now()}`,
    };
    setUsers((prev) => [...prev, newUser]);
    showToast({
      type: 'success',
      title: 'Usuário adicionado',
      message: `${newUser.name} foi cadastrado com sucesso.`,
    });
  };

  const editUser = (id: string, data: Partial<User>) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...data } : u)));
    if (currentUser.id === id) {
      setCurrentUser((prev) => ({ ...prev, ...data }));
    }
    showToast({
      type: 'success',
      title: 'Usuário atualizado',
      message: 'As alterações foram salvas.',
    });
  };

  const toggleUserActive = (id: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          const nextActive = !u.isActive;
          showToast({
            type: nextActive ? 'success' : 'warning',
            title: nextActive ? 'Usuário reativado' : 'Usuário inativado',
            message: `${u.name} agora está ${nextActive ? 'ativo' : 'inativo'}.`,
          });
          return { ...u, isActive: nextActive };
        }
        return u;
      })
    );
  };

  // Permission check logic (Rule 7)
  const hasPermission = (key: PermissionKey): boolean => {
    return currentUser.permissions.includes(key);
  };

  const openQuickAction = (action: 'entry' | 'exit' | 'epi' | 'tool' | 'occurrence' | 'service') => {
    setActiveQuickAction(action);
  };

  const closeQuickAction = () => {
    setActiveQuickAction(null);
  };

  // Operational rule: Entry of materials
  const addMaterialEntry = (data: {
    materialId: string;
    quantity: number;
    origin?: 'Compra' | 'Transferência' | 'Outro';
    documentRef?: string;
    notes?: string;
  }): boolean => {
    if (!hasPermission('materials.entry')) {
      showToast({
        type: 'error',
        title: 'Operação não permitida',
        message: 'Apenas usuários autorizados (regra padrão: Almoxarife) podem dar entrada no estoque.',
      });
      return false;
    }

    const mat = materials.find((m) => m.id === data.materialId);
    if (!mat) return false;

    const previousStock = mat.currentStock;
    const resultStock = previousStock + data.quantity;

    const movement: MaterialMovement = {
      id: `mov-${Date.now()}`,
      companyId: currentWork.companyId || currentUser.companyId || 'comp-01',
      workId: currentWork.id,
      materialId: mat.id,
      materialName: mat.name,
      unit: mat.unit,
      type: 'entry',
      previousStock,
      quantity: data.quantity,
      resultStock,
      origin: data.origin || 'Compra',
      documentRef: data.documentRef,
      notes: data.notes,
      userId: currentUser.id,
      userName: currentUser.name,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };

    setMaterials((prev) =>
      prev.map((m) =>
        m.id === mat.id
          ? { ...m, currentStock: resultStock, updatedAt: movement.timestamp }
          : m
      )
    );
    setMaterialMovements((prev) => [movement, ...prev]);

    showToast({
      type: 'success',
      title: 'Entrada registrada com sucesso',
      message: `${mat.name}: +${data.quantity} ${mat.unit} (Saldo: ${resultStock})`,
    });
    return true;
  };

  // Operational rule: Exit of materials
  const addMaterialExit = (data: {
    materialId: string;
    quantity: number;
    destination?: 'Uso geral' | 'Funcionário';
    employeeId?: string;
    employeeName?: string;
    notes?: string;
  }): boolean => {
    if (!hasPermission('materials.exit')) {
      showToast({
        type: 'error',
        title: 'Operação não permitida',
        message: 'Apenas usuários autorizados (regra padrão: Almoxarife) podem dar saída no estoque.',
      });
      return false;
    }

    const mat = materials.find((m) => m.id === data.materialId);
    if (!mat) return false;

    if (data.quantity > mat.currentStock) {
      showToast({
        type: 'error',
        title: 'Estoque insuficiente',
        message: `Solicitado: ${data.quantity} ${mat.unit} | Disponível: ${mat.currentStock} ${mat.unit}`,
      });
      return false;
    }

    const previousStock = mat.currentStock;
    const resultStock = previousStock - data.quantity;

    const movement: MaterialMovement = {
      id: `mov-${Date.now()}`,
      companyId: currentWork.companyId || currentUser.companyId || 'comp-01',
      workId: currentWork.id,
      materialId: mat.id,
      materialName: mat.name,
      unit: mat.unit,
      type: 'exit',
      previousStock,
      quantity: data.quantity,
      resultStock,
      destination: data.destination || 'Uso geral',
      employeeId: data.employeeId,
      employeeName: data.employeeName,
      notes: data.notes,
      userId: currentUser.id,
      userName: currentUser.name,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };

    setMaterials((prev) =>
      prev.map((m) =>
        m.id === mat.id
          ? { ...m, currentStock: resultStock, updatedAt: movement.timestamp }
          : m
      )
    );
    setMaterialMovements((prev) => [movement, ...prev]);

    showToast({
      type: 'success',
      title: 'Saída registrada com sucesso',
      message: `${mat.name}: -${data.quantity} ${mat.unit} (Saldo restante: ${resultStock})`,
    });
    return true;
  };

  // Operational rule: Stock adjustment
  const adjustMaterialStock = (data: {
    materialId: string;
    newQuantity: number;
    reason: string;
    notes?: string;
  }): boolean => {
    if (!hasPermission('materials.adjust')) {
      showToast({
        type: 'error',
        title: 'Operação não autorizada',
        message: 'Ajustes de estoque requerem permissão operacional específica.',
      });
      return false;
    }

    const mat = materials.find((m) => m.id === data.materialId);
    if (!mat) return false;

    const previousStock = mat.currentStock;
    const diff = data.newQuantity - previousStock;

    const movement: MaterialMovement = {
      id: `mov-${Date.now()}`,
      companyId: currentWork.companyId || currentUser.companyId || 'comp-01',
      workId: currentWork.id,
      materialId: mat.id,
      materialName: mat.name,
      unit: mat.unit,
      type: 'adjust',
      previousStock,
      quantity: Math.abs(diff),
      resultStock: data.newQuantity,
      reason: data.reason,
      notes: data.notes,
      userId: currentUser.id,
      userName: currentUser.name,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };

    setMaterials((prev) =>
      prev.map((m) =>
        m.id === mat.id
          ? { ...m, currentStock: data.newQuantity, updatedAt: movement.timestamp }
          : m
      )
    );
    setMaterialMovements((prev) => [movement, ...prev]);

    showToast({
      type: 'warning',
      title: 'Ajuste de inventário registrado',
      message: `${mat.name}: de ${previousStock} para ${data.newQuantity} ${mat.unit} (${diff >= 0 ? '+' : ''}${diff})`,
    });
    return true;
  };

  // Tool Delivery
  const deliverTool = (data: {
    toolId: string;
    employeeId: string;
    employeeName: string;
    notes?: string;
  }): boolean => {
    const tool = tools.find((t) => t.id === data.toolId);
    if (!tool) return false;

    if (tool.status !== 'Disponível') {
      showToast({
        type: 'error',
        title: 'Ferramenta não disponível',
        message: `Esta ferramenta está no momento ${tool.status.toLowerCase()}.`,
      });
      return false;
    }

    setTools((prev) =>
      prev.map((t) =>
        t.id === tool.id
          ? {
              ...t,
              status: 'Em uso',
              currentEmployeeId: data.employeeId,
              currentEmployeeName: data.employeeName,
              updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
            }
          : t
      )
    );

    showToast({
      type: 'success',
      title: 'Ferramenta entregue',
      message: `${tool.name} entregue para ${data.employeeName}`,
    });
    return true;
  };

  // Tool Return
  const returnTool = (data: {
    toolId: string;
    condition: 'Nova' | 'Boa' | 'Usada' | 'Danificada';
    notes?: string;
  }): boolean => {
    const tool = tools.find((t) => t.id === data.toolId);
    if (!tool) return false;

    setTools((prev) =>
      prev.map((t) =>
        t.id === tool.id
          ? {
              ...t,
              status: data.condition === 'Danificada' ? 'Em manutenção' : 'Disponível',
              condition: data.condition,
              currentEmployeeId: undefined,
              currentEmployeeName: undefined,
              updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
            }
          : t
      )
    );

    showToast({
      type: 'success',
      title: 'Devolução registrada',
      message: `${tool.name} devolvida ao almoxarifado (Condição: ${data.condition})`,
    });
    return true;
  };

  // EPI Delivery
  const deliverEpi = (data: {
    employeeId: string;
    employeeName: string;
    epiId: string;
    quantity: number;
    movementType: 'Fornecimento' | 'Troca';
    notes?: string;
  }): boolean => {
    const epi = epis.find((e) => e.id === data.epiId);
    if (!epi) return false;

    const delivery: EpiDelivery = {
      id: `del-${Date.now()}`,
      companyId: currentWork.companyId || currentUser.companyId || 'comp-01',
      workId: currentWork.id,
      employeeId: data.employeeId,
      employeeName: data.employeeName,
      epiId: epi.id,
      epiName: epi.name,
      quantity: data.quantity,
      movementType: data.movementType,
      manufacturerSnapshot: epi.manufacturer,
      caNumberSnapshot: epi.caNumber,
      userId: currentUser.id,
      userName: currentUser.name,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      notes: data.notes,
    };

    setEpiDeliveries((prev) => [delivery, ...prev]);

    setEpis((prev) =>
      prev.map((e) =>
        e.id === epi.id
          ? { ...e, stock: Math.max(0, e.stock - data.quantity) }
          : e
      )
    );

    showToast({
      type: 'success',
      title: 'EPI registrado com sucesso',
      message: `${data.movementType}: ${data.quantity}x ${epi.name} para ${data.employeeName} (C.A. ${epi.caNumber})`,
    });
    return true;
  };

  // Occurrence addition with dynamic fields, calculations and attachments
  const addOccurrence = (data: {
    employeeId: string;
    employeeName: string;
    type: Occurrence['type'];
    date: string;
    startDate?: string;
    daysCount?: number;
    returnDate?: string;
    startTime?: string;
    endTime?: string;
    hours?: number;
    isAllowed: boolean;
    allowanceType?: Occurrence['allowanceType'];
    reason: string;
    notes?: string;
    hasAttachment?: boolean;
    attachmentName?: string;
    attachmentUrl?: string;
    attachmentType?: string;
    attachmentSize?: string;
  }): boolean => {
    const targetCompanyId = currentWork.companyId || currentTenantId || currentUser.companyId || 'comp-01';
    const occ: Occurrence = {
      id: `occ-${Date.now()}`,
      companyId: targetCompanyId,
      workId: currentWork.id,
      employeeId: data.employeeId,
      employeeName: data.employeeName,
      type: data.type,
      date: data.date,
      startDate: data.startDate,
      daysCount: data.daysCount,
      returnDate: data.returnDate,
      startTime: data.startTime,
      endTime: data.endTime,
      hours: data.hours,
      isAllowed: data.isAllowed,
      allowanceType: data.allowanceType,
      reason: data.reason,
      notes: data.notes,
      hasAttachment: data.hasAttachment,
      attachmentName: data.attachmentName,
      attachmentUrl: data.attachmentUrl,
      attachmentType: data.attachmentType,
      attachmentSize: data.attachmentSize,
      userId: currentUser.id,
      userName: currentUser.name,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };

    setOccurrences((prev) => [occ, ...prev]);
    showToast({
      type: 'success',
      title: 'Ocorrência registrada',
      message: `${data.type} para ${data.employeeName} em ${data.date}`,
    });
    return true;
  };

  // Custom Company Allowance Types (Isolamento por companyId)
  const addCustomAllowanceType = (name: string, description?: string): CustomAllowanceType => {
    const targetCompanyId = currentWork.companyId || currentTenantId || currentUser.companyId || 'comp-01';
    const newAllowance: CustomAllowanceType = {
      id: `custom-allowance-${Date.now()}`,
      companyId: targetCompanyId,
      name: name.trim(),
      description: description?.trim(),
      createdAt: new Date().toISOString().substring(0, 10),
    };

    setCustomAllowanceTypes((prev) => [...prev, newAllowance]);
    setTenants((prevTenants) =>
      prevTenants.map((t) => {
        if (t.id === targetCompanyId) {
          return {
            ...t,
            customAllowanceTypes: [...(t.customAllowanceTypes || []), newAllowance],
          };
        }
        return t;
      })
    );

    showToast({
      type: 'success',
      title: 'Tipo de abono criado',
      message: `"${newAllowance.name}" adicionado com sucesso para sua empresa.`,
    });
    return newAllowance;
  };

  const deleteCustomAllowanceType = (id: string) => {
    setCustomAllowanceTypes((prev) => prev.filter((a) => a.id !== id));
    showToast({
      type: 'info',
      title: 'Abono removido',
      message: 'O tipo de abono personalizado foi excluído.',
    });
  };

  // Service status change
  const updateServiceStatus = (serviceId: string, newStatus: ConstructionService['status']) => {
    setServices((prev) =>
      prev.map((s) => (s.id === serviceId ? { ...s, status: newStatus } : s))
    );
    showToast({
      type: 'info',
      title: 'Status de serviço atualizado',
      message: `Novo status: ${newStatus}`,
    });
  };

  // ==========================================
  // GOLDEN RULE 6: ALL REGISTRIES ADMINISTRABLE
  // ==========================================

  // 1. Materials Administration
  const createMaterial = (data: Omit<Material, 'id' | 'updatedAt' | 'isActive' | 'companyId'> & { companyId?: string }) => {
    const targetCompanyId = data.companyId || currentWork.companyId || currentTenantId || currentUser.companyId || 'comp-01';
    const newMat: Material = {
      ...data,
      companyId: targetCompanyId,
      id: `mat-${Date.now()}`,
      updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      isActive: true,
    };
    setMaterials((prev) => [newMat, ...prev]);
    showToast({
      type: 'success',
      title: 'Material cadastrado',
      message: `${newMat.name} adicionado ao catálogo da obra.`,
    });
  };

  const editMaterial = (id: string, data: Partial<Material>) => {
    setMaterials((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...data, updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16) } : m))
    );
    showToast({ type: 'info', title: 'Material atualizado', message: 'Dados salvos com sucesso.' });
  };

  const toggleMaterialActive = (id: string) => {
    setMaterials((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const nextState = !m.isActive;
          showToast({
            type: nextState ? 'success' : 'warning',
            title: nextState ? 'Material Reativado' : 'Material Inativado',
            message: `${m.name} agora está ${nextState ? 'ativo' : 'inativo'}. Histórico preservado.`,
          });
          return { ...m, isActive: nextState };
        }
        return m;
      })
    );
  };

  // 2. Tools Administration
  const createTool = (data: Omit<Tool, 'id' | 'updatedAt' | 'isActive' | 'companyId'> & { companyId?: string }) => {
    const targetCompanyId = data.companyId || currentWork.companyId || currentTenantId || currentUser.companyId || 'comp-01';
    const newTool: Tool = {
      ...data,
      companyId: targetCompanyId,
      id: `tool-${Date.now()}`,
      updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      isActive: true,
    };
    setTools((prev) => [newTool, ...prev]);
    showToast({ type: 'success', title: 'Ferramenta cadastrada', message: `${newTool.name} disponível no patrimônio.` });
  };

  const editTool = (id: string, data: Partial<Tool>) => {
    setTools((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...data, updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16) } : t))
    );
    showToast({ type: 'info', title: 'Ferramenta atualizada', message: 'Patrimônio atualizado.' });
  };

  const toggleToolActive = (id: string) => {
    setTools((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const nextState = !t.isActive;
          showToast({
            type: nextState ? 'success' : 'warning',
            title: nextState ? 'Ferramenta Reativada' : 'Ferramenta Inativada/Baixada',
            message: `${t.name} agora está ${nextState ? 'ativa' : 'inativa'}. Linha do tempo preservada.`,
          });
          return { ...t, isActive: nextState };
        }
        return t;
      })
    );
  };

  // 3. EPI Administration
  const createEpi = (data: Omit<Epi, 'id' | 'isActive' | 'companyId'> & { companyId?: string }) => {
    const targetCompanyId = data.companyId || currentWork.companyId || currentTenantId || currentUser.companyId || 'comp-01';
    const newEpi: Epi = { 
      ...data, 
      companyId: targetCompanyId,
      id: `epi-${Date.now()}`, 
      isActive: true 
    };
    setEpis((prev) => [newEpi, ...prev]);
    showToast({ type: 'success', title: 'EPI cadastrado', message: `${newEpi.name} (C.A. ${newEpi.caNumber}) pronto para fornecimento.` });
  };

  const editEpi = (id: string, data: Partial<Epi>) => {
    setEpis((prev) => prev.map((e) => (e.id === id ? { ...e, ...data } : e)));
    showToast({ type: 'info', title: 'EPI atualizado', message: 'Cadastro atualizado. Entregas antigas preservadas.' });
  };

  const toggleEpiActive = (id: string) => {
    setEpis((prev) =>
      prev.map((e) => {
        if (e.id === id) {
          const nextState = !e.isActive;
          showToast({
            type: nextState ? 'success' : 'warning',
            title: nextState ? 'EPI Reativado' : 'EPI Inativado',
            message: `${e.name} ${nextState ? 'reativado' : 'inativado'}.`,
          });
          return { ...e, isActive: nextState };
        }
        return e;
      })
    );
  };

  // 4. Employees Administration
  const createEmployee = (data: Omit<Employee, 'id' | 'companyId'> & { companyId?: string }) => {
    const targetCompanyId = data.companyId || currentWork.companyId || currentTenantId || currentUser.companyId || 'comp-01';
    const newEmp: Employee = { 
      ...data, 
      companyId: targetCompanyId,
      id: `emp-${Date.now()}` 
    };
    setEmployees((prev) => [newEmp, ...prev]);
    showToast({ type: 'success', title: 'Colaborador cadastrado', message: `${newEmp.name} vinculado à obra.` });
  };

  const editEmployee = (id: string, data: Partial<Employee>) => {
    setEmployees((prev) => prev.map((e) => (e.id === id ? { ...e, ...data } : e)));
    showToast({ type: 'info', title: 'Colaborador atualizado', message: 'Ficha atualizada.' });
  };

  const toggleEmployeeActive = (id: string) => {
    setEmployees((prev) =>
      prev.map((e) => {
        if (e.id === id) {
          const nextStatus = e.status === 'Ativo' ? 'Afastado' : 'Ativo';
          showToast({
            type: nextStatus === 'Ativo' ? 'success' : 'warning',
            title: `Status do Colaborador: ${nextStatus}`,
            message: `Histórico completo preservado na ficha de ${e.name}.`,
          });
          return { ...e, status: nextStatus };
        }
        return e;
      })
    );
  };

  // 5. Services Administration
  const createService = (data: Omit<ConstructionService, 'id' | 'isActive' | 'companyId'> & { companyId?: string }) => {
    const targetCompanyId = data.companyId || currentWork.companyId || currentTenantId || currentUser.companyId || 'comp-01';
    const newSrv: ConstructionService = { 
      ...data, 
      companyId: targetCompanyId,
      id: `srv-${Date.now()}`, 
      isActive: true 
    };
    setServices((prev) => [newSrv, ...prev]);
    showToast({ type: 'success', title: 'Frente de serviço aberta', message: `${newSrv.floorName} — ${newSrv.name}` });
  };

  const editService = (id: string, data: Partial<ConstructionService>) => {
    setServices((prev) => prev.map((s) => (s.id === id ? { ...s, ...data } : s)));
    showToast({ type: 'info', title: 'Serviço atualizado', message: 'Dados da frente salvos.' });
  };

  const toggleServiceActive = (id: string) => {
    setServices((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const nextState = !s.isActive;
          showToast({
            type: nextState ? 'success' : 'warning',
            title: nextState ? 'Serviço Reativado' : 'Serviço Inativado',
            message: `${s.name} ${nextState ? 'reativado' : 'inativado'}.`,
          });
          return { ...s, isActive: nextState };
        }
        return s;
      })
    );
  };

  // 6. Areas Administration (Section 29)
  const createArea = (name: string) => {
    const newArea: ConstructionArea = { 
      id: `area-${Date.now()}`, 
      companyId: currentWork.companyId || currentUser.companyId || 'comp-01',
      workId: currentWork.id, 
      name, 
      isActive: true 
    };
    setAreas((prev) => [...prev, newArea]);
    showToast({ type: 'success', title: 'Nova área cadastrada', message: `Área "${name}" disponível para serviços.` });
  };

  const editArea = (id: string, name: string) => {
    setAreas((prev) => prev.map((a) => (a.id === id ? { ...a, name } : a)));
    showToast({ type: 'info', title: 'Área renomeada', message: `Área atualizada para "${name}".` });
  };

  const toggleAreaActive = (id: string) => {
    setAreas((prev) =>
      prev.map((a) => (a.id === id ? { ...a, isActive: !a.isActive } : a))
    );
    showToast({ type: 'info', title: 'Status da área alterado', message: 'Cadastro atualizado.' });
  };

  // 7. Floors Administration
  const createFloor = (name: string, level: number, targetWorkId?: string) => {
    const workTargetId = targetWorkId || currentWork.id;
    const newFloor: Floor = { id: `fl-${Date.now()}`, name, level, isActive: true };
    setWorks((prev) =>
      prev.map((w) =>
        w.id === workTargetId
          ? { ...w, floors: [...w.floors, newFloor].sort((a, b) => a.level - b.level) }
          : w
      )
    );
    showToast({ type: 'success', title: 'Novo andar adicionado', message: `Pavimento "${name}" cadastrado na obra.` });
  };

  const editFloor = (id: string, name: string, targetWorkId?: string) => {
    const workTargetId = targetWorkId || currentWork.id;
    setWorks((prev) =>
      prev.map((w) =>
        w.id === workTargetId
          ? { ...w, floors: w.floors.map((fl) => (fl.id === id ? { ...fl, name } : fl)) }
          : w
      )
    );
    showToast({ type: 'info', title: 'Andar renomeado', message: `Pavimento atualizado para "${name}".` });
  };

  const toggleFloorActive = (id: string, targetWorkId?: string) => {
    const workTargetId = targetWorkId || currentWork.id;
    setWorks((prev) =>
      prev.map((w) =>
        w.id === workTargetId
          ? { ...w, floors: w.floors.map((fl) => (fl.id === id ? { ...fl, isActive: !fl.isActive } : fl)) }
          : w
      )
    );
    showToast({ type: 'info', title: 'Status do andar alterado', message: 'Pavimento atualizado.' });
  };

  const reorderFloors = (workId: string, orderedFloorIds: string[]) => {
    setWorks((prev) =>
      prev.map((w) => {
        if (w.id !== workId) return w;
        const floorMap = new Map(w.floors.map((f) => [f.id, f]));
        const reordered = orderedFloorIds
          .map((id, index) => {
            const f = floorMap.get(id);
            return f ? { ...f, level: index } : null;
          })
          .filter(Boolean) as Floor[];
        return { ...w, floors: reordered };
      })
    );
    showToast({ type: 'info', title: 'Ordem dos andares atualizada', message: 'A estrutura de pavimentos foi reorganizada.' });
  };

  // 8. Outsourced Administration (Section 32)
  const createOutsourced = (data: Omit<OutsourcedCompany, 'id' | 'isActive' | 'companyId'> & { companyId?: string }) => {
    const targetCompanyId = data.companyId || currentWork.companyId || currentTenantId || currentUser.companyId || 'comp-01';
    const newOut: OutsourcedCompany = { 
      ...data, 
      companyId: targetCompanyId,
      id: `out-${Date.now()}`, 
      isActive: true 
    };
    setOutsourced((prev) => [...prev, newOut]);
    showToast({ type: 'success', title: 'Terceirizada cadastrada', message: `${newOut.name} registrada na obra.` });
  };

  const editOutsourced = (id: string, data: Partial<OutsourcedCompany>) => {
    setOutsourced((prev) => prev.map((o) => (o.id === id ? { ...o, ...data } : o)));
    showToast({ type: 'info', title: 'Terceirizada atualizada', message: 'Dados do contrato atualizados.' });
  };

  const toggleOutsourcedActive = (id: string) => {
    setOutsourced((prev) =>
      prev.map((o) => (o.id === id ? { ...o, isActive: !o.isActive } : o))
    );
    showToast({ type: 'info', title: 'Status de terceirizada alterado', message: 'Cadastro atualizado.' });
  };

  const addEmployeeToOutsourced = (
    companyId: string,
    employeeData: Omit<OutsourcedEmployee, 'id'>
  ) => {
    const newEmployee: OutsourcedEmployee = {
      ...employeeData,
      id: `emp-out-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      status: employeeData.status || 'Ativo na obra',
    };

    setOutsourced((prev) =>
      prev.map((company) => {
        if (company.id !== companyId) return company;
        return {
          ...company,
          employees: [...(company.employees || []), newEmployee],
        };
      })
    );

    const target = outsourced.find((o) => o.id === companyId);
    showToast({
      type: 'success',
      title: 'Colaborador adicionado',
      message: `${newEmployee.name} foi vinculado à terceirizada ${target?.name || ''}.`,
    });
  };

  const editEmployeeInOutsourced = (
    companyId: string,
    employeeId: string,
    data: Partial<OutsourcedEmployee>
  ) => {
    setOutsourced((prev) =>
      prev.map((company) => {
        if (company.id !== companyId) return company;
        return {
          ...company,
          employees: (company.employees || []).map((emp) =>
            emp.id === employeeId ? { ...emp, ...data } : emp
          ),
        };
      })
    );

    showToast({
      type: 'info',
      title: 'Colaborador atualizado',
      message: 'Dados do colaborador foram atualizados com sucesso.',
    });
  };

  const removeEmployeeFromOutsourced = (companyId: string, employeeId: string) => {
    setOutsourced((prev) =>
      prev.map((company) => {
        if (company.id !== companyId) return company;
        return {
          ...company,
          employees: (company.employees || []).filter((emp) => emp.id !== employeeId),
        };
      })
    );

    showToast({
      type: 'success',
      title: 'Colaborador removido',
      message: 'Colaborador desvinculado da empresa terceirizada.',
    });
  };

  // 9. Works Administration (Section 5)
  const createWork = (data: {
    name: string;
    code?: string;
    address: string;
    city: string;
    state: string;
    type: Work['type'];
    totalFloors: number;
    hasGroundFloor: boolean;
    hasBasements: boolean;
    basementCount: number;
    floors?: Floor[];
    typology?: string;
    interventionType?: 'Construção do Zero (Desde a Fundação)' | 'Reforma / Retrofit';
    services?: ConstructionService[];
  }): Work => {
    const targetCompanyId = currentTenantId || currentUser.companyId || 'comp-01';
    const newWorkId = `work-${Date.now()}`;
    const generatedFloors = (data.floors && data.floors.length > 0)
      ? data.floors.map((f, idx) => ({
          ...f,
          id: f.id || `fl-${newWorkId}-${idx + 1}`,
          workId: newWorkId,
          companyId: targetCompanyId,
        }))
      : generateFloors(data.totalFloors, data.hasGroundFloor, data.basementCount);

    const hasConfiguredServices = !!(data.services && data.services.length > 0);

    const newWork: Work = {
      name: data.name,
      code: data.code,
      address: data.address,
      city: data.city,
      state: data.state,
      type: data.type,
      totalFloors: generatedFloors.length,
      hasGroundFloor: data.hasGroundFloor,
      hasBasements: data.hasBasements,
      basementCount: data.basementCount,
      typology: data.typology,
      interventionType: data.interventionType,
      configuredWithEap: hasConfiguredServices,
      lastScheduleGeneratedAt: hasConfiguredServices ? new Date().toISOString() : undefined,
      id: newWorkId,
      companyId: targetCompanyId,
      status: 'Em andamento',
      floors: generatedFloors,
      isActive: true,
    };

    setWorks((prev) => [...prev, newWork]);
    // Automatically grant current user access to this work
    setCurrentUser((prev) => ({
      ...prev,
      workIds: [...prev.workIds, newWork.id],
    }));
    setCurrentWorkId(newWork.id);

    // If services were provided, link them to the new work
    if (data.services && data.services.length > 0) {
      const boundServices = data.services.map((s) => ({
        ...s,
        workId: newWorkId,
        companyId: targetCompanyId,
      }));
      setServices((prev) => [...boundServices, ...prev]);

      const uniqueCategoryAreas = Array.from(new Set(boundServices.map((s) => s.area))).filter(Boolean);
      if (uniqueCategoryAreas.length > 0) {
        setAreas((prevAreas) => {
          const newCategoryAreas = uniqueCategoryAreas.map((name) => ({
            id: `area-eap-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            companyId: targetCompanyId,
            workId: newWorkId,
            name,
            isActive: true,
          }));
          return [...prevAreas, ...newCategoryAreas];
        });
      }
    }

    showToast({
      type: 'success',
      title: 'Nova Obra Criada com Sucesso',
      message: `${newWork.name} configurada com ${generatedFloors.length} pavimentos/ambientes ${data.services?.length ? `e ${data.services.length} frentes de serviço` : ''}.`,
    });

    return newWork;
  };

  const editWork = (id: string, data: Partial<Work>) => {
    setWorks((prev) => prev.map((w) => (w.id === id ? { ...w, ...data } : w)));
    showToast({ type: 'info', title: 'Obra atualizada', message: 'Parâmetros atualizados.' });
  };

  const saveWorkMapStructure = (params: {
    workId: string;
    interventionType: 'Construção do Zero (Desde a Fundação)' | 'Reforma / Retrofit';
    typology: string;
    floors: Floor[];
    services: ConstructionService[];
  }) => {
    const timestamp = new Date().toISOString();
    
    // Atualiza a obra com a nova lista de pavimentos/ambientes, tipologia e flag de EAP configurada
    setWorks((prevWorks) =>
      prevWorks.map((w) => {
        if (w.id === params.workId) {
          return {
            ...w,
            interventionType: params.interventionType,
            typology: params.typology,
            floors: params.floors,
            totalFloors: params.floors.length,
            configuredWithEap: true,
            lastScheduleGeneratedAt: timestamp,
          };
        }
        return w;
      })
    );

    // Substitui/atualiza os serviços da obra com os serviços gerados vinculados aos locais
    setServices((prevServices) => {
      // Remove serviços antigos desta obra para reconstruir o cronograma limpo
      const filteredOtherWorks = prevServices.filter((s) => s.workId !== params.workId);
      return [...params.services, ...filteredOtherWorks];
    });

    // Também garante que as áreas da obra contemplem as disciplinas da EAP
    const uniqueCategoryAreas = Array.from(new Set(params.services.map((s) => s.area))).filter(Boolean);
    if (uniqueCategoryAreas.length > 0) {
      setAreas((prevAreas) => {
        const existingNames = new Set(prevAreas.filter((a) => a.workId === params.workId).map((a) => a.name));
        const newCategoryAreas = uniqueCategoryAreas
          .filter((name) => !existingNames.has(name))
          .map((name) => ({
            id: `area-eap-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            companyId: currentWork.companyId || currentUser.companyId || 'comp-01',
            workId: params.workId,
            name,
            isActive: true,
          }));
        return [...prevAreas, ...newCategoryAreas];
      });
    }

    showToast({
      type: 'success',
      title: 'Estrutura e Cronograma Vinculados!',
      message: `${params.floors.length} pavimentos/ambientes e ${params.services.length} frentes de serviço vinculadas com sucesso à obra.`,
    });
  };

  const toggleWorkActive = (id: string) => {
    setWorks((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isActive: !w.isActive } : w))
    );
    showToast({ type: 'warning', title: 'Status da obra alterado', message: 'Histórico preservado.' });
  };

  // Physical Deletion Methods (when allowed / no operational history)
  const deleteMaterial = (id: string) => {
    setMaterials((prev) => prev.filter((m) => m.id !== id));
    showToast({ type: 'success', title: 'Registro excluído', message: 'Material excluído do cadastro.' });
  };

  const deleteTool = (id: string) => {
    setTools((prev) => prev.filter((t) => t.id !== id));
    showToast({ type: 'success', title: 'Registro excluído', message: 'Ferramenta excluída do inventário.' });
  };

  const deleteEpi = (id: string) => {
    setEpis((prev) => prev.filter((e) => e.id !== id));
    showToast({ type: 'success', title: 'Registro excluído', message: 'EPI excluído do catálogo.' });
  };

  const deleteEmployee = (id: string) => {
    setEmployees((prev) => prev.filter((e) => e.id !== id));
    showToast({ type: 'success', title: 'Registro excluído', message: 'Colaborador excluído da obra.' });
  };

  const deleteService = (id: string) => {
    setServices((prev) => prev.filter((s) => s.id !== id));
    showToast({ type: 'success', title: 'Registro excluído', message: 'Frente de serviço excluída.' });
  };

  const updateServiceLocationStatus = (
    serviceId: string,
    locationId: string,
    locationName: string,
    status: LocationServiceStatus
  ) => {
    setServices((prev) =>
      prev.map((s) => {
        if (s.id !== serviceId) return s;

        const existingLocs = s.locationProgress || [];
        const locIndex = existingLocs.findIndex((lp) => lp.locationId === locationId);

        let updatedLocs: ServiceLocationProgress[];
        if (locIndex >= 0) {
          updatedLocs = existingLocs.map((lp, idx) =>
            idx === locIndex ? { ...lp, status, updatedAt: new Date().toISOString() } : lp
          );
        } else {
          updatedLocs = [
            ...existingLocs,
            { locationId, locationName, status, updatedAt: new Date().toISOString() },
          ];
        }

        // Recalcular status geral do serviço com base nos locais
        const allCompleted = updatedLocs.length > 0 && updatedLocs.every((lp) => lp.status === 'Concluído' || lp.status === 'Finalizado');
        const anyInProgress = updatedLocs.some((lp) => lp.status === 'Em andamento');
        const anyParalyzed = updatedLocs.some((lp) => lp.status === 'Paralisado');
        
        let newServiceStatus: ServiceStatus = s.status;
        let concludedDate = s.concludedDate;

        if (allCompleted) {
          newServiceStatus = 'Concluído';
          concludedDate = concludedDate || new Date().toISOString().substring(0, 10);
        } else if (anyInProgress) {
          newServiceStatus = 'Em andamento';
          concludedDate = undefined;
        } else if (anyParalyzed) {
          newServiceStatus = 'Paralisado';
          concludedDate = undefined;
        } else {
          newServiceStatus = 'Não iniciado';
          concludedDate = undefined;
        }

        return {
          ...s,
          locationProgress: updatedLocs,
          status: newServiceStatus,
          concludedDate,
        };
      })
    );
  };

  const toggleServiceLocationApplied = (
    serviceId: string,
    locationId: string,
    locationName: string
  ) => {
    setServices((prev) =>
      prev.map((s) => {
        if (s.id !== serviceId) return s;

        const existingLocs = s.locationProgress || [];
        const exists = existingLocs.some((lp) => lp.locationId === locationId);

        let updatedLocs: ServiceLocationProgress[];
        if (exists) {
          updatedLocs = existingLocs.filter((lp) => lp.locationId !== locationId);
        } else {
          updatedLocs = [
            ...existingLocs,
            { locationId, locationName, status: 'Não iniciado', updatedAt: new Date().toISOString() },
          ];
        }

        const allCompleted = updatedLocs.length > 0 && updatedLocs.every((lp) => lp.status === 'Concluído');
        const anyInProgress = updatedLocs.some((lp) => lp.status === 'Em andamento' || lp.status === 'Concluído');
        let newServiceStatus: ServiceStatus = 'Não iniciado';
        if (allCompleted) newServiceStatus = 'Concluído';
        else if (anyInProgress) newServiceStatus = 'Em andamento';

        return {
          ...s,
          locationProgress: updatedLocs,
          status: newServiceStatus,
        };
      })
    );
  };

  const addServiceProofPhoto = (
    serviceId: string,
    photo: Omit<ServiceProofPhoto, 'id'>
  ) => {
    const newPhoto: ServiceProofPhoto = {
      ...photo,
      id: `photo-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      uploadedBy: currentUser.name || 'Engenharia de Campo',
    };

    setServices((prev) =>
      prev.map((s) => {
        if (s.id !== serviceId) return s;
        return {
          ...s,
          proofPhotos: [newPhoto, ...(s.proofPhotos || [])],
        };
      })
    );

    showToast({
      type: 'success',
      title: 'Foto Comprobatória Anexada',
      message: photo.caption ? `"${photo.caption}" registrada.` : 'Registro fotográfico anexado com sucesso.',
    });
  };

  const removeServiceProofPhoto = (serviceId: string, photoId: string) => {
    setServices((prev) =>
      prev.map((s) => {
        if (s.id !== serviceId) return s;
        return {
          ...s,
          proofPhotos: (s.proofPhotos || []).filter((p) => p.id !== photoId),
        };
      })
    );

    showToast({
      type: 'info',
      title: 'Foto Removida',
      message: 'Comprovação fotográfica removida da frente de serviço.',
    });
  };

  const deleteArea = (id: string) => {
    setAreas((prev) => prev.filter((a) => a.id !== id));
    showToast({ type: 'success', title: 'Registro excluído', message: 'Área excluída da obra.' });
  };

  const deleteFloor = (floorId: string, targetWorkId?: string) => {
    const workTargetId = targetWorkId || currentWork.id;
    setWorks((prev) =>
      prev.map((w) =>
        w.id === workTargetId
          ? { ...w, floors: w.floors.filter((f) => f.id !== floorId) }
          : w
      )
    );
    showToast({ type: 'success', title: 'Registro excluído', message: 'Pavimento excluído da estrutura.' });
  };

  const deleteOutsourced = (id: string) => {
    setOutsourced((prev) => prev.filter((o) => o.id !== id));
    showToast({ type: 'success', title: 'Registro excluído', message: 'Terceirizada excluída da obra.' });
  };

  const deleteWork = (id: string) => {
    setWorks((prev) => prev.filter((w) => w.id !== id));
    showToast({ type: 'success', title: 'Registro excluído', message: 'Obra excluída da empresa.' });
  };

  // Transfers Operational Flow (Section 33)
  const createTransferRequest = (data: {
    originWorkId: string;
    originWorkName: string;
    destinationWorkId: string;
    destinationWorkName: string;
    itemType: string;
    materialName: string;
    unit?: string;
    requestedQuantity: number;
    type?: TransferType;
    notes?: string;
  }): TransferRequest => {
    const targetCompanyId = currentWork.companyId || currentTenantId || currentUser.companyId || 'comp-01';
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const newTransfer: TransferRequest = {
      id: `transf-${Date.now()}`,
      companyId: targetCompanyId,
      type: data.type || 'Definitiva',
      status: 'Pendente',
      originWorkId: data.originWorkId,
      originWorkName: data.originWorkName,
      destinationWorkId: data.destinationWorkId,
      destinationWorkName: data.destinationWorkName,
      itemType: data.itemType,
      materialName: data.materialName,
      unit: data.unit || 'un',
      requestedQuantity: data.requestedQuantity,
      offeredQuantity: 0,
      requestedAt: nowStr,
      requestedByUserName: currentUser.name,
      notes: data.notes,
    };

    setTransfers((prev) => [newTransfer, ...prev]);

    // Create operational alert for the receiving/approving work
    const newAlert: OperationalAlert = {
      id: `alt-${Date.now()}`,
      companyId: targetCompanyId,
      type: 'pending_transfer',
      title: 'Nova Solicitação de Insumo',
      message: `${data.originWorkName} solicitou ${data.requestedQuantity} ${data.unit || 'un'} de ${data.materialName}.`,
      workId: data.destinationWorkId,
      timestamp: 'Agora',
      severity: 'medium',
      actionTab: 'transfers',
    };
    setAlerts((prev) => [newAlert, ...prev]);

    showToast({
      type: 'success',
      title: 'Solicitação Criada com Sucesso',
      message: `Pedido de ${data.requestedQuantity} ${data.unit || 'un'} enviado para ${data.destinationWorkName}. Aguardando aprovação.`,
    });

    return newTransfer;
  };

  const approveTransferRequest = (
    transferId: string,
    data: {
      itemType: string;
      materialName: string;
      approvedQuantity: number;
      notes?: string;
    }
  ) => {
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);

    setTransfers((prev) =>
      prev.map((t) => {
        if (t.id !== transferId) return t;
        return {
          ...t,
          status: 'Em trânsito/Transferido',
          approvedItemType: data.itemType,
          approvedItemName: data.materialName,
          approvedQuantity: data.approvedQuantity,
          offeredQuantity: data.approvedQuantity,
          sentQuantity: data.approvedQuantity,
          sentAt: nowStr,
          approvedAt: nowStr,
          approvedByUserName: currentUser.name,
          approvalNotes: data.notes,
        };
      })
    );

    showToast({
      type: 'success',
      title: 'Transferência Aprovada!',
      message: `${data.approvedQuantity} liberados. Status alterado para "Em trânsito/Transferido".`,
    });
  };

  const cancelTransferRequest = (transferId: string, reason?: string) => {
    setTransfers((prev) =>
      prev.map((t) => {
        if (t.id !== transferId) return t;
        return {
          ...t,
          status: 'Encerrado',
          discrepancyNote: reason || 'Cancelado pelo usuário',
        };
      })
    );
    showToast({
      type: 'info',
      title: 'Solicitação Cancelada',
      message: 'A transferência foi cancelada e encerrada.',
    });
  };

  const createBroadcastRequest = (data: {
    originWorkId: string;
    originWorkName: string;
    itemType: string;
    materialName: string;
    unit?: string;
    requestedQuantity: number;
    deliveryAddress?: string;
    targetWarehouseManager?: string;
    type?: TransferType;
    notes?: string;
  }): TransferRequest => {
    const targetCompanyId = currentWork.companyId || currentTenantId || currentUser.companyId || 'comp-01';
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const newBroadcast: TransferRequest = {
      id: `transf-broadcast-${Date.now()}`,
      companyId: targetCompanyId,
      type: data.type || 'Definitiva',
      status: 'Pendente',
      originWorkId: data.originWorkId,
      originWorkName: data.originWorkName,
      destinationWorkId: 'all',
      destinationWorkName: 'Mural Global (Todas as Obras)',
      itemType: data.itemType,
      materialName: data.materialName,
      unit: data.unit || 'un',
      requestedQuantity: data.requestedQuantity,
      offeredQuantity: 0,
      fulfilledQuantity: 0,
      isBroadcast: true,
      contributions: [],
      deliveryAddress: data.deliveryAddress,
      targetWarehouseManager: data.targetWarehouseManager,
      requestedAt: nowStr,
      requestedByUserName: currentUser.name,
      notes: data.notes,
    };

    setTransfers((prev) => [newBroadcast, ...prev]);

    const newAlert: OperationalAlert = {
      id: `alt-${Date.now()}`,
      companyId: targetCompanyId,
      type: 'pending_transfer',
      title: 'Novo Pedido Aberto no Mural',
      message: `${data.originWorkName} abriu pedido no mural de ${data.requestedQuantity} ${data.unit || 'un'} de ${data.materialName}. Todas as obras podem contribuir!`,
      workId: 'all',
      timestamp: 'Agora',
      severity: 'medium',
      actionTab: 'transfers',
    };
    setAlerts((prev) => [newAlert, ...prev]);

    showToast({
      type: 'success',
      title: 'Pedido Publicado no Mural Global!',
      message: `${data.requestedQuantity} ${data.unit || 'un'} de ${data.materialName} publicado para todas as obras contribuírem.`,
    });

    return newBroadcast;
  };

  const contributeToTransferRequest = (
    requestId: string,
    contribution: {
      supplyingWorkId: string;
      supplyingWorkName: string;
      supplyingWorkAddress: string;
      warehouseManagerName: string;
      warehouseManagerPhone?: string;
      quantity: number;
      notes?: string;
    }
  ) => {
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const target = transfers.find((t) => t.id === requestId);
    if (!target) return;

    const qty = contribution.quantity;
    const reqWorkId = target.originWorkId;
    const reqWorkName = target.originWorkName;
    const supWorkId = contribution.supplyingWorkId;
    const supWorkName = contribution.supplyingWorkName;
    const matName = target.materialName;
    const unit = target.unit;

    // -------------------------------------------------------------
    // REGRA 4: CONTA-CORRENTE & ABATIMENTO AUTOMÁTICO (ENCONTRO DE CONTAS)
    // Se futuramente a Obra B solicitar cimento e a Obra A fornecer,
    // o sistema não deve criar uma nova dívida, mas sim deduzir do
    // saldo devedor existente até zerar a conta.
    // -------------------------------------------------------------
    let deductionOccurred = false;
    let deductionAmount = 0;
    let remainingDebtAfterDeduction = 0;

    // Verifica se a obra fornecedora (supWorkId) já devia esse insumo para a obra solicitante (reqWorkId)
    const existingDebtFromSupplier = materialDebts.find(
      (d) =>
        d.debtorWorkId === supWorkId &&
        d.creditorWorkId === reqWorkId &&
        d.materialName.toLowerCase().trim() === matName.toLowerCase().trim() &&
        d.balance > 0
    );

    if (existingDebtFromSupplier) {
      // HÁ DÍVIDA PRÉVIA: APLICAR ABATIMENTO AUTOMÁTICO!
      deductionOccurred = true;
      const priorBalance = existingDebtFromSupplier.balance;

      if (qty <= priorBalance) {
        // Abatimento parcial ou quitação exata
        deductionAmount = qty;
        remainingDebtAfterDeduction = priorBalance - qty;

        setMaterialDebts((prev) =>
          prev.map((d) => {
            if (d.id === existingDebtFromSupplier.id) {
              return {
                ...d,
                balance: remainingDebtAfterDeduction,
                lastUpdatedAt: nowStr,
              };
            }
            return d;
          })
        );

        const newTx: MaterialAccountTransaction = {
          id: `tx-${Date.now()}`,
          date: nowStr,
          debtorWorkId: supWorkId,
          debtorWorkName: supWorkName,
          creditorWorkId: reqWorkId,
          creditorWorkName: reqWorkName,
          materialName: matName,
          unit,
          quantity: qty,
          type: remainingDebtAfterDeduction === 0 ? 'QUITACAO' : 'ABATIMENTO',
          previousBalance: priorBalance,
          newBalance: remainingDebtAfterDeduction,
          description: `Encontro de contas automático: ${supWorkName} forneceu ${qty} ${unit} para ${reqWorkName}, abatendo seu saldo devedor anterior de ${priorBalance} para ${remainingDebtAfterDeduction} ${unit}.`,
          referenceRequestId: requestId,
        };
        setMaterialTransactions((prev) => [newTx, ...prev]);
      } else {
        // Forneceu MAIS do que devia: quita a dívida prévia e o excedente vira nova dívida em sentido inverso
        deductionAmount = priorBalance;
        const excess = qty - priorBalance;

        setMaterialDebts((prev) => {
          const updated = prev.map((d) => {
            if (d.id === existingDebtFromSupplier.id) {
              return { ...d, balance: 0, lastUpdatedAt: nowStr };
            }
            return d;
          });

          const reverseExisting = updated.find(
            (d) =>
              d.debtorWorkId === reqWorkId &&
              d.creditorWorkId === supWorkId &&
              d.materialName.toLowerCase().trim() === matName.toLowerCase().trim()
          );

          if (reverseExisting) {
            return updated.map((d) =>
              d.id === reverseExisting.id
                ? { ...d, balance: d.balance + excess, lastUpdatedAt: nowStr }
                : d
            );
          } else {
            return [
              ...updated,
              {
                id: `debt-${Date.now()}`,
                debtorWorkId: reqWorkId,
                debtorWorkName: reqWorkName,
                creditorWorkId: supWorkId,
                creditorWorkName: supWorkName,
                materialName: matName,
                unit,
                balance: excess,
                lastUpdatedAt: nowStr,
              },
            ];
          }
        });

        const txQuit: MaterialAccountTransaction = {
          id: `tx-${Date.now()}-1`,
          date: nowStr,
          debtorWorkId: supWorkId,
          debtorWorkName: supWorkName,
          creditorWorkId: reqWorkId,
          creditorWorkName: reqWorkName,
          materialName: matName,
          unit,
          quantity: priorBalance,
          type: 'QUITACAO',
          previousBalance: priorBalance,
          newBalance: 0,
          description: `Quitação total da dívida de ${priorBalance} ${unit} que ${supWorkName} tinha com ${reqWorkName}.`,
          referenceRequestId: requestId,
        };

        const txExcess: MaterialAccountTransaction = {
          id: `tx-${Date.now()}-2`,
          date: nowStr,
          debtorWorkId: reqWorkId,
          debtorWorkName: reqWorkName,
          creditorWorkId: supWorkId,
          creditorWorkName: supWorkName,
          materialName: matName,
          unit,
          quantity: excess,
          type: 'NOVA_DIVIDA',
          previousBalance: 0,
          newBalance: excess,
          description: `Fornecimento excedente de ${excess} ${unit} gerou novo saldo devedor de ${reqWorkName} com ${supWorkName}.`,
          referenceRequestId: requestId,
        };

        setMaterialTransactions((prev) => [txExcess, txQuit, ...prev]);
      }
    } else {
      // NÃO HAVIA DÍVIDA PRÉVIA DO FORNECEDOR: Cria ou soma nova dívida de reqWork para supWork
      setMaterialDebts((prev) => {
        const existing = prev.find(
          (d) =>
            d.debtorWorkId === reqWorkId &&
            d.creditorWorkId === supWorkId &&
            d.materialName.toLowerCase().trim() === matName.toLowerCase().trim()
        );

        if (existing) {
          const prevBal = existing.balance;
          const nextBal = prevBal + qty;
          const tx: MaterialAccountTransaction = {
            id: `tx-${Date.now()}`,
            date: nowStr,
            debtorWorkId: reqWorkId,
            debtorWorkName: reqWorkName,
            creditorWorkId: supWorkId,
            creditorWorkName: supWorkName,
            materialName: matName,
            unit,
            quantity: qty,
            type: 'NOVA_DIVIDA',
            previousBalance: prevBal,
            newBalance: nextBal,
            description: `Fornecimento fracionado de ${qty} ${unit} somado ao saldo devedor existente de ${reqWorkName} perante ${supWorkName}.`,
            referenceRequestId: requestId,
          };
          setMaterialTransactions((tprev) => [tx, ...tprev]);

          return prev.map((d) =>
            d.id === existing.id
              ? { ...d, balance: nextBal, lastUpdatedAt: nowStr }
              : d
          );
        } else {
          const tx: MaterialAccountTransaction = {
            id: `tx-${Date.now()}`,
            date: nowStr,
            debtorWorkId: reqWorkId,
            debtorWorkName: reqWorkName,
            creditorWorkId: supWorkId,
            creditorWorkName: supWorkName,
            materialName: matName,
            unit,
            quantity: qty,
            type: 'NOVA_DIVIDA',
            previousBalance: 0,
            newBalance: qty,
            description: `Fornecimento de ${qty} ${unit} gerou saldo devedor de ${reqWorkName} perante ${supWorkName}.`,
            referenceRequestId: requestId,
          };
          setMaterialTransactions((tprev) => [tx, ...tprev]);

          return [
            ...prev,
            {
              id: `debt-${Date.now()}`,
              debtorWorkId: reqWorkId,
              debtorWorkName: reqWorkName,
              creditorWorkId: supWorkId,
              creditorWorkName: supWorkName,
              materialName: matName,
              unit,
              balance: qty,
              lastUpdatedAt: nowStr,
            },
          ];
        }
      });
    }

    // -------------------------------------------------------------
    // REGRA 2: ATUALIZAÇÃO FRACIONADA DO PEDIDO
    // -------------------------------------------------------------
    const newContribution: FractionalContribution = {
      id: `contrib-${Date.now()}`,
      requestId,
      supplyingWorkId: supWorkId,
      supplyingWorkName: supWorkName,
      supplyingWorkAddress: contribution.supplyingWorkAddress,
      warehouseManagerName: contribution.warehouseManagerName,
      warehouseManagerPhone: contribution.warehouseManagerPhone,
      quantity: qty,
      contributedAt: nowStr,
      contributedByUserName: currentUser.name,
      notes: contribution.notes,
    };

    let isComplete = false;
    let newFulfilled = 0;

    setTransfers((prev) =>
      prev.map((t) => {
        if (t.id !== requestId) return t;
        const currentContribs = t.contributions || [];
        const nextContribs = [...currentContribs, newContribution];
        newFulfilled = (t.fulfilledQuantity || 0) + qty;
        isComplete = newFulfilled >= t.requestedQuantity;

        return {
          ...t,
          contributions: nextContribs,
          fulfilledQuantity: newFulfilled,
          approvedQuantity: newFulfilled,
          offeredQuantity: newFulfilled,
          status: isComplete ? 'Em trânsito/Transferido' : 'Pendente',
        };
      })
    );

    // Feedback visual com Toast inteligente
    if (deductionOccurred) {
      showToast({
        type: 'success',
        title: 'Encontro de Contas Automático Realizado!',
        message: `${supWorkName} forneceu ${qty} ${unit}. Dívida anterior abatida em ${deductionAmount} ${unit} (Saldo devedor restante: ${remainingDebtAfterDeduction} ${unit}).`,
      });
    } else {
      showToast({
        type: 'success',
        title: 'Contribuição Registrada!',
        message: `${supWorkName} aprovou o envio de ${qty} ${unit}. Conta-corrente atualizada (Saldo devedor de ${reqWorkName}).`,
      });
    }

    if (isComplete) {
      showToast({
        type: 'info',
        title: '🎉 Pedido 100% Concluído!',
        message: `Todas as ${target.requestedQuantity} ${unit} foram atendidas. Rota de coleta liberada para WhatsApp!`,
      });
    }
  };

  const settleDebtBalance = (debtId: string, quantityToSettle: number, notes?: string) => {
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const target = materialDebts.find((d) => d.id === debtId);
    if (!target) return;

    const qty = Math.min(target.balance, quantityToSettle);
    const prevBal = target.balance;
    const nextBal = Math.max(0, prevBal - qty);

    setMaterialDebts((prev) =>
      prev.map((d) => (d.id === debtId ? { ...d, balance: nextBal, lastUpdatedAt: nowStr } : d))
    );

    const tx: MaterialAccountTransaction = {
      id: `tx-${Date.now()}`,
      date: nowStr,
      debtorWorkId: target.debtorWorkId,
      debtorWorkName: target.debtorWorkName,
      creditorWorkId: target.creditorWorkId,
      creditorWorkName: target.creditorWorkName,
      materialName: target.materialName,
      unit: target.unit,
      quantity: qty,
      type: nextBal === 0 ? 'QUITACAO' : 'ABATIMENTO',
      previousBalance: prevBal,
      newBalance: nextBal,
      description: notes || `Liquidação manual/direta de ${qty} ${target.unit} entre canteiros.`,
    };
    setMaterialTransactions((prev) => [tx, ...prev]);

    showToast({
      type: 'success',
      title: 'Saldo Devedor Atualizado',
      message: `${qty} ${target.unit} liquidados. Saldo devedor restante: ${nextBal} ${target.unit}.`,
    });
  };

  return (
    <AppContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        currentUser,
        setCurrentUser,
        switchUserById,
        logoutWithConfirm,
        switchUser,
        tenants,
        currentTenantId,
        switchTenant,
        setUserDefinitivePassword,
        changeUserPassword,
        companyBranding,
        updateCompanyBranding,
        registerFirstAccess,
        users,
        addUser,
        editUser,
        toggleUserActive,
        works,
        currentWork,
        setCurrentWork,
        availableWorks,
        currentTab,
        setCurrentTab,
        materials,
        materialMovements,
        tools,
        epis,
        epiDeliveries,
        employees,
        occurrences,
        services,
        areas,
        outsourced,
        transfers,
        alerts,
        hasPermission,
        confirmModal,
        requestConfirmation,
        closeConfirmation,
        addMaterialEntry,
        addMaterialExit,
        adjustMaterialStock,
        deliverTool,
        returnTool,
        deliverEpi,
        addOccurrence,
        customAllowanceTypes,
        addCustomAllowanceType,
        deleteCustomAllowanceType,
        updateServiceStatus,
        createMaterial,
        editMaterial,
        toggleMaterialActive,
        deleteMaterial,
        createTool,
        editTool,
        toggleToolActive,
        deleteTool,
        createEpi,
        editEpi,
        toggleEpiActive,
        deleteEpi,
        createEmployee,
        editEmployee,
        toggleEmployeeActive,
        deleteEmployee,
        createService,
        editService,
        toggleServiceActive,
        deleteService,
        updateServiceLocationStatus,
        toggleServiceLocationApplied,
        addServiceProofPhoto,
        removeServiceProofPhoto,
        createArea,
        editArea,
        toggleAreaActive,
        deleteArea,
        createFloor,
        editFloor,
        toggleFloorActive,
        reorderFloors,
        deleteFloor,
        createOutsourced,
        editOutsourced,
        toggleOutsourcedActive,
        deleteOutsourced,
        addEmployeeToOutsourced,
        editEmployeeInOutsourced,
        removeEmployeeFromOutsourced,
        createWork,
        editWork,
        toggleWorkActive,
        deleteWork,
        saveWorkMapStructure,
        createTransferRequest,
        approveTransferRequest,
        cancelTransferRequest,
        createBroadcastRequest,
        contributeToTransferRequest,
        materialDebts,
        materialTransactions,
        settleDebtBalance,
        activeQuickAction,
        openQuickAction,
        closeQuickAction,
        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
