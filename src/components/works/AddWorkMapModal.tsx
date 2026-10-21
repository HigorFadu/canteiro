import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { EAP_CATEGORIES, EAPServiceTemplate } from '../../eapTemplates';
import { Work, Floor, ConstructionService, WorkType, ServiceLocationProgress } from '../../types';
import { TreeNode } from '../tree/TreeNode';
import { buildTreeNodes, TreeNodeData } from '../../utils/treeUtils';
import {
  Building2,
  Home,
  Warehouse,
  Activity,
  Building,
  Wrench,
  TreePine,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Folder,
  FolderOpen,
  CheckCircle2,
  ListTree,
  Sparkles
} from 'lucide-react';

export type EnterpriseTypologyKey =
  | 'casa_residencial'
  | 'predio_residencial'
  | 'galpao'
  | 'hospital'
  | 'shopping'
  | 'predio_comercial'
  | 'reforma'
  | 'condominio';

export interface EnterpriseTypologyConfig {
  key: EnterpriseTypologyKey;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  workTypeMapping: WorkType;
  defaultIntervention: 'Construção do Zero (Desde a Fundação)' | 'Reforma / Retrofit';
}

// 7 Tipologias com renderização condicional avançada
export const ENTERPRISE_TYPOLOGIES: EnterpriseTypologyConfig[] = [
  {
    key: 'predio_residencial',
    label: 'Prédio Residencial',
    description: 'Torres e edifícios verticais de apartamentos.',
    icon: Building2,
    workTypeMapping: 'Residencial',
    defaultIntervention: 'Construção do Zero (Desde a Fundação)',
  },
  {
    key: 'casa_residencial',
    label: 'Casa Residencial',
    description: 'Casas térreas, sobrados e residências unifamiliares.',
    icon: Home,
    workTypeMapping: 'Residencial',
    defaultIntervention: 'Construção do Zero (Desde a Fundação)',
  },
  {
    key: 'condominio',
    label: 'Condomínio / Loteamento',
    description: 'Condomínios fechados horizontais, loteamentos e infraestrutura.',
    icon: TreePine,
    workTypeMapping: 'Infraestrutura',
    defaultIntervention: 'Construção do Zero (Desde a Fundação)',
  },
  {
    key: 'hospital',
    label: 'Hospital / Unidade de Saúde',
    description: 'Hospitais gerais, clínicas, UTIs e unidades de pronto-atendimento.',
    icon: Activity,
    workTypeMapping: 'Comercial',
    defaultIntervention: 'Construção do Zero (Desde a Fundação)',
  },
  {
    key: 'shopping',
    label: 'Prédio Comercial / Shopping',
    description: 'Complexos comerciais, pisos de lojas (mall), cinemas e salas corporativas.',
    icon: Building,
    workTypeMapping: 'Comercial',
    defaultIntervention: 'Construção do Zero (Desde a Fundação)',
  },
  {
    key: 'galpao',
    label: 'Galpão Logístico / Industrial',
    description: 'Centros logísticos, indústrias, naves e baterias de docas.',
    icon: Warehouse,
    workTypeMapping: 'Industrial',
    defaultIntervention: 'Construção do Zero (Desde a Fundação)',
  },
  {
    key: 'reforma',
    label: 'Reforma / Retrofit',
    description: 'Reformas corporativas, retrofits de edifícios, demolição e repaginação.',
    icon: Wrench,
    workTypeMapping: 'Reforma',
    defaultIntervention: 'Reforma / Retrofit',
  },
];

export interface StructuredPhysicalEnvironment {
  id: string;
  name: string;
  level: number;
  type: string;
}

export interface EnvTreeNode {
  id: string;
  part: string;
  fullPath: string;
  level: number;
  isLeaf: boolean;
  children: EnvTreeNode[];
  originalEnv?: StructuredPhysicalEnvironment;
  totalLeavesCount: number;
}

// ---------------------------------------------------------------------------
// Componentes Utilitários de Alta Fidelidade para o Passo 2
// ---------------------------------------------------------------------------
interface NumericFieldProps {
  id: string;
  label: string;
  subtitle?: string;
  value: number;
  min?: number;
  max?: number;
  onChange: (val: number) => void;
}

const NumericField: React.FC<NumericFieldProps> = ({
  id,
  label,
  subtitle,
  value,
  min = 0,
  max = 999,
  onChange,
}) => (
  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3">
    <div className="min-w-0 pr-2">
      <label htmlFor={id} className="block text-xs font-bold text-white truncate">
        {label}
      </label>
      {subtitle && (
        <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
          {subtitle}
        </p>
      )}
    </div>
    <div className="flex items-center gap-1.5 shrink-0">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-black text-sm flex items-center justify-center transition-colors cursor-pointer"
      >
        -
      </button>
      <input
        id={id}
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Math.max(min, Math.min(max, parseInt(e.target.value) || min)))}
        className="w-14 text-center py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs font-bold font-mono text-white focus:outline-none focus:border-[var(--btn-primary)] appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-black text-sm flex items-center justify-center transition-colors cursor-pointer"
      >
        +
      </button>
    </div>
  </div>
);

interface RoomNumericFieldProps {
  id: string;
  label: string;
  subtitle?: string;
  value: number;
  min?: number;
  max?: number;
  onChange: (val: number) => void;
}

const RoomNumericField: React.FC<RoomNumericFieldProps> = ({
  id,
  label,
  subtitle,
  value,
  min = 0,
  max = 20,
  onChange,
}) => (
  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between gap-2.5 shadow-sm">
    <div>
      <label htmlFor={id} className="block text-xs font-bold text-white">
        {label}
      </label>
      {subtitle && (
        <span className="block text-[10px] text-slate-400 leading-tight mt-0.5">
          {subtitle}
        </span>
      )}
    </div>
    <div className="flex items-center justify-between gap-1.5 pt-1.5 border-t border-slate-800">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm flex items-center justify-center transition-colors cursor-pointer shrink-0"
        title={`Diminuir ${label}`}
      >
        -
      </button>
      <input
        id={id}
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Math.max(min, Math.min(max, parseInt(e.target.value) || min)))}
        className="w-full min-w-0 text-center py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs font-bold font-mono text-white focus:outline-none focus:border-[var(--btn-primary)] appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm flex items-center justify-center transition-colors cursor-pointer shrink-0"
        title={`Aumentar ${label}`}
      >
        +
      </button>
    </div>
  </div>
);

interface CheckboxFieldProps {
  id: string;
  label: string;
  subtitle?: string;
  checked: boolean;
  onChange: (val: boolean) => void;
}

