/**
 * categoryEletrica.ts
 * Categoria da EAP: Instalações Elétricas e Comandos
 * Ordem cronológica: serviços 112 a 119 e 131 a 133
 */

import { EAPCategoryTemplate } from '../eapTypes';

export const CATEGORY_INSTALACOES_ELETRICAS: EAPCategoryTemplate = {
  id: 'cat-06-eletrica',
  code: '06',
  name: 'Instalações Elétricas e Comandos',
  order: 6,
  description: 'Infraestrutura de eletrodutos, leitos e eletrocalhas, enfiação de condutores de força, quadros de distribuição (QGD/QDF), sistemas de aterramento e SPDA (para-raios), cabeamento estruturado e comandos.',
  subCategories: [
    {
      id: 'sub-06-01',
      code: '06.01',
      name: 'Instalações Elétricas (Infraestrutura, Fiação e Quadros)',
      order: 1,
      services: [
        {
          id: 'srv-06-01-112',
          code: '06.01.112',
          name: 'Chumbamento de caixas de passagem (4x2, 4x4 e octogonais de teto) e eletrodutos corrugados e rígidos',
          order: 112,
          categoryCode: '06',
          categoryName: 'Instalações Elétricas e Comandos',
          subCategoryName: 'Instalações Elétricas (Infraestrutura, Fiação e Quadros)',
          defaultResponsible: 'Eletricista / Pedreiro',
          defaultEstimatedDays: 6,
          description: 'Abertura de canaletas e chumbamento das caixas embutidas em prumo e nível rigorosos com eletrodutos corrugados reforçados amarelos/laranjas em conformidade com a NBR 5410.',
          checklist: [
            'Nivelamento e alinhamento milimétrico com nível laser das caixas de interruptores (1,10m) e tomadas baixas (0,30m)',
            'Encaixe firme dos eletrodutos nas caixas com buchas de pressão e arruelas apropriadas',
            'Passagem de fio-guia de náilon ou arame em 100% dos eletrodutos antes do reboco',
            'Proteção das caixas com tampas provisórias para impedir entrada de argamassa durante o reboco'
          ]
        },
        {
          id: 'srv-06-01-113',
          code: '06.01.113',
          name: 'Montagem de leitos, perfilados e eletrocalhas metálicas em garagens, subsolos e shafts técnicos',
          order: 113,
          categoryCode: '06',
          categoryName: 'Instalações Elétricas e Comandos',
          subCategoryName: 'Instalações Elétricas (Infraestrutura, Fiação e Quadros)',
          defaultResponsible: 'Eletricista / Montador Eletromecânico',
          defaultEstimatedDays: 5,
          description: 'Fixação de eletrocalhas perfuradas galvanizadas a fogo suspensas por tirantes roscados com septo divisor interno para separação física entre cabos de potência e cabos de telecomunicações.',
          checklist: [
            'Conferência da altura livre de passagem de veículos sob as eletrocalhas nos subsolos',
            'Aterramento de todas as emendas metálicas das eletrocalhas por cordoalha de cobre flexível',
            'Instalação de tampas de encaixe nas áreas sujeitas a goteiras ou poeira excessiva'
          ]
        },
        {
          id: 'srv-06-01-114',
          code: '06.01.114',
          name: 'Passagem e enfiação de condutores elétricos de cobre anti-chama (fase, neutro, terra e retorno)',
          order: 114,
          categoryCode: '06',
          categoryName: 'Instalações Elétricas e Comandos',
          subCategoryName: 'Instalações Elétricas (Infraestrutura, Fiação e Quadros)',
          defaultResponsible: 'Eletricista Instalador / Ajudante',
          defaultEstimatedDays: 8,
          description: 'Puxamento de cabos unipolares flexíveis de cobre eletrolítico com isolação em composto termoplástico anti-chama 750V / 1kV (NBR NM 247-3), respeitando a codificação padrão de cores de condutores.',
          checklist: [
            'Padronização obrigatória de cores de condutores (Azul-claro: Neutro | Verde ou Verde-Amarelo: Terra | Preto/Vermelho/Branco: Fases)',
            'Taxa de ocupação máxima de 40% da área útil do eletroduto com cabos',
            'Utilização exclusiva de vaselina industrial neutra ou talco para lubrificação de passagem (proibido sabão ou detergente)',
            'Deixamento de sobra de no mínimo 20cm de condutor em cada caixa para conexões'
          ]
        },
        {
          id: 'srv-06-01-115',
          code: '06.01.115',
          name: 'Montagem do Quadro Geral de Distribuição (QGD) e quadros de circuitos terminais com disjuntores DIN e DPS/DR',
          order: 115,
          categoryCode: '06',
          categoryName: 'Instalações Elétricas e Comandos',
          subCategoryName: 'Instalações Elétricas (Infraestrutura, Fiação e Quadros)',
          defaultResponsible: 'Eletricista Montador de Quadros',
          defaultEstimatedDays: 5,
          description: 'Instalação de barramentos de cobre tipo pente, montagem de mini-disjuntores termomagnéticos padrão DIN, interruptores diferenciais residuais (IDR de 30mA) e dispositivos protetores de surto (DPS).',
          checklist: [
            'Instalação de IDR geral ou por circuitos de áreas molhadas conforme prescrito pela NBR 5410',
            'Instalação de DPS classe II em todas as fases e neutro contra descargas atmosféricas',
            'Crimpagem de terminais tubulares ilhós em todos os condutores flexíveis conectados aos bornes',
            'Aperto dos bornes com chave dinamométrica aplicando o torque especificado pelo fabricante'
          ]
        },
        {
          id: 'srv-06-01-116',
          code: '06.01.116',
          name: 'Ensaio de resistência de isolamento dos condutores (megômetro) e continuidade do sistema de aterramento',
          order: 116,
          categoryCode: '06',
          categoryName: 'Instalações Elétricas e Comandos',
          subCategoryName: 'Instalações Elétricas (Infraestrutura, Fiação e Quadros)',
          defaultResponsible: 'Engenheiro Eletricista / Técnico em Eletrotécnica',
          defaultEstimatedDays: 2,
          description: 'Aplicação de tensão de ensaio de 500V CC com megômetro calibrado entre condutores vivos e condutor de proteção para certificar ausência de fuga de corrente e resistência superior a 1 megaohm.',
          checklist: [
            'Desconexão prévia de todos os aparelhos eletrônicos sensíveis antes da aplicação da alta tensão',
            'Medição circuito a circuito registrando a resistência de isolação em tabela técnica',
            'Teste de disparo de todos os dispositivos diferenciais residuais (botão de teste e simulador de fuga)',
            'Emissão do relatório de comissionamento de isolação elétrica assinado pelo responsável técnico'
          ]
        }
      ]
    },
    {
      id: 'sub-06-02',
      code: '06.02',
      name: 'Sistema de Proteção contra Descargas Atmosféricas (SPDA) e Aterramento',
      order: 2,
      services: [
        {
          id: 'srv-06-02-117',
          code: '06.02.117',
          name: 'Fixação dos captores tipo Franklin e anéis de cintura de proteção na cobertura (Método de Faraday)',
          order: 117,
          categoryCode: '06',
          categoryName: 'Instalações Elétricas e Comandos',
          subCategoryName: 'Sistema de Proteção contra Descargas Atmosféricas (SPDA) e Aterramento',
          defaultResponsible: 'Eletricista Especializado em SPDA',
          defaultEstimatedDays: 3,
          description: 'Instalação de malha captora com condutores de alumínio ou cobre fixados nos apoios isoladores da platibanda e captores tipo Franklin com mastro galvanizado no topo do reservatório superior (NBR 5419).',
          checklist: [
            'Conferência do raio e ângulo de proteção da malha captora conforme nível de proteção do projeto',
            'Instalação de suportes isoladores a cada 1 metro na platibanda e telhados',
            'Conexão equipotencial de todas as massas metálicas da cobertura (antenas, motores de elevador, dutos de exaustão)'
          ]
        },
        {
          id: 'srv-06-02-118',
          code: '06.02.118',
          name: 'Instalação de descidas do SPDA em barras de cobre/alumínio e caixas de equalização de potencial (BEP)',
          order: 118,
          categoryCode: '06',
          categoryName: 'Instalações Elétricas e Comandos',
          subCategoryName: 'Sistema de Proteção contra Descargas Atmosféricas (SPDA) e Aterramento',
          defaultResponsible: 'Eletricista de SPDA / Técnico',
          defaultEstimatedDays: 4,
          description: 'Montagem de condutores de descida naturais (estruturais) ou externos com caixas de inspeção tipo suspensa para medição individual e barramento de equipotencialização principal (BEP) no subsolo.',
          checklist: [
            'Instalação de terminais de ensaio e medição a 1,5m do solo em cada descida perimetral',
            'Proteção mecânica das descidas externas com eletroduto de PVC rígido ou aço até a altura de 2,5m',
            'Interligação de todas as armaduras estruturais das fundações ao anel de aterramento de base'
          ]
        },
        {
          id: 'srv-06-02-119',
          code: '06.02.119',
          name: 'Medição da resistência ôhmica de aterramento com terrômetro certificado (valor inferior a 10 ohms)',
          order: 119,
          categoryCode: '06',
          categoryName: 'Instalações Elétricas e Comandos',
          subCategoryName: 'Sistema de Proteção contra Descargas Atmosféricas (SPDA) e Aterramento',
          defaultResponsible: 'Engenheiro Eletricista',
          defaultEstimatedDays: 2,
          description: 'Ensaio de queda de potencial com método dos 62% cravando estacas auxiliares de corrente e potencial com terrômetro aferido pelo INMETRO, emitindo laudo de SPDA com ART/RRT.',
          checklist: [
            'Execução da medição em dia seco sem ocorrência prévia de chuva recente',
            'Comprovação da resistência de aterramento em consonância com as prescrições normativas',
            'Emissão do laudo conclusivo com mapa de pontos e anotação de responsabilidade técnica'
          ]
        }
      ]
    },
    {
      id: 'sub-06-03',
      code: '06.03',
      name: 'Cabeamento Estruturado, CFTV, Interfonia e Controle de Acesso',
      order: 3,
      services: [
        {
          id: 'srv-06-03-131',
          code: '06.03.131',
          name: 'Lançamento de cabos UTP Categoria 6 para dados, voz e pontos de câmeras de segurança CFTV',
          order: 131,
          categoryCode: '06',
          categoryName: 'Instalações Elétricas e Comandos',
          subCategoryName: 'Cabeamento Estruturado, CFTV, Interfonia e Controle de Acesso',
          defaultResponsible: 'Técnico de Redes / Cabeamento',
          defaultEstimatedDays: 5,
          description: 'Passagem dos cabos de rede de dados UTP Cat 6 LSZH (baixa emissão de fumaça e zero halogênio) em infraestrutura exclusiva separada da rede elétrica para evitar interferência eletromagnética.',
          checklist: [
            'Respeito ao raio de curvatura mínimo do cabo (8 vezes o diâmetro externo) sem dobras agudas',
            'Identificação numérica nas duas pontas de cada cabo com etiquetas permanentes termorretráteis',
            'Manutenção de distância mínima de 20cm em relação aos cabos elétricos de força'
          ]
        },
        {
          id: 'srv-06-03-132',
          code: '06.03.132',
          name: 'Montagem do rack de telecomunicações (CPD/MDF), patch panels, switchers e certificação de pontos com scanner',
          order: 132,
          categoryCode: '06',
          categoryName: 'Instalações Elétricas e Comandos',
          subCategoryName: 'Cabeamento Estruturado, CFTV, Interfonia e Controle de Acesso',
          defaultResponsible: 'Engenheiro de Redes / Técnico Certificador',
          defaultEstimatedDays: 3,
          description: 'Organização e terminação dos conectores RJ-45 fêmea no patch panel com ferramenta de punch down e certificação ponto a ponto com testador Fluke Networks para garantia de desempenho gigabit.',
          checklist: [
            'Aterramento dedicado da carcaça metálica do rack de telecomunicações',
            'Certificação ponto a ponto emitindo relatório gráfico de atenuação e paradiafonia (NEXT)',
            'Organização dos chicotes de cabos com velcros industriais (proibido abraçadeira plástica de nylon estranguladora)'
          ]
        },
        {
          id: 'srv-06-03-133',
          code: '06.03.133',
          name: 'Infraestrutura e cabeamento para interfonia coletiva, portaria virtual e cancelas automáticas',
          order: 133,
          categoryCode: '06',
          categoryName: 'Instalações Elétricas e Comandos',
          subCategoryName: 'Cabeamento Estruturado, CFTV, Interfonia e Controle de Acesso',
          defaultResponsible: 'Técnico de Segurança Eletrônica',
          defaultEstimatedDays: 4,
          description: 'Instalação de centrais de interfonia IP/analógica, fiação blindada para pontos de porteiros eletrônicos, leitores faciais/biométricos nos acessos de pedestres e sensores indutivos nas cancelas veiculares.',
          checklist: [
            'Teste de comunicação de áudio limpo e sem zumbido entre a guarita e todos os apartamentos',
            'Instalação de fechaduras eletroímã com botão de liberação rápida e chave mestra mecânica',
            'Configuração dos laços indutivos de piso para fechamento seguro das cancelas veiculares anti-esmagamento'
          ]
        }
      ]
    }
  ]
};

export default CATEGORY_INSTALACOES_ELETRICAS;
