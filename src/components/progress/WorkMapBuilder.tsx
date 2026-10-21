import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { EAP_CATEGORIES, EAPCategoryTemplate, EAPServiceTemplate } from '../../eapTemplates';
import { Floor, ConstructionService } from '../../types';
import {
  Compass,
  Building,
  Home,
  Warehouse,
  Plus,
  Trash2,
  CheckCircle2,
  Calendar,
  Layers,
  ChevronRight,
  ChevronDown,
  Sparkles,
  Info,
  HelpCircle,
  FileCheck2,
  Hammer,
  AlertCircle,
  ListTree,
  ArrowRight,
  ShieldCheck,
  Zap,
  LayoutGrid,
  Folder,
  FolderOpen
} from 'lucide-react';

export type InterventionType = 'Construção do Zero (Desde a Fundação)' | 'Reforma / Retrofit';

export interface TypologyPreset {
  id: string;
  code: string; // matches eapTemplates category code: '01', '02', '03', '04', '05', '06', '07'
  name: string;
  categoryTitle: string;
  description: string;
  icon: string;
  scopeHint: string;
  defaults: Record<string, number>;
}

export const TYPOLOGY_PRESETS: TypologyPreset[] = [
  {
    id: 'casa',
    code: '01',
    name: 'Residência Unifamiliar (Casa)',
    categoryTitle: 'Categoria 01 — Serviços Preliminares e Canteiro',
    description: 'Casas térreas, sobrados, condomínios fechados ou residências de alto padrão.',
    icon: 'home',
    scopeHint: 'Planejamento espacial por cômodos internos, suítes e áreas de convivência externa.',
    defaults: {
      bedrooms: 3,
      suites: 1,
      bathrooms: 2,
      livingRooms: 2,
      kitchens: 1,
      gourmet: 1,
      outdoor: 1,
    },
  },
  {
    id: 'predio',
    code: '02',
    name: 'Edifício Residencial ou Comercial (Prédio)',
    categoryTitle: 'Categoria 02 — Infraestrutura e Fundações Profundas',
    description: 'Edificações verticais em múltiplos pavimentos com subsolos, tipo e cobertura.',
    icon: 'building',
    scopeHint: 'Estruturação vertical por subsolos de garagem, térreo/lazer, andares tipo e cobertura técnica.',
    defaults: {
      subsolos: 1,
      garagens: 2,
      groundLeisure: 1,
      typicalFloors: 12,
      aptsPerFloor: 4,
      penthouse: 1,
      machineRoom: 1,
      bedroomsPerApt: 2,
      suitesPerApt: 1,
      livingRoomsPerApt: 1,
      kitchensPerApt: 1,
      bathroomsPerApt: 1,
      laundryPerApt: 1,
    },
  },
  {
    id: 'galpao',
    code: '03',
    name: 'Galpão Logístico / Industrial',
    categoryTitle: 'Categoria 03 — Supraestrutura e Elementos Estruturais',
    description: 'Centros de distribuição, indústrias, pavilhões de armazenagem e docas de carga.',
    icon: 'warehouse',
    scopeHint: 'Configuração de docas niveladas, pátio de manobras, área fabril e mezaninos administrativos.',
    defaults: {
      docks: 6,
      storageArea: 1,
      mezzanines: 2,
      maneuverYard: 1,
      adminOffice: 2,
      portaria: 1,
    },
  },
  {
    id: 'hospital',
    code: '04',
    name: 'Hospital / Unidade de Saúde / Clínicas',
    categoryTitle: 'Categoria 04 — Vedações, Alvenarias, Divisórias e Coberturas',
    description: 'Hospitais gerais, centros cirúrgicos, UTIs, pronto-atendimento e clínicas especializadas.',
    icon: 'activity',
    scopeHint: 'Divisão rigorosa por leitos, enfermarias, salas cirúrgicas esterilizadas e UTIs.',
    defaults: {
      floors: 4,
      consultingRoomsPerFloor: 3,
      internmentRoomsPerFloor: 6,
      vipSuites: 2,
      utiRooms: 4,
      surgicalRooms: 3,
      emergencyRooms: 1,
      receptions: 1,
      hasElevatorShaft: 1,
    },
  },
  {
    id: 'shopping',
    code: '05',
    name: 'Shopping Center / Centro Comercial / Mall',
    categoryTitle: 'Instalações Técnicas, AVAC, Combate a Incêndio e Lojas',
    description: 'Complexos comerciais fechados, praças de alimentação, lojas âncoras e cinemas.',
    icon: 'shopping-bag',
    scopeHint: 'Mapeamento de corredores principais (malls), lojas satélites, âncoras e praça gourmet.',
    defaults: {
      mallCorridors: 3,
      anchorStores: 4,
      satelliteStores: 24,
      foodCourt: 2,
      cinemas: 1,
      technicalDeck: 2,
    },
  },
  {
    id: 'loteamento',
    code: '06',
    name: 'Condomínio Fechado / Loteamento / Infraestrutura Urbana',
    categoryTitle: 'Redes Públicas, Drenagem e Infraestrutura Urbana',
    description: 'Urbanizações horizontais, abertura de vias, redes públicas, quadras e lotes.',
    icon: 'map',
    scopeHint: 'Setorização por quadras habitacionais, praças centrais, portaria social e áreas de preservação.',
    defaults: {
      blocks: 8,
      lotsPerBlock: 12,
      standardHouses: 0,
      townhouses: 0,
      mansions: 0,
      bedroomsPerHouse: 2,
      suitesPerHouse: 1,
      livingRoomsPerHouse: 1,
      kitchensPerHouse: 1,
      bathroomsPerHouse: 1,
      laundryPerHouse: 1,
      hasElevatorShaft: 1,
      guardhouse: 1,
      clubhouse: 1,
      centralSquare: 2,
      utilitySubstation: 1,
    },
  },
  {
    id: 'reforma',
    code: '07',
    name: 'Reforma / Retrofit Comercial ou Residencial',
    categoryTitle: 'Demolição, Reforço Estrutural, Novas Instalações e Acabamentos',
    description: 'Adequações prediais, demolições controladas, substituição de instalações técnicas e retrofit.',
    icon: 'wrench',
    scopeHint: 'Setorização por zonas de intervenção, salas comerciais, demolição e repaginação.',
    defaults: {
      floors: 3,
      demolitionZones: 2,
      retrofitSectors: 4,
      electricalRevamp: 1,
      plumbingRevamp: 1,
      hvacRevamp: 1,
    },
  },
];

interface EditableLocation {
  id: string;
  name: string;
  level: number;
  type: string;
}

export interface LocationTreeNode {
  id: string;
  part: string;
  fullPath: string;
  level: number;
  isLeaf: boolean;
  children: LocationTreeNode[];
  originalLocation?: EditableLocation;
  totalLeavesCount: number;
}

