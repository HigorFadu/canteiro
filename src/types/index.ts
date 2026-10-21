export type UserRole = 
  | 'Almoxarife'
  | 'Encarregado'
  | 'Mestre de Obras'
  | 'Estagiário'
  | 'Engenheiro'
  | 'ADM do sistema';

export type WorkType = 
  | 'Residencial'
  | 'Comercial'
  | 'Industrial'
  | 'Reforma'
  | 'Infraestrutura'
  | 'Outro';

export type WorkStatus = 'Em andamento' | 'Concluída' | 'Paralisada';

export type PlanTier = 'basic' | 'intermediate' | 'advanced';

export interface Floor {
  id: string;
  workId?: string;
  companyId?: string;
  name: string; // "Subsolo 2", "Subsolo 1", "Térreo", "1º", "2º"...
  level: number;
  isActive: boolean;
}

export interface ConstructionArea {
  id: string;
  companyId: string;
  workId: string;
  name: string;
  isActive: boolean;
}

export interface Work {
  id: string;
  companyId: string;
  name: string;
  code?: string;
  address: string;
  city: string;
  state: string;
  type: WorkType;
  interventionType?: 'Construção do Zero (Desde a Fundação)' | 'Reforma / Retrofit';
  typology?: string;
  totalFloors: number;
  hasGroundFloor: boolean;
  hasBasements: boolean;
  basementCount: number;
  status: WorkStatus;
  floors: Floor[];
  locations?: string[];
  isActive: boolean;
  configuredWithEap?: boolean;
  lastScheduleGeneratedAt?: string;
}

export interface Company {
  id: string;
  name: string;
  cnpj: string;
  planTier: PlanTier;
}

export interface CompanyBranding {
  companyName: string;
  tradeName: string;
  cnpj?: string;
  logoUrl?: string;
  
  // Custom Visual Identity (Identidade Visual Completa)
  bgPrimary: string;       // Fundo principal
  bgSecondary: string;     // Fundo secundário / cards
  menuBg: string;          // Menus / sidebar
  buttonPrimary: string;   // Botões principais
  buttonPrimaryText?: string; // Texto do botão principal (auto contraste)
  buttonSecondary: string; // Botões secundários
  textPrimary: string;     // Textos principais
  textSecondary: string;   // Textos secundários
  textTitles: string;      // Títulos
  accentColor: string;     // Destaques / badges
  borderColor: string;     // Bordas e divisores
  iconColor: string;       // Ícones
  linkColor: string;       // Links
  successColor: string;    // Sucesso
  warningColor: string;    // Alerta
  errorColor: string;      // Erro
  themePreset: 'claro' | 'escuro' | 'personalizado';

  // Legacy compatibility getters
  primaryColor?: string;
  secondaryColor?: string;
}

export type PermissionKey =
  | 'materials.view'
  | 'materials.create'
  | 'materials.entry'
  | 'materials.exit'
  | 'materials.adjust'
  | 'materials.edit'
  | 'materials.deactivate'
  | 'materials.reactivate'
  | 'materials.history'
  | 'tools.view'
  | 'tools.create'
  | 'tools.deliver'
  | 'tools.return'
  | 'tools.transfer'
  | 'tools.maintenance'
  | 'tools.loss'
  | 'tools.writeoff'
  | 'tools.edit'
  | 'tools.deactivate'
  | 'tools.reactivate'
  | 'tools.history'
  | 'epis.view'
  | 'epis.create'
  | 'epis.deliver'
  | 'epis.edit'
  | 'epis.deactivate'
  | 'epis.reactivate'
  | 'epis.history'
  | 'employees.view'
  | 'employees.create'
  | 'employees.edit'
  | 'employees.transfer'
  | 'employees.deactivate'
  | 'employees.reactivate'
  | 'employees.history'
  | 'occurrences.view'
  | 'occurrences.create'
  | 'occurrences.correct'
  | 'occurrences.cancel'
  | 'occurrences.report'
  | 'progress.view'
  | 'progress.create_service'
  | 'progress.edit_service'
  | 'progress.change_status'
  | 'progress.assign_people'
  | 'progress.deactivate_service'
  | 'areas.view'
  | 'areas.create'
  | 'areas.edit'
  | 'areas.deactivate'
  | 'floors.view'
  | 'floors.create'
  | 'floors.edit'
  | 'floors.reorder'
  | 'floors.deactivate'
  | 'outsourced.view'
  | 'outsourced.create'
  | 'outsourced.edit'
  | 'outsourced.deactivate'
  | 'transfers.view'
  | 'transfers.request'
  | 'transfers.respond'
  | 'transfers.separate'
  | 'transfers.send'
  | 'transfers.receive'
  | 'transfers.cancel'
  | 'reports.view'
  | 'reports.export'
  | 'users.view'
  | 'users.create'
  | 'users.edit'
  | 'users.block'
  | 'users.reactivate'
  | 'users.permissions'
  | 'works.view'
  | 'works.create'
  | 'works.edit'
  | 'works.deactivate'
  | 'works.reactivate'
  | 'settings.view'
  | 'settings.edit';

