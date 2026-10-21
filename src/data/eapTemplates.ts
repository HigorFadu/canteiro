/**
 * eapTemplates.ts
 * Banco de dados estático mestre de Disciplinas (Categorias) e Serviços
 * em ordem cronológica de execução para o módulo de Andamento da Obra.
 * 
 * Etapa 1: Categorias 1, 2 e 3 completas (100% dos serviços digitados sem resumo/abreviação).
 */

export interface EAPServiceTemplate {
  id: string;
  code: string;
  name: string;
  order: number;
  categoryCode: string;
  categoryName: string;
  subCategoryName: string;
  defaultResponsible: string;
  defaultEstimatedDays: number;
  description: string;
  checklist: string[];
}

export interface EAPSubCategoryTemplate {
  id: string;
  code: string;
  name: string;
  order: number;
  services: EAPServiceTemplate[];
}

export interface EAPCategoryTemplate {
  id: string;
  code: string;
  name: string;
  order: number;
  description: string;
  subCategories: EAPSubCategoryTemplate[];
}

// ============================================================================
// CATEGORIA 1: SERVIÇOS PRELIMINARES E INSTALAÇÃO DO CANTEIRO DE OBRAS
// ============================================================================
export const CATEGORY_1_SERVICOS_PRELIMINARES: EAPCategoryTemplate = {
  id: 'cat-01',
  code: '01',
  name: 'Serviços Preliminares e Canteiro de Obras',
  order: 1,
  description: 'Estudos técnicos, licenças legais, demolições, implantação física do canteiro e locação geométrica da obra.',
  subCategories: [
    {
      id: 'sub-01-01',
      code: '01.01',
      name: 'Estudos, Projetos e Levantamentos Técnicos',
      order: 1,
      services: [
        {
          id: 'srv-01-01-001',
          code: '01.01.001',
          name: 'Levantamento topográfico planialtimétrico cadastral do terreno',
          order: 1,
          categoryCode: '01',
          categoryName: 'Serviços Preliminares e Canteiro de Obras',
          subCategoryName: 'Estudos, Projetos e Levantamentos Técnicos',
          defaultResponsible: 'Topógrafo / Engenheiro Residente',
          defaultEstimatedDays: 3,
          description: 'Mapeamento georreferenciado dos limites territoriais, marcos perimetrais, curvas de nível e interferências vizinhas.',
          checklist: [
            'Conferência de marcos geodésicos',
            'Demarcação dos limites do terreno conforme matrícula',
            'Identificação de árvores e postes de concessionárias',
            'Emissão da planta topográfica com curvas de nível'
          ]
        },
        {
          id: 'srv-01-01-002',
          code: '01.01.002',
          name: 'Sondagem de simples reconhecimento do solo (SPT)',
          order: 2,
          categoryCode: '01',
          categoryName: 'Serviços Preliminares e Canteiro de Obras',
          subCategoryName: 'Estudos, Projetos e Levantamentos Técnicos',
          defaultResponsible: 'Engenheiro Geotécnico / Sondador Especializado',
          defaultEstimatedDays: 4,
          description: 'Execução de furos de sondagem a percussão com ensaio SPT segundo a NBR 6484 para caracterização geotécnica.',
          checklist: [
            'Locação dos pontos de furo conforme projeto de sondagem',
            'Determinação do perfil estratigráfico do solo',
            'Medição dos índices de resistência à penetração (N-SPT)',
            'Identificação do nível do lençol freático'
          ]
        },
        {
          id: 'srv-01-01-003',
          code: '01.01.003',
          name: 'Sondagem rotativa e mista para verificação de maciço rochoso',
          order: 3,
          categoryCode: '01',
          categoryName: 'Serviços Preliminares e Canteiro de Obras',
          subCategoryName: 'Estudos, Projetos e Levantamentos Técnicos',
          defaultResponsible: 'Engenheiro Geotécnico',
          defaultEstimatedDays: 5,
          description: 'Perfuração com coroa diamantada para coleta de testemunhos de rocha e avaliação de espessura de matacões.',
          checklist: [
            'Coleta e catalogação dos testemunhos em caixas apropriadas',
            'Cálculo do RQD (Rock Quality Designation)',
            'Análise de descontinuidades e fraturas da rocha'
          ]
        },
        {
          id: 'srv-01-01-004',
          code: '01.01.004',
          name: 'Vistoria cautelar de vizinhança e laudo pericial fotográfico',
          order: 4,
          categoryCode: '01',
          categoryName: 'Serviços Preliminares e Canteiro de Obras',
          subCategoryName: 'Estudos, Projetos e Levantamentos Técnicos',
          defaultResponsible: 'Perito de Engenharia / Engenheiro Civil',
          defaultEstimatedDays: 5,
          description: 'Inspeção predial preventiva de todos os imóveis confinantes para registro de fissuras e trincas pré-existentes.',
          checklist: [
            'Visita técnica aos imóveis vizinhos laterais e de fundos',
            'Registro fotográfico de alta resolução das anomalias pré-existentes',
            'Colheita de assinaturas dos proprietários vizinhos no termo de vistoria',
            'Registro em cartório do laudo pericial cautelar'
          ]
        },
        {
          id: 'srv-01-01-005',
          code: '01.01.005',
          name: 'Compatibilização geral de projetos executivos (BIM / Interferências)',
          order: 5,
          categoryCode: '01',
          categoryName: 'Serviços Preliminares e Canteiro de Obras',
          subCategoryName: 'Estudos, Projetos e Levantamentos Técnicos',
          defaultResponsible: 'Coordenador de Projetos / Engenheiro Residente',
          defaultEstimatedDays: 10,
          description: 'Confronto tridimensional entre arquitetura, estrutura, elétrica, hidráulica, ar condicionado e combate a incêndio.',
          checklist: [
            'Detecção de interferências físicas (Clash Detection)',
            'Definição de furos e aberturas em vigas e lajes',
            'Emissão de lista de RFI (Request for Information) aos projetistas',
            'Liberação dos arquivos em versão executiva carimbada "Para Construção"'
          ]
        },
        {
          id: 'srv-01-01-006',
          code: '01.01.006',
          name: 'Planejamento executivo e cronograma físico-financeiro detalhado',
          order: 6,
          categoryCode: '01',
          categoryName: 'Serviços Preliminares e Canteiro de Obras',
          subCategoryName: 'Estudos, Projetos e Levantamentos Técnicos',
          defaultResponsible: 'Engenheiro de Planejamento',
          defaultEstimatedDays: 6,
          description: 'Estruturação da EAP, definição do caminho crítico (CPM), linha de balanço e histograma de recursos.',
          checklist: [
            'Cadastro de durações e precedências lógicas',
            'Nivelamento de mão de obra e equipamentos',
            'Curva S prevista de desembolso e avanço físico'
          ]
        }
      ]
    },
    {
      id: 'sub-01-02',
      code: '01.02',
      name: 'Licenciamento, Aprovações Legais e Concessionárias',
      order: 2,
      services: [
        {
          id: 'srv-01-02-001',
          code: '01.02.001',
          name: 'Alvará de construção e licença de obras junto à Prefeitura Municipal',
          order: 7,
          categoryCode: '01',
          categoryName: 'Serviços Preliminares e Canteiro de Obras',
          subCategoryName: 'Licenciamento, Aprovações Legais e Concessionárias',
          defaultResponsible: 'Engenheiro Legal / Despachante Técnico',
          defaultEstimatedDays: 15,
          description: 'Protocolo e acompanhamento do processo de aprovação de projeto legal e emissão da licença de construção.',
          checklist: [
            'Aprovação do projeto arquitetônico legal',
            'Pagamento de taxas municipais (ISS da obra / outorga onerosa)',
            'Emissão do Alvará de Construção e afixação no canteiro'
          ]
        },
        {
          id: 'srv-01-02-002',
          code: '01.02.002',
          name: 'Comunicação prévia de início de obra à DRT (Ministério do Trabalho - NR-18)',
          order: 8,
          categoryCode: '01',
          categoryName: 'Serviços Preliminares e Canteiro de Obras',
          subCategoryName: 'Licenciamento, Aprovações Legais e Concessionárias',
          defaultResponsible: 'Técnico de Segurança do Trabalho / Engenheiro de Segurança',
          defaultEstimatedDays: 2,
          description: 'Protocolo eletrônico de início das atividades laborais da construção civil na fiscalização do trabalho.',
          checklist: [
            'Preenchimento de dados do PGR (Programa de Gerenciamento de Riscos)',
            'Informação do número máximo previsto de trabalhadores',
            'Protocolo no portal do Ministério do Trabalho e Emprego'
          ]
        },
        {
          id: 'srv-01-02-003',
          code: '01.02.003',
          name: 'Abertura de Matrícula CNO (Cadastro Nacional de Obras) na Receita Federal',
          order: 9,
          categoryCode: '01',
          categoryName: 'Serviços Preliminares e Canteiro de Obras',
          subCategoryName: 'Licenciamento, Aprovações Legais e Concessionárias',
          defaultResponsible: 'Contabilidade da Construtora / Engenheiro Residente',
          defaultEstimatedDays: 2,
          description: 'Cadastro fiscal da obra para apuração das contribuições previdenciárias e emissão da futura certidão negativa.',
          checklist: [
            'Vinculação do CNO ao CNPJ da empresa executora',
            'Definição da metragem quadrada total a ser construída',
            'Emissão do comprovante de inscrição no CNO'
          ]
        },
        {
          id: 'srv-01-02-004',
          code: '01.02.004',
          name: 'Ligação provisória de energia elétrica trifásica junto à concessionária',
          order: 10,
          categoryCode: '01',
          categoryName: 'Serviços Preliminares e Canteiro de Obras',
          subCategoryName: 'Licenciamento, Aprovações Legais e Concessionárias',
          defaultResponsible: 'Eletricista Instalador / Encarregado de Elétrica',
          defaultEstimatedDays: 7,
          description: 'Instalação de poste padrão provisório, caixa de medição trifásica, aterramento e vistoria da concessionária.',
          checklist: [
            'Instalação do poste de concreto padrão homologado',
            'Instalação da haste de aterramento cobreada e caixa de inspeção',
            'Montagem do disjuntor geral e chave seccionadora',
            'Vistoria e instalação do medidor pela concessionária'
          ]
        },
        {
          id: 'srv-01-02-005',
          code: '01.02.005',
          name: 'Ligação provisória de água tratada e esgoto sanitário junto à concessionária',
          order: 11,
          categoryCode: '01',
          categoryName: 'Serviços Preliminares e Canteiro de Obras',
          subCategoryName: 'Licenciamento, Aprovações Legais e Concessionárias',
          defaultResponsible: 'Encanador / Encarregado de Instalações',
          defaultEstimatedDays: 5,
          description: 'Execução do ramal provisório de entrada de água potável, hidrômetro e interligação com a rede coletora pública.',
          checklist: [
            'Abertura de vala no passeio público',
            'Instalação da caixa de proteção para hidrômetro',
            'Conexão do colar de tomada na rede pública pela concessionária',
            'Instalação de caixa d’água provisória no canteiro de obras'
          ]
        }
      ]
    },
    {
      id: 'sub-01-03',
      code: '01.03',
      name: 'Limpeza do Terreno, Demolições e Movimentação Inicial',
      order: 3,
      services: [
        {
          id: 'srv-01-03-001',
          code: '01.03.001',
          name: 'Desmatamento, capina e raspagem da camada vegetal do terreno',
          order: 12,
          categoryCode: '01',
          categoryName: 'Serviços Preliminares e Canteiro de Obras',
          subCategoryName: 'Limpeza do Terreno, Demolições e Movimentação Inicial',
          defaultResponsible: 'Operador de Trator / Mestre de Obras',
          defaultEstimatedDays: 3,
          description: 'Remoção de vegetação rasteira, tocos, raízes e raspagem da camada orgânica de solo até 20cm de profundidade.',
          checklist: [
            'Conferência de autorização de supressão vegetal municipal',
            'Operação de trator de esteiras / pá carregadeira',
            'Separação da terra preta orgânica para aproveitamento em paisagismo'
          ]
        },
        {
          id: 'srv-01-03-002',
          code: '01.03.002',
          name: 'Demolição de edificações e muros antigos existentes',
          order: 13,
          categoryCode: '01',
          categoryName: 'Serviços Preliminares e Canteiro de Obras',
          subCategoryName: 'Limpeza do Terreno, Demolições e Movimentação Inicial',
          defaultResponsible: 'Encarregado de Demolição / Mestre de Obras',
          defaultEstimatedDays: 6,
          description: 'Demolição controlada mecanizada e manual com isolamento acústico e aspersão constante de água para redução de poeira.',
          checklist: [
            'Desligamento definitivo de redes elétricas e de gás antigas',
            'Colocação de tela fachadeira de proteção nos muros limítrofes',
            'Demolição de alvenarias e coberturas de cima para baixo',
            'Aspersão contínua com mangueira para controle de partículas'
          ]
        },
        {
          id: 'srv-01-03-003',
          code: '01.03.003',
          name: 'Carga, transporte e destinação final de entulhos em bota-fora licenciado',
          order: 14,
          categoryCode: '01',
          categoryName: 'Serviços Preliminares e Canteiro de Obras',
          subCategoryName: 'Limpeza do Terreno, Demolições e Movimentação Inicial',
          defaultResponsible: 'Apontador de Campo / Mestre de Obras',
          defaultEstimatedDays: 4,
          description: 'Carregamento mecanizado com retroescavadeira em caminhões caçamba basculantes e controle de CTR (Controle de Transporte de Resíduos).',
          checklist: [
            'Controle de viagens e tíquetes de pesagem dos caminhões',
            'Emissão dos manifestos de transporte de resíduos (MTR)',
            'Comprovação de destinação em aterro licenciado de inertes'
          ]
        }
      ]
    },
    {
      id: 'sub-01-04',
      code: '01.04',
      name: 'Implantação Física do Canteiro de Obras (NR-18)',
      order: 4,
      services: [
        {
          id: 'srv-01-04-001',
          code: '01.04.001',
          name: 'Construção de tapume de vedação perimetral e portões de acesso',
          order: 15,
          categoryCode: '01',
          categoryName: 'Serviços Preliminares e Canteiro de Obras',
          subCategoryName: 'Implantação Física do Canteiro de Obras (NR-18)',
          defaultResponsible: 'Carpinteiro Chefe / Mestre de Obras',
          defaultEstimatedDays: 4,
          description: 'Montagem de tapumes com esteios de madeira tratada espaçados a cada 2m e fechamento em chapas compensadas ou telhas metálicas h=2,20m.',
          checklist: [
            'Alinhamento com o meio-fio e respeito ao passeio público',
            'Instalação de portão de veículos com largura mínima de 4m',
            'Instalação de portão para entrada exclusiva de pedestres',
            'Pintura externa e fixação da placa regulamentar da obra'
          ]
        },
        {
          id: 'srv-01-04-002',
          code: '01.04.002',
          name: 'Instalação de guarita de segurança e controle de acesso biométrico/catraca',
          order: 16,
          categoryCode: '01',
          categoryName: 'Serviços Preliminares e Canteiro de Obras',
          subCategoryName: 'Implantação Física do Canteiro de Obras (NR-18)',
          defaultResponsible: 'Encarregado de Obras / Eletricista',
          defaultEstimatedDays: 2,
          description: 'Montagem do posto de controle com visão frontal para pedestres e veículos, interfonia e catraca de crachá.',
          checklist: [
            'Assentamento da cabine de guarita sobre piso cimentado',
            'Instalação de iluminação interna e tomadas estabilizadas',
            'Ligação do computador e software de controle de presença'
          ]
        },
        {
          id: 'srv-01-04-003',
          code: '01.04.003',
          name: 'Montagem de escritório de engenharia, sala técnica e reuniões',
          order: 17,
          categoryCode: '01',
          categoryName: 'Serviços Preliminares e Canteiro de Obras',
          subCategoryName: 'Implantação Física do Canteiro de Obras (NR-18)',
          defaultResponsible: 'Encarregado de Obras / Mestre',
          defaultEstimatedDays: 4,
          description: 'Instalação de módulos habitacionais termoacústicos ou alvenaria provisória para corpo técnico, mesa de projetos e rede.',
          checklist: [
            'Bancada ampla para análise e consulta de pranchas de projeto A0',
            'Instalação de ar condicionado e iluminação fria adequada',
            'Pontos de rede cabeada e Wi-Fi de alta velocidade'
          ]
        },
        {
          id: 'srv-01-04-004',
          code: '01.04.004',
          name: 'Montagem do almoxarifado central e ferramentaria com controle de estoque',
          order: 18,
          categoryCode: '01',
          categoryName: 'Serviços Preliminares e Canteiro de Obras',
          subCategoryName: 'Implantação Física do Canteiro de Obras (NR-18)',
          defaultResponsible: 'Almoxarife Chefe / Mestre de Obras',
          defaultEstimatedDays: 3,
          description: 'Espaço trancado com prateleiras metálicas moduladas, gaveteiros para miudezas, bancada de entrega e quadro de ferramentas.',
          checklist: [
            'Instalação de prateleiras reforçadas para ferramentas elétricas',
            'Quadro para controle visual de fichas de cautela de ferramentas',
            'Balcão de atendimento com grade divisória de segurança',
            'Extintor de incêndio pó químico ABC instalado no acesso'
          ]
        },
        {
          id: 'srv-01-04-005',
          code: '01.04.005',
          name: 'Construção do depósito de cimento e agregados com estrados elevados',
          order: 19,
          categoryCode: '01',
          categoryName: 'Serviços Preliminares e Canteiro de Obras',
          subCategoryName: 'Implantação Física do Canteiro de Obras (NR-18)',
          defaultResponsible: 'Pedreiro / Carpinteiro',
          defaultEstimatedDays: 3,
          description: 'Galpão coberto e ventilado, fechado lateralmente, com estrado de madeira elevado a 15cm do piso contra umidade ascendente.',
          checklist: [
            'Empilhamento de sacaria respeitando limite máximo de 10 sacos',
            'Fechamento contra respingos de chuva e umidade',
            'Baias divisórias de madeira para areia média e brita 1 e 2'
          ]
        },
        {
          id: 'srv-01-04-006',
          code: '01.04.006',
          name: 'Montagem da bancada de armação e corte de aço (Central de Aço)',
          order: 20,
          categoryCode: '01',
          categoryName: 'Serviços Preliminares e Canteiro de Obras',
          subCategoryName: 'Implantação Física do Canteiro de Obras (NR-18)',
          defaultResponsible: 'Armador Chefe / Mestre de Obras',
          defaultEstimatedDays: 2,
          description: 'Bancada reforçada de madeira com cobertura de telha, garras fixas de dobra, tesoura guilhotina mecânica e policorte.',
          checklist: [
            'Cobertura protegendo os operadores contra intempéries',
            'Cavaletes de madeira para estoque segregado por bitola (CA-50 e CA-60)',
            'Aterramento elétrico das máquinas de corte e dobra'
          ]
        },
        {
          id: 'srv-01-04-007',
          code: '01.04.007',
          name: 'Montagem da bancada de carpintaria e serra circular de bancada (Central de Madeira)',
          order: 21,
          categoryCode: '01',
          categoryName: 'Serviços Preliminares e Canteiro de Obras',
          subCategoryName: 'Implantação Física do Canteiro de Obras (NR-18)',
          defaultResponsible: 'Carpinteiro Chefe / Técnico de Segurança',
          defaultEstimatedDays: 2,
          description: 'Área coberta com bancada de corte de madeira equipada com coifa protetora de lâmina de serra, cutelo divisor e botão de emergência.',
          checklist: [
            'Serra circular homologada com protetor de lâmina móvel',
            'Botão de desligamento de emergência de fácil acesso',
            'Coletor de serragem e extintor de água pressurizada próximo'
          ]
        },
        {
          id: 'srv-01-04-008',
          code: '01.04.008',
          name: 'Construção do refeitório dos operários com aquecedores e assentos (NR-18)',
          order: 22,
          categoryCode: '01',
          categoryName: 'Serviços Preliminares e Canteiro de Obras',
          subCategoryName: 'Implantação Física do Canteiro de Obras (NR-18)',
          defaultResponsible: 'Encarregado de Obras / Técnico de Segurança',
          defaultEstimatedDays: 4,
          description: 'Ambiente com mesas de tampo liso e lavável, bancos com encosto, lavatório com sabonete líquido e estufa aquecedora de marmitas.',
          checklist: [
            'Capacidade dimensionada para acomodar o turno da obra',
            'Instalação de bebedouro com água potável filtrada',
            'Instalação de estufa ou micro-ondas para aquecimento de refeições',
            'Lixeira com tampa acionada por pedal para descarte de resíduos'
          ]
        },
        {
          id: 'srv-01-04-009',
          code: '01.04.009',
          name: 'Construção de vestiários masculinos/femininos com armários individuais e chuveiros',
          order: 23,
          categoryCode: '01',
          categoryName: 'Serviços Preliminares e Canteiro de Obras',
          subCategoryName: 'Implantação Física do Canteiro de Obras (NR-18)',
          defaultResponsible: 'Encarregado de Obras / Encanador',
          defaultEstimatedDays: 4,
          description: 'Instalação de compartimentos sanitários individuais, mictórios, chuveiros elétricos com estrado plástico e armários com cadeado.',
          checklist: [
            'Proporção de 1 bacia sanitária para cada 20 trabalhadores',
            'Proporção de 1 chuveiro com água quente para cada 10 trabalhadores',
            'Armários individuais com duas portas ou duplo compartimento',
            'Ventilação cruzada permanente e impermeabilização do piso'
          ]
        },
        {
          id: 'srv-01-04-010',
          code: '01.04.010',
          name: 'Construção da baia ecológica de coleta seletiva de resíduos da construção civil',
          order: 24,
          categoryCode: '01',
          categoryName: 'Serviços Preliminares e Canteiro de Obras',
          subCategoryName: 'Implantação Física do Canteiro de Obras (NR-18)',
          defaultResponsible: 'Técnico de Meio Ambiente / Mestre de Obras',
          defaultEstimatedDays: 2,
          description: 'Instalação de baias sinalizadas conforme Resolução CONAMA 307: Classe A (alvenaria/concreto), B (plástico/papel/madeira), C e D (perigosos).',
          checklist: [
            'Identificação visual clara das classes de resíduos',
            'Piso concretado e cobertura impermeável para tintas e solventes (Classe D)',
            'Espaço livre para manobra e içamento de caçambas estacionárias'
          ]
        }
      ]
    },
    {
      id: 'sub-01-05',
      code: '01.05',
      name: 'Locação Geométrica da Obra e Gabarito Geral',
      order: 5,
      services: [
        {
          id: 'srv-01-05-001',
          code: '01.05.001',
          name: 'Construção do gabarito de madeira perimetral (tábua corrida)',
          order: 25,
          categoryCode: '01',
          categoryName: 'Serviços Preliminares e Canteiro de Obras',
          subCategoryName: 'Locação Geométrica da Obra e Gabarito Geral',
          defaultResponsible: 'Carpinteiro Chefe / Topógrafo',
          defaultEstimatedDays: 3,
          description: 'Cravação de pontaletes de madeira 7,5x7,5cm a cada 1,50m e fixação de tábuas corridas niveladas rigorosamente com nível ótico.',
          checklist: [
            'Nivelamento perfeito de todas as tábuas no mesmo plano horizontal',
            'Estabilidade mecânica e travamento contra empuxo e abalos de caminhões',
            'Pintura branca das tábuas para marcação visível dos eixos'
          ]
        },
        {
          id: 'srv-01-05-002',
          code: '01.05.002',
          name: 'Marcação topográfica de eixos estruturais e pontos de fundação',
          order: 26,
          categoryCode: '01',
          categoryName: 'Serviços Preliminares e Canteiro de Obras',
          subCategoryName: 'Locação Geométrica da Obra e Gabarito Geral',
          defaultResponsible: 'Topógrafo / Engenheiro Residente',
          defaultEstimatedDays: 3,
          description: 'Transferência de coordenadas dos eixos principais do projeto para o gabarito com estação total e cravação de pregos guias.',
          checklist: [
            'Marcação dos pregos e identificação numérica dos eixos (1, 2, 3...) e alfabética (A, B, C...)',
            'Cruzamento dos fios de nylon e transferência de prumo para o terreno com prumo de centro',
            'Pintura com cal e cravação de piquetes de madeira nas posições exatas das estacas/sapatas',
            'Conferência das diagonais pelo teorema de Pitágoras (3-4-5)'
          ]
        }
      ]
    }
  ]
};

