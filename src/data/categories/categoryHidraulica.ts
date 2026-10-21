/**
 * categoryHidraulica.ts
 * Categoria da EAP: Instalações Hidráulicas, Esgoto e Águas Pluviais
 * Ordem cronológica: serviços 102 a 111
 */

import { EAPCategoryTemplate } from '../eapTypes';

export const CATEGORY_INSTALACOES_HIDRAULICAS: EAPCategoryTemplate = {
  id: 'cat-05-hidraulica',
  code: '05',
  name: 'Instalações Hidráulicas, Esgoto e Águas Pluviais',
  order: 5,
  description: 'Instalações hidrossanitárias de água fria e água quente (barrilete, colunas e ramais), esgoto sanitário, ventilação de coluna e redes de drenagem pluvial com cisternas de reúso.',
  subCategories: [
    {
      id: 'sub-05-01',
      code: '05.01',
      name: 'Instalações Hidrossanitárias de Água Fria e Água Quente',
      order: 1,
      services: [
        {
          id: 'srv-05-01-102',
          code: '05.01.102',
          name: 'Montagem de colunas mestras de distribuição de água fria (barrilete e shafts principais)',
          order: 102,
          categoryCode: '05',
          categoryName: 'Instalações Hidráulicas, Esgoto e Águas Pluviais',
          subCategoryName: 'Instalações Hidrossanitárias de Água Fria e Água Quente',
          defaultResponsible: 'Encanador / Instalador Hidráulico',
          defaultEstimatedDays: 5,
          description: 'Instalação das tubulações verticais de PVC marrom rígido e barrilete na saída dos reservatórios superiores com registros de gaveta e ventilação de coluna anti-golpe de aríete.',
          checklist: [
            'Conferência dos diâmetros nominais das colunas conforme pranchas de projeto hidrossanitário',
            'Fixação com abraçadeiras tipo gota ou ômega a cada 1,5 metro com isolamento antivibratório',
            'Instalação de registros de gaveta com volante para manobra em cada prumada independente',
            'Alinhamento e prumo das tubulações no interior dos shafts de serviço'
          ]
        },
        {
          id: 'srv-05-01-103',
          code: '05.01.103',
          name: 'Distribuição de ramais e sub-ramais de água fria em tubos de PVC soldados embutidos em alvenaria',
          order: 103,
          categoryCode: '05',
          categoryName: 'Instalações Hidráulicas, Esgoto e Águas Pluviais',
          subCategoryName: 'Instalações Hidrossanitárias de Água Fria e Água Quente',
          defaultResponsible: 'Encanador / Ajudante',
          defaultEstimatedDays: 6,
          description: 'Abertura de rasgos em alvenaria e embutimento das canalizações de água fria com conexões de transição azul com rosca de latão para todos os pontos de consumo dos banheiros e cozinhas.',
          checklist: [
            'Lixamento e limpeza com solução limpadora antes da soldagem com adesivo plástico para PVC',
            'Utilização obrigatória de joelhos e tês com bucha de latão nas saídas roscáveis para torneiras e chuveiros',
            'Conferência das alturas normatizadas de todos os pontos hidráulicos em relação ao nível de piso acabado',
            'Fixação e chumbamento das tubulações com argamassa forte antes do reboco'
          ]
        },
        {
          id: 'srv-05-01-104',
          code: '05.01.104',
          name: 'Distribuição de tubulação de água quente em PPR termofusionado ou PEX com isolamento térmico',
          order: 104,
          categoryCode: '05',
          categoryName: 'Instalações Hidráulicas, Esgoto e Águas Pluviais',
          subCategoryName: 'Instalações Hidrossanitárias de Água Fria e Água Quente',
          defaultResponsible: 'Encanador Especializado em Termofusão',
          defaultEstimatedDays: 5,
          description: 'Execução de soldagem molecular de tubulações de polipropileno copolímero random (PPR) por termofusora a 260°C ou sistema flexível PEX com tubos corrugados de proteção e isolamento em espuma elastomérica.',
          checklist: [
            'Calibração e aferição da temperatura da termofusora entre 255°C e 265°C',
            'Respeito rigoroso aos tempos de aquecimento e resfriamento por diâmetro nominal sem rotação do tubo',
            'Instalação de mantas ou tubos de espuma de polietileno expandido para isolamento térmico contínuo',
            'Previsão de curvas de dilatação térmica nos trechos retilíneos longos'
          ]
        },
        {
          id: 'srv-05-01-105',
          code: '05.01.105',
          name: 'Teste de estanqueidade e pressão hidrostática em redes de água com bomba pressurizadora',
          order: 105,
          categoryCode: '05',
          categoryName: 'Instalações Hidráulicas, Esgoto e Águas Pluviais',
          subCategoryName: 'Instalações Hidrossanitárias de Água Fria e Água Quente',
          defaultResponsible: 'Encanador / Engenheiro de Instalações',
          defaultEstimatedDays: 3,
          description: 'Fechamento de todos os pontos com plugues (bujões) e aplicação de pressão hidrostática de 10 kgf/cm² (ou 1,5 vezes a pressão de serviço) com bomba hidráulica e manômetro aferido por 1 hora.',
          checklist: [
            'Expulsação prévia de todo o ar retido na tubulação pelas torneiras de purga',
            'Estabilização da pressão de ensaio e registro fotográfico do mostrador do manômetro calibrado',
            'Inspeção visual minuciosa em 100% das conexões, soldas e juntas soldadas ou termofusionadas',
            'Emissão da folha de registro e ensaio hidrostático atestando ausência de queda de pressão'
          ]
        }
      ]
    },
    {
      id: 'sub-05-02',
      code: '05.02',
      name: 'Instalações de Esgoto Sanitário e Ventilação',
      order: 2,
      services: [
        {
          id: 'srv-05-02-106',
          code: '05.02.106',
          name: 'Instalação de tubos de queda de esgoto e ventilação sanitária com caixas sifonadas e ralos secos',
          order: 106,
          categoryCode: '05',
          categoryName: 'Instalações Hidráulicas, Esgoto e Águas Pluviais',
          subCategoryName: 'Instalações de Esgoto Sanitário e Ventilação',
          defaultResponsible: 'Encanador / Montador Hidráulico',
          defaultEstimatedDays: 6,
          description: 'Instalação de tubos de PVC série normal e reforçada (NBR 5688) para esgoto primário e secundário com vedação por anéis de borracha elastoméricos lubrificados com pasta de silicone.',
          checklist: [
            'Chanframento das pontas dos tubos e uso exclusivo de pasta lubrificante compatível com a borracha',
            'Instalação de tubos de ventilação secundária conectados ao desconector e ramal de descarga',
            'Nivelamento e fixação das caixas sifonadas com fecho hídrico mínimo de 50mm contra mau cheiro',
            'Alinhamento vertical dos tubos de queda com abraçadeiras metálicas a cada pavimento'
          ]
        },
        {
          id: 'srv-05-02-107',
          code: '05.02.107',
          name: 'Instalação de subcoletores horizontais suspensos com abraçadeiras antivibração e declividade regulamentar',
          order: 107,
          categoryCode: '05',
          categoryName: 'Instalações Hidráulicas, Esgoto e Águas Pluviais',
          subCategoryName: 'Instalações de Esgoto Sanitário e Ventilação',
          defaultResponsible: 'Encanador / Soldador Hidráulico',
          defaultEstimatedDays: 5,
          description: 'Montagem de tubulações suspensas sob a laje do subsolo com barras roscadas ajustáveis e conferência de declividade mínima de 2% para tubos até DN 75 e 1% para diâmetros iguais ou superiores a DN 100.',
          checklist: [
            'Conferência rigorosa da declividade com nível de precisão para evitar remanso ou assoreamento',
            'Instalação de curvas de raio longo e junções a 45 graus no sentido do fluxo dos efluentes',
            'Instalação de terminais de inspeção (Tê de visita com cap roscável) a cada mudança de direção e no máximo a cada 15m',
            'Fixação com buchas metálicas e tirantes antivibratórios suportando o peso do tubo com carga plena'
          ]
        },
        {
          id: 'srv-05-02-108',
          code: '05.02.108',
          name: 'Execução de caixas de inspeção, caixas de gordura e interligação com a rede pública coletora',
          order: 108,
          categoryCode: '05',
          categoryName: 'Instalações Hidráulicas, Esgoto e Águas Pluviais',
          subCategoryName: 'Instalações de Esgoto Sanitário e Ventilação',
          defaultResponsible: 'Pedreiro / Encanador',
          defaultEstimatedDays: 4,
          description: 'Construção ou assentamento de caixas em alvenaria impermeabilizada ou polietileno pré-fabricado com tampas herméticas estanques a odores e ligação no ramal predial da concessionária.',
          checklist: [
            'Instalação de caixa de gordura especial com cesto removível na saída da pia da cozinha',
            'Execução do fundo das caixas de inspeção com canaletas de meia-cana arredondadas com concordância de fluxo',
            'Impermeabilização interna completa com argamassa polimérica e teste de estanqueidade',
            'Assentamento de tampas herméticas com vedação de borracha para impedir saída de gases e insetos'
          ]
        },
        {
          id: 'srv-05-02-109',
          code: '05.02.109',
          name: 'Teste de fumaça e estanqueidade nas tubulações de esgoto e coluna de ventilação',
          order: 109,
          categoryCode: '05',
          categoryName: 'Instalações Hidráulicas, Esgoto e Águas Pluviais',
          subCategoryName: 'Instalações de Esgoto Sanitário e Ventilação',
          defaultResponsible: 'Engenheiro de Instalações / Encanador',
          defaultEstimatedDays: 2,
          description: 'Injeção de fumaça atóxica sob leve sobrepressão na rede de esgoto para rastreamento de vazamentos de gases e teste de lâmina de água de 24 horas nos tubos coletores.',
          checklist: [
            'Inspeção visual e olfativa de todas as caixas sifonadas e juntas da rede',
            'Verificação da saída contínua de ventilação no topo da coluna acima do telhado',
            'Garantia de integridade de todos os anéis de vedação de borracha'
          ]
        }
      ]
    },
    {
      id: 'sub-05-03',
      code: '05.03',
      name: 'Instalações de Drenagem Pluvial e Águas de Chuva',
      order: 3,
      services: [
        {
          id: 'srv-05-03-110',
          code: '05.03.110',
          name: 'Instalação de colunas pluviais verticais e shafts de coleta de calhas e coberturas',
          order: 110,
          categoryCode: '05',
          categoryName: 'Instalações Hidráulicas, Esgoto e Águas Pluviais',
          subCategoryName: 'Instalações de Drenagem Pluvial e Águas de Chuva',
          defaultResponsible: 'Encanador / Calheiro',
          defaultEstimatedDays: 4,
          description: 'Montagem de prumadas verticais de PVC rígido série reforçada para escoamento das águas captadas pelas calhas, ralos de cobertura e sacadas com ramais de extravasor (ladrão).',
          checklist: [
            'Conexão segura com os bocais de calha utilizando adesivo e vedações apropriadas',
            'Instalação de ramal de extravasor visível para alerta de eventual entupimento de calha',
            'Fixação robusta das colunas verticais com abraçadeiras capazes de absorver golpes de fluxo'
          ]
        },
        {
          id: 'srv-05-03-111',
          code: '05.03.111',
          name: 'Montagem de caixas de areia, gradeamento, cisterna de reúso de águas pluviais e sistema de bombeamento',
          order: 111,
          categoryCode: '05',
          categoryName: 'Instalações Hidráulicas, Esgoto e Águas Pluviais',
          subCategoryName: 'Instalações de Drenagem Pluvial e Águas de Chuva',
          defaultResponsible: 'Encanador / Eletricista de Força',
          defaultEstimatedDays: 5,
          description: 'Construção do sistema de descarte inicial de folhas e sedimentos (primeiras águas de chuva), reservatório de retenção de reúso e instalação de bombas submersíveis de recalque para lavagem e irrigação.',
          checklist: [
            'Instalação de cesto de gradeamento em aço inox para retenção de folhas e galhos',
            'Calibração da válvula de descarte dos primeiros 2mm de chuva (first flush)',
            'Montagem e teste automático das bombas centrífugas de reúso acionadas por bóias de nível elétricas'
          ]
        }
      ]
    }
  ]
};

export default CATEGORY_INSTALACOES_HIDRAULICAS;