export type UserStatus = 'Ativo' | 'Inativo' | 'Primeiro acesso pendente';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  companyId: string;
  workIds: string[]; // works user has access to
  defaultWorkId: string;
  permissions: PermissionKey[];
  isActive: boolean;
  status: UserStatus;
  provisionalPassword?: string;
  requiresPasswordChange?: boolean;
  avatar?: string;
}

export interface TenantCompany {
  id: string;
  name: string;
  tradeName: string;
  cnpj?: string;
  logoUrl?: string;
  planTier: PlanTier;
  branding: CompanyBranding;
  users: User[];
  works: Work[];
  employees: Employee[];
  materials: Material[];
  materialMovements: MaterialMovement[];
  tools: Tool[];
  toolMovements: ToolMovement[];
  epis: Epi[];
  epiDeliveries: EpiDelivery[];
  occurrences: Occurrence[];
  services: ConstructionService[];
  outsourced: OutsourcedCompany[];
  transfers: TransferRequest[];
  alerts: OperationalAlert[];
  areas: ConstructionArea[];
  customAllowanceTypes?: CustomAllowanceType[];
}

export type MaterialCategory = 
  | 'Cimento'
  | 'Argamassa'
  | 'Areia'
  | 'Brita'
  | 'Aço'
  | 'Madeira'
  | 'Tubos'
  | 'Conexões'
  | 'Elétrica'
  | 'Hidráulica'
  | 'Ferragens'
  | 'Acabamento'
  | 'Limpeza'
  | 'Outros';

export type MaterialUnit = 
  | 'Unidade'
  | 'Saco'
  | 'Caixa'
  | 'Metro'
  | 'm²'
  | 'm³'
  | 'kg'
  | 'Litro'
  | 'Barra'
  | 'Rolo'
  | 'Par'
  | 'Pacote'
  | 'Outro';

export interface Material {
  id: string;
  companyId: string;
  workId: string;
  name: string;
  category: MaterialCategory;
  unit: MaterialUnit;
  code?: string;
  currentStock: number;
  minStock: number;
  location?: string;
  notes?: string;
  updatedAt: string;
  isActive: boolean;
}

export type MovementType = 'entry' | 'exit' | 'adjust';

export interface MaterialMovement {
  id: string;
  companyId: string;
  workId: string;
  materialId: string;
  materialName: string;
  unit: MaterialUnit;
  type: MovementType;
  previousStock: number;
  quantity: number;
  resultStock: number;
  origin?: 'Compra' | 'Transferência' | 'Outro';
  destination?: 'Uso geral' | 'Funcionário';
  employeeId?: string;
  employeeName?: string;
  documentRef?: string;
  reason?: string;
  notes?: string;
  userId: string;
  userName: string;
  timestamp: string;
}

export type ToolStatus = 'Disponível' | 'Em uso' | 'Em manutenção' | 'Extraviada' | 'Baixada';
export type ToolCondition = 'Nova' | 'Boa' | 'Usada' | 'Danificada';

export interface Tool {
  id: string;
  companyId: string;
  workId: string;
  name: string;
  type: string;
  brand?: string;
  model?: string;
  code?: string;
  status: ToolStatus;
  condition: ToolCondition;
  currentEmployeeId?: string;
  currentEmployeeName?: string;
  notes?: string;
  updatedAt: string;
  isActive: boolean;
}

export interface ToolMovement {
  id: string;
  companyId: string;
  toolId: string;
  toolName: string;
  type: 'Entrega' | 'Devolução' | 'Transferência' | 'Manutenção' | 'Extravio' | 'Baixa';
  employeeId?: string;
  employeeName?: string;
  toEmployeeId?: string;
  toEmployeeName?: string;
  condition: ToolCondition;
  reason?: string;
  notes?: string;
  userId: string;
  userName: string;
  timestamp: string;
}