// ============================================================================
// CATEGORIA 2: INFRAESTRUTURA, FUNDAÇÕES E CONTENÇÕES
// ============================================================================
export const CATEGORY_2_INFRAESTRUTURA_FUNDACOES: EAPCategoryTemplate = {
  id: 'cat-02',
  code: '02',
  name: 'Infraestrutura, Fundações e Contenções',
  order: 2,
  description: 'Contenções de terra, estacas, tubulões, sapatas, blocos de coroamento, vigas baldrames e impermeabilização enterrada.',
  subCategories: [
    {
      id: 'sub-02-01',
      code: '02.01',
      name: 'Contenções, Cortinas e Estabilização de Taludes',
      order: 1,
      services: [
        {
          id: 'srv-02-01-001',
          code: '02.01.001',
          name: 'Perfuração e injeção de tirantes / chumbadores para solo grampeado',
          order: 27,
          categoryCode: '02',
          categoryName: 'Infraestrutura, Fundações e Contenções',
          subCategoryName: 'Contenções, Cortinas e Estabilização de Taludes',
          defaultResponsible: 'Encarregado de Geotecnia / Perfurador',
          defaultEstimatedDays: 8,
          description: 'Perfuração rotopercursiva do talude, instalação de barras de aço CA-50/aço especial com centralizadores e injeção de calda de cimento sob pressão.',
          checklist: [
            'Conferência do ângulo de inclinação do furo',
            'Instalação de tubos manchetados para injeção setorizada',
            'Controle do fator água/cimento da calda e pressão do manômetro'
          ]
        },
        {
          id: 'srv-02-01-002',
          code: '02.01.002',
          name: 'Instalação de tela soldada e projeção de concreto armado (solo grampeado)',
          order: 28,
          categoryCode: '02',
          categoryName: 'Infraestrutura, Fundações e Contenções',
          subCategoryName: 'Contenções, Cortinas e Estabilização de Taludes',
          defaultResponsible: 'Operador de Mangote / Mestre de Fundações',
          defaultEstimatedDays: 6,
          description: 'Fixação de tela soldada de aço Q-196 com placas de ancoragem e projeção por via úmida de concreto projetado espessura 7 a 10cm.',
          checklist: [
            'Aplicação de barbacãs e drenos sub-horizontais profundos (DHP)',
            'Regulagem da dosagem de acelerador de pega no bico da mangueira',
            'Verificação da espessura com cravos de referência'
          ]
        },
        {
          id: 'srv-02-01-003',
          code: '02.01.003',
          name: 'Perfuração e concretagem de estacas pranchas para cortina de contenção',
          order: 29,
          categoryCode: '02',
          categoryName: 'Infraestrutura, Fundações e Contenções',
          subCategoryName: 'Contenções, Cortinas e Estabilização de Taludes',
          defaultResponsible: 'Encarregado de Fundações',
          defaultEstimatedDays: 12,
          description: 'Execução de linha de estacas justapostas ou secantes ao longo da divisa para contenção do subsolo.',
          checklist: [
            'Prumo e espaçamento rigoroso entre eixos de estacas',
            'Descida da armadura com espaçadores de plástico tipo rolete',
            'Concretagem contínua para evitar vazios na parede de contenção'
          ]
        },
        {
          id: 'srv-02-01-004',
          code: '02.01.004',
          name: 'Execução da viga de coroamento de contenções e estacas perimetrais',
          order: 30,
          categoryCode: '02',
          categoryName: 'Infraestrutura, Fundações e Contenções',
          subCategoryName: 'Contenções, Cortinas e Estabilização de Taludes',
          defaultResponsible: 'Carpinteiro / Armador / Mestre',
          defaultEstimatedDays: 5,
          description: 'Desponte das estacas da cortina, montagem de fôrma, armadura longitudinal e concretagem da viga contínua de amarração superior.',
          checklist: [
            'Engastamento das esperas de aço das estacas na viga de coroamento',
            'Alinhamento e nivelamento topográfico da face superior',
            'Vibração mecânica do concreto e cura química'
          ]
        },
        {
          id: 'srv-02-01-005',
          code: '02.01.005',
          name: 'Protensão e teste de carga em tirantes provisórios de contenção',
          order: 31,
          categoryCode: '02',
          categoryName: 'Infraestrutura, Fundações e Contenções',
          subCategoryName: 'Contenções, Cortinas e Estabilização de Taludes',
          defaultResponsible: 'Engenheiro Geotécnico / Técnico de Protensão',
          defaultEstimatedDays: 4,
          description: 'Aplicação de carga com macaco hidráulico calibrado nos bulbos de ancoragem para atestar capacidade de carga.',
          checklist: [
            'Calibração de célula de carga e manômetro',
            'Ensaio de qualificação e de recebimento conforme NBR 5629',
            'Cravação de cunhas de retenção na cabeça do tirante'
          ]
        }
      ]
    },
    {
      id: 'sub-02-02',
      code: '02.02',
      name: 'Rebaixamento do Lençol Freático e Drenagem Profunda',
      order: 2,
      services: [
        {
          id: 'srv-02-02-001',
          code: '02.02.001',
          name: 'Instalação de sistema de rebaixamento por ponteiras filtrantes (Well-points)',
          order: 32,
          categoryCode: '02',
          categoryName: 'Infraestrutura, Fundações e Contenções',
          subCategoryName: 'Rebaixamento do Lençol Freático e Drenagem Profunda',
          defaultResponsible: 'Técnico Especialista em Rebaixamento / Eletricista',
          defaultEstimatedDays: 5,
          description: 'Cravação por jato de água de ponteiras ranhuradas com filtro envolvente e interligação a tubos coletores a vácuo.',
          checklist: [
            'Espaçamento constante de 1 a 1,5m entre ponteiras',
            'Teste de vácuo nas bombas autoescorvantes',
            'Instalação de grupo gerador de emergência para operação 24h sem interrupção'
          ]
        },
        {
          id: 'srv-02-02-002',
          code: '02.02.002',
          name: 'Perfuração e instalação de poços profundos de sucção com bombas submersas',
          order: 33,
          categoryCode: '02',
          categoryName: 'Infraestrutura, Fundações e Contenções',
          subCategoryName: 'Rebaixamento do Lençol Freático e Drenagem Profunda',
          defaultResponsible: 'Encarregado de Perfuração / Eletromecânico',
          defaultEstimatedDays: 6,
          description: 'Perfuração de poços de grande diâmetro com filtro de tubo geomecânico, envelopamento com brita graduada e bomba submersível.',
          checklist: [
            'Instalação de sensores de nível boia automática de acionamento',
            'Medição diária da vazão e monitoramento dos piezômetros vizinhos',
            'Canalização segura das águas bombeadas até a rede pluvial municipal'
          ]
        },
        {
          id: 'srv-02-02-003',
          code: '02.02.003',
          name: 'Execução de valas drenantes profundas e colchão de drenagem de pedra rachão',
          order: 34,
          categoryCode: '02',
          categoryName: 'Infraestrutura, Fundações e Contenções',
          subCategoryName: 'Rebaixamento do Lençol Freático e Drenagem Profunda',
          defaultResponsible: 'Encarregado de Obras / Pedreiro',
          defaultEstimatedDays: 4,
          description: 'Abertura de valas no fundo da cava com caimento para caixas coletoras, assentamento de manta geotêxtil (Bidim) e brita.',
          checklist: [
            'Caimento mínimo de 1% em direção ao poço de captação',
            'Instalação de tubos de PEAD corrugado perfurado para drenagem',
            'Envelopamento completo do tubo com manta geotêxtil e brita 2'
          ]
        }
      ]
    },
    {
      id: 'sub-02-03',
      code: '02.03',
      name: 'Escavação Geral e Movimentação da Cava do Subsolo',
      order: 3,
      services: [
        {
          id: 'srv-02-03-001',
          code: '02.03.001',
          name: 'Escavação mecanizada do volume de subsolo com escavadeira hidráulica',
          order: 35,
          categoryCode: '02',
          categoryName: 'Infraestrutura, Fundações e Contenções',
          subCategoryName: 'Escavação Geral e Movimentação da Cava do Subsolo',
          defaultResponsible: 'Operador de Escavadeira / Apontador',
          defaultEstimatedDays: 14,
          description: 'Remoção em etapas descendentes (bermas de estabilização) compatibilizadas com o avanço dos tirantes e contenções.',
          checklist: [
            'Respeito às cotas de escavação por nível com conferência de mira laser',
            'Manutenção de rampas seguras de saída de caminhões basculantes',
            'Inspeção diária da estabilidade das bermas temporárias de terra'
          ]
        },
        {
          id: 'srv-02-03-002',
          code: '02.03.002',
          name: 'Acerto manual de fundo da cava de fundações e remoção de solo amoltecido',
          order: 36,
          categoryCode: '02',
          categoryName: 'Infraestrutura, Fundações e Contenções',
          subCategoryName: 'Escavação Geral e Movimentação da Cava do Subsolo',
          defaultResponsible: 'Feitor / Serventes / Mestre',
          defaultEstimatedDays: 4,
          description: 'Escavação com pá e picareta para não alterar o solo natural de apoio e atingir a cota de projeto sem remexer o fundo.',
          checklist: [
            'Conferência milimétrica da cota de fundo com nível ótico',
            'Apiloamento leve com soquete manual',
            'Limpeza imediata antes do lançamento do concreto magro'
          ]
        }
      ]
    },
    {
      id: 'sub-02-04',
      code: '02.04',
      name: 'Fundações Profundas (Estacas e Tubulões)',
      order: 4,
      services: [
        {
          id: 'srv-02-04-001',
          code: '02.04.001',
          name: 'Perfuração de estacas hélice contínua monitorada por computador de bordo',
          order: 37,
          categoryCode: '02',
          categoryName: 'Infraestrutura, Fundações e Contenções',
          subCategoryName: 'Fundações Profundas (Estacas e Tubulões)',
          defaultResponsible: 'Operador de Perfuratriz Hélice / Engenheiro de Fundações',
          defaultEstimatedDays: 10,
          description: 'Perfuração ininterrupta por trado helicoidal até a cota impenetrável ou torque estipulado pelo projeto de fundações.',
          checklist: [
            'Posicionamento da ponta da hélice exatamente sobre o piquete topográfico',
            'Verificação do prumo da torre nos dois eixos (X e Y)',
            'Registro eletrônico de torque, velocidade de penetração e profundidade'
          ]
        },
        {
          id: 'srv-02-04-002',
          code: '02.04.002',
          name: 'Injeção de concreto bombeado pela haste central e retirada da hélice contínua',
          order: 38,
          categoryCode: '02',
          categoryName: 'Infraestrutura, Fundações e Contenções',
          subCategoryName: 'Fundações Profundas (Estacas e Tubulões)',
          defaultResponsible: 'Operador de Bomba de Concreto / Engenheiro Fiscal',
          defaultEstimatedDays: 10,
          description: 'Injeção de concreto usinado com slump 22±2cm e fck>=30MPa sob pressão positiva constante sem descontinuidade do fuste.',
          checklist: [
            'Manutenção de pressão positiva de bombeamento durante subida da hélice',
            'Fator de consumo de concreto mínimo de 1,15 a 1,20 para garantia de seção',
            'Moldagem de corpos de prova para cada caminhão de estaca'
          ]
        },
        {
          id: 'srv-02-04-003',
          code: '02.04.003',
          name: 'Colocação de armadura em gaiola nas estacas com auxílio de guincho/vibrador',
          order: 39,
          categoryCode: '02',
          categoryName: 'Infraestrutura, Fundações e Contenções',
          subCategoryName: 'Fundações Profundas (Estacas e Tubulões)',
          defaultResponsible: 'Armador / Operador de Munck / Mestre',
          defaultEstimatedDays: 10,
          description: 'Descida imediata da armadura montada com espaçadores circulares no concreto fresco antes do início da pega.',
          checklist: [
            'Conferência do comprimento e bitola dos ferros da gaiola',
            'Fixação de espaçadores plásticos a cada 1,5m em toda a extensão',
            'Imersão da armadura até a cota de projeto sem deformação plástica'
          ]
        },
        {
          id: 'srv-02-04-004',
          code: '02.04.004',
          name: 'Cravação de estacas pré-moldadas de concreto armado / protendido',
          order: 40,
          categoryCode: '02',
          categoryName: 'Infraestrutura, Fundações e Contenções',
          subCategoryName: 'Fundações Profundas (Estacas e Tubulões)',
          defaultResponsible: 'Operador de Bate-estacas / Encarregado',
          defaultEstimatedDays: 8,
          description: 'Posicionamento e cravação com martelo em queda livre ou hidráulico, com controle de nega e repique elástico.',
          checklist: [
            'Proteção da cabeça da estaca com coxim de madeira e cepo de aço',
            'Medição rigorosa da nega nas últimas 10 pancadas do martelo',
            'Registro das fichas individuais de cravação de cada estaca'
          ]
        },
        {
          id: 'srv-02-04-005',
          code: '02.04.005',
          name: 'Perfuração e injeção de estacas tipo raiz em solo e rocha',
          order: 41,
          categoryCode: '02',
          categoryName: 'Infraestrutura, Fundações e Contenções',
          subCategoryName: 'Fundações Profundas (Estacas e Tubulões)',
          defaultResponsible: 'Encarregado de Estaca Raiz',
          defaultEstimatedDays: 8,
          description: 'Perfuração com revestimento integral e injeção alternada de argamassa de cimento e areia com ar comprimido.',
          checklist: [
            'Conferência do embutimento mínimo na camada de rocha sã',
            'Colocação do tubo central de armadura de aço',
            'Pressurização com ar comprimido para expulsão de água e lama'
          ]
        },
        {
          id: 'srv-02-04-006',
          code: '02.04.006',
          name: 'Arrasamento e descabeçamento mecânico de estacas até a cota de assentamento',
          order: 42,
          categoryCode: '02',
          categoryName: 'Infraestrutura, Fundações e Contenções',
          subCategoryName: 'Fundações Profundas (Estacas e Tubulões)',
          defaultResponsible: 'Operador de Martelete / Pedreiro',
          defaultEstimatedDays: 5,
          description: 'Corte do concreto frágil de topo de estaca com martelete pneumático leve sem danificar a armadura nem fissurar o fuste.',
          checklist: [
            'Marcação precisa com nível ótico da cota de arrasamento',
            'Corte perimetral inicial com disco diamantado para evitar lascas',
            'Preservação do comprimento de ancoragem das esperas de aço'
          ]
        },
        {
          id: 'srv-02-04-007',
          code: '02.04.007',
          name: 'Execução de ensaios de integridade PIT (Pile Integrity Test) e prova de carga',
          order: 43,
          categoryCode: '02',
          categoryName: 'Infraestrutura, Fundações e Contenções',
          subCategoryName: 'Fundações Profundas (Estacas e Tubulões)',
          defaultResponsible: 'Engenheiro Geotécnico Perito',
          defaultEstimatedDays: 2,
          description: 'Ensaio dinâmico sônico não-destrutivo com acelerômetro acoplado no topo da estaca para detecção de falhas ou estrangulamento.',
          checklist: [
            'Preparo e lixamento liso da superfície de topo da estaca',
            'Golpe com martelo de mão instrumentado',
            'Análise do ecograma de reflexão de ondas e laudo conclusivo'
          ]
        }
      ]
    },
    {
      id: 'sub-02-05',
      code: '02.05',
      name: 'Blocos de Coroamento, Sapatas e Vigas Baldrames',
      order: 5,
      services: [
        {
          id: 'srv-02-05-001',
          code: '02.05.001',
          name: 'Lançamento de lastro de concreto magro espessura 5cm em cavas e blocos',
          order: 44,
          categoryCode: '02',
          categoryName: 'Infraestrutura, Fundações e Contenções',
          subCategoryName: 'Blocos de Coroamento, Sapatas e Vigas Baldrames',
          defaultResponsible: 'Pedreiro / Servente',
          defaultEstimatedDays: 3,
          description: 'Regularização do fundo das cavas com concreto não-estrutural para isolamento das armaduras do contato com a terra.',
          checklist: [
            'Espessura uniforme mínima de 5cm garantida',
            'Superfície desempenada e isenta de terra solta',
            'Secagem prévia antes da montagem das fôrmas'
          ]
        },
        {
          id: 'srv-02-05-002',
          code: '02.05.002',
          name: 'Montagem de fôrmas de madeira/metálica para blocos de coroamento e sapatas',
          order: 45,
          categoryCode: '02',
          categoryName: 'Infraestrutura, Fundações e Contenções',
          subCategoryName: 'Blocos de Coroamento, Sapatas e Vigas Baldrames',
          defaultResponsible: 'Carpinteiro Chefe',
          defaultEstimatedDays: 5,
          description: 'Confeção e posicionamento de painéis laterais de fôrma com gravatas e tensores de aço para resistir à pressão do concreto.',
          checklist: [
            'Esquadro, prumo e dimensões exatas de projeto',
            'Aplicação de desmoldante biodegradável na face interna',
            'Estanqueidade das juntas contra vazamento de nata de cimento'
          ]
        },
        {
          id: 'srv-02-05-003',
          code: '02.05.003',
          name: 'Armação e posicionamento de armaduras de blocos, sapatas e arranques de pilares',
          order: 46,
          categoryCode: '02',
          categoryName: 'Infraestrutura, Fundações e Contenções',
          subCategoryName: 'Blocos de Coroamento, Sapatas e Vigas Baldrames',
          defaultResponsible: 'Armador Chefe / Engenheiro Fiscal',
          defaultEstimatedDays: 6,
          description: 'Amarração com arame recozido 18 das malhas inferiores e superiores de aço CA-50 e posicionamento dos arranques de pilares.',
          checklist: [
            'Espaçadores plásticos de alta resistência para cobrimento normativo de 5cm',
            'Amarração rígida das esperas dos pilares com gabarito de posicionamento',
            'Conferência do diâmetro e quantidade de barras conforme memorial'
          ]
        },
        {
          id: 'srv-02-05-004',
          code: '02.05.004',
          name: 'Concretagem e adensamento vibrado de blocos de coroamento e sapatas',
          order: 47,
          categoryCode: '02',
          categoryName: 'Infraestrutura, Fundações e Contenções',
          subCategoryName: 'Blocos de Coroamento, Sapatas e Vigas Baldrames',
          defaultResponsible: 'Mestre de Obras / Pedreiro',
          defaultEstimatedDays: 4,
          description: 'Lançamento de concreto usinado bombeado com slump 12±2cm e fck>=30MPa com vibração por vibrador de agulha 60mm.',
          checklist: [
            'Vibração em camadas sucessivas de até 50cm sem tocar nas armaduras',
            'Nivelamento superior do topo do bloco na cota exata',
            'Início imediato da cura úmida contínua'
          ]
        },
        {
          id: 'srv-02-05-005',
          code: '02.05.005',
          name: 'Montagem de fôrmas e armação das vigas baldrames de travamento',
          order: 48,
          categoryCode: '02',
          categoryName: 'Infraestrutura, Fundações e Contenções',
          subCategoryName: 'Blocos de Coroamento, Sapatas e Vigas Baldrames',
          defaultResponsible: 'Carpinteiro / Armador',
          defaultEstimatedDays: 6,
          description: 'Interligação entre blocos através de vigas baldrames de concreto armado apoiadas sobre lastro de concreto magro.',
          checklist: [
            'Alinhamento com as paredes de alvenaria do pavimento térreo/subsolo',
            'Passagem de tubulações de esgoto e água que cruzam o baldrame',
            'Colocação de espaçadores nas laterais e fundo da viga'
          ]
        },
        {
          id: 'srv-02-05-006',
          code: '02.05.006',
          name: 'Concretagem, desforma e cura das vigas baldrames',
          order: 49,
          categoryCode: '02',
          categoryName: 'Infraestrutura, Fundações e Contenções',
          subCategoryName: 'Blocos de Coroamento, Sapatas e Vigas Baldrames',
          defaultResponsible: 'Pedreiro / Mestre',
          defaultEstimatedDays: 4,
          description: 'Lançamento contínuo do concreto nas vigas baldrames, adensamento vibrado e posterior desforma lateral com 3 dias.',
          checklist: [
            'Controle do fck por corpos de prova de compressão',
            'Superfície superior desempenada e rústica para aderência',
            'Cura com aspersão d’água por no mínimo 7 dias'
          ]
        },
        {
          id: 'srv-02-05-007',
          code: '02.05.007',
          name: 'Impermeabilização asfáltica e cristalização de vigas baldrames e blocos',
          order: 50,
          categoryCode: '02',
          categoryName: 'Infraestrutura, Fundações e Contenções',
          subCategoryName: 'Blocos de Coroamento, Sapatas e Vigas Baldrames',
          defaultResponsible: 'Impermeabilizador Especializado',
          defaultEstimatedDays: 4,
          description: 'Aplicação de primer e 3 demãos cruzadas de emulsão asfáltica elastomérica ou argamassa polimérica contra umidade ascendente.',
          checklist: [
            'Arredondamento das arestas vivas (meia-cana) com argamassa forte',
            'Pintura estendendo-se por todas as faces e 20cm acima do solo nas paredes',
            'Teste de aderência e tempo de secagem entre demãos'
          ]
        },
        {
          id: 'srv-02-05-008',
          code: '02.05.008',
          name: 'Reaterro e compactação mecanizada entre blocos e baldrames em camadas de 20cm',
          order: 51,
          categoryCode: '02',
          categoryName: 'Infraestrutura, Fundações e Contenções',
          subCategoryName: 'Blocos de Coroamento, Sapatas e Vigas Baldrames',
          defaultResponsible: 'Operador de Compactador Sapo / Servente',
          defaultEstimatedDays: 5,
          description: 'Preenchimento com solo selecionado livre de entulhos orgânicos com compactação por compactador de percussão a gasolina.',
          checklist: [
            'Umidade ótima de compactação controlada com ensaio de Proctor',
            'Espessura máxima de cada camada solta limitada a 20cm',
            'Ensaio de frasco de areia para comprovação de grau de compactação >= 95%'
          ]
        }
      ]
    }
  ]
};