const CheckboxField: React.FC<CheckboxFieldProps> = ({
  id,
  label,
  subtitle,
  checked,
  onChange,
}) => (
  <label
    htmlFor={id}
    className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
      checked
        ? 'bg-slate-900 border-[var(--btn-primary)]/50 ring-1 ring-[var(--btn-primary)]/30'
        : 'bg-slate-900/60 border-slate-800 opacity-70'
    }`}
  >
    <div className="min-w-0 pr-2">
      <span className="text-xs font-bold text-white block truncate">
        {label}
      </span>
      {subtitle && (
        <span className="text-[11px] text-slate-400 block mt-0.5 line-clamp-1">
          {subtitle}
        </span>
      )}
    </div>
    <input
      id={id}
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className="w-5 h-5 rounded border-slate-700 accent-[var(--btn-primary)] cursor-pointer shrink-0"
    />
  </label>
);

interface AddWorkMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  workToEdit?: Work | null;
  onSaved?: (savedWork: Work) => void;
}

export const AddWorkMapModal: React.FC<AddWorkMapModalProps> = ({
  isOpen,
  onClose,
  workToEdit,
  onSaved,
}) => {
  const { createWork, editWork, saveWorkMapStructure, showToast } = useApp();

  // 1 = Tipologia, 2 = Gerador Rápido, 3 = Árvore de Locais
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Passo 1: Tipologia e Dados da Obra
  const [selectedTypologyKey, setSelectedTypologyKey] = useState<EnterpriseTypologyKey>('predio_residencial');
  const [workName, setWorkName] = useState('');
  const [workCode, setWorkCode] = useState('');
  const [workAddress, setWorkAddress] = useState('');
  const [workCity, setWorkCity] = useState('Rio de Janeiro');
  const [workState, setWorkState] = useState('RJ');
  const [interventionType, setInterventionType] = useState<
    'Construção do Zero (Desde a Fundação)' | 'Reforma / Retrofit'
  >('Construção do Zero (Desde a Fundação)');

  const activeTypology = useMemo(
    () => ENTERPRISE_TYPOLOGIES.find((t) => t.key === selectedTypologyKey) || ENTERPRISE_TYPOLOGIES[0],
    [selectedTypologyKey]
  );

  // Identificação e flags estritas da tipologia ativa
  const tipologia = activeTypology.label;

  const isCasaOuSobrado =
    tipologia === 'Casa Residencial' ||
    tipologia === 'Sobrado' ||
    tipologia === 'Casa Residencial / Sobrado' ||
    selectedTypologyKey === 'casa_residencial';

  const isSobrado = tipologia === 'Sobrado' || tipologia.toLowerCase().includes('sobrado');

  const isPredioResidencial =
    tipologia === 'Prédio Residencial' ||
    selectedTypologyKey === 'predio_residencial';

  const isCondominioLoteamento =
    tipologia === 'Condomínio / Loteamento' ||
    tipologia === 'Condomínio' ||
    selectedTypologyKey === 'condominio';

  const isHospitalSaude =
    tipologia === 'Hospital / Unidade de Saúde' ||
    selectedTypologyKey === 'hospital';

  const isPredioComercialShopping =
    tipologia === 'Prédio Comercial / Shopping' ||
    tipologia === 'Shopping Center / Comercial' ||
    selectedTypologyKey === 'shopping' ||
    selectedTypologyKey === 'predio_comercial';

  const isGalpaoLogistico =
    tipologia === 'Galpão Logístico / Industrial' ||
    selectedTypologyKey === 'galpao';

  // 1. REGRA DE TIPOLOGIA PARA SHAFT E ESCADA:
  // Defina uma constante isVerticalBuilding que só é verdadeira para: Prédios/Edifícios (Residencial/Comercial), Shoppings, Hospitais ou Hotéis.
  // Para Casa, Sobrado, Galpão, Loteamento/Quadras ou Infraestrutura: isVerticalBuilding DEVE ser false.
  const isNonVerticalTypology =
    isCasaOuSobrado ||
    isCondominioLoteamento ||
    isGalpaoLogistico ||
    tipologia.toLowerCase().includes('casa') ||
    tipologia.toLowerCase().includes('sobrado') ||
    tipologia.toLowerCase().includes('galpão') ||
    tipologia.toLowerCase().includes('galpao') ||
    tipologia.toLowerCase().includes('loteamento') ||
    tipologia.toLowerCase().includes('quadra') ||
    tipologia.toLowerCase().includes('infraestrutura');

  const isVerticalBuilding =
    !isNonVerticalTypology &&
    (isPredioResidencial ||
      isPredioComercialShopping ||
      isHospitalSaude ||
      tipologia.toLowerCase().includes('prédio') ||
      tipologia.toLowerCase().includes('predio') ||
      tipologia.toLowerCase().includes('edifício') ||
      tipologia.toLowerCase().includes('edificio') ||
      tipologia.toLowerCase().includes('shopping') ||
      tipologia.toLowerCase().includes('hospital') ||
      tipologia.toLowerCase().includes('hotel'));

  // -------------------------------------------------------------------------
  // PASSO 2: CONTROLES DE ESTADO CONDICIONAIS POR TIPOLOGIA
  // -------------------------------------------------------------------------

  // 1. 'Casa Residencial' ou 'Sobrado'
  // Inputs: Quartos, Suítes, Salas, Cozinhas, Banheiros, Vagas de Garagem.
  // Checkboxes: Área Gourmet, Piscina, Quintal/Jardim.
  const [houseBedrooms, setHouseBedrooms] = useState<number>(3);
  const [houseSuites, setHouseSuites] = useState<number>(1);
  const [houseLivingRooms, setHouseLivingRooms] = useState<number>(2);
  const [houseKitchens, setHouseKitchens] = useState<number>(1);
  const [houseBathrooms, setHouseBathrooms] = useState<number>(2);
  const [houseLavabos, setHouseLavabos] = useState<number>(1);
  const [houseGarageSpots, setHouseGarageSpots] = useState<number>(2);
  const [hasHouseGourmetArea, setHasHouseGourmetArea] = useState<boolean>(true);
  const [hasHousePool, setHasHousePool] = useState<boolean>(true);
  const [hasHouseBackyardGarden, setHasHouseBackyardGarden] = useState<boolean>(true);
  const [hasHouseElevatorShaft, setHasHouseElevatorShaft] = useState<boolean>(true);
  const [hasHouseStairs, setHasHouseStairs] = useState<boolean>(true);
  const [hasTechnicalArea, setHasTechnicalArea] = useState<boolean>(true);
  const [hasBuildingStairs, setHasBuildingStairs] = useState<boolean>(true);
  const [hasBuildingShaft, setHasBuildingShaft] = useState<boolean>(true);
  const [technicalAreaCount, setTechnicalAreaCount] = useState<number>(1);
  const [hasFloorTechnicalArea, setHasFloorTechnicalArea] = useState<boolean>(true);
  const [hasAptTechnicalArea, setHasAptTechnicalArea] = useState<boolean>(true);

  // 2. 'Prédio Residencial'
  // Inputs: Subsolos, Garagens (G1, G2...), Andares Tipo, Aptos por Andar.
  // Cômodos por Apartamento: Quartos, Suítes, Salas, Cozinhas, Banheiros, Lavanderias, Lavabos.
  // Checkboxes: Térreo/Recepção, Lazer/Mezanino, Cobertura/Duplex, Casa de Máquinas, Barrilete, Reservatório Superior, Poço de Elevador.
  const [subsolosCount, setSubsolosCount] = useState<number>(1);
  const [garagesCount, setGaragesCount] = useState<number>(2);
  const [typicalFloors, setTypicalFloors] = useState<number>(10);
  const [aptsPerFloor, setAptsPerFloor] = useState<number>(4);
  const [buildingBedroomsPerApt, setBuildingBedroomsPerApt] = useState<number>(2);
  const [buildingSuitesPerApt, setBuildingSuitesPerApt] = useState<number>(1);
  const [buildingLivingRoomsPerApt, setBuildingLivingRoomsPerApt] = useState<number>(1);
  const [buildingKitchensPerApt, setBuildingKitchensPerApt] = useState<number>(1);
  const [buildingBathroomsPerApt, setBuildingBathroomsPerApt] = useState<number>(1);
  const [buildingLavabosPerApt, setBuildingLavabosPerApt] = useState<number>(1);
  const [buildingLaundryPerApt, setBuildingLaundryPerApt] = useState<number>(1);
  const [hasGroundHall, setHasGroundHall] = useState<boolean>(true);
  const [hasLeisureMezzanine, setHasLeisureMezzanine] = useState<boolean>(true);
  const [hasPenthouse, setHasPenthouse] = useState<boolean>(true);
  const [hasMachineRoom, setHasMachineRoom] = useState<boolean>(true);
  const [hasTechnicalFloor, setHasTechnicalFloor] = useState<boolean>(true);
  const [hasUpperReservoir, setHasUpperReservoir] = useState<boolean>(true);
  const [hasBuildingElevatorShaft, setHasBuildingElevatorShaft] = useState<boolean>(true);

  // 3. 'Condomínio / Loteamento'
  // Inputs Territoriais: Quadras, Lotes por Quadra, Praças.
  // Unidades Habitacionais (Construção Civil): Casas Populares / Padrão, Sobrados / Geminadas, Mansões / Alto Padrão.
  // Cômodos por Unidade Habitacional: Quartos, Suítes, Salas, Cozinhas, Banheiros, Lavanderias, Lavabos.
  // Checkboxes: Portaria Principal, Portaria de Serviço, Clube Social, ETE, Poço de Elevador.
  const [condoBlocksCount, setCondoBlocksCount] = useState<number>(3);
  const [condoLotsPerBlock, setCondoLotsPerBlock] = useState<number>(20);
  const [condoSquaresCount, setCondoSquaresCount] = useState<number>(2);
  const [condoStandardHouses, setCondoStandardHouses] = useState<number>(0);
  const [condoTownhouses, setCondoTownhouses] = useState<number>(0);
  const [condoMansions, setCondoMansions] = useState<number>(0);
  const [condoBedroomsPerHouse, setCondoBedroomsPerHouse] = useState<number>(2);
  const [condoSuitesPerHouse, setCondoSuitesPerHouse] = useState<number>(1);
  const [condoLivingRoomsPerHouse, setCondoLivingRoomsPerHouse] = useState<number>(1);
  const [condoKitchensPerHouse, setCondoKitchensPerHouse] = useState<number>(1);
  const [condoBathroomsPerHouse, setCondoBathroomsPerHouse] = useState<number>(1);
  const [condoLavabosPerHouse, setCondoLavabosPerHouse] = useState<number>(1);
  const [condoLaundryPerHouse, setCondoLaundryPerHouse] = useState<number>(1);
  const [hasCondoMainGate, setHasCondoMainGate] = useState<boolean>(true);
  const [hasCondoServiceGate, setHasCondoServiceGate] = useState<boolean>(true);
  const [hasCondoSocialClub, setHasCondoSocialClub] = useState<boolean>(true);
  const [hasCondoEte, setHasCondoEte] = useState<boolean>(true);
  const [hasCondoElevatorShaft, setHasCondoElevatorShaft] = useState<boolean>(true);

  // 4. 'Hospital / Unidade de Saúde'
  // Inputs: Blocos/Alas, Andares, Consultórios por Andar, Salas Cirúrgicas, Leitos de UTI, Quartos de Internação por Andar, Suítes VIP/Isolamento, Lavabos.
  // Checkboxes: Pronto-Socorro, CME, Centro de Imagens, Casa de Gases, Poço de Elevador.
  const [hospitalBlocks, setHospitalBlocks] = useState<number>(2);
  const [hospitalFloors, setHospitalFloors] = useState<number>(4);
  const [hospitalConsultingRoomsPerFloor, setHospitalConsultingRoomsPerFloor] = useState<number>(3);
  const [hospitalSurgicalRooms, setHospitalSurgicalRooms] = useState<number>(4);
  const [hospitalUtiBeds, setHospitalUtiBeds] = useState<number>(10);
  const [hospitalInternmentRoomsPerFloor, setHospitalInternmentRoomsPerFloor] = useState<number>(6);
  const [hospitalVipSuites, setHospitalVipSuites] = useState<number>(2);
  const [hospitalLavabosPerFloor, setHospitalLavabosPerFloor] = useState<number>(2);
  const [hasHospitalEmergency, setHasHospitalEmergency] = useState<boolean>(true);
  const [hasHospitalCme, setHasHospitalCme] = useState<boolean>(true);
  const [hasHospitalImagingCenter, setHasHospitalImagingCenter] = useState<boolean>(true);
  const [hasHospitalGasHouse, setHasHospitalGasHouse] = useState<boolean>(true);
  const [hasHospitalElevatorShaft, setHasHospitalElevatorShaft] = useState<boolean>(true);

  // 5. 'Prédio Comercial / Shopping'
  // Inputs: Subsolos, Pisos de Lojas (Mall), Lojas Âncora, Lojas Satélite, Salas Comerciais, Lavabos.
  // Checkboxes: Praça de Alimentação, Cinemas, Docas, CAG, Poço de Elevador.
  const [commercialSubsolos, setCommercialSubsolos] = useState<number>(2);
  const [commercialMallFloors, setCommercialMallFloors] = useState<number>(3);
  const [commercialAnchorStores, setCommercialAnchorStores] = useState<number>(4);
  const [commercialSatelliteStores, setCommercialSatelliteStores] = useState<number>(30);
  const [commercialOfficeRooms, setCommercialOfficeRooms] = useState<number>(20);
  const [commercialLavabosPerFloor, setCommercialLavabosPerFloor] = useState<number>(4);
  const [hasCommercialFoodCourt, setHasCommercialFoodCourt] = useState<boolean>(true);
  const [hasCommercialCinemas, setHasCommercialCinemas] = useState<boolean>(true);
  const [hasCommercialDocks, setHasCommercialDocks] = useState<boolean>(true);
  const [hasCommercialCag, setHasCommercialCag] = useState<boolean>(true);
  const [hasCommercialElevatorShaft, setHasCommercialElevatorShaft] = useState<boolean>(true);

  // 6. 'Galpão Logístico / Industrial'
  // Inputs: Naves/Galpões, Baterias de Docas.
  // Checkboxes: Pátio de Manobras, Mezanino Administrativo, Refeitório, Portaria Blindada, Poço de Elevador.
  const [warehouseNaves, setWarehouseNaves] = useState<number>(2);
  const [warehouseDockBatteries, setWarehouseDockBatteries] = useState<number>(8);
  const [hasWarehouseManeuverYard, setHasWarehouseManeuverYard] = useState<boolean>(true);
  const [hasWarehouseAdminMezzanine, setHasWarehouseAdminMezzanine] = useState<boolean>(true);
  const [hasWarehouseRefectory, setHasWarehouseRefectory] = useState<boolean>(true);
  const [hasWarehouseArmoredGate, setHasWarehouseArmoredGate] = useState<boolean>(true);
  const [hasWarehouseElevatorShaft, setHasWarehouseElevatorShaft] = useState<boolean>(true);

  // Passo 3: Árvore de Locais
  const [environments, setEnvironments] = useState<StructuredPhysicalEnvironment[]>([]);
  const [isAddingManual, setIsAddingManual] = useState<boolean>(false);
  const [manualName, setManualName] = useState('');
  const [manualType, setManualType] = useState('Área Geral');
  const [manualLevel, setManualLevel] = useState<number>(1);

  const [editingEnvId, setEditingEnvId] = useState<string | null>(null);
  const [editingEnvName, setEditingEnvName] = useState('');
  const [searchEnvFilter, setSearchEnvFilter] = useState('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [expandedTreeNodes, setExpandedTreeNodes] = useState<Record<string, boolean>>({});

  // Sincroniza dados ao abrir ou editar
  useEffect(() => {
    if (!isOpen) return;

    if (workToEdit) {
      setWorkName(workToEdit.name || '');
      setWorkCode(workToEdit.code || '');
      setWorkAddress(workToEdit.address || '');
      setWorkCity(workToEdit.city || 'Rio de Janeiro');
      setWorkState(workToEdit.state || 'RJ');
      setInterventionType(workToEdit.interventionType || 'Construção do Zero (Desde a Fundação)');

      const matched = ENTERPRISE_TYPOLOGIES.find(
        (t) =>
          t.label.toLowerCase() === workToEdit.typology?.toLowerCase() ||
          t.key === workToEdit.typology
      );
      setSelectedTypologyKey(matched ? matched.key : 'predio_residencial');

      if (workToEdit.floors && workToEdit.floors.length > 0) {
        setEnvironments(
          workToEdit.floors.map((f, i) => ({
            id: f.id,
            name: f.name,
            level: f.level ?? i,
            type: 'Pavimento/Ambiente',
          }))
        );
      }
    } else {
      setWorkName('');
      setWorkCode(`OBR-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 90) + 10)}`);
      setWorkAddress('');
      setWorkCity('Rio de Janeiro');
      setWorkState('RJ');
      setSelectedTypologyKey('predio_residencial');
      setInterventionType('Construção do Zero (Desde a Fundação)');

      // Reseta prédios
      setSubsolosCount(1);
      setGaragesCount(2);
      setTypicalFloors(10);
      setAptsPerFloor(4);
      setBuildingBedroomsPerApt(2);
      setBuildingSuitesPerApt(1);
      setBuildingLivingRoomsPerApt(1);
      setBuildingKitchensPerApt(1);
      setBuildingBathroomsPerApt(1);
      setBuildingLaundryPerApt(1);
      setHasGroundHall(true);
      setHasLeisureMezzanine(true);
      setHasPenthouse(true);
      setHasMachineRoom(true);
      setHasTechnicalFloor(true);
      setHasUpperReservoir(true);
      setHasBuildingElevatorShaft(true);

      // Reseta casas
      setHouseBedrooms(3);
      setHouseSuites(1);
      setHouseLivingRooms(2);
      setHouseKitchens(1);
      setHouseBathrooms(2);
      setHouseGarageSpots(2);
      setHasHouseGourmetArea(true);
      setHasHousePool(true);
      setHasHouseBackyardGarden(true);
      setHasHouseElevatorShaft(true);

      // Reseta condomínio
      setCondoBlocksCount(3);
      setCondoLotsPerBlock(20);
      setCondoSquaresCount(2);
      setCondoStandardHouses(0);
      setCondoTownhouses(0);
      setCondoMansions(0);
      setCondoBedroomsPerHouse(2);
      setCondoSuitesPerHouse(1);
      setCondoLivingRoomsPerHouse(1);
      setCondoKitchensPerHouse(1);
      setCondoBathroomsPerHouse(1);
      setCondoLaundryPerHouse(1);
      setHasCondoMainGate(true);
      setHasCondoServiceGate(true);
      setHasCondoSocialClub(true);
      setHasCondoEte(true);
      setHasCondoElevatorShaft(true);

      // Reseta hospital
      setHospitalBlocks(2);
      setHospitalFloors(4);
      setHospitalConsultingRoomsPerFloor(3);
      setHospitalSurgicalRooms(4);
      setHospitalUtiBeds(10);
      setHospitalInternmentRoomsPerFloor(6);
      setHospitalVipSuites(2);
      setHasHospitalEmergency(true);
      setHasHospitalCme(true);
      setHasHospitalImagingCenter(true);
      setHasHospitalGasHouse(true);
      setHasHospitalElevatorShaft(true);

      // Reseta shopping
      setCommercialSubsolos(2);
      setCommercialMallFloors(3);
      setCommercialAnchorStores(4);
      setCommercialSatelliteStores(30);
      setCommercialOfficeRooms(20);
      setHasCommercialFoodCourt(true);
      setHasCommercialCinemas(true);
      setHasCommercialDocks(true);
      setHasCommercialCag(true);
      setHasCommercialElevatorShaft(true);

      // Reseta galpão
      setWarehouseNaves(2);
      setWarehouseDockBatteries(8);
      setHasWarehouseManeuverYard(true);
      setHasWarehouseAdminMezzanine(true);
      setHasWarehouseRefectory(true);
      setHasWarehouseArmoredGate(true);
      setHasWarehouseElevatorShaft(true);

      setEnvironments([]);
    }

    setCurrentStep(1);
    setIsAddingManual(false);
    setEditingEnvId(null);
  }, [isOpen, workToEdit]);

  // Geração estrita da lista de ambientes baseada na tipologia selecionada
  const generateEnvironmentsFromInputs = (): StructuredPhysicalEnvironment[] => {
    const list: StructuredPhysicalEnvironment[] = [];
    const timestamp = Date.now();

    // Aliases e variáveis dinâmicas universais (Obrigatório e Dinâmico)
    const hasShaft = hasBuildingShaft;
    const hasEscada = hasBuildingStairs;
    const areaTecnica = technicalAreaCount;

    // -------------------------------------------------------------------------
    // 1. 'CASA RESIDENCIAL' OU 'SOBRADO'
    // -------------------------------------------------------------------------
    if (isCasaOuSobrado) {
      let houseLevel = 1;
      const nomeNivel = 'Casa';

      // Checkboxes (Áreas de Convivência e Lazer)
      if (hasHouseGourmetArea) {
        list.push({
          id: `env-${timestamp}-gourmet`,
          name: 'Área Gourmet',
          level: 0.5,
          type: 'Lazer & Convivência',
        });
      }

      if (hasHousePool) {
        list.push({
          id: `env-${timestamp}-piscina`,
          name: 'Piscina',
          level: 0.5,
          type: 'Lazer & Recreação',
        });
      }

      if (hasHouseBackyardGarden) {
        list.push({
          id: `env-${timestamp}-quintal-jardim`,
          name: 'Quintal / Jardim',
          level: 0.5,
          type: 'Área Externa',
        });
      }

      if (hasHouseElevatorShaft) {
        list.push({
          id: `env-${timestamp}-poco-elevador`,
          name: 'Poço de Elevador',
          level: 0,
          type: 'Instalações Técnicas / Circulação Vertical',
        });
      }

      // Vagas de Garagem
      if (houseGarageSpots > 0) {
        list.push({
          id: `env-${timestamp}-vagas-garagem`,
          name: houseGarageSpots === 1 ? 'Vaga de Garagem' : `Garagem (${houseGarageSpots} Vagas)`,
          level: 0,
          type: 'Garagem / Estacionamento',
        });
      }

      // Salas
      for (let s = 1; s <= houseLivingRooms; s++) {
        list.push({
          id: `env-${timestamp}-sala-${s}`,
          name: houseLivingRooms === 1 ? 'Sala de Estar / Jantar' : `Sala ${s}`,
          level: houseLevel++,
          type: 'Área Social',
        });
      }

      // Cozinhas
      for (let k = 1; k <= houseKitchens; k++) {
        list.push({
          id: `env-${timestamp}-coz-${k}`,
          name: houseKitchens === 1 ? 'Cozinha' : `Cozinha ${k}`,
          level: houseLevel++,
          type: 'Área Molhada',
        });
      }

      // Suítes
      for (let st = 1; st <= houseSuites; st++) {
        list.push({
          id: `env-${timestamp}-suite-${st}`,
          name: houseSuites === 1 ? 'Suíte Master' : `Suíte ${st}`,
          level: houseLevel++,
          type: 'Quarto / Suíte',
        });
      }

      // Quartos
      for (let q = 1; q <= houseBedrooms; q++) {
        list.push({
          id: `env-${timestamp}-quarto-${q}`,
          name: houseBedrooms === 1 ? 'Quarto' : `Quarto ${q}`,
          level: houseLevel++,
          type: 'Quarto',
        });
      }

      // Banheiros
      for (let b = 1; b <= houseBathrooms; b++) {
        list.push({
          id: `env-${timestamp}-banh-${b}`,
          name: houseBathrooms === 1 ? 'Banheiro Social' : `Banheiro ${b}`,
          level: houseLevel++,
          type: 'Área Molhada',
        });
      }

      // Lavabos
      if (houseLavabos > 0) {
        for (let l = 1; l <= houseLavabos; l++) {
          list.push({
            id: `env-${timestamp}-lavabo-${l}`,
            name: houseLavabos === 1 ? 'Lavabo' : `Lavabo ${l}`,
            level: houseLevel++,
            type: 'Área Molhada / Lavabo',
          });
        }
      }

      // Lógica de Cômodo: Dentro do laço/loop que gera os ambientes da unidade, insira a concatenação da Área Técnica
      if (areaTecnica > 0) {
        list.push({
          id: `env-${timestamp}-casa-area-tecnica`,
          name: `${nomeNivel} - Área Técnica`,
          level: houseLevel++,
          type: 'Instalações Técnicas / Área Técnica',
        });
      }

      // Em Sobrado, 'Escada' é apenas um cômodo único opcional da casa, nunca repetido por andar
      if (isSobrado && hasHouseStairs) {
        list.push({
          id: `env-${timestamp}-sobrado-escada`,
          name: 'Escada',
          level: houseLevel++,
          type: 'Circulação / Escada',
        });
      }

      // PROIBIDO concatenar 'Shaft' e 'Escada' em Quadras, Lotes, Casas ou Galpões.
      // Eles só devem ser injetados nos pavimentos se isVerticalBuilding === true.
      if (isVerticalBuilding && hasShaft) {
        list.push({
          id: `env-${timestamp}-casa-shaft`,
          name: `${nomeNivel} - Shaft`,
          level: houseLevel++,
          type: 'Instalações Técnicas / Shaft',
        });
      }
      if (isVerticalBuilding && hasEscada) {
        list.push({
          id: `env-${timestamp}-casa-escada`,
          name: `${nomeNivel} - Escada`,
          level: houseLevel++,
          type: 'Circulação Vertical / Escadas',
        });
      }
    }
    // -------------------------------------------------------------------------
    // 2. 'PRÉDIO RESIDENCIAL'
    // -------------------------------------------------------------------------
    else if (isPredioResidencial) {
      // 1. Subsolos (Níveis Raiz independentes: Subsolo 1, Subsolo 2...)
      if (subsolosCount > 0) {
        for (let i = 1; i <= subsolosCount; i++) {
          const variavelDoPavimentoAtual = `Subsolo ${i}`;
          list.push({
            id: `env-${timestamp}-subsolo-${i}`,
            name: variavelDoPavimentoAtual,
            level: -i,
            type: 'Subsolo',
          });
          if (isVerticalBuilding && hasShaft) list.push({ id: `env-${timestamp}-subsolo-${i}-shaft`, name: `${variavelDoPavimentoAtual} - Shaft`, level: -i, type: 'Instalações Técnicas / Shaft' });
          if (isVerticalBuilding && hasEscada) list.push({ id: `env-${timestamp}-subsolo-${i}-escada`, name: `${variavelDoPavimentoAtual} - Escada`, level: -i, type: 'Circulação Vertical / Escadas' });
        }
      }

      // 2. Garagens (Níveis Raiz independentes: G1, G2, G3...)
      if (garagesCount > 0) {
        for (let i = 1; i <= garagesCount; i++) {
          const variavelDoPavimentoAtual = `G${i}`;
          list.push({
            id: `env-${timestamp}-g${i}`,
            name: variavelDoPavimentoAtual,
            level: -(garagesCount - i + 1),
            type: 'Garagem',
          });
          if (isVerticalBuilding && hasShaft) list.push({ id: `env-${timestamp}-g${i}-shaft`, name: `${variavelDoPavimentoAtual} - Shaft`, level: -(garagesCount - i + 1), type: 'Instalações Técnicas / Shaft' });
          if (isVerticalBuilding && hasEscada) list.push({ id: `env-${timestamp}-g${i}-escada`, name: `${variavelDoPavimentoAtual} - Escada`, level: -(garagesCount - i + 1), type: 'Circulação Vertical / Escadas' });
        }
      }

      // 3. Térreo (Nível Raiz independente: Térreo)
      if (hasGroundHall) {
        const variavelDoPavimentoAtual = 'Térreo';
        list.push({
          id: `env-${timestamp}-terreo`,
          name: variavelDoPavimentoAtual,
          level: 0,
          type: 'Acesso / Térreo',
        });
        if (isVerticalBuilding && hasShaft) list.push({ id: `env-${timestamp}-terreo-shaft`, name: `${variavelDoPavimentoAtual} - Shaft`, level: 0, type: 'Instalações Técnicas / Shaft' });
        if (isVerticalBuilding && hasEscada) list.push({ id: `env-${timestamp}-terreo-escada`, name: `${variavelDoPavimentoAtual} - Escada`, level: 0, type: 'Circulação Vertical / Escadas' });
      }

      // 4. Lazer / Mezanino
      if (hasLeisureMezzanine) {
        const variavelDoPavimentoAtual = 'Lazer / Mezanino';
        list.push({
          id: `env-${timestamp}-lazer-mezanino`,
          name: variavelDoPavimentoAtual,
          level: 0.5,
          type: 'Área Comum / Lazer',
        });
        if (hasShaft) list.push({ id: `env-${timestamp}-lazer-shaft`, name: `${variavelDoPavimentoAtual} - Shaft`, level: 0.5, type: 'Instalações Técnicas / Shaft' });
        if (hasEscada) list.push({ id: `env-${timestamp}-lazer-escada`, name: `${variavelDoPavimentoAtual} - Escada`, level: 0.5, type: 'Circulação Vertical / Escadas' });
      }

      // 5. Andares Tipo com sub-loop de Aptos por Andar e terceiro nível de Cômodos por Apto (Loop Triplo)
      let pLevel = 1;
      for (let f = 1; f <= typicalFloors; f++) {
        const nomeAndar = `${f}º Andar`;
        const nomeNivel = nomeAndar;

        if (aptsPerFloor <= 0) {
          list.push({
            id: `env-${timestamp}-tipo-${f}`,
            name: `${nomeAndar} Tipo`,
            level: pLevel++,
            type: 'Pavimento Tipo',
          });
        } else {
          for (let a = 1; a <= aptsPerFloor; a++) {
            const aptCode = aptsPerFloor < 10 ? `${f}${a}` : `${f}${String(a).padStart(2, '0')}`;
            const nomeUnidade = `Apto ${aptCode}`;
            const prefixoUnidade = `${nomeAndar} - ${nomeUnidade}`;

            const hasRooms =
              buildingLivingRoomsPerApt > 0 ||
              buildingSuitesPerApt > 0 ||
              buildingBedroomsPerApt > 0 ||
              buildingKitchensPerApt > 0 ||
              buildingBathroomsPerApt > 0 ||
              buildingLaundryPerApt > 0 ||
              buildingLavabosPerApt > 0 ||
              areaTecnica > 0;

            if (!hasRooms) {
              list.push({
                id: `env-${timestamp}-tipo-${f}-apto-${a}`,
                name: prefixoUnidade,
                level: pLevel++,
                type: 'Apartamento',
              });
            } else {
              // Salas
              for (let s = 1; s <= buildingLivingRoomsPerApt; s++) {
                list.push({
                  id: `env-${timestamp}-tipo-${f}-apto-${a}-sala-${s}`,
                  name: buildingLivingRoomsPerApt === 1 ? `${prefixoUnidade} - Sala` : `${prefixoUnidade} - Sala ${s}`,
                  level: pLevel++,
                  type: 'Apartamento / Sala',
                });
              }

              // Suítes
              for (let st = 1; st <= buildingSuitesPerApt; st++) {
                list.push({
                  id: `env-${timestamp}-tipo-${f}-apto-${a}-suite-${st}`,
                  name: `${prefixoUnidade} - Suíte ${st}`,
                  level: pLevel++,
                  type: 'Apartamento / Suíte',
                });
              }

              // Quartos
              for (let q = 1; q <= buildingBedroomsPerApt; q++) {
                list.push({
                  id: `env-${timestamp}-tipo-${f}-apto-${a}-quarto-${q}`,
                  name: buildingBedroomsPerApt === 1 ? `${prefixoUnidade} - Quarto` : `${prefixoUnidade} - Quarto ${q}`,
                  level: pLevel++,
                  type: 'Apartamento / Quarto',
                });
              }

              // Cozinhas
              for (let k = 1; k <= buildingKitchensPerApt; k++) {
                list.push({
                  id: `env-${timestamp}-tipo-${f}-apto-${a}-coz-${k}`,
                  name: buildingKitchensPerApt === 1 ? `${prefixoUnidade} - Cozinha` : `${prefixoUnidade} - Cozinha ${k}`,
                  level: pLevel++,
                  type: 'Apartamento / Cozinha',
                });
              }

              // Banheiros
              for (let b = 1; b <= buildingBathroomsPerApt; b++) {
                list.push({
                  id: `env-${timestamp}-tipo-${f}-apto-${a}-banh-${b}`,
                  name: buildingBathroomsPerApt === 1 ? `${prefixoUnidade} - Banheiro` : `${prefixoUnidade} - Banheiro ${b}`,
                  level: pLevel++,
                  type: 'Apartamento / Banheiro',
                });
              }

              // Lavanderias
              for (let l = 1; l <= buildingLaundryPerApt; l++) {
                list.push({
                  id: `env-${timestamp}-tipo-${f}-apto-${a}-lav-${l}`,
                  name: buildingLaundryPerApt === 1 ? `${prefixoUnidade} - Lavanderia` : `${prefixoUnidade} - Lavanderia ${l}`,
                  level: pLevel++,
                  type: 'Apartamento / Lavanderia',
                });
              }

              // Lavabos
              for (let l = 1; l <= buildingLavabosPerApt; l++) {
                list.push({
                  id: `env-${timestamp}-tipo-${f}-apto-${a}-lavabo-${l}`,
                  name: buildingLavabosPerApt === 1 ? `${prefixoUnidade} - Lavabo` : `${prefixoUnidade} - Lavabo ${l}`,
                  level: pLevel++,
                  type: 'Apartamento / Lavabo',
                });
              }

              // Lógica de Cômodo: Dentro do laço/loop que gera os ambientes da unidade (Apto, Consultório, etc.), insira a concatenação da Área Técnica (Ex: ${nomeAndar} - ${nomeUnidade} - Área Técnica)
              if (areaTecnica > 0) {
                list.push({
                  id: `env-${timestamp}-tipo-${f}-apto-${a}-area-tecnica`,
                  name: `${nomeAndar} - ${nomeUnidade} - Área Técnica`,
                  level: pLevel++,
                  type: 'Apartamento / Área Técnica',
                });
              }
            }
          }
        }

        // Lógica de Pavimento: No final de qualquer laço que crie um nível raiz, insira:
        if (isVerticalBuilding && hasShaft) {
          list.push({
            id: `env-${timestamp}-andar-${f}-shaft`,
            name: `${nomeNivel} - Shaft`,
            level: pLevel++,
            type: 'Instalações Técnicas / Shaft',
          });
        }
        if (isVerticalBuilding && hasEscada) {
          list.push({
            id: `env-${timestamp}-andar-${f}-escada`,
            name: `${nomeNivel} - Escada`,
            level: pLevel++,
            type: 'Circulação Vertical / Escadas',
          });
        }
      }

      // 6. Cobertura / Duplex
      if (hasPenthouse) {
        const nomeNivel = 'Cobertura';
        list.push({
          id: `env-${timestamp}-cobertura-duplex`,
          name: `${nomeNivel} / Duplex`,
          level: typicalFloors + 1,
          type: 'Cobertura',
        });
        if (isVerticalBuilding && hasShaft) {
          list.push({
            id: `env-${timestamp}-cobertura-shaft`,
            name: `${nomeNivel} - Shaft`,
            level: typicalFloors + 1,
            type: 'Instalações Técnicas / Shaft',
          });
        }
        if (isVerticalBuilding && hasEscada) {
          list.push({
            id: `env-${timestamp}-cobertura-escada`,
            name: `${nomeNivel} - Escada`,
            level: typicalFloors + 1,
            type: 'Circulação Vertical / Escadas',
          });
        }
      }

      // 7. Instalações Técnicas (Níveis Raiz Independentes: Barrilete, Casa de Máquinas, Reservatório)
      let topLevel = typicalFloors + (hasPenthouse ? 2 : 1);
      if (hasTechnicalFloor) {
        list.push({
          id: `env-${timestamp}-barrilete`,
          name: 'Barrilete',
          level: topLevel++,
          type: 'Área Técnica',
        });
      }
      if (hasMachineRoom) {
        list.push({
          id: `env-${timestamp}-casa-maquinas`,
          name: 'Casa de Máquinas',
          level: topLevel++,
          type: 'Área Técnica',
        });
      }
      if (hasUpperReservoir) {
        list.push({
          id: `env-${timestamp}-caixa-dagua`,
          name: 'Reservatório',
          level: topLevel++,
          type: 'Área Técnica',
        });
      }
      if (hasBuildingElevatorShaft) {
        list.push({
          id: `env-${timestamp}-poco-elevador`,
          name: 'Poço de Elevador',
          level: -(subsolosCount + 1),
          type: 'Circulação Vertical / Instalações Técnicas',
        });
      }
    }
    // -------------------------------------------------------------------------
    // 3. 'CONDOMÍNIO / LOTEAMENTO'
    // -------------------------------------------------------------------------
    else if (isCondominioLoteamento) {
      let cLevel = 1;

      // Checkboxes (Portarias, Clube, ETE)
      if (hasCondoMainGate) {
        list.push({
          id: `env-${timestamp}-portaria-principal`,
          name: 'Portaria Principal',
          level: 0,
          type: 'Acesso & Segurança',
        });
      }

      if (hasCondoServiceGate) {
        list.push({
          id: `env-${timestamp}-portaria-servico`,
          name: 'Portaria de Serviço',
          level: 0,
          type: 'Acesso & Serviços',
        });
      }

      if (hasCondoSocialClub) {
        list.push({
          id: `env-${timestamp}-clube-social`,
          name: 'Clube Social',
          level: 1,
          type: 'Lazer & Convivência',
        });
      }

      if (hasCondoEte) {
        list.push({
          id: `env-${timestamp}-ete`,
          name: 'ETE',
          level: 1,
          type: 'Infraestrutura / Saneamento',
        });
      }

      // Praças
      for (let p = 1; p <= condoSquaresCount; p++) {
        list.push({
          id: `env-${timestamp}-praca-${p}`,
          name: condoSquaresCount === 1 ? 'Praça Central' : `Praça ${p}`,
          level: cLevel++,
          type: 'Área Verde / Lazer',
        });
      }

      // Quadras com Lotes por Quadra (Estritamente Quadra X - Lote Y para evitar duplicidade de item solto e pasta)
      for (let q = 1; q <= condoBlocksCount; q++) {
        const letter = String.fromCharCode(64 + q);
        const quadraName = `Quadra ${letter}`;
        if (condoLotsPerBlock > 0) {
          for (let l = 1; l <= condoLotsPerBlock; l++) {
            list.push({
              id: `env-${timestamp}-quadra-${letter}-lote-${l}`,
              name: `${quadraName} - Lote ${l}`,
              level: cLevel++,
              type: 'Setor Residencial / Lote',
            });
          }
        } else {
          list.push({
            id: `env-${timestamp}-quadra-${letter}`,
            name: quadraName,
            level: cLevel++,
            type: 'Setor Residencial / Quadra',
          });
        }

        // Shaft e Escada PROIBIDOS em Quadras/Lotes (somente se isVerticalBuilding === true)
        if (isVerticalBuilding && hasShaft) {
          list.push({
            id: `env-${timestamp}-quadra-${letter}-shaft`,
            name: `${quadraName} - Shaft`,
            level: cLevel++,
            type: 'Instalações Técnicas / Shaft',
          });
        }
        if (isVerticalBuilding && hasEscada) {
          list.push({
            id: `env-${timestamp}-quadra-${letter}-escada`,
            name: `${quadraName} - Escada`,
            level: cLevel++,
            type: 'Circulação Vertical / Escadas',
          });
        }
      }

      // Checkbox Poço de Elevador
      if (hasCondoElevatorShaft) {
        list.push({
          id: `env-${timestamp}-condo-elevador`,
          name: 'Poço de Elevador',
          level: 0,
          type: 'Instalações Técnicas / Circulação Vertical',
        });
      }

      // Helper para geração aninhada de cômodos por unidade habitacional
      const appendUnitWithRooms = (unitBaseName: string, unitIndex: number, typeCategory: string) => {
        const unitName = `${unitBaseName} ${unitIndex}`;
        const hasRooms =
          condoLivingRoomsPerHouse > 0 ||
          condoSuitesPerHouse > 0 ||
          condoBedroomsPerHouse > 0 ||
          condoKitchensPerHouse > 0 ||
          condoBathroomsPerHouse > 0 ||
          condoLaundryPerHouse > 0 ||
          condoLavabosPerHouse > 0 ||
          areaTecnica > 0;

        if (!hasRooms) {
          list.push({
            id: `env-${timestamp}-${unitBaseName.toLowerCase().replace(/\s+/g, '-')}-${unitIndex}`,
            name: unitName,
            level: cLevel++,
            type: `Unidade Habitacional / ${typeCategory}`,
          });
          return;
        }

        // Sub-loops para os cômodos da unidade:
        // 1. Salas
        for (let s = 1; s <= condoLivingRoomsPerHouse; s++) {
          list.push({
            id: `env-${timestamp}-${unitBaseName.toLowerCase().replace(/\s+/g, '-')}-${unitIndex}-sala-${s}`,
            name: `${unitName} - Sala ${s}`,
            level: cLevel++,
            type: `${typeCategory} / Sala`,
          });
        }

        // 2. Suítes (Ex: 'Casa 2 - Suíte 1')
        for (let st = 1; st <= condoSuitesPerHouse; st++) {
          list.push({
            id: `env-${timestamp}-${unitBaseName.toLowerCase().replace(/\s+/g, '-')}-${unitIndex}-suite-${st}`,
            name: `${unitName} - Suíte ${st}`,
            level: cLevel++,
            type: `${typeCategory} / Suíte`,
          });
        }

        // 3. Quartos
        for (let q = 1; q <= condoBedroomsPerHouse; q++) {
          list.push({
            id: `env-${timestamp}-${unitBaseName.toLowerCase().replace(/\s+/g, '-')}-${unitIndex}-quarto-${q}`,
            name: `${unitName} - Quarto ${q}`,
            level: cLevel++,
            type: `${typeCategory} / Quarto`,
          });
        }

        // 4. Cozinhas
        for (let k = 1; k <= condoKitchensPerHouse; k++) {
          list.push({
            id: `env-${timestamp}-${unitBaseName.toLowerCase().replace(/\s+/g, '-')}-${unitIndex}-coz-${k}`,
            name: condoKitchensPerHouse > 1 ? `${unitName} - Cozinha ${k}` : `${unitName} - Cozinha`,
            level: cLevel++,
            type: `${typeCategory} / Cozinha`,
          });
        }

        // 5. Banheiros
        for (let b = 1; b <= condoBathroomsPerHouse; b++) {
          list.push({
            id: `env-${timestamp}-${unitBaseName.toLowerCase().replace(/\s+/g, '-')}-${unitIndex}-banh-${b}`,
            name: condoBathroomsPerHouse > 1 ? `${unitName} - Banheiro ${b}` : `${unitName} - Banheiro`,
            level: cLevel++,
            type: `${typeCategory} / Banheiro`,
          });
        }

        // 6. Lavanderias
        for (let l = 1; l <= condoLaundryPerHouse; l++) {
          list.push({
            id: `env-${timestamp}-${unitBaseName.toLowerCase().replace(/\s+/g, '-')}-${unitIndex}-lav-${l}`,
            name: condoLaundryPerHouse > 1 ? `${unitName} - Lavanderia ${l}` : `${unitName} - Lavanderia`,
            level: cLevel++,
            type: `${typeCategory} / Lavanderia`,
          });
        }

        // 7. Lavabos
        for (let l = 1; l <= condoLavabosPerHouse; l++) {
          list.push({
            id: `env-${timestamp}-${unitBaseName.toLowerCase().replace(/\s+/g, '-')}-${unitIndex}-lavabo-${l}`,
            name: condoLavabosPerHouse > 1 ? `${unitName} - Lavabo ${l}` : `${unitName} - Lavabo`,
            level: cLevel++,
            type: `${typeCategory} / Lavabo`,
          });
        }

        // Lógica de Cômodo: Dentro do laço/loop que gera os ambientes da unidade, insira a concatenação da Área Técnica
        if (areaTecnica > 0) {
          list.push({
            id: `env-${timestamp}-${unitBaseName.toLowerCase().replace(/\s+/g, '-')}-${unitIndex}-area-tecnica`,
            name: `${unitName} - Área Técnica`,
            level: cLevel++,
            type: `${typeCategory} / Área Técnica`,
          });
        }
      };

      // 1. Casas Populares / Padrão
      if (condoStandardHouses > 0) {
        for (let i = 1; i <= condoStandardHouses; i++) {
          appendUnitWithRooms('Casa', i, 'Casa Padrão');
        }
      }

      // 2. Sobrados / Geminadas
      if (condoTownhouses > 0) {
        for (let i = 1; i <= condoTownhouses; i++) {
          appendUnitWithRooms('Sobrado', i, 'Sobrado');
        }
      }

      // 3. Mansões / Alto Padrão
      if (condoMansions > 0) {
        for (let i = 1; i <= condoMansions; i++) {
          appendUnitWithRooms('Mansão', i, 'Mansão');
        }
      }
    }
    // -------------------------------------------------------------------------
    // 4. 'HOSPITAL / UNIDADE DE SAÚDE'
    // -------------------------------------------------------------------------
    else if (isHospitalSaude) {
      let hospLevel = 1;

      // Checkboxes (Pronto-Socorro, CME, Centro de Imagens, Casa de Gases)
      if (hasHospitalEmergency) {
        list.push({
          id: `env-${timestamp}-ps-triagem`,
          name: 'Pronto-Socorro',
          level: 0,
          type: 'Emergência & Atendimento',
        });
      }

      if (hasHospitalCme) {
        list.push({
          id: `env-${timestamp}-cme`,
          name: 'CME',
          level: 0.5,
          type: 'Central de Esterilização',
        });
      }

      if (hasHospitalImagingCenter) {
        list.push({
          id: `env-${timestamp}-centro-imagens`,
          name: 'Centro de Imagens',
          level: 0.5,
          type: 'Diagnóstico & Exames',
        });
      }

      if (hasHospitalGasHouse) {
        list.push({
          id: `env-${timestamp}-casa-gases`,
          name: 'Casa de Gases',
          level: 0,
          type: 'Infraestrutura Hospitalar',
        });
      }

      if (hasHospitalElevatorShaft) {
        list.push({
          id: `env-${timestamp}-poco-elevador`,
          name: 'Poço de Elevador',
          level: 0,
          type: 'Circulação Vertical / Instalações Técnicas',
        });
      }

      // Andares com sub-loops de Consultórios, Quartos de Internação e Suítes VIP por Andar
      for (let f = 1; f <= hospitalFloors; f++) {
        const nomeAndar = `${f}º Andar`;
        const nomeNivel = nomeAndar;

        const hasSubRooms =
          hospitalVipSuites > 0 ||
          hospitalConsultingRoomsPerFloor > 0 ||
          hospitalInternmentRoomsPerFloor > 0 ||
          hospitalLavabosPerFloor > 0;

        if (!hasSubRooms) {
          list.push({
            id: `env-${timestamp}-andar-${f}`,
            name: nomeAndar,
            level: hospLevel++,
            type: 'Pavimento Hospitalar',
          });
        } else {
          // 1. Suítes VIP / Isolamento (Ex: '1º Andar - Suíte VIP 1')
          for (let v = 1; v <= hospitalVipSuites; v++) {
            const nomeUnidade = `Suíte VIP ${v}`;
            list.push({
              id: `env-${timestamp}-andar-${f}-vip-${v}`,
              name: `${nomeAndar} - ${nomeUnidade}`,
              level: hospLevel++,
              type: 'Acomodação / Suíte VIP',
            });
            if (areaTecnica > 0) {
              list.push({
                id: `env-${timestamp}-andar-${f}-vip-${v}-area-tecnica`,
                name: `${nomeAndar} - ${nomeUnidade} - Área Técnica`,
                level: hospLevel++,
                type: 'Instalações Técnicas / Área Técnica',
              });
            }
          }

          // 2. Quartos de Internação por Andar
          for (let q = 1; q <= hospitalInternmentRoomsPerFloor; q++) {
            const nomeUnidade = `Quarto Internação ${q}`;
            list.push({
              id: `env-${timestamp}-andar-${f}-internacao-${q}`,
              name: `${nomeAndar} - ${nomeUnidade}`,
              level: hospLevel++,
              type: 'Internação / Enfermaria',
            });
            if (areaTecnica > 0) {
              list.push({
                id: `env-${timestamp}-andar-${f}-internacao-${q}-area-tecnica`,
                name: `${nomeAndar} - ${nomeUnidade} - Área Técnica`,
                level: hospLevel++,
                type: 'Instalações Técnicas / Área Técnica',
              });
            }
          }

          // 3. Consultórios por Andar
          for (let c = 1; c <= hospitalConsultingRoomsPerFloor; c++) {
            const nomeUnidade = `Consultório ${c}`;
            list.push({
              id: `env-${timestamp}-andar-${f}-cons-${c}`,
              name: `${nomeAndar} - ${nomeUnidade}`,
              level: hospLevel++,
              type: 'Ambulatório / Consultório',
            });
            // Lógica de Cômodo: Dentro do laço/loop que gera os ambientes da unidade, insira a concatenação da Área Técnica
            if (areaTecnica > 0) {
              list.push({
                id: `env-${timestamp}-andar-${f}-cons-${c}-area-tecnica`,
                name: `${nomeAndar} - ${nomeUnidade} - Área Técnica`,
                level: hospLevel++,
                type: 'Instalações Técnicas / Área Técnica',
              });
            }
          }

          // 4. Lavabos por Andar
          for (let l = 1; l <= hospitalLavabosPerFloor; l++) {
            list.push({
              id: `env-${timestamp}-andar-${f}-lavabo-${l}`,
              name: hospitalLavabosPerFloor === 1 ? `${nomeAndar} - Lavabo` : `${nomeAndar} - Lavabo ${l}`,
              level: hospLevel++,
              type: 'Ambulatório / Lavabo',
            });
          }
        }

        // Lógica de Pavimento: OBRIGATÓRIO: No final de qualquer laço que crie um nível raiz, insira:
        if (hasShaft) {
          list.push({
            id: `env-${timestamp}-hosp-andar-${f}-shaft`,
            name: `${nomeNivel} - Shaft`,
            level: hospLevel++,
            type: 'Instalações Técnicas / Shaft',
          });
        }
        if (hasEscada) {
          list.push({
            id: `env-${timestamp}-hosp-andar-${f}-escada`,
            name: `${nomeNivel} - Escada`,
            level: hospLevel++,
            type: 'Circulação Vertical / Escadas',
          });
        }
      }

      // Salas Cirúrgicas
      for (let s = 1; s <= hospitalSurgicalRooms; s++) {
        list.push({
          id: `env-${timestamp}-sala-cirurgica-${s}`,
          name: hospitalSurgicalRooms === 1 ? 'Sala Cirúrgica' : `Sala Cirúrgica ${s}`,
          level: hospLevel++,
          type: 'Centro Cirúrgico',
        });
      }

      // Leitos de UTI
      if (hospitalUtiBeds > 0) {
        list.push({
          id: `env-${timestamp}-leitos-uti`,
          name: `Ala de UTI (${hospitalUtiBeds} Leitos)`,
          level: hospLevel++,
          type: 'Terapia Intensiva (UTI)',
        });
      }

      // Blocos/Alas
      if (hospitalBlocks > 1) {
        for (let b = 1; b <= hospitalBlocks; b++) {
          const letter = String.fromCharCode(64 + b);
          const nomeNivel = `Bloco / Ala ${letter}`;
          list.push({
            id: `env-${timestamp}-bloco-ala-${letter}`,
            name: nomeNivel,
            level: hospLevel++,
            type: 'Bloco / Ala',
          });
          if (hasShaft) {
            list.push({
              id: `env-${timestamp}-bloco-ala-${letter}-shaft`,
              name: `${nomeNivel} - Shaft`,
              level: hospLevel++,
              type: 'Instalações Técnicas / Shaft',
            });
          }
          if (hasEscada) {
            list.push({
              id: `env-${timestamp}-bloco-ala-${letter}-escada`,
              name: `${nomeNivel} - Escada`,
              level: hospLevel++,
              type: 'Circulação Vertical / Escadas',
            });
          }
        }
      } else if (hospitalBlocks === 1) {
        const nomeNivel = 'Bloco / Ala Principal';
        list.push({
          id: `env-${timestamp}-bloco-ala-principal`,
          name: nomeNivel,
          level: hospLevel++,
          type: 'Bloco / Ala',
        });
        if (hasShaft) {
          list.push({
            id: `env-${timestamp}-bloco-ala-principal-shaft`,
            name: `${nomeNivel} - Shaft`,
            level: hospLevel++,
            type: 'Instalações Técnicas / Shaft',
          });
        }
        if (hasEscada) {
          list.push({
            id: `env-${timestamp}-bloco-ala-principal-escada`,
            name: `${nomeNivel} - Escada`,
            level: hospLevel++,
            type: 'Circulação Vertical / Escadas',
          });
        }
      }
    }
    // -------------------------------------------------------------------------
    // 5. 'PRÉDIO COMERCIAL / SHOPPING'
    // -------------------------------------------------------------------------
    else if (isPredioComercialShopping) {
      // 1. Subsolos
      if (commercialSubsolos > 0) {
        for (let g = 1; g <= commercialSubsolos; g++) {
          const nomeNivel = `Subsolo ${g}`;
          list.push({
            id: `env-${timestamp}-subsolo-${g}`,
            name: nomeNivel,
            level: -g,
            type: 'Subsolo',
          });
          if (hasShaft) {
            list.push({
              id: `env-${timestamp}-subsolo-${g}-shaft`,
              name: `${nomeNivel} - Shaft`,
              level: -g,
              type: 'Instalações Técnicas / Shaft',
            });
          }
          if (hasEscada) {
            list.push({
              id: `env-${timestamp}-subsolo-${g}-escada`,
              name: `${nomeNivel} - Escada`,
              level: -g,
              type: 'Circulação Vertical / Escadas',
            });
          }
        }
      }

      // 2. Pisos de Lojas (Mall) com Lavabos por Piso
      for (let m = 1; m <= commercialMallFloors; m++) {
        const nomeAndar = `${m}º Piso`;
        const nomeNivel = nomeAndar;

        list.push({
          id: `env-${timestamp}-mall-piso-${m}`,
          name: `${nomeAndar} de Lojas (Mall)`,
          level: m,
          type: 'Piso de Lojas (Mall)',
        });

        // Lavabos por Piso
        for (let l = 1; l <= commercialLavabosPerFloor; l++) {
          list.push({
            id: `env-${timestamp}-mall-${m}-lavabo-${l}`,
            name: commercialLavabosPerFloor === 1 ? `${nomeAndar} - Lavabo` : `${nomeAndar} - Lavabo ${l}`,
            level: m + 0.05 * l,
            type: 'Sanitário / Lavabo Mall',
          });
        }

        // Lógica de Pavimento: OBRIGATÓRIO: No final de qualquer laço que crie um nível raiz, insira:
        if (hasShaft) {
          list.push({
            id: `env-${timestamp}-mall-${m}-shaft`,
            name: `${nomeNivel} - Shaft`,
            level: m + 0.08,
            type: 'Instalações Técnicas / Shaft',
          });
        }
        if (hasEscada) {
          list.push({
            id: `env-${timestamp}-mall-${m}-escada`,
            name: `${nomeNivel} - Escada`,
            level: m + 0.09,
            type: 'Circulação Vertical / Escadas',
          });
        }
      }

      // 3. Lojas Âncora
      for (let a = 1; a <= commercialAnchorStores; a++) {
        const nomeAndar = `${commercialMallFloors}º Piso`;
        const nomeUnidade = commercialAnchorStores === 1 ? 'Loja Âncora' : `Loja Âncora ${a}`;
        list.push({
          id: `env-${timestamp}-loja-ancora-${a}`,
          name: `${nomeAndar} - ${nomeUnidade}`,
          level: commercialMallFloors + 0.1 * a,
          type: 'Loja Âncora',
        });
        // Lógica de Cômodo: Dentro do laço/loop que gera os ambientes da unidade, insira a concatenação da Área Técnica
        if (areaTecnica > 0) {
          list.push({
            id: `env-${timestamp}-loja-ancora-${a}-area-tecnica`,
            name: `${nomeAndar} - ${nomeUnidade} - Área Técnica`,
            level: commercialMallFloors + 0.1 * a,
            type: 'Loja Âncora / Área Técnica',
          });
        }
      }

      // 4. Lojas Satélite
      if (commercialSatelliteStores > 0) {
        list.push({
          id: `env-${timestamp}-lojas-satelite`,
          name: `Lojas Satélite (${commercialSatelliteStores} Lojas)`,
          level: commercialMallFloors + 0.5,
          type: 'Lojas Satélite',
        });
      }

      // 5. Salas Comerciais
      if (commercialOfficeRooms > 0) {
        list.push({
          id: `env-${timestamp}-salas-comerciais`,
          name: `Salas Comerciais (${commercialOfficeRooms} Salas)`,
          level: commercialMallFloors + 1,
          type: 'Salas Comerciais',
        });
      }

      // Checkboxes (Praça de Alimentação, Cinemas, Docas, CAG)
      if (hasCommercialFoodCourt) {
        list.push({
          id: `env-${timestamp}-praca-alimentacao`,
          name: 'Praça de Alimentação',
          level: commercialMallFloors + 1.5,
          type: 'Praça de Alimentação',
        });
      }

      if (hasCommercialCinemas) {
        list.push({
          id: `env-${timestamp}-cinemas`,
          name: 'Cinemas',
          level: commercialMallFloors + 2,
          type: 'Cinemas',
        });
      }

      if (hasCommercialDocks) {
        list.push({
          id: `env-${timestamp}-docas`,
          name: 'Docas',
          level: 0,
          type: 'Docas / Carga e Descarga',
        });
      }

      if (hasCommercialCag) {
        list.push({
          id: `env-${timestamp}-cag`,
          name: 'CAG',
          level: commercialMallFloors + 3,
          type: 'Área Técnica (CAG)',
        });
      }

      if (hasCommercialElevatorShaft) {
        list.push({
          id: `env-${timestamp}-poco-elevador`,
          name: 'Poço de Elevador',
          level: -(commercialSubsolos + 1),
          type: 'Circulação Vertical / Monta-Cargas',
        });
      }
    }
    // -------------------------------------------------------------------------
    // 6. 'GALPÃO LOGÍSTICO / INDUSTRIAL'
    // -------------------------------------------------------------------------
    else if (isGalpaoLogistico) {
      let whLevel = 1;

      // Checkboxes (Portaria Blindada, Pátio, Mezanino, Refeitório)
      if (hasWarehouseArmoredGate) {
        list.push({
          id: `env-${timestamp}-portaria-blindada`,
          name: 'Portaria Blindada',
          level: 0,
          type: 'Acesso & Segurança',
        });
      }

      if (hasWarehouseManeuverYard) {
        list.push({
          id: `env-${timestamp}-patio-manobras`,
          name: 'Pátio de Manobras',
          level: 0.5,
          type: 'Pátio de Manobras',
        });
      }

      // Naves/Galpões
      for (let n = 1; n <= warehouseNaves; n++) {
        const nomeNivel = warehouseNaves === 1 ? 'Nave / Galpão Principal' : `Nave / Galpão ${n}`;
        list.push({
          id: `env-${timestamp}-nave-galpao-${n}`,
          name: nomeNivel,
          level: whLevel++,
          type: 'Naves/Galpões',
        });

        // Lógica de Cômodo: Dentro do laço/loop que gera os ambientes da unidade, insira a concatenação da Área Técnica
        if (areaTecnica > 0) {
          list.push({
            id: `env-${timestamp}-nave-galpao-${n}-area-tecnica`,
            name: `${nomeNivel} - Área Técnica`,
            level: whLevel++,
            type: 'Instalações Técnicas / Área Técnica',
          });
        }

        // Shaft e Escadas PROIBIDOS em Galpão (somente injetados se isVerticalBuilding === true)
        if (isVerticalBuilding && hasShaft) {
          list.push({
            id: `env-${timestamp}-nave-${n}-shaft`,
            name: `${nomeNivel} - Shaft`,
            level: whLevel++,
            type: 'Instalações Técnicas / Shaft',
          });
        }
        if (isVerticalBuilding && hasEscada) {
          list.push({
            id: `env-${timestamp}-nave-${n}-escada`,
            name: `${nomeNivel} - Escada`,
            level: whLevel++,
            type: 'Circulação Vertical / Escadas',
          });
        }
      }

      // Baterias de Docas
      for (let d = 1; d <= warehouseDockBatteries; d++) {
        list.push({
          id: `env-${timestamp}-bateria-docas-${d}`,
          name: warehouseDockBatteries === 1 ? 'Bateria de Docas Principal' : `Bateria de Docas ${d}`,
          level: whLevel++,
          type: 'Baterias de Docas',
        });
      }

      // Mezanino Administrativo
      if (hasWarehouseAdminMezzanine) {
        const nomeNivel = 'Mezanino Administrativo';
        list.push({
          id: `env-${timestamp}-mezanino-adm`,
          name: nomeNivel,
          level: whLevel++,
          type: 'Mezanino Administrativo',
        });
        if (isVerticalBuilding && hasShaft) {
          list.push({
            id: `env-${timestamp}-mezanino-shaft`,
            name: `${nomeNivel} - Shaft`,
            level: whLevel++,
            type: 'Instalações Técnicas / Shaft',
          });
        }
        if (isVerticalBuilding && hasEscada) {
          list.push({
            id: `env-${timestamp}-mezanino-escada`,
            name: `${nomeNivel} - Escada`,
            level: whLevel++,
            type: 'Circulação Vertical / Escadas',
          });
        }
      }

      // Refeitório
      if (hasWarehouseRefectory) {
        list.push({
          id: `env-${timestamp}-refeitorio`,
          name: 'Refeitório',
          level: whLevel++,
          type: 'Refeitório Operacional',
        });
      }

      if (hasWarehouseElevatorShaft) {
        list.push({
          id: `env-${timestamp}-poco-elevador`,
          name: 'Poço de Elevador',
          level: 0,
          type: 'Transporte Vertical / Monta-Cargas',
        });
      }
    }

    // Fallback de segurança se nenhum ambiente for adicionado
    if (list.length === 0) {
      list.push({
        id: `env-${timestamp}-geral`,
        name: 'Pavimento Principal',
        level: 1,
        type: 'Geral',
      });
    }

    setEnvironments(list);
    return list;
  };

  // Alias para semântica do Passo 3 (generateLocations)
  const generateLocations = generateEnvironmentsFromInputs;

  const handleAddManualEnvironment = () => {
    if (!manualName.trim()) {
      showToast({
        type: 'warning',
        title: 'Nome obrigatório',
        message: 'Digite o nome do ambiente a adicionar.',
      });
      return;
    }

    const newEnv: StructuredPhysicalEnvironment = {
      id: `env-manual-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: manualName.trim(),
      level: manualLevel,
      type: manualType.trim() || 'Ambiente',
    };

    setEnvironments((prev) => [...prev, newEnv]);
    setManualName('');
    setIsAddingManual(false);
    showToast({
      type: 'success',
      title: 'Ambiente Adicionado',
      message: `"${newEnv.name}" incluído na árvore de locais.`,
    });
  };

  const handleDeleteEnvironment = (envId: string) => {
    setEnvironments((prev) => prev.filter((e) => e.id !== envId));
  };

  const handleStartRename = (env: StructuredPhysicalEnvironment) => {
    setEditingEnvId(env.id);
    setEditingEnvName(env.name);
  };

  const handleSaveRename = (envId: string) => {
    if (!editingEnvName.trim()) return;
    setEnvironments((prev) =>
      prev.map((e) => (e.id === envId ? { ...e, name: editingEnvName.trim() } : e))
    );
    setEditingEnvId(null);
  };

  const toggleTreeNode = (nodeId: string) => {
    setExpandedTreeNodes((prev) => ({
      ...prev,
      [nodeId]: !prev[nodeId],
    }));
  };

  // Botão Contextual (+ Adicionar): abre prompt, concatena hierarquia atual e faz push em environments
  const handleAddContextualEnv = (hierarchyPath: string, parentNodeId?: string) => {
    const input = window.prompt('Nome do ambiente:');
    if (input === null) return;
    const trimmed = input.trim();
    if (!trimmed) return;

    const fullName = `${hierarchyPath} - ${trimmed}`;
    const maxLevel = environments.length > 0 ? Math.max(...environments.map((e) => e.level)) : 0;
    const newEnv: StructuredPhysicalEnvironment = {
      id: `env-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: fullName,
      level: maxLevel + 1,
      type: 'Ambiente',
    };

    setEnvironments((prev) => [...prev, newEnv]);

    if (parentNodeId) {
      setExpandedTreeNodes((prev) => ({
        ...prev,
        [parentNodeId]: true,
      }));
    }

    showToast({
      type: 'info',
      title: 'Ambiente Adicionado',
      message: `"${fullName}" incluído na árvore de locais.`,
    });
  };

  const handleDeleteEnvBranch = (fullPath: string) => {
    if (window.confirm(`Deseja excluir "${fullPath}" e todos os seus sub-ambientes vinculados?`)) {
      setEnvironments((prev) =>
        prev.filter((e) => e.name !== fullPath && !e.name.startsWith(`${fullPath} - `))
      );
    }
  };

  const goToStep2 = () => {
    if (!workName.trim()) {
      showToast({
        type: 'warning',
        title: 'Nome da Obra',
        message: 'Informe o nome do empreendimento para continuar.',
      });
      return;
    }
    setCurrentStep(2);
  };

  const goToStep3 = () => {
    generateEnvironmentsFromInputs();
    setCurrentStep(3);
  };

  const handleSaveWorkAndLinkMap = () => {
    if (!workName.trim()) {
      showToast({
        type: 'warning',
        title: 'Nome Obrigatório',
        message: 'Informe o nome da obra.',
      });
      setCurrentStep(1);
      return;
    }

    if (environments.length === 0) {
      showToast({
        type: 'warning',
        title: 'Árvore de Locais Vazia',
        message: 'Gere ou adicione ao menos um ambiente físico para a obra.',
      });
      setCurrentStep(2);
      return;
    }

    setIsSubmitting(true);

    try {
      const finalFloors: Floor[] = environments.map((env) => ({
        id: env.id,
        workId: workToEdit?.id || '',
        name: env.name,
        level: env.level,
        companyId: workToEdit?.companyId || 'comp-01',
        isActive: true,
      }));

      // Vincula serviços padrão da EAP em segundo plano sem poluir a interface
      const allTemplates: EAPServiceTemplate[] = [];
      EAP_CATEGORIES.forEach((cat) => {
        cat.subCategories.forEach((sub) => {
          sub.services.forEach((srv) => {
            allTemplates.push(srv);
          });
        });
      });

      const today = new Date();
      let runningDayOffset = 0;
      const primaryFloor = finalFloors[0] || { id: 'fl-1', name: 'Geral' };

      const generatedServices: ConstructionService[] = allTemplates.map((srv, srvIdx) => {
        const startDate = new Date(today);
        startDate.setDate(today.getDate() + runningDayOffset);

        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + Math.max(3, srv.defaultEstimatedDays || 5));

        const locationProgress: ServiceLocationProgress[] = finalFloors.map((fl) => ({
          locationId: fl.id,
          locationName: fl.name,
          status: 'Não iniciado',
        }));

        if (srvIdx % 2 === 0) {
          runningDayOffset += 2;
        }

        return {
          id: `srv-${Date.now()}-${srv.code.replace(/\./g, '-')}-${Math.random().toString(36).substring(2, 5)}`,
          workId: workToEdit?.id || '',
          companyId: workToEdit?.companyId || 'comp-01',
          floorId: primaryFloor.id,
          floorName: primaryFloor.name,
          name: srv.name,
          category: srv.categoryName || 'Construção Civil',
          area: srv.subCategoryName || 'Obra Geral',
          status: 'Não iniciado',
          responsibleName: srv.defaultResponsible || 'Engenheiro Residente',
          startDate: startDate.toISOString().substring(0, 10),
          predictedEndDate: endDate.toISOString().substring(0, 10),
          notes: srv.description || `Vinculado via Construtor do Mapa (${activeTypology.label}).`,
          eapServiceCode: srv.code,
          categoryCode: srv.categoryCode,
          categoryName: srv.categoryName,
          checklist: srv.checklist || [],
          isActive: true,
          assignedEmployees: [],
          locationProgress,
          proofPhotos: [],
        };
      });

      const actualSubsolosCount = isPredioResidencial
        ? subsolosCount
        : isPredioComercialShopping
        ? commercialSubsolos
        : subsolosCount;

      const hasBasements = actualSubsolosCount > 0;
      const basementCount = actualSubsolosCount;
      const hasGround = finalFloors.some((f) => f.level === 0 || f.name.includes('Térreo'));

      if (workToEdit) {
        editWork(workToEdit.id, {
          name: workName.trim(),
          code: workCode.trim() || undefined,
          address: workAddress.trim(),
          city: workCity.trim(),
          state: workState.trim().toUpperCase(),
          typology: activeTypology.label,
          interventionType,
          totalFloors: finalFloors.length,
          hasBasements,
          basementCount,
          floors: finalFloors,
        });

        saveWorkMapStructure({
          workId: workToEdit.id,
          interventionType,
          typology: activeTypology.label,
          floors: finalFloors,
          services: generatedServices,
        });

        if (onSaved) onSaved({ ...workToEdit, floors: finalFloors });
      } else {
        const newWork = createWork({
          name: workName.trim(),
          code: workCode.trim() || undefined,
          address: workAddress.trim(),
          city: workCity.trim(),
          state: workState.trim().toUpperCase(),
          type: activeTypology.workTypeMapping,
          totalFloors: finalFloors.length,
          hasGroundFloor: hasGround,
          hasBasements,
          basementCount,
          floors: finalFloors,
          typology: activeTypology.label,
          interventionType,
          services: generatedServices,
        });

        if (onSaved) onSaved(newWork);
      }

      setIsSubmitting(false);
      onClose();
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
      showToast({
        type: 'error',
        title: 'Erro ao salvar obra',
        message: 'Ocorreu um erro ao processar a criação do mapa da obra.',
      });
    }
  };

  const filteredEnvironments = useMemo(() => {
    if (!searchEnvFilter.trim()) return environments;
    const term = searchEnvFilter.toLowerCase();
    return environments.filter(
      (e) => e.name.toLowerCase().includes(term) || e.type.toLowerCase().includes(term)
    );
  }, [environments, searchEnvFilter]);

  // Data Transformation: Transformar o array de ambientes em TreeNodes recursivos universais delimitados por ' - '
  const treeNodes = useMemo<TreeNodeData[]>(() => {
    const sourceList = searchEnvFilter.trim() ? filteredEnvironments : environments;
    return buildTreeNodes(sourceList);
  }, [environments, filteredEnvironments, searchEnvFilter]);

  const handleAddContextualEnvironment = (parentPath: string) => {
    const novoNome = window.prompt('Nome do ambiente:');
    if (!novoNome || !novoNome.trim()) return;
    const cleanName = novoNome.trim();
    const fullPath = `${parentPath} - ${cleanName}`;

    const newEnv: StructuredPhysicalEnvironment = {
      id: `env-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: fullPath,
      level: environments.length + 1,
      type: 'Ambiente Adicionado',
    };

    setEnvironments((prev) => [...prev, newEnv]);
    showToast({
      type: 'success',
      title: 'Ambiente adicionado',
      message: `"${cleanName}" adicionado com sucesso em ${parentPath}.`,
    });
  };

  const handleEditTreeNode = (node: TreeNodeData) => {
    const currentName = node.name;
    const novoNome = window.prompt('Editar nome do ambiente:', currentName);
    if (!novoNome || !novoNome.trim() || novoNome.trim() === currentName) return;

    const clean = novoNome.trim();
    const parts = node.fullPath.split(' - ');
    parts[parts.length - 1] = clean;
    const newFullPath = parts.join(' - ');

    setEnvironments((prev) =>
      prev.map((e) =>
        e.name === node.fullPath ? { ...e, name: newFullPath } : e
      )
    );
    showToast({
      type: 'info',
      title: 'Ambiente renomeado',
      message: `Ambiente renomeado para "${clean}".`,
    });
  };

  const handleDeleteTreeNode = (node: TreeNodeData) => {
    if (!confirm(`Deseja realmente excluir "${node.name}"?`)) return;

    setEnvironments((prev) =>
      prev.filter(
        (e) => e.name !== node.fullPath && !e.name.startsWith(`${node.fullPath} - `)
      )
    );
    showToast({
      type: 'info',
      title: 'Ambiente excluído',
      message: `"${node.name}" foi removido da árvore.`,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-4xl rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-900/95 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div
              className="p-2.5 rounded-xl border shrink-0"
              style={{
                backgroundColor: 'color-mix(in srgb, var(--btn-primary) 12%, transparent)',
                borderColor: 'color-mix(in srgb, var(--btn-primary) 35%, transparent)',
                color: 'var(--btn-primary)',
              }}
            >
              <Building2 className="w-5 h-5" style={{ color: 'var(--btn-primary)' }} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                {workToEdit ? 'Configurar Mapa da Obra' : 'Construtor do Mapa da Obra'}
              </h2>
              <p className="text-xs text-slate-400">
                Configure a estrutura e os ambientes físicos para o acompanhamento da obra.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper Navigation */}
        <div className="px-4 py-2.5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between gap-2 overflow-x-auto shrink-0">
          <button
            type="button"
            onClick={() => setCurrentStep(1)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              currentStep === 1
                ? 'shadow-sm text-[var(--btn-primary-text)]'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
            style={
              currentStep === 1
                ? { backgroundColor: 'var(--btn-primary)', color: 'var(--btn-primary-text)' }
                : undefined
            }
          >
            <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black bg-black/20">
              1
            </span>
            <span>Passo 1: Tipologia</span>
          </button>

          <ChevronRight className="w-4 h-4 text-slate-700 shrink-0" />

          <button
            type="button"
            onClick={() => (workName.trim() ? setCurrentStep(2) : goToStep2())}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              currentStep === 2
                ? 'shadow-sm text-[var(--btn-primary-text)]'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
            style={
              currentStep === 2
                ? { backgroundColor: 'var(--btn-primary)', color: 'var(--btn-primary-text)' }
                : undefined
            }
          >
            <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black bg-black/20">
              2
            </span>
            <span>Passo 2: Gerador Rápido</span>
          </button>

          <ChevronRight className="w-4 h-4 text-slate-700 shrink-0" />

          <button
            type="button"
            onClick={() => (workName.trim() ? goToStep3() : goToStep2())}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              currentStep === 3
                ? 'shadow-sm text-[var(--btn-primary-text)]'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
            style={
              currentStep === 3
                ? { backgroundColor: 'var(--btn-primary)', color: 'var(--btn-primary-text)' }
                : undefined
            }
          >
            <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black bg-black/20">
              3
            </span>
            <span>Passo 3: Árvore de Locais</span>
            {environments.length > 0 && (
              <span className="px-1.5 py-0.2 rounded bg-slate-800 text-[10px] font-mono text-slate-300">
                {environments.length}
              </span>
            )}
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">

          {/* =========================================================================
              PASSO 1: SELETOR VISUAL E LIMPO COM AS 7 TIPOLOGIAS
              ========================================================================= */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Seletor Visual das 6 Tipologias */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-200">
                  Selecione a Tipologia da Obra
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {ENTERPRISE_TYPOLOGIES.map((typ) => {
                    const isSelected = typ.key === selectedTypologyKey;
                    const IconComponent = typ.icon;
                    return (
                      <button
                        key={typ.key}
                        type="button"
                        onClick={() => setSelectedTypologyKey(typ.key)}
                        className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between gap-2.5 cursor-pointer ${
                          isSelected
                            ? 'bg-slate-800/90 border-[var(--btn-primary)] shadow-sm ring-1 ring-[var(--btn-primary)]/50'
                            : 'bg-slate-950/60 border-slate-800 hover:bg-slate-850 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <div
                            className="p-2 rounded-lg border"
                            style={{
                              backgroundColor: isSelected
                                ? 'color-mix(in srgb, var(--btn-primary) 18%, transparent)'
                                : 'rgba(30, 41, 59, 0.6)',
                              borderColor: isSelected ? 'var(--btn-primary)' : 'rgba(51, 65, 85, 0.6)',
                              color: isSelected ? 'var(--btn-primary)' : '#94a3b8',
                            }}
                          >
                            <IconComponent className="w-4 h-4" />
                          </div>
                          {isSelected && (
                            <span
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: 'var(--btn-primary)' }}
                            />
                          )}
                        </div>

                        <div>
                          <span className="text-xs font-bold text-white block">
                            {typ.label}
                          </span>
                          <span className="text-[11px] text-slate-400 block line-clamp-2 mt-0.5 leading-relaxed">
                            {typ.description}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Dados Básicos da Obra */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-4">
                <div className="text-xs font-bold text-slate-200">
                  Dados do Empreendimento
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Nome da Obra *
                    </label>
                    <input
                      type="text"
                      required
                      value={workName}
                      onChange={(e) => setWorkName(e.target.value)}
                      placeholder="Ex: Residencial Vista do Parque"
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[var(--btn-primary)]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Código (Opcional)
                    </label>
                    <input
                      type="text"
                      value={workCode}
                      onChange={(e) => setWorkCode(e.target.value)}
                      placeholder="OBR-2026-01"
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white font-mono placeholder-slate-500 focus:outline-none focus:border-[var(--btn-primary)]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Endereço / Logradouro
                    </label>
                    <input
                      type="text"
                      value={workAddress}
                      onChange={(e) => setWorkAddress(e.target.value)}
                      placeholder="Av. das Américas, 4200"
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[var(--btn-primary)]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Cidade</label>
                      <input
                        type="text"
                        value={workCity}
                        onChange={(e) => setWorkCity(e.target.value)}
                        placeholder="Rio de Janeiro"
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[var(--btn-primary)]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">UF</label>
                      <input
                        type="text"
                        maxLength={2}
                        value={workState}
                        onChange={(e) => setWorkState(e.target.value.toUpperCase())}
                        placeholder="RJ"
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white font-mono uppercase text-center placeholder-slate-500 focus:outline-none focus:border-[var(--btn-primary)]"
                      />
                    </div>
                  </div>
                </div>

                {/* Tipo de Intervenção */}
                <div className="pt-1">
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    Tipo de Intervenção
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <label
                      className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                        interventionType === 'Construção do Zero (Desde a Fundação)'
                          ? 'bg-slate-800/80 border-[var(--btn-primary)] ring-1 ring-[var(--btn-primary)]'
                          : 'bg-slate-900 border-slate-800 hover:bg-slate-850'
                      }`}
                    >
                      <input
                        type="radio"
                        name="modal-intervention-type"
                        checked={interventionType === 'Construção do Zero (Desde a Fundação)'}
                        onChange={() => setInterventionType('Construção do Zero (Desde a Fundação)')}
                        className="accent-[var(--btn-primary)]"
                      />
                      <div>
                        <span className="text-xs font-bold text-white block">Construção do Zero</span>
                        <span className="text-[11px] text-slate-400 block">
                          Fundação, estrutura, alvenarias e acabamentos.
                        </span>
                      </div>
                    </label>

                    <label
                      className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                        interventionType === 'Reforma / Retrofit'
                          ? 'bg-slate-800/80 border-[var(--btn-primary)] ring-1 ring-[var(--btn-primary)]'
                          : 'bg-slate-900 border-slate-800 hover:bg-slate-850'
                      }`}
                    >
                      <input
                        type="radio"
                        name="modal-intervention-type"
                        checked={interventionType === 'Reforma / Retrofit'}
                        onChange={() => setInterventionType('Reforma / Retrofit')}
                        className="accent-[var(--btn-primary)]"
                      />
                      <div>
                        <span className="text-xs font-bold text-white block">Reforma / Retrofit</span>
                        <span className="text-[11px] text-slate-400 block">
                          Intervenções internas, modernização e retrofit.
                        </span>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              PASSO 2: GERADOR RÁPIDO COM RENDERIZAÇÃO CONDICIONAL AVANÇADA POR TIPOLOGIA
              ========================================================================= */}
          {currentStep === 2 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              
              {/* Cabeçalho do Passo 2 com Badge da Tipologia Ativa */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div>
                  <div className="text-xs font-bold text-white uppercase tracking-wider">
                    Parâmetros do Gerador Rápido
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Preencha as quantidades e setores específicos para a tipologia selecionada.
                  </p>
                </div>
                <span
                  className="text-xs font-bold px-2.5 py-1 rounded-lg border"
                  style={{
                    backgroundColor: 'color-mix(in srgb, var(--btn-primary) 12%, transparent)',
                    borderColor: 'var(--btn-primary)',
                    color: 'var(--btn-primary)',
                  }}
                >
                  {activeTypology.label}
                </span>
              </div>

              {/* ---------------------------------------------------------------------
                  CONDICIONAL 1: 'Casa Residencial' ou 'Sobrado'
                  Inputs: Quartos, Suítes, Salas, Cozinhas, Banheiros, Vagas de Garagem.
                  Checkboxes: Área Gourmet, Piscina, Quintal/Jardim.
                  --------------------------------------------------------------------- */}
              {(tipologia === 'Casa Residencial' || tipologia === 'Sobrado' || tipologia === 'Casa Residencial / Sobrado' || isCasaOuSobrado) && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  {/* Inputs Numéricos */}
                  <div className="space-y-2">
                    <span className="block text-xs font-bold text-slate-200">
                      Cômodos e Vagas (Quantidades)
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      <NumericField
                        id="input-casa-quartos"
                        label="Quartos"
                        subtitle="Dormitórios padrão"
                        value={houseBedrooms}
                        min={0}
                        max={30}
                        onChange={setHouseBedrooms}
                      />
                      <NumericField
                        id="input-casa-suites"
                        label="Suítes"
                        subtitle="Dormitórios com banheiro privativo"
                        value={houseSuites}
                        min={0}
                        max={20}
                        onChange={setHouseSuites}
                      />
                      <NumericField
                        id="input-casa-salas"
                        label="Salas"
                        subtitle="Estar, jantar ou TV"
                        value={houseLivingRooms}
                        min={0}
                        max={15}
                        onChange={setHouseLivingRooms}
                      />
                      <NumericField
                        id="input-casa-cozinhas"
                        label="Cozinhas"
                        subtitle="Cozinhas e copas"
                        value={houseKitchens}
                        min={0}
                        max={10}
                        onChange={setHouseKitchens}
                      />
                      <NumericField
                        id="input-casa-banheiros"
                        label="Banheiros"
                        subtitle="Banheiros sociais"
                        value={houseBathrooms}
                        min={0}
                        max={20}
                        onChange={setHouseBathrooms}
                      />
                      <NumericField
                        id="input-casa-lavabos"
                        label="Lavabos"
                        subtitle="Lavabos sociais"
                        value={houseLavabos}
                        min={0}
                        max={10}
                        onChange={setHouseLavabos}
                      />
                      <NumericField
                        id="input-casa-vagas"
                        label="Vagas de Garagem"
                        subtitle="Vagas cobertas ou descobertas"
                        value={houseGarageSpots}
                        min={0}
                        max={30}
                        onChange={setHouseGarageSpots}
                      />
                      <NumericField
                        id="input-casa-area-tecnica"
                        label="Área Técnica"
                        subtitle="Área técnica interna / privativa"
                        value={technicalAreaCount}
                        min={0}
                        max={20}
                        onChange={setTechnicalAreaCount}
                      />
                    </div>
                  </div>

                  {/* Checkboxes */}
                  <div className="space-y-2 pt-2 border-t border-slate-800/80">
                    <span className="block text-xs font-bold text-slate-200">
                      Áreas de Convivência e Instalações Comuns
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                      <CheckboxField
                        id="check-casa-gourmet"
                        label="Área Gourmet"
                        subtitle="Churrasqueira e bancada"
                        checked={hasHouseGourmetArea}
                        onChange={setHasHouseGourmetArea}
                      />
                      <CheckboxField
                        id="check-casa-piscina"
                        label="Piscina"
                        subtitle="Piscina privativa e deck"
                        checked={hasHousePool}
                        onChange={setHasHousePool}
                      />
                      <CheckboxField
                        id="check-casa-jardim"
                        label="Quintal/Jardim"
                        subtitle="Área verde externa privativa"
                        checked={hasHouseBackyardGarden}
                        onChange={setHasHouseBackyardGarden}
                      />
                      <CheckboxField
                        id="check-casa-poco-elevador"
                        label="Poço de Elevador"
                        subtitle="Caixa de corrida para elevadores e monta-cargas"
                        checked={hasHouseElevatorShaft}
                        onChange={setHasHouseElevatorShaft}
                      />
                      {isSobrado ? (
                        <CheckboxField
                          id="check-sobrado-escada"
                          label="Escada"
                          subtitle="Cômodo único opcional de acesso interno"
                          checked={hasHouseStairs}
                          onChange={setHasHouseStairs}
                        />
                      ) : (
                        isVerticalBuilding && (
                          <CheckboxField
                            id="check-casa-escadas"
                            label="Escadas"
                            subtitle="Escadas de acesso e circulação"
                            checked={hasBuildingStairs}
                            onChange={setHasBuildingStairs}
                          />
                        )
                      )}
                      {isVerticalBuilding && (
                        <CheckboxField
                          id="check-casa-shaft"
                          label="Shaft"
                          subtitle="Shafts técnicos e prumadas"
                          checked={hasBuildingShaft}
                          onChange={setHasBuildingShaft}
                        />
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* ---------------------------------------------------------------------
                  CONDICIONAL 2: 'Prédio Residencial'
                  Inputs: Subsolos, Garagens (G1, G2...), Andares Tipo, Aptos por Andar.
                  Checkboxes: Térreo/Recepção, Lazer/Mezanino, Cobertura/Duplex, Casa de Máquinas, Barrilete, Reservatório Superior.
                  --------------------------------------------------------------------- */}
              {(tipologia === 'Prédio Residencial' || isPredioResidencial) && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  {/* Inputs Numéricos */}
                  <div className="space-y-2">
                    <span className="block text-xs font-bold text-slate-200">
                      Pavimentos e Apartamentos
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <NumericField
                        id="input-predio-subsolos"
                        label="Subsolos"
                        subtitle="Pavimentos técnicos subterrâneos (Subsolo 1, 2...)"
                        value={subsolosCount}
                        min={0}
                        max={15}
                        onChange={setSubsolosCount}
                      />
                      <NumericField
                        id="input-predio-garagens"
                        label="Garagens (G1, G2...)"
                        subtitle="Pavimentos de estacionamento"
                        value={garagesCount}
                        min={0}
                        max={15}
                        onChange={setGaragesCount}
                      />
                      <NumericField
                        id="input-predio-andares-tipo"
                        label="Andares Tipo"
                        subtitle="Quantidade de pavimentos residenciais padrão"
                        value={typicalFloors}
                        min={1}
                        max={80}
                        onChange={setTypicalFloors}
                      />
                      <NumericField
                        id="input-predio-apts-andar"
                        label="Aptos por Andar"
                        subtitle="Unidades privativas por nível"
                        value={aptsPerFloor}
                        min={1}
                        max={50}
                        onChange={setAptsPerFloor}
                      />
                    </div>
                  </div>

                  {/* Seção Exigida: Cômodos por Apartamento */}
                  <div className="space-y-2 pt-2 border-t border-slate-800/80">
                    <span className="block text-xs font-bold text-slate-200">
                      Cômodos por Apartamento
                    </span>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      <RoomNumericField
                        id="input-predio-quartos-apto"
                        label="Quartos"
                        subtitle="Dormitórios por apto"
                        value={buildingBedroomsPerApt}
                        min={0}
                        max={10}
                        onChange={setBuildingBedroomsPerApt}
                      />
                      <RoomNumericField
                        id="input-predio-suites-apto"
                        label="Suítes"
                        subtitle="Quartos com banheiro privativo"
                        value={buildingSuitesPerApt}
                        min={0}
                        max={10}
                        onChange={setBuildingSuitesPerApt}
                      />
                      <RoomNumericField
                        id="input-predio-salas-apto"
                        label="Salas"
                        subtitle="Salas de estar/jantar"
                        value={buildingLivingRoomsPerApt}
                        min={0}
                        max={10}
                        onChange={setBuildingLivingRoomsPerApt}
                      />
                      <RoomNumericField
                        id="input-predio-cozinhas-apto"
                        label="Cozinhas"
                        subtitle="Cozinhas e copas"
                        value={buildingKitchensPerApt}
                        min={0}
                        max={5}
                        onChange={setBuildingKitchensPerApt}
                      />
                      <RoomNumericField
                        id="input-predio-banheiros-apto"
                        label="Banheiros"
                        subtitle="Sanitários sociais"
                        value={buildingBathroomsPerApt}
                        min={0}
                        max={10}
                        onChange={setBuildingBathroomsPerApt}
                      />
                      <RoomNumericField
                        id="input-predio-lavabos-apto"
                        label="Lavabos"
                        subtitle="Lavabos privativos"
                        value={buildingLavabosPerApt}
                        min={0}
                        max={5}
                        onChange={setBuildingLavabosPerApt}
                      />
                      <RoomNumericField
                        id="input-predio-lavanderias-apto"
                        label="Lavanderias"
                        subtitle="Área de serviço"
                        value={buildingLaundryPerApt}
                        min={0}
                        max={5}
                        onChange={setBuildingLaundryPerApt}
                      />
                      <RoomNumericField
                        id="input-predio-area-tecnica-apto"
                        label="Área Técnica"
                        subtitle="Área técnica do apto"
                        value={technicalAreaCount}
                        min={0}
                        max={10}
                        onChange={setTechnicalAreaCount}
                      />
                    </div>
                  </div>

                  {/* Checkboxes */}
                  <div className="space-y-2 pt-2 border-t border-slate-800/80">
                    <span className="block text-xs font-bold text-slate-200">
                      Pavimentos Comuns e Instalações Técnicas
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      <CheckboxField
                        id="check-predio-terreo"
                        label="Térreo/Recepção"
                        subtitle="Hall de entrada e portaria"
                        checked={hasGroundHall}
                        onChange={setHasGroundHall}
                      />
                      <CheckboxField
                        id="check-predio-lazer"
                        label="Lazer/Mezanino"
                        subtitle="Salão de festas e áreas comuns"
                        checked={hasLeisureMezzanine}
                        onChange={setHasLeisureMezzanine}
                      />
                      <CheckboxField
                        id="check-predio-cobertura"
                        label="Cobertura/Duplex"
                        subtitle="Pavimento superior privativo"
                        checked={hasPenthouse}
                        onChange={setHasPenthouse}
                      />
                      <CheckboxField
                        id="check-predio-casa-maquinas"
                        label="Casa de Máquinas"
                        subtitle="Área técnica dos elevadores"
                        checked={hasMachineRoom}
                        onChange={setHasMachineRoom}
                      />
                      <CheckboxField
                        id="check-predio-poco-elevador"
                        label="Poço de Elevador"
                        subtitle="Caixa de corrida para elevadores e monta-cargas"
                        checked={hasBuildingElevatorShaft}
                        onChange={setHasBuildingElevatorShaft}
                      />
                      <CheckboxField
                        id="check-predio-barrilete"
                        label="Barrilete"
                        subtitle="Pavimento técnico hidráulico"
                        checked={hasTechnicalFloor}
                        onChange={setHasTechnicalFloor}
                      />
                      <CheckboxField
                        id="check-predio-reservatorio"
                        label="Reservatório"
                        subtitle="Reservatório de água (Nível Raiz independente)"
                        checked={hasUpperReservoir}
                        onChange={setHasUpperReservoir}
                      />
                      <CheckboxField
                        id="check-predio-escadas"
                        label="Escadas"
                        subtitle="Escadas de emergência nos pavimentos"
                        checked={hasBuildingStairs}
                        onChange={setHasBuildingStairs}
                      />
                      <CheckboxField
                        id="check-predio-shaft"
                        label="Shaft"
                        subtitle="Shafts de instalações hidráulicas e elétricas"
                        checked={hasBuildingShaft}
                        onChange={setHasBuildingShaft}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ---------------------------------------------------------------------
                  CONDICIONAL 3: 'Condomínio / Loteamento'
                  Inputs: Quadras, Lotes por Quadra, Praças.
                  Checkboxes: Portaria Principal, Portaria de Serviço, Clube Social, ETE.
                  --------------------------------------------------------------------- */}
              {(tipologia === 'Condomínio / Loteamento' || tipologia === 'Condomínio' || isCondominioLoteamento) && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  {/* Inputs Numéricos */}
                  <div className="space-y-2">
                    <span className="block text-xs font-bold text-slate-200">
                      Quadras, Lotes e Praças
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <NumericField
                        id="input-condo-quadras"
                        label="Quadras"
                        subtitle="Divisões territoriais do loteamento"
                        value={condoBlocksCount}
                        min={1}
                        max={50}
                        onChange={setCondoBlocksCount}
                      />
                      <NumericField
                        id="input-condo-lotes"
                        label="Lotes por Quadra"
                        subtitle="Quantidade de lotes em cada quadra"
                        value={condoLotsPerBlock}
                        min={1}
                        max={100}
                        onChange={setCondoLotsPerBlock}
                      />
                      <NumericField
                        id="input-condo-pracas"
                        label="Praças"
                        subtitle="Áreas de convivência pública"
                        value={condoSquaresCount}
                        min={0}
                        max={20}
                        onChange={setCondoSquaresCount}
                      />
                    </div>
                  </div>

                  {/* Seção Exigida: Unidades Habitacionais (Construção Civil) */}
                  <div className="space-y-2 pt-2 border-t border-slate-800/80">
                    <span className="block text-xs font-bold text-slate-200">
                      Unidades Habitacionais (Construção Civil)
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <NumericField
                        id="input-condo-casas-padrao"
                        label="Casas Populares / Padrão"
                        subtitle="Unidades térreas de metragem padrão"
                        value={condoStandardHouses}
                        min={0}
                        max={500}
                        onChange={setCondoStandardHouses}
                      />
                      <NumericField
                        id="input-condo-sobrados"
                        label="Sobrados / Geminadas"
                        subtitle="Unidades com múltiplos pavimentos"
                        value={condoTownhouses}
                        min={0}
                        max={500}
                        onChange={setCondoTownhouses}
                      />
                      <NumericField
                        id="input-condo-mansoes"
                        label="Mansões / Alto Padrão"
                        subtitle="Unidades isoladas de alto luxo"
                        value={condoMansions}
                        min={0}
                        max={500}
                        onChange={setCondoMansions}
                      />
                    </div>
                  </div>

                  {/* Seção Exigida: Cômodos por Unidade Habitacional */}
                  <div className="space-y-2 pt-2 border-t border-slate-800/80">
                    <span className="block text-xs font-bold text-slate-200">
                      Cômodos por Unidade Habitacional
                    </span>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      <RoomNumericField
                        id="input-condo-quartos-casa"
                        label="Quartos"
                        subtitle="Dormitórios por unidade"
                        value={condoBedroomsPerHouse}
                        min={0}
                        max={20}
                        onChange={setCondoBedroomsPerHouse}
                      />
                      <RoomNumericField
                        id="input-condo-suites-casa"
                        label="Suítes"
                        subtitle="Dormitórios com banheiro privativo"
                        value={condoSuitesPerHouse}
                        min={0}
                        max={15}
                        onChange={setCondoSuitesPerHouse}
                      />
                      <RoomNumericField
                        id="input-condo-salas-casa"
                        label="Salas"
                        subtitle="Salas de estar/jantar"
                        value={condoLivingRoomsPerHouse}
                        min={0}
                        max={10}
                        onChange={setCondoLivingRoomsPerHouse}
                      />
                      <RoomNumericField
                        id="input-condo-cozinhas-casa"
                        label="Cozinhas"
                        subtitle="Cozinhas e copas"
                        value={condoKitchensPerHouse}
                        min={0}
                        max={10}
                        onChange={setCondoKitchensPerHouse}
                      />
                      <RoomNumericField
                        id="input-condo-banheiros-casa"
                        label="Banheiros"
                        subtitle="Sanitários sociais"
                        value={condoBathroomsPerHouse}
                        min={0}
                        max={15}
                        onChange={setCondoBathroomsPerHouse}
                      />
                      <RoomNumericField
                        id="input-condo-lavabos-casa"
                        label="Lavabos"
                        subtitle="Lavabos por casa/unidade"
                        value={condoLavabosPerHouse}
                        min={0}
                        max={5}
                        onChange={setCondoLavabosPerHouse}
                      />
                      <RoomNumericField
                        id="input-condo-lavanderias-casa"
                        label="Lavanderias"
                        subtitle="Área de serviço"
                        value={condoLaundryPerHouse}
                        min={0}
                        max={5}
                        onChange={setCondoLaundryPerHouse}
                      />
                      <RoomNumericField
                        id="input-condo-area-tecnica"
                        label="Área Técnica"
                        subtitle="Área técnica privativa"
                        value={technicalAreaCount}
                        min={0}
                        max={10}
                        onChange={setTechnicalAreaCount}
                      />
                    </div>
                  </div>

                  {/* Checkboxes */}
                  <div className="space-y-2 pt-2 border-t border-slate-800/80">
                    <span className="block text-xs font-bold text-slate-200">
                      Infraestrutura e Portarias
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      <CheckboxField
                        id="check-condo-portaria-principal"
                        label="Portaria Principal"
                        subtitle="Controle de acesso social"
                        checked={hasCondoMainGate}
                        onChange={setHasCondoMainGate}
                      />
                      <CheckboxField
                        id="check-condo-portaria-servico"
                        label="Portaria de Serviço"
                        subtitle="Acesso de fornecedores e obras"
                        checked={hasCondoServiceGate}
                        onChange={setHasCondoServiceGate}
                      />
                      <CheckboxField
                        id="check-condo-clube"
                        label="Clube Social"
                        subtitle="Piscinas, salão e esportes"
                        checked={hasCondoSocialClub}
                        onChange={setHasCondoSocialClub}
                      />
                      <CheckboxField
                        id="check-condo-ete"
                        label="ETE"
                        subtitle="Estação de Tratamento de Esgoto"
                        checked={hasCondoEte}
                        onChange={setHasCondoEte}
                      />
                      <CheckboxField
                        id="check-condo-poco-elevador"
                        label="Poço de Elevador"
                        subtitle="Caixa de corrida para elevadores e monta-cargas"
                        checked={hasCondoElevatorShaft}
                        onChange={setHasCondoElevatorShaft}
                      />
                      {isVerticalBuilding && (
                        <>
                          <CheckboxField
                            id="check-condo-escadas"
                            label="Escadas"
                            subtitle="Escadas de acesso e circulação"
                            checked={hasBuildingStairs}
                            onChange={setHasBuildingStairs}
                          />
                          <CheckboxField
                            id="check-condo-shaft"
                            label="Shaft"
                            subtitle="Shafts técnicos de infraestrutura"
                            checked={hasBuildingShaft}
                            onChange={setHasBuildingShaft}
                          />
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* ---------------------------------------------------------------------
                  CONDICIONAL 4: 'Hospital / Unidade de Saúde'
                  Inputs: Blocos/Alas, Andares, Consultórios, Salas Cirúrgicas, Leitos de UTI, Quartos Internação.
                  Checkboxes: Pronto-Socorro, CME, Centro de Imagens, Casa de Gases.
                  --------------------------------------------------------------------- */}
              {(tipologia === 'Hospital / Unidade de Saúde' || isHospitalSaude) && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  {/* Inputs Numéricos */}
                  <div className="space-y-2">
                    <span className="block text-xs font-bold text-slate-200">
                      Dimensionamento Hospitalar
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      <NumericField
                        id="input-hosp-blocos"
                        label="Blocos/Alas"
                        subtitle="Setores do complexo de saúde"
                        value={hospitalBlocks}
                        min={1}
                        max={20}
                        onChange={setHospitalBlocks}
                      />
                      <NumericField
                        id="input-hosp-andares"
                        label="Andares"
                        subtitle="Pavimentos verticais"
                        value={hospitalFloors}
                        min={1}
                        max={40}
                        onChange={setHospitalFloors}
                      />
                      <NumericField
                        id="input-hosp-consultorios"
                        label="Consultórios por Andar"
                        subtitle="Salas de atendimento médico por pavimento"
                        value={hospitalConsultingRoomsPerFloor}
                        min={0}
                        max={30}
                        onChange={setHospitalConsultingRoomsPerFloor}
                      />
                      <NumericField
                        id="input-hosp-cirurgicas"
                        label="Salas Cirúrgicas"
                        subtitle="Salas operatórias especializadas"
                        value={hospitalSurgicalRooms}
                        min={0}
                        max={50}
                        onChange={setHospitalSurgicalRooms}
                      />
                      <NumericField
                        id="input-hosp-uti"
                        label="Leitos de UTI"
                        subtitle="Leitos de terapia intensiva"
                        value={hospitalUtiBeds}
                        min={0}
                        max={100}
                        onChange={setHospitalUtiBeds}
                      />
                      <NumericField
                        id="input-hosp-internacao"
                        label="Quartos de Internação por Andar"
                        subtitle="Quartos e enfermarias por pavimento"
                        value={hospitalInternmentRoomsPerFloor}
                        min={0}
                        max={50}
                        onChange={setHospitalInternmentRoomsPerFloor}
                      />
                      <NumericField
                        id="input-hosp-lavabos"
                        label="Lavabos por Andar"
                        subtitle="Sanitários e lavabos por pavimento"
                        value={hospitalLavabosPerFloor}
                        min={0}
                        max={30}
                        onChange={setHospitalLavabosPerFloor}
                      />
                      <NumericField
                        id="input-hosp-area-tecnica"
                        label="Área Técnica"
                        subtitle="Áreas técnicas internas por pavimento"
                        value={technicalAreaCount}
                        min={0}
                        max={20}
                        onChange={setTechnicalAreaCount}
                      />
                    </div>
                  </div>

                  {/* Checkboxes */}
                  <div className="space-y-2 pt-2 border-t border-slate-800/80">
                    <span className="block text-xs font-bold text-slate-200">
                      Unidades Críticas e Apoio Técnico
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      <CheckboxField
                        id="check-hosp-ps"
                        label="Pronto-Socorro"
                        subtitle="Urgência e triagem médica"
                        checked={hasHospitalEmergency}
                        onChange={setHasHospitalEmergency}
                      />
                      <CheckboxField
                        id="check-hosp-cme"
                        label="CME"
                        subtitle="Central de Material e Esterilização"
                        checked={hasHospitalCme}
                        onChange={setHasHospitalCme}
                      />
                      <CheckboxField
                        id="check-hosp-imagem"
                        label="Centro de Imagens"
                        subtitle="Raio-X, tomografia e exames"
                        checked={hasHospitalImagingCenter}
                        onChange={setHasHospitalImagingCenter}
                      />
                      <CheckboxField
                        id="check-hosp-gases"
                        label="Casa de Gases"
                        subtitle="Central de oxigênio e vácuo"
                        checked={hasHospitalGasHouse}
                        onChange={setHasHospitalGasHouse}
                      />
                      <CheckboxField
                        id="check-hosp-poco-elevador"
                        label="Poço de Elevador"
                        subtitle="Caixa de corrida para elevadores e monta-cargas"
                        checked={hasHospitalElevatorShaft}
                        onChange={setHasHospitalElevatorShaft}
                      />
                      <CheckboxField
                        id="check-hosp-escadas"
                        label="Escadas"
                        subtitle="Escadas de emergência nos pavimentos"
                        checked={hasBuildingStairs}
                        onChange={setHasBuildingStairs}
                      />
                      <CheckboxField
                        id="check-hosp-shaft"
                        label="Shaft"
                        subtitle="Shafts de gases medicinais e elétrica"
                        checked={hasBuildingShaft}
                        onChange={setHasBuildingShaft}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ---------------------------------------------------------------------
                  CONDICIONAL 5: 'Prédio Comercial / Shopping'
                  Inputs: Subsolos, Pisos de Lojas (Mall), Lojas Âncora, Lojas Satélite, Salas Comerciais.
                  Checkboxes: Praça de Alimentação, Cinemas, Docas, CAG.
                  --------------------------------------------------------------------- */}
              {(tipologia === 'Prédio Comercial / Shopping' || tipologia === 'Shopping Center / Comercial' || isPredioComercialShopping) && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  {/* Inputs Numéricos */}
                  <div className="space-y-2">
                    <span className="block text-xs font-bold text-slate-200">
                      Pisos, Lojas e Salas Comerciais
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      <NumericField
                        id="input-shop-subsolos"
                        label="Subsolos"
                        subtitle="Estacionamento subterrâneo"
                        value={commercialSubsolos}
                        min={0}
                        max={10}
                        onChange={setCommercialSubsolos}
                      />
                      <NumericField
                        id="input-shop-pisos"
                        label="Pisos de Lojas (Mall)"
                        subtitle="Pavimentos comerciais"
                        value={commercialMallFloors}
                        min={1}
                        max={20}
                        onChange={setCommercialMallFloors}
                      />
                      <NumericField
                        id="input-shop-ancora"
                        label="Lojas Âncora"
                        subtitle="Grandes lojas de departamento"
                        value={commercialAnchorStores}
                        min={0}
                        max={30}
                        onChange={setCommercialAnchorStores}
                      />
                      <NumericField
                        id="input-shop-satelite"
                        label="Lojas Satélite"
                        subtitle="Lojas comerciais padrão e quiosques"
                        value={commercialSatelliteStores}
                        min={0}
                        max={200}
                        onChange={setCommercialSatelliteStores}
                      />
                      <NumericField
                        id="input-shop-salas"
                        label="Salas Comerciais"
                        subtitle="Escritórios e salas empresariais"
                        value={commercialOfficeRooms}
                        min={0}
                        max={300}
                        onChange={setCommercialOfficeRooms}
                      />
                      <NumericField
                        id="input-shop-lavabos"
                        label="Lavabos por Piso"
                        subtitle="Baterias de lavabos por piso do Mall"
                        value={commercialLavabosPerFloor}
                        min={0}
                        max={30}
                        onChange={setCommercialLavabosPerFloor}
                      />
                      <NumericField
                        id="input-shop-area-tecnica"
                        label="Área Técnica"
                        subtitle="Área técnica por pavimento/loja"
                        value={technicalAreaCount}
                        min={0}
                        max={30}
                        onChange={setTechnicalAreaCount}
                      />
                    </div>
                  </div>

                  {/* Checkboxes */}
                  <div className="space-y-2 pt-2 border-t border-slate-800/80">
                    <span className="block text-xs font-bold text-slate-200">
                      Lazer, Docas e Áreas Técnicas
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      <CheckboxField
                        id="check-shop-praca"
                        label="Praça de Alimentação"
                        subtitle="Restaurantes e mesas"
                        checked={hasCommercialFoodCourt}
                        onChange={setHasCommercialFoodCourt}
                      />
                      <CheckboxField
                        id="check-shop-cinemas"
                        label="Cinemas"
                        subtitle="Salas de cinema e entretenimento"
                        checked={hasCommercialCinemas}
                        onChange={setHasCommercialCinemas}
                      />
                      <CheckboxField
                        id="check-shop-docas"
                        label="Docas"
                        subtitle="Recebimento e carga de lojistas"
                        checked={hasCommercialDocks}
                        onChange={setHasCommercialDocks}
                      />
                      <CheckboxField
                        id="check-shop-cag"
                        label="CAG"
                        subtitle="Central de Água Gelada e climatização"
                        checked={hasCommercialCag}
                        onChange={setHasCommercialCag}
                      />
                      <CheckboxField
                        id="check-shop-poco-elevador"
                        label="Poço de Elevador"
                        subtitle="Caixa de corrida para elevadores e monta-cargas"
                        checked={hasCommercialElevatorShaft}
                        onChange={setHasCommercialElevatorShaft}
                      />
                      <CheckboxField
                        id="check-shop-escadas"
                        label="Escadas"
                        subtitle="Escadas de emergência e de circulação"
                        checked={hasBuildingStairs}
                        onChange={setHasBuildingStairs}
                      />
                      <CheckboxField
                        id="check-shop-shaft"
                        label="Shaft"
                        subtitle="Shafts de infraestrutura e climatização"
                        checked={hasBuildingShaft}
                        onChange={setHasBuildingShaft}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ---------------------------------------------------------------------
                  CONDICIONAL 6: 'Galpão Logístico / Industrial'
                  Inputs: Naves/Galpões, Baterias de Docas.
                  Checkboxes: Pátio de Manobras, Mezanino Administrativo, Refeitório, Portaria Blindada.
                  --------------------------------------------------------------------- */}
              {(tipologia === 'Galpão Logístico / Industrial' || isGalpaoLogistico) && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  {/* Inputs Numéricos */}
                  <div className="space-y-2">
                    <span className="block text-xs font-bold text-slate-200">
                      Armazenagem e Operação Logística
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <NumericField
                        id="input-galpao-naves"
                        label="Naves/Galpões"
                        subtitle="Pavilhões e módulos de armazenagem"
                        value={warehouseNaves}
                        min={1}
                        max={30}
                        onChange={setWarehouseNaves}
                      />
                      <NumericField
                        id="input-galpao-docas"
                        label="Baterias de Docas"
                        subtitle="Baias com niveladores de carga"
                        value={warehouseDockBatteries}
                        min={1}
                        max={80}
                        onChange={setWarehouseDockBatteries}
                      />
                      <NumericField
                        id="input-galpao-area-tecnica"
                        label="Área Técnica"
                        subtitle="Área técnica das naves"
                        value={technicalAreaCount}
                        min={0}
                        max={20}
                        onChange={setTechnicalAreaCount}
                      />
                    </div>
                  </div>

                  {/* Checkboxes */}
                  <div className="space-y-2 pt-2 border-t border-slate-800/80">
                    <span className="block text-xs font-bold text-slate-200">
                      Infraestrutura e Apoio Operacional
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      <CheckboxField
                        id="check-galpao-patio"
                        label="Pátio de Manobras"
                        subtitle="Área externa para carretas"
                        checked={hasWarehouseManeuverYard}
                        onChange={setHasWarehouseManeuverYard}
                      />
                      <CheckboxField
                        id="check-galpao-mezanino"
                        label="Mezanino Administrativo"
                        subtitle="Escritórios e salas de gestão"
                        checked={hasWarehouseAdminMezzanine}
                        onChange={setHasWarehouseAdminMezzanine}
                      />
                      <CheckboxField
                        id="check-galpao-refeitorio"
                        label="Refeitório"
                        subtitle="Refeitório e vestiários"
                        checked={hasWarehouseRefectory}
                        onChange={setHasWarehouseRefectory}
                      />
                      <CheckboxField
                        id="check-galpao-portaria"
                        label="Portaria Blindada"
                        subtitle="Guarita e balança rodoviária"
                        checked={hasWarehouseArmoredGate}
                        onChange={setHasWarehouseArmoredGate}
                      />
                      <CheckboxField
                        id="check-galpao-poco-elevador"
                        label="Poço de Elevador"
                        subtitle="Caixa de corrida para elevadores e monta-cargas"
                        checked={hasWarehouseElevatorShaft}
                        onChange={setHasWarehouseElevatorShaft}
                      />
                      {isVerticalBuilding && (
                        <>
                          <CheckboxField
                            id="check-galpao-escadas"
                            label="Escadas"
                            subtitle="Escadas de acesso ao mezanino"
                            checked={hasBuildingStairs}
                            onChange={setHasBuildingStairs}
                          />
                          <CheckboxField
                            id="check-galpao-shaft"
                            label="Shaft"
                            subtitle="Shafts e galerias de instalações industriais"
                            checked={hasBuildingShaft}
                            onChange={setHasBuildingShaft}
                          />
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* =========================================================================
              PASSO 3: ÁRVORE DE LOCAIS COMPLETA (VISUALIZAR, EDITAR, EXCLUIR, ADICIONAR)
              ========================================================================= */}
          {currentStep === 3 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-4">
                
                {/* Header da lista de locais */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <ListTree className="w-4 h-4" style={{ color: 'var(--btn-primary)' }} />
                      <span>Árvore de Locais da Obra</span>
                      <span className="text-xs font-normal text-slate-400">
                        ({environments.length} {environments.length === 1 ? 'ambiente' : 'ambientes'})
                      </span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Revise os ambientes gerados para a sua obra antes de salvar.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {treeNodes.length > 0 && (
                      <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
                        <button
                          type="button"
                          onClick={() => {
                            const details = document.querySelectorAll('details');
                            details.forEach((d) => (d.open = true));
                          }}
                          className="px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
                        >
                          Expandir Todos
                        </button>
                        <span className="text-slate-700">|</span>
                        <button
                          type="button"
                          onClick={() => {
                            const details = document.querySelectorAll('details');
                            details.forEach((d) => (d.open = false));
                          }}
                          className="px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
                        >
                          Recolher Todos
                        </button>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => setIsAddingManual((prev) => !prev)}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border border-slate-700 shrink-0"
                    >
                      <Plus className="w-4 h-4" style={{ color: 'var(--btn-primary)' }} />
                      <span>Adicionar Ambiente</span>
                    </button>
                  </div>
                </div>

                {/* Formulário de inclusão manual */}
                {isAddingManual && (
                  <div
                    className="p-3.5 rounded-xl bg-slate-900 border space-y-3 animate-in fade-in duration-150"
                    style={{ borderColor: 'var(--btn-primary)' }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Plus className="w-4 h-4" style={{ color: 'var(--btn-primary)' }} />
                        Novo Ambiente
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsAddingManual(false)}
                        className="text-slate-400 hover:text-white cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                          Nome do Ambiente *
                        </label>
                        <input
                          type="text"
                          value={manualName}
                          onChange={(e) => setManualName(e.target.value)}
                          placeholder="Ex: Sala de Reunião, Espaço Gourmet, G3"
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-[var(--btn-primary)]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                          Tipo
                        </label>
                        <input
                          type="text"
                          value={manualType}
                          onChange={(e) => setManualType(e.target.value)}
                          placeholder="Ex: Área Comum, Pavimento"
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-[var(--btn-primary)]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                          Nível
                        </label>
                        <input
                          type="number"
                          value={manualLevel}
                          onChange={(e) => setManualLevel(parseInt(e.target.value) || 0)}
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-[var(--btn-primary)] font-mono text-center appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setIsAddingManual(false)}
                        className="px-3 py-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white text-xs font-semibold cursor-pointer"
                      >
                        Cancelar
                      </button>
                      <button
                        type="button"
                        onClick={handleAddManualEnvironment}
                        className="px-4 py-1 rounded-lg font-bold text-xs transition-colors cursor-pointer"
                        style={{ backgroundColor: 'var(--btn-primary)', color: 'var(--btn-primary-text)' }}
                      >
                        Adicionar
                      </button>
                    </div>
                  </div>
                )}

                {/* Filtro de busca se houver muitos ambientes */}
                {environments.length > 6 && (
                  <input
                    type="text"
                    value={searchEnvFilter}
                    onChange={(e) => setSearchEnvFilter(e.target.value)}
                    placeholder="Filtrar ambientes por nome..."
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[var(--btn-primary)]"
                  />
                )}

                {/* Árvore Hierárquica Universal de Ambientes (<TreeNode />) */}
                <div className="space-y-2.5 max-h-[50vh] overflow-y-auto pr-1">
                  {treeNodes.length === 0 ? (
                    <div className="p-8 text-center rounded-xl bg-slate-900/60 border border-dashed border-slate-800 text-xs text-slate-400 space-y-2">
                      <p>Nenhum ambiente encontrado na lista.</p>
                      <button
                        type="button"
                        onClick={() => generateEnvironmentsFromInputs()}
                        className="px-3 py-1.5 rounded-lg font-bold text-xs cursor-pointer"
                        style={{ backgroundColor: 'var(--btn-primary)', color: 'var(--btn-primary-text)' }}
                      >
                        Gerar Ambientes do Passo 2
                      </button>
                    </div>
                  ) : (
                    treeNodes.map((node) => (
                      <TreeNode
                        key={node.id || node.fullPath}
                        node={node}
                        onAdd={handleAddContextualEnvironment}
                        onEdit={handleEditTreeNode}
                        onDelete={handleDeleteTreeNode}
                      />
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-900/95 flex items-center justify-between gap-3 shrink-0">
          <div>
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => (prev - 1) as 1 | 2 | 3)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Voltar</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white font-semibold text-xs transition-colors cursor-pointer"
              >
                Cancelar
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {currentStep === 1 && (
              <button
                type="button"
                onClick={goToStep2}
                className="px-5 py-2.5 rounded-xl font-bold text-xs transition-all shadow-sm cursor-pointer flex items-center gap-1.5 hover:opacity-90"
                style={{ backgroundColor: 'var(--btn-primary)', color: 'var(--btn-primary-text)' }}
              >
                <span>Avançar para o Gerador Rápido</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}

            {currentStep === 2 && (
              <button
                type="button"
                onClick={goToStep3}
                className="px-5 py-2.5 rounded-xl font-bold text-xs transition-all shadow-sm cursor-pointer flex items-center gap-1.5 hover:opacity-90"
                style={{ backgroundColor: 'var(--btn-primary)', color: 'var(--btn-primary-text)' }}
              >
                <span>Avançar para a Árvore de Locais</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}

            {currentStep === 3 && (
              <button
                type="button"
                disabled={isSubmitting || environments.length === 0}
                onClick={handleSaveWorkAndLinkMap}
                className="px-6 py-2.5 rounded-xl font-bold text-xs transition-all shadow-md cursor-pointer flex items-center gap-2 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: 'var(--btn-primary)', color: 'var(--btn-primary-text)' }}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{workToEdit ? 'Salvar Alterações da Obra' : 'Salvar Obra'}</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AddWorkMapModal;
