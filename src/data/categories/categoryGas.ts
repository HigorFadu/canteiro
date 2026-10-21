/**
 * categoryGas.ts
 * Categoria da EAP: Instalações de Gás (GLP/GN)
 * Ordem cronológica: serviços 120 a 122
 */

import { EAPCategoryTemplate } from '../eapTypes';

export const CATEGORY_INSTALACOES_GAS: EAPCategoryTemplate = {
  id: 'cat-08-gas',
  code: '08',
  name: 'Instalações de Gás (GLP/GN)',
  order: 8,
  description: 'Tubulações de cobre e aço para gás combustível canalizado (GLP e GN), abrigos de medição coletiva e individualizada, válvulas de bloqueio de emergência e testes pneumáticos de estanqueidade.',
  subCategories: [
    {
      id: 'sub-08-01',
      code: '08.01',
      name: 'Instalações de Gás Combustível (GLP / GN)',
      order: 1,
      services: [
        {
          id: 'srv-08-01-120',
          code: '08.01.120',
          name: 'Tubulação de cobre sem costura classe A ou aço galvanizado para prumada e ramais de gás',
          order: 120,
          categoryCode: '08',
          categoryName: 'Instalações de Gás (GLP/GN)',
          subCategoryName: 'Instalações de Gás Combustível (GLP / GN)',
          defaultResponsible: 'Gasista Instalador Certificado',
          defaultEstimatedDays: 5,
          description: 'Montagem de tubulações rígidas em cobre com solda foscoper ou prata e conexões de latão em shafts ventilados, proibido embutimento sem duto protetor estanque conforme NBR 15526.',
          checklist: [
            'Utilização de solda prata ou foscoper de alta temperatura com pasta desoxidante',
            'Instalação de tubos de ventilação permanente nos shafts de distribuição de gás',
            'Pintura amarela padronizada (código Munsell 5Y 8/12) em toda a tubulação aparente de gás'
          ]
        },
        {
          id: 'srv-08-01-121',
          code: '08.01.121',
          name: 'Teste de estanqueidade pneumática com nitrogênio e ar comprimido com manômetro aferido',
          order: 121,
          categoryCode: '08',
          categoryName: 'Instalações de Gás (GLP/GN)',
          subCategoryName: 'Instalações de Gás Combustível (GLP / GN)',
          defaultResponsible: 'Engenheiro Mecânico / Gasista Perito',
          defaultEstimatedDays: 2,
          description: 'Pressurização da rede de gás com gás inerte (nitrogênio N2) a 1,5 vezes a pressão de trabalho durante no mínimo 2 horas com monitoramento por manômetro de escala sensível.',
          checklist: [
            'Aplicação de solução de espuma de sabão neutro em 100% das juntas e roscas para checagem de bolhas',
            'Monitoramento da pressão por 120 minutos sem variação que caracterize fuga',
            'Emissão de Certificado de Estanqueidade da Rede de Gás'
          ]
        },
        {
          id: 'srv-08-01-122',
          code: '08.01.122',
          name: 'Instalação de válvulas de bloqueio de emergência, reguladores de pressão e abrigos de medição',
          order: 122,
          categoryCode: '08',
          categoryName: 'Instalações de Gás (GLP/GN)',
          subCategoryName: 'Instalações de Gás Combustível (GLP / GN)',
          defaultResponsible: 'Gasista Instalador / Técnico',
          defaultEstimatedDays: 3,
          description: 'Instalação de válvulas de esfera de fechamento rápido 1/4 de volta em cada unidade autônoma e reguladores de pressão de primeiro e segundo estágio no abrigo coletivo de medidores.',
          checklist: [
            'Conferência da ventilação natural inferior e superior no abrigo dos medidores de gás',
            'Identificação individualizada com plaquetas metálicas de cada medidor por número de apartamento',
            'Instalação de válvula de bloqueio manual de fácil acesso em caso de emergência'
          ]
        }
      ]
    }
  ]
};

export default CATEGORY_INSTALACOES_GAS;