// ============================================================================
// CATEGORIA 3: SUPRAESTRUTURA E ESTRUTURA PRINCIPAL
// ============================================================================
export const CATEGORY_3_SUPRAESTRUTURA: EAPCategoryTemplate = {
  id: 'cat-03',
  code: '03',
  name: 'Supraestrutura e Estrutura Principal',
  order: 3,
  description: 'Pilares, vigas, lajes, escadas, caixas de elevador, reservatórios e elementos de concreto armado/protendido.',
  subCategories: [
    {
      id: 'sub-03-01',
      code: '03.01',
      name: 'Pilares e Elementos Verticais Estruturais',
      order: 1,
      services: [
        {
          id: 'srv-03-01-001',
          code: '03.01.001',
          name: 'Locação topográfica de arranque de pilares e marcação de gabarito de base',
          order: 52,
          categoryCode: '03',
          categoryName: 'Supraestrutura e Estrutura Principal',
          subCategoryName: 'Pilares e Elementos Verticais Estruturais',
          defaultResponsible: 'Topógrafo / Mestre de Obras',
          defaultEstimatedDays: 2,
          description: 'Conferência milimétrica das coordenadas e alinhamento dos pilares no pavimento antes da montagem da armadura.',
          checklist: [
            'Transferência de eixos com estação total e prumo laser',
            'Marcação a giz/tinta com gabarito de madeira pregado no piso',
            'Conferência do recuo das faces em relação ao eixo de projeto'
          ]
        },
        {
          id: 'srv-03-01-002',
          code: '03.01.002',
          name: 'Limpeza, apicoamento e tratamento da junta fria de concretagem na base dos pilares',
          order: 53,
          categoryCode: '03',
          categoryName: 'Supraestrutura e Estrutura Principal',
          subCategoryName: 'Pilares e Elementos Verticais Estruturais',
          defaultResponsible: 'Pedreiro / Servente',
          defaultEstimatedDays: 1,
          description: 'Apicoamento manual com ponteiro para exposição dos agregados graúdos e lavagem sob pressão para garantir monolitismo.',
          checklist: [
            'Remoção de qualquer película de nata de cimento frágil',
            'Aspiração de poeira e serragem acumulada na base',
            'Aplicação eventual de ponte de aderência polimérica'
          ]
        },
        {
          id: 'srv-03-01-003',
          code: '03.01.003',
          name: 'Emenda por transpasse e amarração das armaduras verticais e estribos dos pilares',
          order: 54,
          categoryCode: '03',
          categoryName: 'Supraestrutura e Estrutura Principal',
          subCategoryName: 'Pilares e Elementos Verticais Estruturais',
          defaultResponsible: 'Armador Chefe / Engenheiro Fiscal',
          defaultEstimatedDays: 4,
          description: 'Amarração das barras longitudinais de aço CA-50 e estribos fechados com ganchos a 135° conforme NBR 6118.',
          checklist: [
            'Comprimento de transpasse normativo atendido (ex: 50 x diâmetro)',
            'Adensamento dos estribos nas regiões de topo e base do pilar',
            'Fixação de espaçadores plásticos tipo pastilha a cada 80cm em todas as faces'
          ]
        },
        {
          id: 'srv-03-01-004',
          code: '03.01.004',
          name: 'Instalação de tubulações embutidas e eletrodutos aprovados dentro dos pilares',
          order: 55,
          categoryCode: '03',
          categoryName: 'Supraestrutura e Estrutura Principal',
          subCategoryName: 'Pilares e Elementos Verticais Estruturais',
          defaultResponsible: 'Eletricista / Encanador',
          defaultEstimatedDays: 1,
          description: 'Passagem exclusiva de tubulações elétricas ou hidrossanitárias expressamente autorizadas pelo projetista estrutural.',
          checklist: [
            'Garantia de que a tubulação não ultrapassa 1/3 da espessura do pilar',
            'Amarração firme para não deslocar com o vibrador de concreto',
            'Vedações das pontas dos eletrodutos para não entrar nata'
          ]
        },
        {
          id: 'srv-03-01-005',
          code: '03.01.005',
          name: 'Aplicação de desmoldante biodegradável nos painéis de fôrma de pilares',
          order: 56,
          categoryCode: '03',
          categoryName: 'Supraestrutura e Estrutura Principal',
          subCategoryName: 'Pilares e Elementos Verticais Estruturais',
          defaultResponsible: 'Carpinteiro',
          defaultEstimatedDays: 1,
          description: 'Aplicação com rolo ou pulverizador de película homogênea de desmoldante vegetal sem excessos que manchem o concreto.',
          checklist: [
            'Limpeza prévia de raspagem dos painéis de madeira/metálicos',
            'Não contaminação das armaduras de aço com desmoldante',
            'Verificação visual de recobrimento uniforme'
          ]
        },
        {
          id: 'srv-03-01-006',
          code: '03.01.006',
          name: 'Montagem, fechamento, aprumo e travamento das fôrmas de pilares com gravatas e tensores',
          order: 57,
          categoryCode: '03',
          categoryName: 'Supraestrutura e Estrutura Principal',
          subCategoryName: 'Pilares e Elementos Verticais Estruturais',
          defaultResponsible: 'Carpinteiro Chefe / Mestre',
          defaultEstimatedDays: 4,
          description: 'Fechamento com painéis de compensado plastificado 18mm ou formas de alumínio, com escoramento diagonal regulável nos dois sentidos.',
          checklist: [
            'Conferência do prumo nas faces ortogonais com prumo de face',
            'Aperto de barras tensoras rosqueadas e borboletas de pressão',
            'Abertura de janela provisória na base (janela de limpeza) para retirada de detritos'
          ]
        },
        {
          id: 'srv-03-01-007',
          code: '03.01.007',
          name: 'Concretagem de pilares com concreto usinado autoadensável/convencional e vibração',
          order: 58,
          categoryCode: '03',
          categoryName: 'Supraestrutura e Estrutura Principal',
          subCategoryName: 'Pilares e Elementos Verticais Estruturais',
          defaultResponsible: 'Mestre de Obras / Operador de Vibrador',
          defaultEstimatedDays: 2,
          description: 'Lançamento com tubo tremie ou mangote de bomba descendo até o fundo para evitar segregação, com vibração externa e interna.',
          checklist: [
            'Altura de queda livre do concreto limitada a no máximo 2,00m',
            'Vibração com agulha fina 35mm em camadas de 50cm',
            'Batimento suave com macete de borracha na fôrma para eliminação de bolhas superficiais'
          ]
        },
        {
          id: 'srv-03-01-008',
          code: '03.01.008',
          name: 'Desforma lateral cuidadosa e cura úmida e contínua dos pilares',
          order: 59,
          categoryCode: '03',
          categoryName: 'Supraestrutura e Estrutura Principal',
          subCategoryName: 'Pilares e Elementos Verticais Estruturais',
          defaultResponsible: 'Carpinteiro / Servente',
          defaultEstimatedDays: 2,
          description: 'Retirada das gravatas e fôrmas após prazo normativo mínimo de 48h sem impacto mecânico nas arestas e envolvimento com filme plástico.',
          checklist: [
            'Inspeção visual imediata para verificação de bicheiras ou vazios',
            'Envolvimento do pilar com manta geotêxtil umedecida e filme stretch',
            'Manutenção da hidratação diária por no mínimo 7 dias'
          ]
        }
      ]
    },
    {
      id: 'sub-03-02',
      code: '03.02',
      name: 'Escoramento, Fôrmas e Re-escoramento de Vigas e Lajes',
      order: 2,
      services: [
        {
          id: 'srv-03-02-001',
          code: '03.02.001',
          name: 'Montagem de torres de carga e escoras metálicas telescópicas ajustáveis',
          order: 60,
          categoryCode: '03',
          categoryName: 'Supraestrutura e Estrutura Principal',
          subCategoryName: 'Escoramento, Fôrmas e Re-escoramento de Vigas e Lajes',
          defaultResponsible: 'Montador de Andaimes / Carpinteiro',
          defaultEstimatedDays: 4,
          description: 'Montagem do sistema de escoramento de aço galvanizado apoiado sobre piso rígido com sapatas reguláveis conforme projeto de fôrmas.',
          checklist: [
            'Assentamento das bases sobre pranchões de madeira para distribuição de carga',
            'Travamento horizontal com tubos e braçadeiras a cada 2m de altura',
            'Alinhamento e ajuste fino de nível nos forcados superiores'
          ]
        },
        {
          id: 'srv-03-02-002',
          code: '03.02.002',
          name: 'Montagem de vigas principais (longarinas) e vigas secundárias (barrotes) de alumínio/madeira',
          order: 61,
          categoryCode: '03',
          categoryName: 'Supraestrutura e Estrutura Principal',
          subCategoryName: 'Escoramento, Fôrmas e Re-escoramento de Vigas e Lajes',
          defaultResponsible: 'Carpinteiro Chefe',
          defaultEstimatedDays: 3,
          description: 'Disposição da grelha de vigas H20 ou vigas de alumínio sobre os forcados com cálculo da contra-flecha estipulada.',
          checklist: [
            'Aplicação da contra-flecha central de vigas e lajes de grande vão (L/500)',
            'Espaçamento constante entre barrotes para suporte do compensado sem flexão',
            'Fixação com pregos de cabeça dupla para facilitar desforma posterior'
          ]
        },
        {
          id: 'srv-03-02-003',
          code: '03.02.003',
          name: 'Montagem do fundo e painéis laterais de fôrma de vigas com compensado plastificado',
          order: 62,
          categoryCode: '03',
          categoryName: 'Supraestrutura e Estrutura Principal',
          subCategoryName: 'Escoramento, Fôrmas e Re-escoramento de Vigas e Lajes',
          defaultResponsible: 'Carpinteiro Chefe',
          defaultEstimatedDays: 5,
          description: 'Fixação de tábuas de fundo niveladas e painéis laterais com gravatas de travamento superior para manter largura uniforme.',
          checklist: [
            'Conferência das dimensões da seção transversal (b x h)',
            'Garantia de estanqueidade nas junções entre fundo e laterais com fita adesiva',
            'Instalação de mãos-francesas de contraventamento nas laterais'
          ]
        },
        {
          id: 'srv-03-02-004',
          code: '03.02.004',
          name: 'Montagem do assoalho de fôrma de lajes maciças / posicionamento de cubetas plásticas',
          order: 63,
          categoryCode: '03',
          categoryName: 'Supraestrutura e Estrutura Principal',
          subCategoryName: 'Escoramento, Fôrmas e Re-escoramento de Vigas e Lajes',
          defaultResponsible: 'Carpinteiro / Mestre',
          defaultEstimatedDays: 5,
          description: 'Colocação das chapas de compensado resinado/plastificado 18mm ou fôrmas modulares de polipropileno para lajes nervuradas.',
          checklist: [
            'Encontro perfeito entre chapas sem ressaltos (dente) na face aparente',
            'Aplicação de desmoldante antes da descida de qualquer armadura',
            'Limpeza da superfície com vassoura e recolhimento de pregos soltos'
          ]
        },
        {
          id: 'srv-03-02-005',
          code: '03.02.005',
          name: 'Colocação de vigotas pré-moldadas e elementos de enchimento (EPS / tavelas cerâmicas)',
          order: 64,
          categoryCode: '03',
          categoryName: 'Supraestrutura e Estrutura Principal',
          subCategoryName: 'Escoramento, Fôrmas e Re-escoramento de Vigas e Lajes',
          defaultResponsible: 'Pedreiro / Carpinteiro',
          defaultEstimatedDays: 4,
          description: 'Apoio das vigotas treliçadas nas vigas, encaixe dos blocos de EPS moldado e linha central de escoramento para evitar quebras.',
          checklist: [
            'Apoio mínimo de 5cm das vigotas sobre as vigas de concreto',
            'Alinhamento dos blocos de EPS sem folgas excessivas',
            'Colocação de tábuas de tráfego sobre o EPS para passagem segura dos operários'
          ]
        }
      ]
    },
    {
      id: 'sub-03-03',
      code: '03.03',
      name: 'Armação de Vigas, Lajes e Embutimentos Técnicos',
      order: 3,
      services: [
        {
          id: 'srv-03-03-001',
          code: '03.03.001',
          name: 'Montagem e posicionamento da armadura inferior e superior longitudinal de vigas',
          order: 65,
          categoryCode: '03',
          categoryName: 'Supraestrutura e Estrutura Principal',
          subCategoryName: 'Armação de Vigas, Lajes e Embutimentos Técnicos',
          defaultResponsible: 'Armador Chefe / Mestre',
          defaultEstimatedDays: 6,
          description: 'Colocação das barras de tração, armadura de pele e barras superiores com apoio em cavaletes e amarração de estribos.',
          checklist: [
            'Conferência do diâmetro, posição e traspasse das barras conforme prancha de vigas',
            'Posicionamento de espaçadores plásticos tipo rolete nas laterais e cadeirinhas no fundo',
            'Verificação dos comprimentos de ancoragem nos apoios dos pilares'
          ]
        },
        {
          id: 'srv-03-03-002',
          code: '03.03.002',
          name: 'Amarração e distribuição dos estribos de vigas com ganchos a 135 graus',
          order: 66,
          categoryCode: '03',
          categoryName: 'Supraestrutura e Estrutura Principal',
          subCategoryName: 'Armação de Vigas, Lajes e Embutimentos Técnicos',
          defaultResponsible: 'Armador',
          defaultEstimatedDays: 4,
          description: 'Distribuição dos estribos com espaçamento menor nas proximidades dos apoios (zona de cisalhamento máximo).',
          checklist: [
            'Conferência do espaçamento mínimo e máximo entre estribos',
            'Alternância da posição das emendas dos ganchos dos estribos',
            'Amarração rígida com nó duplo de arame recozido'
          ]
        },
        {
          id: 'srv-03-03-003',
          code: '03.03.003',
          name: 'Montagem da armadura positiva (malha inferior) de lajes maciças / nervuradas',
          order: 67,
          categoryCode: '03',
          categoryName: 'Supraestrutura e Estrutura Principal',
          subCategoryName: 'Armação de Vigas, Lajes e Embutimentos Técnicos',
          defaultResponsible: 'Armador',
          defaultEstimatedDays: 4,
          description: 'Disposição cruzada das barras de aço CA-50 ou tela soldada nervurada sobre espaçadores plásticos tipo cadeirinha.',
          checklist: [
            'Cobrimento inferior normativo de 2,5cm garantido por espaçadores a cada metro quadrado',
            'Transpasse mínimo de 3 malhas para telas soldadas',
            'Amarração de todos os cruzamentos perimetrais da malha'
          ]
        },
        {
          id: 'srv-03-03-004',
          code: '03.03.004',
          name: 'Instalação de eletrodutos, caixas elétricas e shafts passantes na laje',
          order: 68,
          categoryCode: '03',
          categoryName: 'Supraestrutura e Estrutura Principal',
          subCategoryName: 'Armação de Vigas, Lajes e Embutimentos Técnicos',
          defaultResponsible: 'Eletricista / Encanador Predial',
          defaultEstimatedDays: 3,
          description: 'Fixação de caixas octogonais de teto, traçado de tubulações corrugadas reforçadas e passagens de tubos de queda de esgoto.',
          checklist: [
            'Amarração dos eletrodutos à malha de aço com arame para não flutuarem',
            'Vedação de todas as caixas com papel/tampas plásticas contra entrada de nata',
            'Instalação de colarinhos/carenagens de EPS para furos de prumadas futuras'
          ]
        },
        {
          id: 'srv-03-03-005',
          code: '03.03.005',
          name: 'Montagem da armadura negativa (malha superior / chapéu) de lajes sobre vigas',
          order: 69,
          categoryCode: '03',
          categoryName: 'Supraestrutura e Estrutura Principal',
          subCategoryName: 'Armação de Vigas, Lajes e Embutimentos Técnicos',
          defaultResponsible: 'Armador Chefe / Engenheiro Fiscal',
          defaultEstimatedDays: 3,
          description: 'Instalação de barras superiores sobre cavaletes metálicos rígidos (caranguejos) para resistir aos momentos fletores negativos.',
          checklist: [
            'Posicionamento de cavaletes de suporte a cada 60cm para resistir ao trânsito dos operários',
            'Comprimento de ancoragem das barras negativas para dentro dos vãos adjacentes',
            'Armadura de reforço de cantos e aberturas de shafts'
          ]
        },
        {
          id: 'srv-03-03-006',
          code: '03.03.006',
          name: 'Limpeza geral das fôrmas com jato de ar comprimido e lavagem com água',
          order: 70,
          categoryCode: '03',
          categoryName: 'Supraestrutura e Estrutura Principal',
          subCategoryName: 'Armação de Vigas, Lajes e Embutimentos Técnicos',
          defaultResponsible: 'Servente / Feitor',
          defaultEstimatedDays: 1,
          description: 'Remoção de pontas de arame, pedaços de madeira, serragem e poeira através de janelas de inspeção antes da concretagem.',
          checklist: [
            'Passagem do compressor de ar em todos os fundos de vigas',
            'Lavagem com mangueira d’água para umedecimento prévio das fôrmas de madeira',
            'Fechamento definitivo das janelas de limpeza de vigas e pilares'
          ]
        }
      ]
    },
    {
      id: 'sub-03-04',
      code: '03.04',
      name: 'Concretagem, Nivelamento e Cura de Vigas e Lajes',
      order: 4,
      services: [
        {
          id: 'srv-03-04-001',
          code: '03.04.001',
          name: 'Vistoria e liberação técnica formal da armação e fôrmas para concretagem (Checklist)',
          order: 71,
          categoryCode: '03',
          categoryName: 'Supraestrutura e Estrutura Principal',
          subCategoryName: 'Concretagem, Nivelamento e Cura de Vigas e Lajes',
          defaultResponsible: 'Engenheiro Residente / Fiscal da Obra',
          defaultEstimatedDays: 1,
          description: 'Inspeção minuciosa com prancha estrutural em mãos de todos os elementos, cobrimentos, escoramentos e embutimentos.',
          checklist: [
            'Conferência de cotas de nível e espessura da laje marcada em mestras',
            'Assinatura da ficha de liberação de concretagem (FVS - Ficha de Verificação de Serviço)',
            'Checagem da disponibilidade de caminhões betoneira e bomba de concreto reserva'
          ]
        },
        {
          id: 'srv-03-04-002',
          code: '03.04.002',
          name: 'Controle tecnológico do concreto usinado: Ensaio de Slump Test e moldagem de corpos de prova',
          order: 72,
          categoryCode: '03',
          categoryName: 'Supraestrutura e Estrutura Principal',
          subCategoryName: 'Concretagem, Nivelamento e Cura de Vigas e Lajes',
          defaultResponsible: 'Laboratorista de Concreto / Engenheiro de Qualidade',
          defaultEstimatedDays: 1,
          description: 'Ensaio de abatimento de tronco de cone na chegada de cada caminhão e moldagem de 6 corpos de prova cilíndricos (NBR 5738).',
          checklist: [
            'Aferição do Slump Test (ex: 12±2cm ou espalhamento de autoadensável)',
            'Verificação do horário de saída da usina e nota fiscal (máximo 2h30)',
            'Identificação dos corpos de prova para ruptura aos 7, 14 e 28 dias'
          ]
        },
        {
          id: 'srv-03-04-003',
          code: '03.04.003',
          name: 'Lançamento e bombeamento contínuo de concreto usinado em vigas e lajes',
          order: 73,
          categoryCode: '03',
          categoryName: 'Supraestrutura e Estrutura Principal',
          subCategoryName: 'Concretagem, Nivelamento e Cura de Vigas e Lajes',
          defaultResponsible: 'Mestre de Obras / Operador de Bomba Lança',
          defaultEstimatedDays: 2,
          description: 'Lançamento progressivo do concreto pelas vigas principais e preenchimento uniforme da laje do ponto mais distante para o acesso.',
          checklist: [
            'Manutenção de ritmo contínuo para evitar juntas frias não-programadas',
            'Uso de tábuas de movimentação para que os mangoteiros não pisem na armadura negativa',
            'Preenchimento completo dos nós de encontro viga-pilar'
          ]
        },
        {
          id: 'srv-03-04-004',
          code: '03.04.004',
          name: 'Adensamento vibrado do concreto com vibradores de imersão de agulha',
          order: 74,
          categoryCode: '03',
          categoryName: 'Supraestrutura e Estrutura Principal',
          subCategoryName: 'Concretagem, Nivelamento e Cura de Vigas e Lajes',
          defaultResponsible: 'Operadores de Vibrador / Feitor',
          defaultEstimatedDays: 2,
          description: 'Inserção rápida e vertical do mangote de agulha 50mm e retirada lenta com raio de ação sobreposto.',
          checklist: [
            'Permanência da agulha de 5 a 15 segundos no ponto até cessar o borbulhamento',
            'Não permitir o contato do vibrador diretamente nas barras de aço da armadura',
            'Disponibilidade de vibrador reserva no local da concretagem'
          ]
        },
        {
          id: 'srv-03-04-005',
          code: '03.04.005',
          name: 'Sarrafeamento, nivelamento com mestras e acabamento superficial da laje',
          order: 75,
          categoryCode: '03',
          categoryName: 'Supraestrutura e Estrutura Principal',
          subCategoryName: 'Concretagem, Nivelamento e Cura de Vigas e Lajes',
          defaultResponsible: 'Pedreiros Acabadores',
          defaultEstimatedDays: 2,
          description: 'Passagem de régua de alumínio de 3m apoiada nas mestras de nível para garantia de espessura constante e desempeno.',
          checklist: [
            'Conferência contínua com nível laser da cota de topo da laje',
            'Desempenamento com desempenadeira de magnésio/madeira',
            'Acabamento camurçado ou polido mecânico conforme uso final do pavimento'
          ]
        },
        {
          id: 'srv-03-04-006',
          code: '03.04.006',
          name: 'Cura química ou cura úmida contínua da laje por período mínimo de 7 dias',
          order: 76,
          categoryCode: '03',
          categoryName: 'Supraestrutura e Estrutura Principal',
          subCategoryName: 'Concretagem, Nivelamento e Cura de Vigas e Lajes',
          defaultResponsible: 'Feitor / Serventes',
          defaultEstimatedDays: 7,
          description: 'Aspersão de membrana de cura líquida ou lâmina d’água superficial (cura por inundação / manta geotêxtil molhada).',
          checklist: [
            'Início da aspersão assim que a superfície do concreto perder o brilho úmido inicial',
            'Manutenção da umidade permanente nas primeiras 72 horas críticas',
            'Proteção contra insolação direta e ventos fortes causadores de retração plástica'
          ]
        }
      ]
    },
    {
      id: 'sub-03-05',
      code: '03.05',
      name: 'Desforma Gradual, Re-escoramento e Ciclo de Pavimentos',
      order: 5,
      services: [
        {
          id: 'srv-03-05-001',
          code: '03.05.001',
          name: 'Desforma dos painéis laterais de vigas e bordas de laje após 3 dias',
          order: 77,
          categoryCode: '03',
          categoryName: 'Supraestrutura e Estrutura Principal',
          subCategoryName: 'Desforma Gradual, Re-escoramento e Ciclo de Pavimentos',
          defaultResponsible: 'Carpinteiro',
          defaultEstimatedDays: 2,
          description: 'Soltura das gravatas e afastamento suave dos painéis laterais que não suportam peso próprio estrutural.',
          checklist: [
            'Preservação intacta de todas as escoras de fundo de vigas',
            'Limpeza e raspagem imediata dos painéis desformados',
            'Aplicação de nova demão de desmoldante para o próximo ciclo'
          ]
        },
        {
          id: 'srv-03-05-002',
          code: '03.05.002',
          name: 'Desforma do fundo de lajes e vigas mantendo escoras de alívio pontuais',
          order: 78,
          categoryCode: '03',
          categoryName: 'Supraestrutura e Estrutura Principal',
          subCategoryName: 'Desforma Gradual, Re-escoramento e Ciclo de Pavimentos',
          defaultResponsible: 'Carpinteiro Chefe / Engenheiro Residente',
          defaultEstimatedDays: 3,
          description: 'Retirada das chapas de compensado preservando pontais de escoramento no meio dos vãos conforme NBR 14931.',
          checklist: [
            'Atingimento prévio de no mínimo 70% do fck aos 14 dias comprovado em laboratório',
            'Alívio gradual das roscas das escoras sem choque mecânico',
            'Inspeção visual da flecha elástica imediata'
          ]
        },
        {
          id: 'srv-03-05-003',
          code: '03.05.003',
          name: 'Instalação de re-escoramento em pavimentos inferiores para suporte de cargas de concretagem',
          order: 79,
          categoryCode: '03',
          categoryName: 'Supraestrutura e Estrutura Principal',
          subCategoryName: 'Desforma Gradual, Re-escoramento e Ciclo de Pavimentos',
          defaultResponsible: 'Montador / Mestre de Obras',
          defaultEstimatedDays: 3,
          description: 'Manutenção de linhas de escoras pontuais ajustáveis em 2 a 3 pavimentos subjacentes para absorver o peso do piso recém-concretado.',
          checklist: [
            'Alinhamento vertical estrito das escoras entre pavimentos sobrepostos',
            'Aperto manual sem forçar pré-tensão excessiva nas lajes já curadas',
            'Liberação definitiva somente após o piso superior atingir 28 dias'
          ]
        }
      ]
    },
    {
      id: 'sub-03-06',
      code: '03.06',
      name: 'Escadas, Caixas de Elevador e Elementos Especiais',
      order: 6,
      services: [
        {
          id: 'srv-03-06-001',
          code: '03.06.001',
          name: 'Montagem de fôrmas de fundo inclinado e espelhos de degraus de escadas de emergência',
          order: 80,
          categoryCode: '03',
          categoryName: 'Supraestrutura e Estrutura Principal',
          subCategoryName: 'Escadas, Caixas de Elevador e Elementos Especiais',
          defaultResponsible: 'Carpinteiro Especialista em Escadas',
          defaultEstimatedDays: 3,
          description: 'Confeção do tabuleiro inclinado da rampa e fixação de tábuas de espelho rigorosamente aprumadas com fórmula de Blondel (2E + P = 63 a 64cm).',
          checklist: [
            'Dimensões rigorosamente idênticas em todos os degraus e patamares',
            'Travamento lateral contra flambagem durante o lançamento do concreto',
            'Marcação da cota final considerando acabamento do piso futuro'
          ]
        },
        {
          id: 'srv-03-06-002',
          code: '03.06.002',
          name: 'Armação longitudinal e estribos de rampa, patamares e degraus de escadas',
          order: 81,
          categoryCode: '03',
          categoryName: 'Supraestrutura e Estrutura Principal',
          subCategoryName: 'Escadas, Caixas de Elevador e Elementos Especiais',
          defaultResponsible: 'Armador',
          defaultEstimatedDays: 2,
          description: 'Amarração da malha de aço inferior e superior dobrada acompanhando o perfil em zigue-zague dos degraus.',
          checklist: [
            'Engastamento da armadura nas vigas de apoio dos patamares',
            'Espaçadores plásticos garantindo cobrimento normativo na face inclinada',
            'Armadura de espera para fixação futura do corrimão/guarda-corpo'
          ]
        },
        {
          id: 'srv-03-06-003',
          code: '03.06.003',
          name: 'Concretagem com concreto de consistência plástica e acabamento desempenado de escadas',
          order: 82,
          categoryCode: '03',
          categoryName: 'Supraestrutura e Estrutura Principal',
          subCategoryName: 'Escadas, Caixas de Elevador e Elementos Especiais',
          defaultResponsible: 'Pedreiros / Vibrador',
          defaultEstimatedDays: 2,
          description: 'Lançamento de baixo para cima com concreto de slump mais baixo (8 a 10cm) para não escorrer pelos espelhos dos degraus.',
          checklist: [
            'Vibração com agulha fina 25mm em cada degrau sucessivamente',
            'Acabamento desempenado rústico nos pisos dos degraus',
            'Cura úmida com panos umedecidos por 7 dias'
          ]
        },
        {
          id: 'srv-03-06-004',
          code: '03.06.004',
          name: 'Montagem de fôrmas trepantes e armação de paredes de concreto da caixa de elevador',
          order: 83,
          categoryCode: '03',
          categoryName: 'Supraestrutura e Estrutura Principal',
          subCategoryName: 'Escadas, Caixas de Elevador e Elementos Especiais',
          defaultResponsible: 'Carpinteiro / Armador',
          defaultEstimatedDays: 4,
          description: 'Fôrmas internas e externas para poço de elevador com prumo absoluto e malha dupla de aço resistente à torção.',
          checklist: [
            'Conferência do prumo milimétrico das paredes do fosso com fio de prumo de aço',
            'Instalação de caixas de espera para fixação das guias do elevador',
            'Instalação das aberturas das portas de pavimento com cantoneiras de aço'
          ]
        },
        {
          id: 'srv-03-06-005',
          code: '03.06.005',
          name: 'Concretagem e ensaio de estanqueidade de reservatórios superiores e inferiores de água',
          order: 84,
          categoryCode: '03',
          categoryName: 'Supraestrutura e Estrutura Principal',
          subCategoryName: 'Escadas, Caixas de Elevador e Elementos Especiais',
          defaultResponsible: 'Engenheiro Residente / Mestre',
          defaultEstimatedDays: 5,
          description: 'Concretagem com aditivo cristalizante impermeabilizante no traço e teste de carga com lâmina d’água plena por 72 horas.',
          checklist: [
            'Instalação de fita waterstop de PVC em todas as juntas frias de fundo/parede',
            'Preenchimento total de água até o nível do extravasor (ladrão)',
            'Inspeção visual externa diária para atestar ausência de umidade ou vazamento'
          ]
        }
      ]
    }
  ]
};