export type EpiCategory =
  | 'Proteção da cabeça'
  | 'Proteção dos olhos'
  | 'Proteção facial'
  | 'Proteção auditiva'
  | 'Proteção respiratória'
  | 'Proteção das mãos'
  | 'Proteção dos pés'
  | 'Proteção contra quedas'
  | 'Vestimentas'
  | 'Outros';

export interface Epi {
  id: string;
  companyId: string;
  name: string;
  category: EpiCategory;
  manufacturer: string;
  caNumber: string; // Certificado de Aprovação
  sizes?: string[];
  unit: string;
  stock: number;
  minStock: number;
  notes?: string;
  isActive: boolean;
}

export interface EpiDelivery {
  id: string;
  companyId: string;
  workId: string;
  employeeId: string;
  employeeName: string;
  epiId: string;
  epiName: string;
  quantity: number;
  movementType: 'Fornecimento' | 'Troca';
  // Historical snapshot rule (copied from EPI at delivery moment)
  manufacturerSnapshot: string;
  caNumberSnapshot: string;
  userId: string;
  userName: string;
  timestamp: string;
  notes?: string;
}

export type EmployeeStatus = 'Ativo' | 'Afastado' | 'Desligado' | 'Bloqueado';

export interface Employee {
  id: string;
  companyId: string;
  workId: string;
  name: string;
  code?: string; // Matrícula
  functionName: string;
  admissionDate?: string;
  status: EmployeeStatus;
  notes?: string;
  phone?: string;
}

export interface EmployeeFunctionHistory {
  id: string;
  companyId?: string;
  employeeId: string;
  previousFunction: string;
  newFunction: string;
  timestamp: string;
  notes?: string;
  userId: string;
}

export interface EmployeeWorkHistory {
  id: string;
  companyId?: string;
  employeeId: string;
  previousWorkId: string;
  previousWorkName: string;
  newWorkId: string;
  newWorkName: string;
  timestamp: string;
  notes?: string;
  userId: string;
}

export type OccurrenceType =
  | 'Atestado de Dias'
  | 'Atestado de Horas'
  | 'Atestado médico'
  | 'Atestado de horas'
  | 'Advertência'
  | 'Suspensão'
  | 'Falta justificada'
  | 'Falta injustificada'
  | 'Abono'
  | 'Outro'
  | string;

export type AllowanceType = 
  | 'Liberado pelo encarregado'
  | 'Banco'
  | 'Escritório'
  | 'Atestado de horas'
  | 'Outro'
  | string;

export interface CustomAllowanceType {
  id: string;
  companyId: string;
  name: string;
  description?: string;
  createdAt: string;
}

export interface Occurrence {
  id: string;
  companyId: string;
  workId: string;
  employeeId: string;
  employeeName: string;
  type: OccurrenceType;
  date: string;
  startDate?: string;
  daysCount?: number;
  returnDate?: string;
  startTime?: string;
  endTime?: string;
  hours?: number;
  isAllowed: boolean;
  allowanceType?: AllowanceType;
  reason: string;
  notes?: string;
  hasAttachment?: boolean;
  attachmentName?: string;
  attachmentUrl?: string;
  attachmentType?: string;
  attachmentSize?: string;
  userId: string;
  userName: string;
  timestamp: string;
}

export type ServiceStatus = 'Não iniciado' | 'Em andamento' | 'Concluído' | 'Finalizado' | 'Paralisado';
export type LocationServiceStatus = 'Não iniciado' | 'Em andamento' | 'Concluído' | 'Finalizado' | 'Paralisado';

export interface ServiceLocationProgress {
  locationId: string;
  locationName: string;
  status: LocationServiceStatus;
  updatedAt?: string;
  notes?: string;
}

export interface ServiceProofPhoto {
  id: string;
  url: string;
  date: string;
  caption?: string;
  locationId?: string;
  locationName?: string;
  uploadedBy?: string;
}