export const WorkMapBuilder: React.FC<{
  onComplete?: () => void;
  onCancel?: () => void;
}> = ({ onComplete, onCancel }) => {
  const { currentWork, saveWorkMapStructure, companyBranding, showToast } = useApp();

  // 1. Tipo de Intervenção
  const [interventionType, setInterventionType] = useState<InterventionType>(
    currentWork.interventionType || 'Construção do Zero (Desde a Fundação)'
  );

  // 2. Tipologia do Empreendimento (default: predio ou casa)
  const [selectedTypologyId, setSelectedTypologyId] = useState<string>(() => {
    if (currentWork.typology) {
      const match = TYPOLOGY_PRESETS.find(
        (t) => t.name.toLowerCase() === currentWork.typology?.toLowerCase() || t.id === currentWork.typology
      );
      if (match) return match.id;
    }
    return currentWork.type === 'Residencial' ? 'predio' : 'casa';
  });

  const activePreset = TYPOLOGY_PRESETS.find((t) => t.id === selectedTypologyId) || TYPOLOGY_PRESETS[0];

  // Contadores rápidos por tipologia
  const [numericInputs, setNumericInputs] = useState<Record<string, number>>(activePreset.defaults);

  // Árvore de locais gerada e editável
  const [locations, setLocations] = useState<EditableLocation[]>(() => {
    if (currentWork.floors && currentWork.floors.length > 0) {
      return currentWork.floors.map((f, idx) => ({
        id: f.id,
        name: f.name,
        level: f.level ?? idx,
        type: 'Pavimento/Ambiente',
      }));
    }
    return [
      { id: 'loc-1', name: 'Térreo / Acesso Principal', level: 0, type: 'Área Comum' },
      { id: 'loc-2', name: '1º Pavimento', level: 1, type: 'Pavimento Tipo' },
    ];
  });

  // Modal / Input para adicionar local manual
  const [newLocationName, setNewLocationName] = useState('');
  const [isAddingCustom, setIsAddingCustom] = useState(false);
  const [editingLocId, setEditingLocId] = useState<string | null>(null);
  const [editingLocName, setEditingLocName] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Estado dos Accordions da Árvore Hierárquica (iniciam todos recolhidos/fechados)
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({});

  // Mudança de tipologia
  const handleSelectTypology = (preset: TypologyPreset) => {
    setSelectedTypologyId(preset.id);
    setNumericInputs(preset.defaults);
  };

  const handleNumericChange = (key: string, value: number) => {
    const val = Math.max(0, Math.min(99, Number.isNaN(value) ? 0 : value));
    setNumericInputs((prev) => ({ ...prev, [key]: val }));
  };

  // Gerador Rápido de Pavimentos / Ambientes baseado nos seletores da tipologia (generateLocations)
  const generateLocations = () => {
    const list: EditableLocation[] = [];
    let currentLevel = 0;

    if (selectedTypologyId === 'casa') {
      const { bedrooms = 0, suites = 0, bathrooms = 0, livingRooms = 0, kitchens = 0, gourmet = 0, outdoor = 0 } = numericInputs;
      
      list.push({ id: `loc-${Date.now()}-ext`, name: 'Área Externa & Fachada Frontal', level: currentLevel++, type: 'Área Externa' });
      
      for (let i = 1; i <= livingRooms; i++) {
        list.push({ id: `loc-${Date.now()}-sala-${i}`, name: livingRooms === 1 ? 'Sala de Estar / Jantar' : `Sala ${i}`, level: currentLevel++, type: 'Ambiente' });
      }
      for (let i = 1; i <= kitchens; i++) {
        list.push({ id: `loc-${Date.now()}-coz-${i}`, name: kitchens === 1 ? 'Cozinha & Despensa' : `Cozinha ${i}`, level: currentLevel++, type: 'Área Molhada' });
      }
      for (let i = 1; i <= suites; i++) {
        list.push({ id: `loc-${Date.now()}-suite-${i}`, name: suites === 1 ? 'Suíte Master' : `Suíte ${i}`, level: currentLevel++, type: 'Quarto' });
      }
      for (let i = 1; i <= bedrooms; i++) {
        list.push({ id: `loc-${Date.now()}-quarto-${i}`, name: `Quarto Social ${i}`, level: currentLevel++, type: 'Quarto' });
      }
      for (let i = 1; i <= bathrooms; i++) {
        list.push({ id: `loc-${Date.now()}-banh-${i}`, name: bathrooms === 1 ? 'Banheiro Social' : `Banheiro ${i}`, level: currentLevel++, type: 'Área Molhada' });
      }
      for (let i = 1; i <= gourmet; i++) {
        list.push({ id: `loc-${Date.now()}-gourmet-${i}`, name: gourmet === 1 ? 'Espaço Gourmet & Churrasqueira' : `Espaço Gourmet ${i}`, level: currentLevel++, type: 'Lazer' });
      }
      for (let i = 1; i <= outdoor; i++) {
        list.push({ id: `loc-${Date.now()}-jardim-${i}`, name: outdoor === 1 ? 'Quintal / Piscina / Jardim' : `Área Externa ${i}`, level: currentLevel++, type: 'Área Externa' });
      }
    } else if (selectedTypologyId === 'predio') {
      const { 
        subsolos = 1, 
        garagens = 2, 
        groundLeisure = 0, 
        typicalFloors = 0, 
        aptsPerFloor = 0, 
        penthouse = 0, 
        machineRoom = 0,
        hasElevatorShaft = 0,
        bedroomsPerApt = 2,
        suitesPerApt = 1,
        livingRoomsPerApt = 1,
        kitchensPerApt = 1,
        bathroomsPerApt = 1,
        laundryPerApt = 1,
      } = numericInputs;

      // 1. Subsolos: Pavimentos técnicos subterrâneos ('Subsolo 1', 'Subsolo 2', etc.)
      if (subsolos > 0) {
        for (let s = 1; s <= subsolos; s++) {
          list.push({
            id: `loc-${Date.now()}-sub-${s}`,
            name: `Subsolo ${s}`,
            level: -s,
            type: 'Subsolo',
          });
        }
      }

      // 2. Garagens: Pavimentos de estacionamento ('G1', 'G2', 'G3', etc.)
      if (garagens > 0) {
        for (let g = 1; g <= garagens; g++) {
          list.push({
            id: `loc-${Date.now()}-gar-${g}`,
            name: `G${g}`,
            level: -g,
            type: 'Garagem',
          });
        }
      }

      if (groundLeisure > 0) {
        list.push({ id: `loc-${Date.now()}-terreo`, name: 'Térreo / Portaria & Hall Social', level: 0, type: 'Acesso' });
        if (groundLeisure > 1) {
          list.push({ id: `loc-${Date.now()}-lazer`, name: 'Pavimento de Lazer & Piscinas', level: 0.5, type: 'Lazer' });
        }
      }

      // 3. Andares Tipo com sub-loop de Aptos por Andar e terceiro nível de Cômodos por Apto (3 loops aninhados)
      // Ex: '1º Andar - Apto 11 - Sala', '1º Andar - Apto 11 - Suíte 1', etc.
      for (let f = 1; f <= typicalFloors; f++) {
        const floorName = `${f}º Andar`;
        if (aptsPerFloor <= 0) {
          list.push({ id: `loc-${Date.now()}-tipo-${f}`, name: floorName, level: f, type: 'Pavimento Tipo' });
          continue;
        }

        for (let a = 1; a <= aptsPerFloor; a++) {
          const aptCode = aptsPerFloor < 10 ? `${f}${a}` : `${f}${String(a).padStart(2, '0')}`;
          const aptBase = `${floorName} - Apto ${aptCode}`;

          const hasRooms =
            livingRoomsPerApt > 0 ||
            suitesPerApt > 0 ||
            bedroomsPerApt > 0 ||
            kitchensPerApt > 0 ||
            bathroomsPerApt > 0 ||
            laundryPerApt > 0;

          if (!hasRooms) {
            list.push({
              id: `loc-${Date.now()}-tipo-${f}-apto-${a}`,
              name: aptBase,
              level: f,
              type: 'Apartamento',
            });
          } else {
            // 3º nível: cômodos concatenados com ' - '
            // Salas
            for (let s = 1; s <= livingRoomsPerApt; s++) {
              const roomName = livingRoomsPerApt === 1 ? 'Sala' : `Sala ${s}`;
              list.push({
                id: `loc-${Date.now()}-tipo-${f}-apto-${a}-sala-${s}`,
                name: `${aptBase} - ${roomName}`,
                level: f,
                type: 'Apartamento / Sala',
              });
            }
            // Suítes (Ex: '1º Andar - Apto 11 - Suíte 1')
            for (let st = 1; st <= suitesPerApt; st++) {
              const roomName = `Suíte ${st}`;
              list.push({
                id: `loc-${Date.now()}-tipo-${f}-apto-${a}-suite-${st}`,
                name: `${aptBase} - ${roomName}`,
                level: f,
                type: 'Apartamento / Suíte',
              });
            }
            // Quartos
            for (let q = 1; q <= bedroomsPerApt; q++) {
              const roomName = `Quarto ${q}`;
              list.push({
                id: `loc-${Date.now()}-tipo-${f}-apto-${a}-quarto-${q}`,
                name: `${aptBase} - ${roomName}`,
                level: f,
                type: 'Apartamento / Quarto',
              });
            }
            // Cozinhas
            for (let k = 1; k <= kitchensPerApt; k++) {
              const roomName = kitchensPerApt === 1 ? 'Cozinha' : `Cozinha ${k}`;
              list.push({
                id: `loc-${Date.now()}-tipo-${f}-apto-${a}-coz-${k}`,
                name: `${aptBase} - ${roomName}`,
                level: f,
                type: 'Apartamento / Cozinha',
              });
            }
            // Banheiros
            for (let b = 1; b <= bathroomsPerApt; b++) {
              const roomName = bathroomsPerApt === 1 ? 'Banheiro' : `Banheiro ${b}`;
              list.push({
                id: `loc-${Date.now()}-tipo-${f}-apto-${a}-banh-${b}`,
                name: `${aptBase} - ${roomName}`,
                level: f,
                type: 'Apartamento / Banheiro',
              });
            }
            // Lavanderias
            for (let l = 1; l <= laundryPerApt; l++) {
              const roomName = laundryPerApt === 1 ? 'Lavanderia' : `Lavanderia ${l}`;
              list.push({
                id: `loc-${Date.now()}-tipo-${f}-apto-${a}-lav-${l}`,
                name: `${aptBase} - ${roomName}`,
                level: f,
                type: 'Apartamento / Lavanderia',
              });
            }
          }
        }
      }

      if (penthouse > 0) {
        for (let p = 1; p <= penthouse; p++) {
          list.push({ id: `loc-${Date.now()}-cob-${p}`, name: penthouse === 1 ? 'Cobertura' : `Cobertura ${p}`, level: typicalFloors + p, type: 'Cobertura' });
        }
      }

      // Locais Soltos (raiz, sem delimitadores)
      if (machineRoom > 0) {
        list.push({ id: `loc-${Date.now()}-maquinas`, name: 'Casa de Máquinas', level: typicalFloors + (penthouse || 0) + 1, type: 'Área Técnica' });
      }

      if (hasElevatorShaft > 0) {
        list.push({ id: `loc-${Date.now()}-elevador`, name: 'Poço de Elevador', level: 0, type: 'Circulação Vertical' });
      }
    } else if (selectedTypologyId === 'galpao') {
      const { docks = 0, storageArea = 0, mezzanines = 0, maneuverYard = 0, adminOffice = 0, portaria = 0 } = numericInputs;
      if (portaria > 0) list.push({ id: `loc-${Date.now()}-portaria`, name: 'Portaria Blindada, Balança & Controle de Acesso', level: currentLevel++, type: 'Controle' });
      if (maneuverYard > 0) list.push({ id: `loc-${Date.now()}-patio`, name: 'Pátio Externo de Manobras e Estacionamento de Carretas', level: currentLevel++, type: 'Área Externa' });
      for (let d = 1; d <= docks; d++) {
        list.push({ id: `loc-${Date.now()}-doca-${d}`, name: `Doca de Carga e Descarga ${d}`, level: currentLevel++, type: 'Operacional' });
      }
      for (let s = 1; s <= storageArea; s++) {
        list.push({ id: `loc-${Date.now()}-armazenagem-${s}`, name: storageArea === 1 ? 'Nave Principal de Armazenagem (Piso Industrial)' : `Nave de Armazenagem ${s}`, level: currentLevel++, type: 'Galpão' });
      }
      for (let m = 1; m <= mezzanines; m++) {
        list.push({ id: `loc-${Date.now()}-mez-${m}`, name: `Mezanino Metálico ${m}`, level: currentLevel++, type: 'Mezanino' });
      }
      for (let a = 1; a <= adminOffice; a++) {
        list.push({ id: `loc-${Date.now()}-adm-${a}`, name: `Módulo Administrativo & Vestiários ${a}`, level: currentLevel++, type: 'Apoio' });
      }
    } else if (selectedTypologyId === 'hospital') {
      const {
        floors = 4,
        consultingRoomsPerFloor = 3,
        internmentRoomsPerFloor = 6,
        vipSuites = 2,
        utiRooms = 4,
        surgicalRooms = 3,
        emergencyRooms = 1,
        receptions = 1,
        hasElevatorShaft = 1,
      } = numericInputs;

      // Locais Soltos (raiz, sem delimitadores)
      if (hasElevatorShaft > 0) list.push({ id: `loc-${Date.now()}-elevador`, name: 'Poço de Elevador', level: 0, type: 'Circulação Vertical' });
      if (emergencyRooms > 0) list.push({ id: `loc-${Date.now()}-ps`, name: 'Pronto-Socorro', level: 0, type: 'Emergência' });
      if (receptions > 0) list.push({ id: `loc-${Date.now()}-rec`, name: 'Recepção Geral', level: 0, type: 'Acesso' });

      // Hospitais: Use 2 loops aninhados (Andares -> Cômodos / Suítes / Leitos)
      // Ex: '1º Andar - Suíte VIP 1'
      for (let f = 1; f <= floors; f++) {
        const floorName = `${f}º Andar`;
        const hasSubRooms = vipSuites > 0 || internmentRoomsPerFloor > 0 || consultingRoomsPerFloor > 0;

        if (!hasSubRooms) {
          list.push({
            id: `loc-${Date.now()}-andar-${f}`,
            name: floorName,
            level: currentLevel++,
            type: 'Pavimento Hospitalar',
          });
        } else {
          // 1. Suítes VIP / Isolamento (Ex: '1º Andar - Suíte VIP 1')
          for (let v = 1; v <= vipSuites; v++) {
            list.push({
              id: `loc-${Date.now()}-andar-${f}-vip-${v}`,
              name: `${floorName} - Suíte VIP ${v}`,
              level: currentLevel++,
              type: 'Acomodação / Suíte VIP',
            });
          }

          // 2. Quartos de Internação por Andar
          for (let q = 1; q <= internmentRoomsPerFloor; q++) {
            list.push({
              id: `loc-${Date.now()}-andar-${f}-internacao-${q}`,
              name: `${floorName} - Quarto Internação ${q}`,
              level: currentLevel++,
              type: 'Internação / Enfermaria',
            });
          }

          // 3. Consultórios por Andar
          for (let c = 1; c <= consultingRoomsPerFloor; c++) {
            list.push({
              id: `loc-${Date.now()}-andar-${f}-cons-${c}`,
              name: `${floorName} - Consultório ${c}`,
              level: currentLevel++,
              type: 'Ambulatório / Consultório',
            });
          }
        }
      }

      // Locais Soltos Técnicos / Centros
      for (let s = 1; s <= surgicalRooms; s++) {
        list.push({ id: `loc-${Date.now()}-cc-${s}`, name: surgicalRooms === 1 ? 'Centro Cirúrgico' : `Centro Cirúrgico ${s}`, level: currentLevel++, type: 'Cirurgia' });
      }
      for (let u = 1; u <= utiRooms; u++) {
        list.push({ id: `loc-${Date.now()}-uti-${u}`, name: utiRooms === 1 ? 'Ala de UTI' : `Leito UTI ${u}`, level: currentLevel++, type: 'UTI' });
      }
    } else if (selectedTypologyId === 'shopping') {
      const { mallCorridors = 0, anchorStores = 0, satelliteStores = 0, foodCourt = 0, cinemas = 0, technicalDeck = 0 } = numericInputs;
      for (let m = 1; m <= mallCorridors; m++) list.push({ id: `loc-${Date.now()}-mall-${m}`, name: `Mall Principal / Galeria de Circulação ${m}`, level: currentLevel++, type: 'Circulação' });
      for (let a = 1; a <= anchorStores; a++) list.push({ id: `loc-${Date.now()}-ancora-${a}`, name: `Loja Âncora / Megastore ${a}`, level: currentLevel++, type: 'Comércio' });
      for (let s = 1; s <= satelliteStores; s++) list.push({ id: `loc-${Date.now()}-sat-${s}`, name: `Loja Satélite ${s}`, level: currentLevel++, type: 'Comércio' });
      for (let f = 1; f <= foodCourt; f++) list.push({ id: `loc-${Date.now()}-praca-${f}`, name: `Praça de Alimentação & Exaustão ${f}`, level: currentLevel++, type: 'Gourmet' });
      for (let c = 1; c <= cinemas; c++) list.push({ id: `loc-${Date.now()}-cine-${c}`, name: `Complexo de Cinemas & Lazer ${c}`, level: currentLevel++, type: 'Lazer' });
      for (let t = 1; t <= technicalDeck; t++) list.push({ id: `loc-${Date.now()}-deck-${t}`, name: `Doca de Abastecimento & Central de Ar-Condicionado (Chillers) ${t}`, level: currentLevel++, type: 'Técnico' });
    } else if (selectedTypologyId === 'loteamento') {
      const {
        blocks = 0,
        lotsPerBlock = 0,
        standardHouses = 0,
        townhouses = 0,
        mansions = 0,
        bedroomsPerHouse = 2,
        suitesPerHouse = 1,
        livingRoomsPerHouse = 1,
        kitchensPerHouse = 1,
        bathroomsPerHouse = 1,
        laundryPerHouse = 1,
        hasElevatorShaft = 1,
        guardhouse = 0,
        clubhouse = 0,
        centralSquare = 0,
        utilitySubstation = 0,
      } = numericInputs;

      // Locais Soltos (raiz, sem delimitadores)
      if (hasElevatorShaft > 0) list.push({ id: `loc-${Date.now()}-elevador`, name: 'Poço de Elevador', level: 0, type: 'Circulação Vertical' });
      if (guardhouse > 0) list.push({ id: `loc-${Date.now()}-portaria`, name: 'Portaria', level: currentLevel++, type: 'Segurança' });
      if (clubhouse > 0) list.push({ id: `loc-${Date.now()}-clube`, name: 'Clube Social', level: currentLevel++, type: 'Clube' });
      if (utilitySubstation > 0) list.push({ id: `loc-${Date.now()}-estacao`, name: 'Estação Elevatória', level: currentLevel++, type: 'Infra' });

      for (let s = 1; s <= centralSquare; s++) {
        list.push({ id: `loc-${Date.now()}-praca-${s}`, name: centralSquare === 1 ? 'Praça Central' : `Praça Central ${s}`, level: currentLevel++, type: 'Lazer' });
      }

      for (let b = 1; b <= blocks; b++) {
        const lotInfo = lotsPerBlock > 0 ? ` (${lotsPerBlock} lotes)` : '';
        list.push({ id: `loc-${Date.now()}-quadra-${b}`, name: `Quadra ${b}${lotInfo}`, level: currentLevel++, type: 'Quadra' });
      }

      // Condomínios: Use 2 loops aninhados (Unidade Habitacional -> Cômodos)
      // Ex: 'Mansão 1 - Sala', 'Casa 2 - Suíte 1'
      const appendCondoUnits = (unitType: string, count: number, typeCategory: string) => {
        const hasRooms =
          livingRoomsPerHouse > 0 ||
          suitesPerHouse > 0 ||
          bedroomsPerHouse > 0 ||
          kitchensPerHouse > 0 ||
          bathroomsPerHouse > 0 ||
          laundryPerHouse > 0;

        for (let i = 1; i <= count; i++) {
          const unitName = `${unitType} ${i}`;

          if (!hasRooms) {
            list.push({
              id: `loc-${Date.now()}-${unitType.toLowerCase()}-${i}`,
              name: unitName,
              level: currentLevel++,
              type: typeCategory,
            });
          } else {
            // Loop 2: Cômodos da Unidade Habitacional concatenados com ' - '
            // Salas
            for (let s = 1; s <= livingRoomsPerHouse; s++) {
              const roomName = livingRoomsPerHouse === 1 ? 'Sala' : `Sala ${s}`;
              list.push({
                id: `loc-${Date.now()}-${unitType.toLowerCase()}-${i}-sala-${s}`,
                name: `${unitName} - ${roomName}`,
                level: currentLevel++,
                type: `${typeCategory} / Sala`,
              });
            }

            // Suítes (Ex: 'Casa 2 - Suíte 1', 'Mansão 1 - Suíte 1')
            for (let st = 1; st <= suitesPerHouse; st++) {
              const roomName = `Suíte ${st}`;
              list.push({
                id: `loc-${Date.now()}-${unitType.toLowerCase()}-${i}-suite-${st}`,
                name: `${unitName} - ${roomName}`,
                level: currentLevel++,
                type: `${typeCategory} / Suíte`,
              });
            }

            // Quartos
            for (let q = 1; q <= bedroomsPerHouse; q++) {
              const roomName = `Quarto ${q}`;
              list.push({
                id: `loc-${Date.now()}-${unitType.toLowerCase()}-${i}-quarto-${q}`,
                name: `${unitName} - ${roomName}`,
                level: currentLevel++,
                type: `${typeCategory} / Quarto`,
              });
            }

            // Cozinhas
            for (let k = 1; k <= kitchensPerHouse; k++) {
              const roomName = kitchensPerHouse === 1 ? 'Cozinha' : `Cozinha ${k}`;
              list.push({
                id: `loc-${Date.now()}-${unitType.toLowerCase()}-${i}-coz-${k}`,
                name: `${unitName} - ${roomName}`,
                level: currentLevel++,
                type: `${typeCategory} / Cozinha`,
              });
            }

            // Banheiros
            for (let b = 1; b <= bathroomsPerHouse; b++) {
              const roomName = bathroomsPerHouse === 1 ? 'Banheiro' : `Banheiro ${b}`;
              list.push({
                id: `loc-${Date.now()}-${unitType.toLowerCase()}-${i}-banh-${b}`,
                name: `${unitName} - ${roomName}`,
                level: currentLevel++,
                type: `${typeCategory} / Banheiro`,
              });
            }

            // Lavanderias
            for (let l = 1; l <= laundryPerHouse; l++) {
              const roomName = laundryPerHouse === 1 ? 'Lavanderia' : `Lavanderia ${l}`;
              list.push({
                id: `loc-${Date.now()}-${unitType.toLowerCase()}-${i}-lav-${l}`,
                name: `${unitName} - ${roomName}`,
                level: currentLevel++,
                type: `${typeCategory} / Lavanderia`,
              });
            }
          }
        }
      };

      const totalUnits = standardHouses + townhouses + mansions;
      if (totalUnits === 0 && (bedroomsPerHouse > 0 || suitesPerHouse > 0 || livingRoomsPerHouse > 0)) {
        appendCondoUnits('Casa', 2, 'Casa Padrão');
      } else {
        if (mansions > 0) appendCondoUnits('Mansão', mansions, 'Mansão');
        if (townhouses > 0) appendCondoUnits('Sobrado', townhouses, 'Sobrado');
        if (standardHouses > 0) appendCondoUnits('Casa', standardHouses, 'Casa Padrão');
      }
    }

    if (list.length === 0) {
      list.push({ id: `loc-${Date.now()}-geral`, name: 'Área Geral da Obra', level: 0, type: 'Geral' });
    }

    setLocations(list);
    showToast({
      type: 'success',
      title: 'Estrutura Gerada com Sucesso!',
      message: `${list.length} pavimentos/ambientes criados automaticamente com base na tipologia escolhida.`,
    });
    return list;
  };

  const generateLocationsFromInputs = generateLocations;

  // Funções de edição da árvore de locais
  const handleAddManualLocation = () => {
    if (!newLocationName.trim()) return;
    const maxLevel = locations.length > 0 ? Math.max(...locations.map((l) => l.level)) : 0;
    const newLoc: EditableLocation = {
      id: `loc-${Date.now()}`,
      name: newLocationName.trim(),
      level: maxLevel + 1,
      type: 'Personalizado',
    };
    setLocations((prev) => [...prev, newLoc]);
    setNewLocationName('');
    setIsAddingCustom(false);
    showToast({
      type: 'info',
      title: 'Local Adicionado',
      message: `"${newLoc.name}" inserido na árvore da obra.`,
    });
  };

  const handleDeleteLocation = (id: string) => {
    setLocations((prev) => prev.filter((l) => l.id !== id));
  };

  const handleStartRename = (loc: EditableLocation) => {
    setEditingLocId(loc.id);
    setEditingLocName(loc.name);
  };

  const handleSaveRename = (id: string) => {
    if (!editingLocName.trim()) return;
    setLocations((prev) =>
      prev.map((l) => (l.id === id ? { ...l, name: editingLocName.trim() } : l))
    );
    setEditingLocId(null);
    setEditingLocName('');
  };

  // Alternar expansão/recolhimento de nó do Accordion
  const toggleNode = (nodeId: string) => {
    setExpandedNodes((prev) => ({
      ...prev,
      [nodeId]: !prev[nodeId],
    }));
  };

  // Botão Contextual (+ Adicionar): abre window.prompt('Nome do ambiente:'), concatena com hierarquia atual e faz push no estado de locais
  const handleAddContextualEnvironment = (hierarchyPath: string, parentNodeId?: string) => {
    const input = window.prompt('Nome do ambiente:');
    if (input === null) return;
    const trimmed = input.trim();
    if (!trimmed) return;

    const fullName = `${hierarchyPath} - ${trimmed}`;
    const maxLevel = locations.length > 0 ? Math.max(...locations.map((l) => l.level)) : 0;
    const newLoc: EditableLocation = {
      id: `loc-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: fullName,
      level: maxLevel + 1,
      type: 'Ambiente',
    };

    setLocations((prev) => [...prev, newLoc]);

    // Expande a pasta pai para o novo cômodo ficar imediatamente visível
    if (parentNodeId) {
      setExpandedNodes((prev) => ({
        ...prev,
        [parentNodeId]: true,
      }));
    }

    showToast({
      type: 'info',
      title: 'Ambiente Adicionado',
      message: `"${fullName}" inserido na árvore da obra.`,
    });
  };

  // Exclusão em cascata de um ramo da hierarquia
  const handleDeleteBranch = (fullPath: string) => {
    if (window.confirm(`Deseja excluir "${fullPath}" e todos os seus sub-ambientes vinculados?`)) {
      setLocations((prev) =>
        prev.filter((l) => l.name !== fullPath && !l.name.startsWith(`${fullPath} - `))
      );
    }
  };

  // Data Transformation: Antes do JSX, agrupe o array de strings dinamicamente pelo delimitador ' - ' criando uma estrutura aninhada (Tree).
  const locationTree = useMemo<LocationTreeNode[]>(() => {
    const rootNodes: LocationTreeNode[] = [];

    locations.forEach((loc) => {
      const rawParts = loc.name.split(' - ').map((s) => s.trim()).filter(Boolean);
      const parts = rawParts.length > 0 ? rawParts : [loc.name.trim()];

      let currentList = rootNodes;
      let accumulatedPath = '';

      parts.forEach((part, idx) => {
        accumulatedPath = accumulatedPath ? `${accumulatedPath} - ${part}` : part;
        const isLast = idx === parts.length - 1;
        const currentLevel = idx + 1;

        let existing = currentList.find((n) => n.part === part);
        if (!existing) {
          existing = {
            id: `node-${accumulatedPath}`,
            part,
            fullPath: accumulatedPath,
            level: currentLevel,
            isLeaf: isLast,
            children: [],
            originalLocation: isLast ? loc : undefined,
            totalLeavesCount: 0,
          };
          currentList.push(existing);
        } else {
          if (isLast) {
            existing.originalLocation = loc;
          }
        }

        currentList = existing.children;
      });
    });

    const finalize = (nodes: LocationTreeNode[]): number => {
      let count = 0;
      nodes.forEach((n) => {
        if (n.children.length === 0) {
          n.isLeaf = true;
          n.totalLeavesCount = 1;
          count += 1;
        } else {
          n.isLeaf = false;
          n.totalLeavesCount = finalize(n.children);
          count += n.totalLeavesCount;
        }
      });
      return count;
    };
    finalize(rootNodes);

    return rootNodes;
  }, [locations]);

  const handleExpandAllTree = () => {
    const all: Record<string, boolean> = {};
    const collect = (nodes: LocationTreeNode[]) => {
      nodes.forEach((n) => {
        if (!n.isLeaf) {
          all[n.id] = true;
          collect(n.children);
        }
      });
    };
    collect(locationTree);
    setExpandedNodes(all);
  };

  const handleCollapseAllTree = () => {
    setExpandedNodes({});
  };

  // Salvar e Gerar Cronograma vinculado à obra atual
  const handleSaveAndGenerateSchedule = () => {
    if (!currentWork.id) {
      showToast({
        type: 'error',
        title: 'Nenhuma obra selecionada',
        message: 'Cadastre ou selecione uma obra ativa para vincular o cronograma.',
      });
      return;
    }

    if (locations.length === 0) {
      showToast({
        type: 'warning',
        title: 'Estrutura vazia',
        message: 'Gere ou adicione ao menos um pavimento/ambiente antes de salvar.',
      });
      return;
    }

    setIsGenerating(true);

    try {
      // 1. Converter locais em Floores formais
      const newFloors: Floor[] = locations.map((loc, idx) => ({
        id: loc.id.startsWith('fl-') ? loc.id : `fl-${idx + 1}-${Date.now().toString(36)}`,
        workId: currentWork.id,
        companyId: currentWork.companyId,
        name: loc.name,
        level: loc.level,
        isActive: true,
      }));

      // 2. Filtrar categorias e serviços correspondentes do eapTemplates.ts
      // Se for 'Reforma / Retrofit', exclui fundações profundas pesadas (02.01 a menos que sob demanda)
      let availableServices: EAPServiceTemplate[] = [];

      // Mapeamento cronológico dos serviços da categoria selecionada ou completa
      // Se for selecionada tipologia específica com código correspondente, selecionamos os serviços completos da EAP cronologicamente
      EAP_CATEGORIES.forEach((cat) => {
        // Se for Reforma / Retrofit e for a categoria 02 (Fundações profundas), só trazemos reforço estrutural
        if (interventionType === 'Reforma / Retrofit' && cat.code === '02') {
          const reforcoSub = cat.subCategories.filter((s) => s.name.toLowerCase().includes('reforço') || s.name.toLowerCase().includes('contenção'));
          if (reforcoSub.length > 0) {
            availableServices.push(...reforcoSub.flatMap((s) => s.services));
          }
          return;
        }

        cat.subCategories.forEach((sub) => {
          availableServices.push(...sub.services);
        });
      });

      // Se porventura a lista estiver vazia, carrega todos
      if (availableServices.length === 0) {
        availableServices = EAP_CATEGORIES.flatMap((c) => c.subCategories.flatMap((s) => s.services));
      }

      // Ordenar cronologicamente
      availableServices.sort((a, b) => a.order - b.order);

      // 3. Gerar serviços distribuídos nos locais gerados
      const generatedServices: ConstructionService[] = [];
      const today = new Date();

      // Vamos criar um cronograma robusto distribuindo os serviços mestres
      // Associando serviços preliminares e fundação aos primeiros pavimentos/gerais, e acabamentos aos andares/ambientes
      let runningDayOffset = 0;

      // Pegamos uma amostra ou todos os serviços da EAP correspondente
      // Para não gerar 10.000 itens se houver 50 andares x 185 serviços,
      // associamos serviços de áreas comuns e fundações ao pavimento térreo/subsolo, e serviços de alvenaria/acabamentos aos pavimentos tipo/ambientes
      availableServices.forEach((srv, srvIdx) => {
        // Determinar em quais locais o serviço deve ser aplicado
        let targetFloors: Floor[] = [];

        if (srv.categoryCode === '01' || srv.categoryCode === '02') {
          // Preliminares e Fundação: aplica no Térreo, Subsolo ou Geral
          targetFloors = newFloors.filter(
            (f) =>
              f.level <= 0 ||
              f.name.toLowerCase().includes('térreo') ||
              f.name.toLowerCase().includes('subsolo') ||
              f.name.toLowerCase().includes('externa') ||
              f.name.toLowerCase().includes('geral')
          );
          if (targetFloors.length === 0) targetFloors = [newFloors[0]];
        } else if (srv.categoryCode === '03' || srv.categoryCode === '04') {
          // Supraestrutura e Alvenarias: em todos os pavimentos ou amostragem
          targetFloors = newFloors;
        } else {
          // Instalações, acabamentos e entrega: em todos os locais
          targetFloors = newFloors;
        }

        // Criar frente de serviço vinculada para cada local alvo relevante (ou pelo menos 1 por serviço)
        targetFloors.slice(0, 3).forEach((fl) => {
          const startDate = new Date(today);
          startDate.setDate(today.getDate() + runningDayOffset);

          const endDate = new Date(startDate);
          const duration = srv.defaultEstimatedDays || 5;
          endDate.setDate(startDate.getDate() + duration);

          generatedServices.push({
            id: `srv-${srv.code.replace(/\./g, '-')}-${fl.id.slice(-4)}-${Date.now().toString(36)}`,
            companyId: currentWork.companyId,
            workId: currentWork.id,
            floorId: fl.id,
            floorName: fl.name,
            area: srv.categoryName || srv.subCategoryName || 'Civil',
            name: `${srv.code} — ${srv.name}`,
            status: srvIdx === 0 ? 'Em andamento' : 'Não iniciado',
            responsibleName: srv.defaultResponsible || 'Mestre de Obras',
            startDate: startDate.toISOString().substring(0, 10),
            predictedEndDate: endDate.toISOString().substring(0, 10),
            notes: srv.description || `Serviço gerado via Construtor do Mapa da Obra (${activePreset.name}).`,
            eapServiceCode: srv.code,
            categoryCode: srv.categoryCode,
            categoryName: srv.categoryName,
            checklist: srv.checklist || [],
            isActive: true,
            assignedEmployees: [],
            locationProgress: [
              {
                locationId: fl.id,
                locationName: fl.name,
                status: srvIdx === 0 ? 'Em andamento' : 'Não iniciado',
              },
            ],
            proofPhotos: [],
          });
        });

        // Avançar um pouco o dia no cronograma
        if (srvIdx % 2 === 0) {
          runningDayOffset += 2;
        }
      });

      // 4. Salvar na obra via AppContext
      saveWorkMapStructure({
        workId: currentWork.id,
        interventionType,
        typology: activePreset.name,
        floors: newFloors,
        services: generatedServices,
      });

      setIsGenerating(false);

      if (onComplete) {
        onComplete();
      }
    } catch (err) {
      console.error(err);
      setIsGenerating(false);
      showToast({
        type: 'error',
        title: 'Erro ao gerar cronograma',
        message: 'Ocorreu um erro ao processar a estrutura da EAP.',
      });
    }
  };

  // Renderizador recursivo para nós da Árvore Hierárquica (Nested Accordions)
  const renderTreeNode = (node: LocationTreeNode, depth: number = 1): React.ReactNode => {
    const isExpanded = !!expandedNodes[node.id];

    if (node.isLeaf) {
      // Nó Folha (Leaf Node): cômodo final ou local solto raiz
      const loc = node.originalLocation;
      const isEditing = loc && editingLocId === loc.id;

      return (
        <div
          key={node.id}
          className="flex justify-between items-center pl-4 py-2 border-b border-slate-800 hover:bg-slate-800/30 transition-colors group"
        >
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <div
              className="w-1.5 h-1.5 rounded-full shrink-0"
              style={{ backgroundColor: 'var(--primary-color)' }}
            />

            {isEditing && loc ? (
              <div className="flex items-center gap-1.5 flex-1">
                <input
                  type="text"
                  value={editingLocName}
                  onChange={(e) => setEditingLocName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveRename(loc.id);
                    if (e.key === 'Escape') setEditingLocId(null);
                  }}
                  className="w-full max-w-xs px-2 py-1 rounded bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-[var(--btn-primary)]"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => handleSaveRename(loc.id)}
                  className="px-2.5 py-1 rounded text-[10px] font-bold cursor-pointer"
                  style={{
                    backgroundColor: 'var(--btn-primary)',
                    color: 'var(--btn-primary-text)',
                  }}
                >
                  Salvar
                </button>
              </div>
            ) : (
              <div className="min-w-0 flex-1">
                <span
                  onClick={() => loc && handleStartRename(loc)}
                  title="Clique para editar o nome"
                  className="text-xs font-semibold text-slate-200 truncate hover:text-[var(--primary-color)] cursor-pointer block"
                >
                  {node.part}
                </span>
                <span className="text-[10px] text-slate-500 font-mono block truncate">
                  {node.fullPath}
                </span>
              </div>
            )}
          </div>

          {!isEditing && loc && (
            <div className="flex items-center gap-2 shrink-0 opacity-90 group-hover:opacity-100 transition-opacity">
              <button
                type="button"
                onClick={() => handleStartRename(loc)}
                className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 text-xs transition-colors cursor-pointer"
                title="Editar nome"
              >
                ✏️
              </button>
              <button
                type="button"
                onClick={() => handleDeleteLocation(loc.id)}
                className="p-1 rounded text-slate-400 hover:text-red-400 hover:bg-red-500/10 text-xs transition-colors cursor-pointer"
                title="Excluir ambiente"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      );
    }

    // Pasta Hierárquica (Nível 1 ex: '1º Andar', Nível 2 ex: 'Apto 11')
    const isLevel1 = node.level === 1;
    const isLevel2 = node.level === 2;

    return (
      <details
        key={node.id}
        open={isExpanded}
        className="mb-2 border rounded p-2 border-slate-800 bg-slate-900/70 text-white transition-all"
      >
        <summary
          onClick={(e) => {
            e.preventDefault();
            toggleNode(node.id);
          }}
          className="font-bold flex justify-between cursor-pointer items-center select-none py-1 gap-2"
        >
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-slate-400">📁</span>
            <span className={`font-bold text-white truncate ${isLevel1 ? 'text-xs sm:text-sm' : 'text-xs'}`}>
              {node.part}
            </span>
            <span className="text-[10px] font-mono text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-full shrink-0">
              {node.totalLeavesCount} {node.totalLeavesCount === 1 ? 'ambiente' : 'ambientes'}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
            {(isLevel1 || isLevel2) && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddContextualEnvironment(node.fullPath, node.id);
                }}
                className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition-colors flex items-center gap-1 cursor-pointer shadow-sm"
                title={`Adicionar novo ambiente dentro de ${node.part}`}
              >
                <Plus className="w-3 h-3" />
                <span>+ Adicionar</span>
              </button>
            )}

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteBranch(node.fullPath);
              }}
              className="p-1 rounded text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer text-xs"
              title={`Excluir "${node.part}" e todos os sub-ambientes`}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </summary>

        <div className="pl-3 sm:pl-4 pt-2 space-y-1 border-t border-slate-800/60 mt-1">
          {node.children.map((child) => renderTreeNode(child, depth + 1))}
        </div>
      </details>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Banner de Apresentação da Etapa 1 */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span 
                className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-800 border border-slate-700"
                style={{ color: 'var(--primary-color)' }}
              >
                Etapa 1 • Versão Básica
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Obra Atual: <strong className="text-white">{currentWork.name}</strong>
              </span>
            </div>
            <h2 className="text-2xl font-black text-white flex items-center gap-2">
              <Compass className="w-6 h-6" style={{ color: 'var(--primary-color)' }} />
              Construtor do Mapa da Obra
            </h2>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Configure a estrutura do empreendimento. Gere automaticamente pavimentos e ambientes e personalize a árvore de locais da obra com facilidade.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-all cursor-pointer"
              >
                Voltar à visualização
              </button>
            )}
            <button
              type="button"
              onClick={handleSaveAndGenerateSchedule}
              disabled={isGenerating || locations.length === 0}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer disabled:opacity-50"
              style={{
                backgroundColor: 'var(--btn-primary)',
                color: 'var(--btn-primary-text)',
              }}
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Gerando Cronograma...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Salvar e Gerar Cronograma</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Grid de Configurações: Intervenção e Tipologia */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bloco 1: Tipo de Intervenção */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Hammer className="w-4 h-4" style={{ color: 'var(--primary-color)' }} />
              1. Tipo de Intervenção
            </h3>
            <span className="text-[10px] text-slate-500 font-mono">Regra de Escopo</span>
          </div>

          <p className="text-xs text-slate-400">
            Define se o cronograma contemplará as etapas pesadas de infraestrutura e escavações ou focará em reformas e modernizações.
          </p>

          <div className="space-y-2.5 pt-1">
            <label
              onClick={() => setInterventionType('Construção do Zero (Desde a Fundação)')}
              className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                interventionType === 'Construção do Zero (Desde a Fundação)'
                  ? 'bg-primary/10 border-primary text-white shadow-sm'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <input
                type="radio"
                name="interventionType"
                checked={interventionType === 'Construção do Zero (Desde a Fundação)'}
                onChange={() => setInterventionType('Construção do Zero (Desde a Fundação)')}
                className="mt-0.5 text-primary focus:ring-primary"
              />
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-white block">Construção do Zero (Desde a Fundação)</span>
                <span className="text-[11px] text-slate-400 block">
                  Inclui 100% da EAP: Topografia, Contenções, Fundações Profundas, Supraestrutura e Acabamentos.
                </span>
              </div>
            </label>

            <label
              onClick={() => setInterventionType('Reforma / Retrofit')}
              className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                interventionType === 'Reforma / Retrofit'
                  ? 'bg-primary/10 border-primary text-white shadow-sm'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <input
                type="radio"
                name="interventionType"
                checked={interventionType === 'Reforma / Retrofit'}
                onChange={() => setInterventionType('Reforma / Retrofit')}
                className="mt-0.5 text-primary focus:ring-primary"
              />
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-white block">Reforma / Retrofit</span>
                <span className="text-[11px] text-slate-400 block">
                  Focado em Demolições, Vedações, Adequação de Instalações, Revestimentos, Pisos e Acabamento Final.
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* Bloco 2: Tipologia do Empreendimento (6 Tipologias) */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <LayoutGrid className="w-4 h-4" style={{ color: 'var(--primary-color)' }} />
              2. Tipologia do Empreendimento (7 Tipologias)
            </h3>
            <span className="text-[10px] font-mono font-bold" style={{ color: 'var(--primary-color)' }}>
              {activePreset.categoryTitle}
            </span>
          </div>

          <p className="text-xs text-slate-400">
            Selecione o perfil do empreendimento correspondente à biblioteca técnica do <strong>eapTemplates.ts</strong>. O construtor ajustará os geradores rápidos automaticamente.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-1">
            {TYPOLOGY_PRESETS.map((preset) => {
              const isSelected = selectedTypologyId === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleSelectTypology(preset)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between h-full ${
                    isSelected
                      ? 'bg-primary/15 border-primary text-white shadow-md'
                      : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span 
                        className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700"
                        style={{ color: 'var(--primary-color)' }}
                      >
                        {preset.code}
                      </span>
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5" style={{ color: 'var(--primary-color)' }} />}
                    </div>
                    <div className="text-xs font-bold text-white pt-1 line-clamp-1">{preset.name}</div>
                    <p className="text-[10px] text-slate-400 line-clamp-2">{preset.description}</p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center gap-2.5 text-xs text-slate-300">
            <Info className="w-4 h-4 shrink-0" style={{ color: 'var(--primary-color)' }} />
            <span>
              <strong>Diretriz Técnica:</strong> {activePreset.scopeHint}
            </span>
          </div>
        </div>
      </div>

      {/* Bloco 3: Gerador Rápido de Pavimentos/Ambientes Dinâmico */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4" style={{ color: 'var(--primary-color)' }} />
              3. Gerador Rápido de Pavimentos e Ambientes ({activePreset.name})
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Ajuste as quantidades desejadas abaixo e clique em "Gerar Pavimentos/Ambientes" para preencher a árvore de locais.
            </p>
          </div>

          <button
            type="button"
            onClick={generateLocationsFromInputs}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-xs shadow-sm transition-all cursor-pointer shrink-0"
            style={{
              backgroundColor: 'var(--btn-primary)',
              color: 'var(--btn-primary-text)',
            }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Gerar Pavimentos / Ambientes</span>
          </button>
        </div>

        {selectedTypologyId === 'casa' && (
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
            <span className="text-xs font-bold text-slate-200 block">
              Cômodos da Residência
            </span>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[
                { key: 'bedrooms', label: 'Quartos', sub: 'Dormitórios sociais', def: 3 },
                { key: 'suites', label: 'Suítes', sub: 'Com banheiro privativo', def: 1 },
                { key: 'livingRooms', label: 'Salas', sub: 'Salas de estar/jantar', def: 2 },
                { key: 'kitchens', label: 'Cozinhas', sub: 'Cozinhas e copas', def: 1 },
                { key: 'bathrooms', label: 'Banheiros', sub: 'Sanitários sociais', def: 2 },
                { key: 'gourmet', label: 'Área Gourmet', sub: 'Churrasqueira e varanda', def: 1 },
                { key: 'outdoor', label: 'Área Externa', sub: 'Quintal e jardim', def: 1 },
              ].map((field) => (
                <div key={field.key} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2 flex flex-col justify-between shadow-sm">
                  <div>
                    <label className="text-xs font-bold text-white block">{field.label}</label>
                    <span className="text-[10px] text-slate-400 block mt-0.5">{field.sub}</span>
                  </div>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={numericInputs[field.key] ?? field.def}
                    onChange={(e) => handleNumericChange(field.key, parseInt(e.target.value, 10))}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-[var(--btn-primary)] appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedTypologyId === 'predio' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
              {[
                { key: 'subsolos', label: 'Subsolos', subtitle: 'Pavimentos técnicos subterrâneos', def: 1 },
                { key: 'garagens', label: 'Garagens', subtitle: 'Pavimentos de estacionamento', def: 2 },
                { key: 'groundLeisure', label: 'Térreo / Lazer', def: 1 },
                { key: 'typicalFloors', label: 'Nº Andares Tipo', def: 12 },
                { key: 'aptsPerFloor', label: 'Aptos por Andar', def: 4 },
                { key: 'penthouse', label: 'Cobertura / Duplex', def: 1 },
                { key: 'machineRoom', label: 'Casa de Máquinas', def: 1 },
              ].map((field) => (
                <div key={field.key} className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5 flex flex-col justify-between">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-300 block">{field.label}</label>
                    {field.subtitle && (
                      <span className="text-[10px] text-slate-500 block leading-tight mt-0.5">{field.subtitle}</span>
                    )}
                  </div>
                  <input
                    type="number"
                    min="0"
                    max="99"
                    value={numericInputs[field.key] ?? field.def}
                    onChange={(e) => handleNumericChange(field.key, parseInt(e.target.value, 10))}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-[var(--btn-primary)] appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  />
                </div>
              ))}
            </div>

            {/* Seção Exigida: Cômodos por Apartamento */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
              <span className="text-xs font-bold text-slate-200 block">
                Cômodos por Apartamento
              </span>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {[
                  { key: 'bedroomsPerApt', label: 'Quartos', sub: 'Dormitórios sociais', def: 2 },
                  { key: 'suitesPerApt', label: 'Suítes', sub: 'Com banheiro privativo', def: 1 },
                  { key: 'livingRoomsPerApt', label: 'Salas', sub: 'Salas de estar/jantar', def: 1 },
                  { key: 'kitchensPerApt', label: 'Cozinhas', sub: 'Cozinhas e copas', def: 1 },
                  { key: 'bathroomsPerApt', label: 'Banheiros', sub: 'Sanitários e lavabos', def: 1 },
                  { key: 'laundryPerApt', label: 'Lavanderias', sub: 'Área de serviço', def: 1 },
                ].map((field) => (
                  <div key={field.key} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2 flex flex-col justify-between shadow-sm">
                    <div>
                      <label className="text-xs font-bold text-white block">{field.label}</label>
                      <span className="text-[10px] text-slate-400 block mt-0.5">{field.sub}</span>
                    </div>
                    <input
                      type="number"
                      min="0"
                      max="15"
                      value={numericInputs[field.key] ?? field.def}
                      onChange={(e) => handleNumericChange(field.key, parseInt(e.target.value, 10))}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-[var(--btn-primary)] appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {selectedTypologyId === 'galpao' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {[
              { key: 'docks', label: 'Nº de Docas', def: 6 },
              { key: 'storageArea', label: 'Área Armazenagem', def: 1 },
              { key: 'mezzanines', label: 'Mezaninos', def: 2 },
              { key: 'maneuverYard', label: 'Pátio Manobras', def: 1 },
              { key: 'adminOffice', label: 'Módulos Adm', def: 2 },
              { key: 'portaria', label: 'Portaria Blindada', def: 1 },
            ].map((field) => (
              <div key={field.key} className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-400 block">{field.label}</label>
                <input
                  type="number"
                  min="0"
                  max="99"
                  value={numericInputs[field.key] ?? field.def}
                  onChange={(e) => handleNumericChange(field.key, parseInt(e.target.value, 10))}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-[var(--btn-primary)] appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                />
              </div>
            ))}
          </div>
        )}

        {selectedTypologyId === 'hospital' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { key: 'floors', label: 'Nº de Andares', def: 4 },
                { key: 'consultingRoomsPerFloor', label: 'Consultórios por Andar', def: 3 },
                { key: 'surgicalRooms', label: 'Salas Cirúrgicas', def: 3 },
                { key: 'emergencyRooms', label: 'Pronto-Socorro', def: 1 },
              ].map((field) => (
                <div key={field.key} className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5 flex flex-col justify-between">
                  <label className="text-[11px] font-semibold text-slate-300 block">{field.label}</label>
                  <input
                    type="number"
                    min="0"
                    max="99"
                    value={numericInputs[field.key] ?? field.def}
                    onChange={(e) => handleNumericChange(field.key, parseInt(e.target.value, 10))}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-[var(--btn-primary)] appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  />
                </div>
              ))}
            </div>

            {/* Acomodações, Leitos e Suítes Hospitalares */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
              <span className="text-xs font-bold text-slate-200 block">
                Acomodações e Leitos Hospitalares
              </span>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {[
                  { key: 'internmentRoomsPerFloor', label: 'Quartos Internação', sub: 'Por andar tipo', def: 6 },
                  { key: 'vipSuites', label: 'Suítes VIP/Isolamento', sub: 'Leitos VIP e isolamento', def: 2 },
                  { key: 'utiRooms', label: 'Leitos UTI', sub: 'Terapia intensiva', def: 4 },
                ].map((field) => (
                  <div key={field.key} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2 flex flex-col justify-between shadow-sm">
                    <div>
                      <label className="text-xs font-bold text-white block">{field.label}</label>
                      <span className="text-[10px] text-slate-400 block mt-0.5">{field.sub}</span>
                    </div>
                    <input
                      type="number"
                      min="0"
                      max="99"
                      value={numericInputs[field.key] ?? field.def}
                      onChange={(e) => handleNumericChange(field.key, parseInt(e.target.value, 10))}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-[var(--btn-primary)] appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white block">Poço de Elevador</span>
                <span className="text-[10px] text-slate-400 block">Caixa de corrida para elevadores hospitalares e macas</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={(numericInputs['hasElevatorShaft'] ?? 1) > 0}
                  onChange={(e) => handleNumericChange('hasElevatorShaft', e.target.checked ? 1 : 0)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--primary-color)]"></div>
              </label>
            </div>
          </div>
        )}

        {selectedTypologyId === 'shopping' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {[
              { key: 'mallCorridors', label: 'Corredores Mall', def: 3 },
              { key: 'anchorStores', label: 'Lojas Âncoras', def: 4 },
              { key: 'satelliteStores', label: 'Lojas Satélites', def: 24 },
              { key: 'foodCourt', label: 'Praça Gourmet', def: 2 },
              { key: 'cinemas', label: 'Salas Cinema', def: 1 },
              { key: 'technicalDeck', label: 'Docas / Chillers', def: 2 },
            ].map((field) => (
              <div key={field.key} className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-400 block">{field.label}</label>
                <input
                  type="number"
                  min="0"
                  max="99"
                  value={numericInputs[field.key] ?? field.def}
                  onChange={(e) => handleNumericChange(field.key, parseInt(e.target.value, 10))}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-[var(--btn-primary)] appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                />
              </div>
            ))}
          </div>
        )}

        {selectedTypologyId === 'loteamento' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {[
                { key: 'blocks', label: 'Nº de Quadras', def: 8 },
                { key: 'lotsPerBlock', label: 'Lotes / Quadra', def: 12 },
                { key: 'guardhouse', label: 'Portaria Social', def: 1 },
                { key: 'clubhouse', label: 'Clube Social', def: 1 },
                { key: 'centralSquare', label: 'Praças / Lazer', def: 2 },
                { key: 'utilitySubstation', label: 'Estação Esgoto/Água', def: 1 },
              ].map((field) => (
                <div key={field.key} className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5">
                  <label className="text-[11px] font-semibold text-slate-400 block">{field.label}</label>
                  <input
                    type="number"
                    min="0"
                    max="99"
                    value={numericInputs[field.key] ?? field.def}
                    onChange={(e) => handleNumericChange(field.key, parseInt(e.target.value, 10))}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-[var(--btn-primary)] appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  />
                </div>
              ))}
            </div>

            {/* Unidades Habitacionais (Construção Civil) */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
              <span className="text-xs font-bold text-slate-200 block">
                Unidades Habitacionais (Construção Civil)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    key: 'standardHouses',
                    label: 'Casas Populares / Padrão',
                    sub: 'Unidades térreas de metragem padrão',
                    def: 0,
                  },
                  {
                    key: 'townhouses',
                    label: 'Sobrados / Geminadas',
                    sub: 'Unidades com múltiplos pavimentos',
                    def: 0,
                  },
                  {
                    key: 'mansions',
                    label: 'Mansões / Alto Padrão',
                    sub: 'Unidades isoladas de alto luxo',
                    def: 0,
                  },
                ].map((field) => (
                  <div key={field.key} className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                    <div>
                      <span className="text-xs font-bold text-white block">{field.label}</span>
                      <span className="text-[10px] text-slate-400 block">{field.sub}</span>
                    </div>
                    <input
                      type="number"
                      min="0"
                      max="500"
                      value={numericInputs[field.key] ?? field.def}
                      onChange={(e) => handleNumericChange(field.key, parseInt(e.target.value, 10))}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-[var(--btn-primary)] appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Seção Exigida: Cômodos por Casa / Unidade Habitacional */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
              <span className="text-xs font-bold text-slate-200 block">
                Cômodos por Casa / Unidade Habitacional
              </span>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {[
                  { key: 'bedroomsPerHouse', label: 'Quartos', sub: 'Dormitórios sociais', def: 2 },
                  { key: 'suitesPerHouse', label: 'Suítes', sub: 'Com banheiro privativo', def: 1 },
                  { key: 'livingRoomsPerHouse', label: 'Salas', sub: 'Salas de estar/jantar', def: 1 },
                  { key: 'kitchensPerHouse', label: 'Cozinhas', sub: 'Cozinhas e copas', def: 1 },
                  { key: 'bathroomsPerHouse', label: 'Banheiros', sub: 'Sanitários e lavabos', def: 1 },
                  { key: 'laundryPerHouse', label: 'Lavanderias', sub: 'Área de serviço', def: 1 },
                ].map((field) => (
                  <div key={field.key} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2 flex flex-col justify-between shadow-sm">
                    <div>
                      <label className="text-xs font-bold text-white block">{field.label}</label>
                      <span className="text-[10px] text-slate-400 block mt-0.5">{field.sub}</span>
                    </div>
                    <input
                      type="number"
                      min="0"
                      max="20"
                      value={numericInputs[field.key] ?? field.def}
                      onChange={(e) => handleNumericChange(field.key, parseInt(e.target.value, 10))}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-[var(--btn-primary)] appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Checkbox Poço de Elevador */}
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white block">Poço de Elevador</span>
                <span className="text-[10px] text-slate-400 block">Caixa de corrida para elevadores e monta-cargas</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={(numericInputs['hasElevatorShaft'] ?? 1) > 0}
                  onChange={(e) => handleNumericChange('hasElevatorShaft', e.target.checked ? 1 : 0)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--primary-color)]"></div>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Bloco 4: Lista Editável da Árvore de Locais */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ListTree className="w-4 h-4" style={{ color: 'var(--primary-color)' }} />
                4. Árvore de Locais e Ambientes ({locations.length} gerados)
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                Estrutura Hierárquica em Árvore
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Navegue pelas pastas de pavimentos e unidades para inspecionar, renomear ou adicionar novos ambientes contextuais.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {locationTree.length > 0 && (
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={handleExpandAllTree}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Expandir Todos
                </button>
                <span className="text-slate-700">|</span>
                <button
                  type="button"
                  onClick={handleCollapseAllTree}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Recolher Todos
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={() => setIsAddingCustom(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-all cursor-pointer shrink-0"
            >
              <Plus className="w-3.5 h-3.5" style={{ color: 'var(--primary-color)' }} />
              <span>Adicionar Pavimento/Ambiente Manualmente</span>
            </button>
          </div>
        </div>

        {/* Formulário inline para adicionar local manual */}
        {isAddingCustom && (
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 animate-in fade-in">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold flex items-center gap-1.5" style={{ color: 'var(--primary-color)' }}>
                <Plus className="w-3.5 h-3.5" />
                Novo Pavimento / Ambiente Manual
              </span>
              <button
                type="button"
                onClick={() => setIsAddingCustom(false)}
                className="text-slate-500 hover:text-slate-300 text-xs cursor-pointer"
              >
                Cancelar
              </button>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                autoFocus
                placeholder="Ex: 1º Andar - Apto 11 - Varanda Gourmet"
                value={newLocationName}
                onChange={(e) => setNewLocationName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddManualLocation()}
                className="flex-1 px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[var(--btn-primary)]"
              />
              <button
                type="button"
                onClick={handleAddManualLocation}
                disabled={!newLocationName.trim()}
                className="px-4 py-2 rounded-lg font-bold text-xs disabled:opacity-50 transition-all cursor-pointer shadow-sm"
                style={{
                  backgroundColor: 'var(--btn-primary)',
                  color: 'var(--btn-primary-text)',
                }}
              >
                Adicionar
              </button>
            </div>
          </div>
        )}

        {/* Árvore Hierárquica de Locais (Nested Accordions) */}
        {locations.length === 0 ? (
          <div className="p-8 text-center rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
            <AlertCircle className="w-8 h-8 text-amber-400 mx-auto" />
            <p className="text-xs text-slate-300 font-semibold">Nenhum pavimento ou ambiente configurado ainda.</p>
            <p className="text-[11px] text-slate-500">
              Utilize o <strong>Gerador Rápido</strong> acima ou clique em <strong>Adicionar Pavimento/Ambiente Manualmente</strong>.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {locationTree.map((node) => renderTreeNode(node, 1))}
          </div>
        )}

        {/* Botão de Rodapé para Ação Final */}
        <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>
              Ao clicar em Salvar, a estrutura do projeto será criada e os ambientes vinculados.
            </span>
          </div>

          <button
            type="button"
            onClick={handleSaveAndGenerateSchedule}
            disabled={isGenerating || locations.length === 0}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-xs shadow-lg transition-all cursor-pointer disabled:opacity-50"
            style={{
              backgroundColor: 'var(--btn-primary)',
              color: 'var(--btn-primary-text)',
            }}
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Processando vinculação...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Salvar e Gerar Cronograma da Obra</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
export default WorkMapBuilder;