// ============================================================================
// IMPORTAÇÃO DAS CATEGORIAS ESPECIALIZADAS (ORDEM CRONOLÓGICA)
// ============================================================================
import { CATEGORY_4_VEDACOES_COBERTURA } from './categories/category4';
import { CATEGORY_INSTALACOES_HIDRAULICAS } from './categories/categoryHidraulica';
import { CATEGORY_INSTALACOES_ELETRICAS } from './categories/categoryEletrica';
import { CATEGORY_SISTEMAS_AVAC } from './categories/categoryAvac';
import { CATEGORY_INSTALACOES_GAS } from './categories/categoryGas';
import { CATEGORY_SISTEMAS_INCENDIO } from './categories/categoryIncendio';
import { CATEGORY_6_REVESTIMENTOS_ACABAMENTOS } from './categories/category6';
import { CATEGORY_7_LIMPEZA_COMISSIONAMENTO_ENTREGA } from './categories/category7';

export {
  CATEGORY_4_VEDACOES_COBERTURA,
  CATEGORY_INSTALACOES_HIDRAULICAS,
  CATEGORY_INSTALACOES_ELETRICAS,
  CATEGORY_SISTEMAS_AVAC,
  CATEGORY_INSTALACOES_GAS,
  CATEGORY_SISTEMAS_INCENDIO,
  CATEGORY_6_REVESTIMENTOS_ACABAMENTOS,
  CATEGORY_7_LIMPEZA_COMISSIONAMENTO_ENTREGA,
};

