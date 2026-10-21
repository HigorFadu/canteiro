import {
  EAPCategoryTemplate,
  EAPServiceTemplate,
  CATEGORY_1_SERVICOS_PRELIMINARES,
  CATEGORY_2_INFRAESTRUTURA_FUNDACOES,
  CATEGORY_3_SUPRAESTRUTURA,
  CATEGORY_4_VEDACOES_COBERTURA,
  CATEGORY_INSTALACOES_HIDRAULICAS,
  CATEGORY_INSTALACOES_ELETRICAS,
  CATEGORY_SISTEMAS_AVAC,
  CATEGORY_INSTALACOES_GAS,
  CATEGORY_SISTEMAS_INCENDIO,
  CATEGORY_6_REVESTIMENTOS_ACABAMENTOS,
  CATEGORY_7_LIMPEZA_COMISSIONAMENTO_ENTREGA,
} from './eapTemplates';

export interface MasterDiscipline {
  id: string;
  code: string;
  technicalName: string;
  category: EAPCategoryTemplate;
  services: EAPServiceTemplate[];
}

export const MASTER_DISCIPLINES: MasterDiscipline[] = [
  {
    id: 'eletrica',
    code: '06',
    technicalName: 'Instalações Elétricas e Comandos',
    category: CATEGORY_INSTALACOES_ELETRICAS,
    services: CATEGORY_INSTALACOES_ELETRICAS.subCategories.flatMap((s) => s.services),
  },
  {
    id: 'hidraulica',
    code: '05',
    technicalName: 'Instalações Hidráulicas e Pluviais',
    category: CATEGORY_INSTALACOES_HIDRAULICAS,
    services: CATEGORY_INSTALACOES_HIDRAULICAS.subCategories.flatMap((s) => s.services),
  },
  {
    id: 'gas',
    code: '08',
    technicalName: 'Gás (GLP/GN)',
    category: CATEGORY_INSTALACOES_GAS,
    services: CATEGORY_INSTALACOES_GAS.subCategories.flatMap((s) => s.services),
  },
  {
    id: 'avac',
    code: '07',
    technicalName: 'Sistemas de Climatização (AVAC)',
    category: CATEGORY_SISTEMAS_AVAC,
    services: CATEGORY_SISTEMAS_AVAC.subCategories.flatMap((s) => s.services),
  },
  {
    id: 'alvenaria',
    code: '04',
    technicalName: 'Alvenaria e Vedação',
    category: CATEGORY_4_VEDACOES_COBERTURA,
    services: CATEGORY_4_VEDACOES_COBERTURA.subCategories.flatMap((s) => s.services),
  },
  {
    id: 'incendio',
    code: '09',
    technicalName: 'Sistemas de Combate a Incêndio (PPCI)',
    category: CATEGORY_SISTEMAS_INCENDIO,
    services: CATEGORY_SISTEMAS_INCENDIO.subCategories.flatMap((s) => s.services),
  },
  {
    id: 'estrutura',
    code: '03',
    technicalName: 'Estrutura e Supraestrutura',
    category: CATEGORY_3_SUPRAESTRUTURA,
    services: CATEGORY_3_SUPRAESTRUTURA.subCategories.flatMap((s) => s.services),
  },
  {
    id: 'fundacoes',
    code: '02',
    technicalName: 'Fundações e Infraestrutura',
    category: CATEGORY_2_INFRAESTRUTURA_FUNDACOES,
    services: CATEGORY_2_INFRAESTRUTURA_FUNDACOES.subCategories.flatMap((s) => s.services),
  },
  {
    id: 'preliminares',
    code: '01',
    technicalName: 'Serviços Preliminares e Canteiro',
    category: CATEGORY_1_SERVICOS_PRELIMINARES,
    services: CATEGORY_1_SERVICOS_PRELIMINARES.subCategories.flatMap((s) => s.services),
  },
  {
    id: 'revestimentos',
    code: '10',
    technicalName: 'Revestimentos, Forros e Pintura',
    category: CATEGORY_6_REVESTIMENTOS_ACABAMENTOS,
    services: CATEGORY_6_REVESTIMENTOS_ACABAMENTOS.subCategories.flatMap((s) => s.services),
  },
  {
    id: 'limpeza',
    code: '11',
    technicalName: 'Limpeza Final, Comissionamento e Entrega',
    category: CATEGORY_7_LIMPEZA_COMISSIONAMENTO_ENTREGA,
    services: CATEGORY_7_LIMPEZA_COMISSIONAMENTO_ENTREGA.subCategories.flatMap((s) => s.services),
  },
];

export { getDisciplineMeta } from '../utils/disciplineUtils';
export type { DisciplineMeta } from '../utils/disciplineUtils';
