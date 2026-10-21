/**
 * categoryAvac.ts
 * Categoria da EAP: Sistemas de Climatização e Exaustão (AVAC)
 * Ordem cronológica: serviços 128 a 130
 */

import { EAPCategoryTemplate } from '../eapTypes';

export const CATEGORY_SISTEMAS_AVAC: EAPCategoryTemplate = {
  id: 'cat-07-avac',
  code: '07',
  name: 'Sistemas de Climatização e Exaustão (AVAC)',
  order: 7,
  description: 'Redes frigorígenas para ar-condicionado (Split/VRF), dutos metálicos de exaustão mecânica, ventilação forçada de garagens e testes de pressurização com nitrogênio e vácuo.',
  subCategories: [
    {
      id: 'sub-07-01',
      code: '07.01',
      name: 'Climatização, Exaustão e Ventilação Mecânica (HVAC / AVAC)',
      order: 1,
      services: [
        {
          id: 'srv-07-01-128',
          code: '07.01.128',
          name: 'Instalação de rede frigorígena de cobre isolado para sistemas de ar-condicionado Split ou VRF',
          order: 128,
          categoryCode: '07',
          categoryName: 'Sistemas de Climatização e Exaustão (AVAC)',
          subCategoryName: 'Climatização, Exaustão e Ventilação Mecânica (HVAC / AVAC)',
          defaultResponsible: 'Técnico de Refrigeração e HVAC',
          defaultEstimatedDays: 5,
          description: 'Passagem de pares de tubos de cobre sem costura isolados individualmente com tubos de espuma elastomérica anti-condensação e cabos de sinal PP entre condensadoras e evaporadoras.',
          checklist: [
            'Soldagem oxiacetilênica das conexões de cobre com atmosfera inerte de nitrogênio para evitar fuligem interna',
            'Isolamento térmico contínuo sem pontes térmicas em todas as curvas e junções',
            'Instalação de linha de drenagem de condensado em PVC com declividade de 1% para ralo seco'
          ]
        },
        {
          id: 'srv-07-01-129',
          code: '07.01.129',
          name: 'Dutos metálicos galvanizados e dampers para renovação de ar e exaustão mecânica de banheiros e subsolos',
          order: 129,
          categoryCode: '07',
          categoryName: 'Sistemas de Climatização e Exaustão (AVAC)',
          subCategoryName: 'Climatização, Exaustão e Ventilação Mecânica (HVAC / AVAC)',
          defaultResponsible: 'Montador de Dutos / Funileiro Industrial',
          defaultEstimatedDays: 4,
          description: 'Instalação de rede de dutos em chapa galvanizada com juntas TDC ou venezianas de sobrepressão e ventiladores centrífugos de exaustão mecânica para renovação de ar conforme PMOC.',
          checklist: [
            'Vedação de todas as flanges dos dutos com fita de borracha butílica autoadesiva',
            'Instalação de dampers corta-fogo nas passagens de dutos por paredes corta-fogo',
            'Fixação dos exaustores centrífugos sobre amortecedores de mola contra ruído e vibração'
          ]
        },
        {
          id: 'srv-07-01-130',
          code: '07.01.130',
          name: 'Teste de pressurização da linha frigorígena com nitrogênio e teste de vácuo a 500 microns',
          order: 130,
          categoryCode: '07',
          categoryName: 'Sistemas de Climatização e Exaustão (AVAC)',
          subCategoryName: 'Climatização, Exaustão e Ventilação Mecânica (HVAC / AVAC)',
          defaultResponsible: 'Técnico de Refrigeração',
          defaultEstimatedDays: 2,
          description: 'Pressurização das linhas de gás refrigerante com nitrogênio seco a 550 PSI por 24 horas seguida de evacuação profunda com bomba de vácuo de duplo estágio atingindo nível inferior a 500 microns.',
          checklist: [
            'Medição do vácuo com vacuômetro digital de alta precisão (proibido uso de manômetro mecânico comum)',
            'Teste de retenção do vácuo por 30 minutos sem quebra para atestar ausência de umidade residual',
            'Liberação das válvulas de serviço para carga definitiva de refrigerante ecológico (R-410A / R-32)'
          ]
        }
      ]
    }
  ]
};

export default CATEGORY_SISTEMAS_AVAC;