// ============================================================================
// LISTA MESTRE DAS CATEGORIAS INDEPENDENTES EM ORDEM CRONOLÓGICA (1 A 185)
// ============================================================================
export const EAP_CATEGORIES: EAPCategoryTemplate[] = [
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
];

// Lista linear plana de todos os serviços ordenados cronologicamente (1 a 185)
export const EAP_SERVICES: EAPServiceTemplate[] = EAP_CATEGORIES.flatMap((cat) =>
  cat.subCategories.flatMap((sub) => sub.services)
).sort((a, b) => a.order - b.order);

// Objeto mestre eapTemplates
export const eapTemplates = {
  version: '3.0.0',
  description: 'Lista Mestre EAP da Construção Civil - Disciplinas Independentes de Instalações em Ordem Cronológica Completa',
  categories: EAP_CATEGORIES,
  services: EAP_SERVICES,
  totalCategories: EAP_CATEGORIES.length,
  totalServices: EAP_SERVICES.length,
};

// ============================================================================
// FUNÇÕES AUXILIARES DE CONSULTA
// ============================================================================

/**
 * Retorna todas as categorias mestres da EAP
 */
export function getEAPCategories(): EAPCategoryTemplate[] {
  return EAP_CATEGORIES;
}

/**
 * Retorna todos os serviços de uma categoria por código ou nome
 */