export interface ConstructionService {
  id: string;
  companyId: string;
  workId: string;
  floorId: string;
  floorName: string;
  area: string; // Fundação, Estrutura, Alvenaria, Elétrica, etc.
  name: string;
  status: ServiceStatus;
  responsibleName: string;
  startDate: string;
  predictedEndDate: string;
  concludedDate?: string;
  notes?: string;
  eapServiceCode?: string;
  categoryCode?: string;
  categoryName?: string;
  checklist?: string[];
  isActive: boolean;
  assignedEmployees: {
    id: string;
    name: string;
    isOutsourced?: boolean;
    companyName?: string;
  }[];
  // Etapa 2: Apontamento Serviço x Local & Fotos de Comprovação
  locationProgress?: ServiceLocationProgress[];
  proofPhotos?: ServiceProofPhoto[];
}

export type OutsourcedEmployeeStatus = 'Ativo na obra' | 'Afastado' | 'Encerrado na obra';

export interface OutsourcedEmployee {
  id: string;
  name: string;
  functionName: string;
  status: OutsourcedEmployeeStatus;
  cpf?: string;
  phone?: string;
  notes?: string;
  admissionDate?: string;
}

export interface OutsourcedCompany {
  id: string;
  companyId: string;
  name: string;
  cnpj?: string;
  mainService: string;
  responsible: string;
  phone: string;
  notes?: string;
  isActive: boolean;
  employees: OutsourcedEmployee[];
}

export type TransferType = 'Definitiva' | 'Empréstimo';
export type TransferStatus = 
  | 'Pendente'
  | 'Em trânsito/Transferido'
  | 'Solicitação criada'
  | 'Respostas recebidas'
  | 'Material separado'
  | 'Transporte solicitado'
  | 'Enviado'
  | 'Recebido'
  | 'Encerrado';

export interface TransferRequest {
  id: string;
  companyId: string;
  type: TransferType;
  status: TransferStatus;
  originWorkId: string; // Obra de Origem (quem pede)
  originWorkName: string;
  destinationWorkId: string; // Obra de Destino (para quem pede)
  destinationWorkName: string;
  itemType?: 'Material' | 'Ferramenta' | 'EPI' | 'Equipamento / Outro' | string;
  materialName: string; // Nome do Insumo
  unit: string;
  requestedQuantity: number; // Quantidade Solicitada
  offeredQuantity: number;
  approvedQuantity?: number; // Quantidade Aprovada
  approvedItemType?: string;
  approvedItemName?: string;
  approvedAt?: string;
  approvedByUserName?: string;
  approvalNotes?: string;
  separatedQuantity?: number;
  sentQuantity?: number;
  receivedQuantity?: number;
  // Para empréstimos
  borrowedQuantity?: number;
  returnedQuantity?: number;
  pendingReturnQuantity?: number;
  requestedAt: string;
  sentAt?: string;
  receivedAt?: string;
  requestedByUserName: string;
  notes?: string;
  discrepancyNote?: string;
  // Logística Fracionada & Broadcast
  isBroadcast?: boolean;
  contributions?: FractionalContribution[];
  fulfilledQuantity?: number;
  deliveryAddress?: string;
  targetWarehouseManager?: string;
}

export interface FractionalContribution {
  id: string;
  requestId: string;
  supplyingWorkId: string;
  supplyingWorkName: string;
  supplyingWorkAddress: string;
  warehouseManagerName: string;
  warehouseManagerPhone?: string;
  quantity: number;
  contributedAt: string;
  contributedByUserName: string;
  notes?: string;
}

export interface MaterialDebtBalance {
  id: string;
  debtorWorkId: string;
  debtorWorkName: string;
  creditorWorkId: string;
  creditorWorkName: string;
  debtorId?: string;
  creditorId?: string;
  materialName: string;
  unit: string;
  balance: number;
  lastUpdatedAt: string;
}

export interface MaterialAccountTransaction {
  id: string;
  date: string;
  debtorWorkId: string;
  debtorWorkName: string;
  creditorWorkId: string;
  creditorWorkName: string;
  materialName: string;
  unit: string;
  quantity: number;
  type: 'NOVA_DIVIDA' | 'ABATIMENTO' | 'QUITACAO' | 'AJUSTE';
  previousBalance: number;
  newBalance: number;
  description: string;
  referenceRequestId?: string;
}

export interface OperationalAlert {
  id: string;
  companyId: string;
  type: 'critical_stock' | 'pending_transfer' | 'waiting_receipt' | 'halted_service';
  title: string;
  message: string;
  workId: string;
  timestamp: string;
  severity: 'high' | 'medium';
  actionTab?: string;
}