export function getEAPServicesByCategory(categoryCodeOrName: string): EAPServiceTemplate[] {
  const normalized = categoryCodeOrName.toLowerCase().trim();
  const category = EAP_CATEGORIES.find(
    (c) =>
      c.code.toLowerCase() === normalized ||
      c.name.toLowerCase().includes(normalized) ||
      normalized.includes(c.name.toLowerCase())
  );
  if (!category) return [];
  return category.subCategories.flatMap((sub) => sub.services);
}

/**
 * Retorna um serviço pelo ID ou código
 */
export function getEAPServiceById(serviceIdOrCode: string): EAPServiceTemplate | undefined {
  return EAP_SERVICES.find(
    (s) => s.id === serviceIdOrCode || s.code === serviceIdOrCode
  );
}

/**
 * Busca serviços por termo (nome, responsável ou subcategoria)
 */
export function searchEAPServices(term: string): EAPServiceTemplate[] {
  const query = term.toLowerCase().trim();
  if (!query) return EAP_SERVICES;
  return EAP_SERVICES.filter(
    (s) =>
      s.name.toLowerCase().includes(query) ||
      s.subCategoryName.toLowerCase().includes(query) ||
      s.defaultResponsible.toLowerCase().includes(query) ||
      s.code.toLowerCase().includes(query)
  );
}

export default eapTemplates;
