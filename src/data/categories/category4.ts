/**
 * category4.ts
 * Categoria 04 da EAP: Vedações, Alvenarias, Divisórias e Coberturas
 * Ordem cronológica: serviços 85 a 101
 */

import { EAPCategoryTemplate } from '../eapTypes';

export const CATEGORY_4_VEDACOES_COBERTURA: EAPCategoryTemplate = {
  id: 'cat-04',
  code: '04',
  name: 'Vedações, Alvenarias, Divisórias e Coberturas',
  order: 4,
  description: 'Marcação e elevação de alvenarias, encunhamento, vergas, divisórias de gesso acartonado (drywall), estrutura e montagem de coberturas e impermeabilização de lajes de cobertura.',
  subCategories: [
    {
      id: 'sub-04-01',
      code: '04.01',
      name: 'Alvenaria de Vedação e Marcação',
      order: 1,
      services: [
        {
          id: 'srv-04-01-085',
          code: '04.01.085',
          name: 'Marcação da primeira fiada de alvenaria e alinhamento a laser com conferência de esquadro',
          order: 85,
          categoryCode: '04',
          categoryName: 'Vedações, Alvenarias, Divisórias e Coberturas',
          subCategoryName: 'Alvenaria de Vedação e Marcação',
          defaultResponsible: 'Pedreiro / Mestre de Obras',
          defaultEstimatedDays: 3,
          description: 'Locação milimétrica das paredes sobre a laje com nível e esquadro a laser, assentando a fiada inicial com argamassa impermeável e aditivo hidrofugante nas áreas molhadas.',
          checklist: [
            'Conferência do esquadro trigonométrico (3-4-5) em todas as esquinas e vãos',
            'Checagem da largura dos corredores e espessuras de paredes conforme projeto executivo de arquitetura',
            'Aditivação com impermeabilizante na argamassa de assentamento das fiadas de embasamento',
            'Instalação de pinos de aço e fitas de marcação para conferência pelo engenheiro residente'
          ]
        },
        {
          id: 'srv-04-01-086',
          code: '04.01.086',
          name: 'Elevação de alvenaria com blocos cerâmicos ou blocos de concreto com amarração e tela soldada',
          order: 86,
          categoryCode: '04',
          categoryName: 'Vedações, Alvenarias, Divisórias e Coberturas',
          subCategoryName: 'Alvenaria de Vedação e Marcação',
          defaultResponsible: 'Pedreiro / Servente',
          defaultEstimatedDays: 7,
          description: 'Execução do assentamento das fiadas intermediárias com controle contínuo de prumo de face, alinhamento por linha de nylon esticada e juntas verticais de argamassa regulares.',
          checklist: [
            'Conferência de prumo de ambos os lados da parede a cada 3 fiadas',
            'Uso de gabarito para espessura constante de junta de assentamento (10mm a 15mm)',
            'Instalação de telas galvanizadas de amarração chumbadas aos pilares de concreto',
            'Deixamento das passagens de tubulações hidráulicas e elétricas sem corte destrutivo excessivo'
          ]
        },
        {
          id: 'srv-04-01-087',
          code: '04.01.087',
          name: 'Fixação e encunhamento superior de alvenaria com argamassa expansiva ou espuma de poliuretano',
          order: 87,
          categoryCode: '04',
          categoryName: 'Vedações, Alvenarias, Divisórias e Coberturas',
          subCategoryName: 'Alvenaria de Vedação e Marcação',
          defaultResponsible: 'Pedreiro Especializado',
          defaultEstimatedDays: 2,
          description: 'Travamento da última fiada contra o fundo da viga ou laje superior após o período mínimo de cura e deformação elástica da alvenaria (respeitando intervalo mínimo de 7 dias).',
          checklist: [
            'Verificação do prazo de maturação e assentamento prévio da parede antes do aperto',
            'Limpeza e umedecimento do vão entre a última fiada e o fundo da viga de concreto',
            'Preenchimento completo sem vazios com argamassa de encunhamento inclinada ou espuma de PU expansiva de alta densidade',
            'Inspeção para certificar ausência de transmissão indesejada de carga da viga para a alvenaria'
          ]
        },
        {
          id: 'srv-04-01-088',
          code: '04.01.088',
          name: 'Execução de vergas e contravergas pré-moldadas ou moldadas in loco em vãos de portas e janelas',
          order: 88,
          categoryCode: '04',
          categoryName: 'Vedações, Alvenarias, Divisórias e Coberturas',
          subCategoryName: 'Alvenaria de Vedação e Marcação',
          defaultResponsible: 'Pedreiro / Carpinteiro',
          defaultEstimatedDays: 3,
          description: 'Instalação de vigotas armadas de concreto sobre os vãos de portas e sobre/sob vãos de esquadrias com traspasse mínimo de 20cm em cada lateral para dissipação de tensões e prevenção de trincas a 45 graus.',
          checklist: [
            'Conferência do traspasse mínimo de 20 a 30cm além do vão da janela ou porta',
            'Checagem da armadura longitudinal e estribos contra esforços cortantes',
            'Preenchimento dos blocos canaleta (tipo U) com graute aditivado de alta fluidez',
            'Nivelamento perfeito de topo para apoio correto dos contramarcos'
          ]
        },
        {
          id: 'srv-04-01-089',
          code: '04.01.089',
          name: 'Aplicação de tela metálica galvanizada na interface alvenaria-estrutura de concreto',
          order: 89,
          categoryCode: '04',
          categoryName: 'Vedações, Alvenarias, Divisórias e Coberturas',
          subCategoryName: 'Alvenaria de Vedação e Marcação',
          defaultResponsible: 'Pedreiro / Pintor',
          defaultEstimatedDays: 2,
          description: 'Fixação de tela metálica expandida eletrossoldada cobrindo 15cm na alvenaria e 15cm no pilar/viga para evitar fissuras por dilatação térmica diferencial antes do revestimento argamassado.',
          checklist: [
            'Fixação da tela com pinos de aço acionados por pistola e arruelas zincadas a cada 30cm',
            'Tensionamento adequado da tela evitando bolsões e estufamentos',
            'Aplicação do chapisco aderente cobrindo integralmente a malha metálica'
          ]
        }
      ]
    },
    {
      id: 'sub-04-02',
      code: '04.02',
      name: 'Divisórias Leves e Drywall',
      order: 2,
      services: [
        {
          id: 'srv-04-02-090',
          code: '04.02.090',
          name: 'Marcação de guias e montantes estruturais de aço galvanizado para paredes de drywall',
          order: 90,
          categoryCode: '04',
          categoryName: 'Vedações, Alvenarias, Divisórias e Coberturas',
          subCategoryName: 'Divisórias Leves e Drywall',
          defaultResponsible: 'Gesseiro / Montador de Drywall',
          defaultEstimatedDays: 3,
          description: 'Instalação de perfis metálicos guia de piso e teto com fita de isolamento acústico perimetral e montantes verticais modulados a cada 40cm ou 60cm com conferência de prumo a laser.',
          checklist: [
            'Aplicação da banda acústica autoadesiva na base das guias inferiores e superiores',
            'Fixação mecânica com buchas e parafusos a cada 60cm no piso e laje',
            'Espaçamento regulamentar e alinhamento milimétrico dos montantes verticais',
            'Reforço com madeira tratada ou chapa metálica nos pontos previstos para armários, televisores e pias suspensas'
          ]
        },
        {
          id: 'srv-04-02-091',
          code: '04.02.091',
          name: 'Instalação de isolamento termoacústico com lã de rocha ou lã de vidro no interior das paredes',
          order: 91,
          categoryCode: '04',
          categoryName: 'Vedações, Alvenarias, Divisórias e Coberturas',
          subCategoryName: 'Divisórias Leves e Drywall',
          defaultResponsible: 'Montador de Drywall',
          defaultEstimatedDays: 2,
          description: 'Preenchimento contínuo do miolo dos montantes com mantas acústicas minerais sem folgas ou esmagamento para garantia do isolamento sonoro conforme norma de desempenho NBR 15575.',
          checklist: [
            'Uso obrigatório de EPI (máscara PFF2, luvas nitrílicas e óculos de proteção)',
            'Corte preciso das mantas contornando caixas elétricas e tubos hidráulicos',
            'Preenchimento integral da cavidade entre os montantes de aço sem deixar vazios de ar'
          ]
        },
        {
          id: 'srv-04-02-092',
          code: '04.02.092',
          name: 'Chapeamento com placas de gesso acartonado (ST para áreas secas, RU para molháveis e RF resistente a fogo)',
          order: 92,
          categoryCode: '04',
          categoryName: 'Vedações, Alvenarias, Divisórias e Coberturas',
          subCategoryName: 'Divisórias Leves e Drywall',
          defaultResponsible: 'Gesseiro / Montador de Drywall',
          defaultEstimatedDays: 4,
          description: 'Fixação das placas de gesso com parafusos autoperfurantes fosfatizados espaçados a cada 25cm, respeitando amarração de juntas e placas verdes (RU) com silicone em áreas úmidas.',
          checklist: [
            'Utilização de placas verdes (RU) resistentes à umidade em banheiros, cozinhas e lavanderias',
            'Deslocamento mínimo de 40cm entre as juntas horizontais das placas (desencontro de topo)',
            'Cabeças dos parafusos rentes à superfície do papel sem rasgar o cartão exterior',
            'Espaço livre de 10mm entre a borda inferior da placa e o contrapiso acabado'
          ]
        },
        {
          id: 'srv-04-02-093',
          code: '04.02.093',
          name: 'Tratamento de juntas com fita microperfurada e massa para acabamento de drywall',
          order: 93,
          categoryCode: '04',
          categoryName: 'Vedações, Alvenarias, Divisórias e Coberturas',
          subCategoryName: 'Divisórias Leves e Drywall',
          defaultResponsible: 'Gesseiro / Pintor',
          defaultEstimatedDays: 3,
          description: 'Aplicação de fita de papel microperfurado ou fita de fibra de vidro autoadesiva com três demãos sucessivas de pasta específica para rejunte de drywall e cantoneiras perfuradas nas quinas.',
          checklist: [
            'Aplicação de fita microperfurada de alta resistência mecânica',
            'Execução das demãos de regularização respeitando o tempo de secagem de 24 horas',
            'Instalação de cantoneiras metálicas de proteção em todas as esquinas externas salientes',
            'Lixamento suave com lixa fina sem danificar o papel cartão das placas'
          ]
        }
      ]
    },
    {
      id: 'sub-04-03',
      code: '04.03',
      name: 'Estrutura de Cobertura e Telhados',
      order: 3,
      services: [
        {
          id: 'srv-04-03-094',
          code: '04.03.094',
          name: 'Montagem de tesouras, pontaletes, terças e ripas da estrutura de madeira ou aço para cobertura',
          order: 94,
          categoryCode: '04',
          categoryName: 'Vedações, Alvenarias, Divisórias e Coberturas',
          subCategoryName: 'Estrutura de Cobertura e Telhados',
          defaultResponsible: 'Carpinteiro de Cobertura / Montador Metálico',
          defaultEstimatedDays: 5,
          description: 'Instalação e ancoragem dos elementos estruturais de sustentação do telhado com cálculo de inclinação, tirantes contra flambagem e tratamento ignífugo e cupinicida na madeira.',
          checklist: [
            'Conferência da inclinação do telhado conforme especificação das telhas (ex: 30% a 35%)',
            'Fixação e chumbamento das sapatas e apoios das tesouras na viga de coroamento',
            'Aplicação de imunizante químico anticupim em toda a estrutura de madeira bruta',
            'Alinhamento e nivelamento ótico das terças com linha de náilon'
          ]
        },
        {
          id: 'srv-04-03-095',
          code: '04.03.095',
          name: 'Colocação de telhas termoacústicas, cerâmicas ou metálicas com fixação autobrocante',
          order: 95,
          categoryCode: '04',
          categoryName: 'Vedações, Alvenarias, Divisórias e Coberturas',
          subCategoryName: 'Estrutura de Cobertura e Telhados',
          defaultResponsible: 'Telhadista / Montador',
          defaultEstimatedDays: 4,
          description: 'Içamento e colocação das telhas a partir do beiral inferior em direção à cumeeira, garantindo sobreposição mínima longitudinal e transversal e fixação com parafusos vedados com arruela de EPDM.',
          checklist: [
            'Garantia do recobrimento mínimo recomendado pelo fabricante das telhas',
            'Fixação com parafusos autobrocantes na crista da onda com torque controlado sem esmagar a arruela de vedação',
            'Checagem do alinhamento das fiadas com linha perpendicular',
            'Uso obrigatório de linha de vida e cinto de segurança tipo paraquedista em todo o trabalho em altura (NR 35)'
          ]
        },
        {
          id: 'srv-04-03-096',
          code: '04.03.096',
          name: 'Instalação de rufos, contra-rufos, calhas metálicas galvanizadas e ralo hemisférico',
          order: 96,
          categoryCode: '04',
          categoryName: 'Vedações, Alvenarias, Divisórias e Coberturas',
          subCategoryName: 'Estrutura de Cobertura e Telhados',
          defaultResponsible: 'Calheiro Especializado',
          defaultEstimatedDays: 3,
          description: 'Montagem de calhas em chapa galvanizada ou alumínio com declividade mínima de 0,5% em direção aos bocais de descida, rufos de encosto com vedação em PU e ralos tipo abacaxi contra folhas.',
          checklist: [
            'Conferência do caimento positivo das calhas para os condutores verticais de descida',
            'Aplicação de selante de poliuretano (PU de construção) em todas as emendas e rebites',
            'Engaste dos contra-rufos em rasgos de 2cm na alvenaria com vedação elástica',
            'Instalação de telas protetoras ou ralos hemisféricos em todos os bocais de escoamento'
          ]
        },
        {
          id: 'srv-04-03-097',
          code: '04.03.097',
          name: 'Aplicação de subcobertura com manta térmica reflexiva de foil de alumínio dupla face',
          order: 97,
          categoryCode: '04',
          categoryName: 'Vedações, Alvenarias, Divisórias e Coberturas',
          subCategoryName: 'Estrutura de Cobertura e Telhados',
          defaultResponsible: 'Telhadista / Ajudante',
          defaultEstimatedDays: 2,
          description: 'Instalação contínua de manta aluminizada reflexiva sob os caibros/ripas com sobreposição de 10cm colada com fita adesiva aluminizada para isolamento térmico e barreira contra goteiras eventuais.',
          checklist: [
            'Sobreposição mínima de 10cm nas emendas no sentido do escoamento da água',
            'Vedação de todas as juntas e rasgos com fita autoadesiva metalizada de alta aderência',
            'Tensionamento equilibrado da manta para criar canal de drenagem em caso de infiltração'
          ]
        }
      ]
    },
    {
      id: 'sub-04-04',
      code: '04.04',
      name: 'Impermeabilização de Lajes de Cobertura e Calhas',
      order: 4,
      services: [
        {
          id: 'srv-04-04-098',
          code: '04.04.098',
          name: 'Regularização de caimento (mínimo 1% para ralos) com argamassa armada e cantos arredondados',
          order: 98,
          categoryCode: '04',
          categoryName: 'Vedações, Alvenarias, Divisórias e Coberturas',
          subCategoryName: 'Impermeabilização de Lajes de Cobertura e Calhas',
          defaultResponsible: 'Pedreiro / Impermeabilizador',
          defaultEstimatedDays: 4,
          description: 'Execução de contrapiso com argamassa cimento e areia traço 1:3 com caimento mínimo de 1% em direção aos ralos e execução de meia-cana com raio de 5cm no encontro piso-parede.',
          checklist: [
            'Conferência do caimento contínuo em todos os pontos com nível e derramamento de água de teste',
            'Execução da meia-cana arredondada (chanfro) em todas as interfaces com platibandas e muretas',
            'Acabamento desempenado fino sem saliências cortantes para não furar a manta',
            'Arredondamento das bordas dos ralos com rebaixo de 1cm para embutimento da manta'
          ]
        },
        {
          id: 'srv-04-04-099',
          code: '04.04.099',
          name: 'Aplicação de primer betuminoso e colagem de manta asfáltica 4mm tipo III polimérica aderida a maçarico',
          order: 99,
          categoryCode: '04',
          categoryName: 'Vedações, Alvenarias, Divisórias e Coberturas',
          subCategoryName: 'Impermeabilização de Lajes de Cobertura e Calhas',
          defaultResponsible: 'Impermeabilizador Profissional',
          defaultEstimatedDays: 5,
          description: 'Pintura de primer asfáltico base solvente e fusão a fogo de manta asfáltica armada com poliéster de 4mm, subindo no mínimo 30cm nas platibandas e embutindo no ralo com biselamento.',
          checklist: [
            'Secagem completa do primer antes da aplicação da chama do maçarico',
            'Sobreposição mínima de 10cm nas emendas laterais com cordão de asfalto fundido visível (biselamento)',
            'Subida de no mínimo 30cm da cota final do piso acabado em todas as paredes perimetrais',
            'Reforço com dupla camada de manta nos bocais de ralos e tubulações passantes'
          ]
        },
        {
          id: 'srv-04-04-100',
          code: '04.04.100',
          name: 'Teste de estanqueidade com lâmina d’água de 72 horas com registro fotográfico e laudo',
          order: 100,
          categoryCode: '04',
          categoryName: 'Vedações, Alvenarias, Divisórias e Coberturas',
          subCategoryName: 'Impermeabilização de Lajes de Cobertura e Calhas',
          defaultResponsible: 'Engenheiro Residente / Fiscal da Qualidade',
          defaultEstimatedDays: 4,
          description: 'Fechamento hermético de todos os ralos de drenagem e enchimento da laje com lâmina d’água de 10cm de altura durante 72 horas ininterruptas com vistoria visual diária no teto inferior.',
          checklist: [
            'Vedação de todos os ralos com plugue expansivo de teste de pressão',
            'Marcação do nível da lâmina com régua milimétrica para controle de evaporação vs vazamento',
            'Vistoria no forro do pavimento imediatamente inferior para detecção de qualquer mancha de umidade',
            'Emissão de laudo técnico de liberação assinado pelo engenheiro residente da obra'
          ]
        },
        {
          id: 'srv-04-04-101',
          code: '04.04.101',
          name: 'Execução de camada separadora (geotêxtil não-tecido) e proteção mecânica com argamassa',
          order: 101,
          categoryCode: '04',
          categoryName: 'Vedações, Alvenarias, Divisórias e Coberturas',
          subCategoryName: 'Impermeabilização de Lajes de Cobertura e Calhas',
          defaultResponsible: 'Pedreiro / Servente',
          defaultEstimatedDays: 3,
          description: 'Assentamento de manta de geotêxtil (Bidim) sobre a impermeabilização para amortecimento de cargas e execução de piso de concreto magro/argamassa de proteção com juntas de dilatação de 2x2m.',
          checklist: [
            'Sobreposição de 15cm nas juntas da manta geotêxtil',
            'Execução do piso de proteção mecânica sem uso de pás ou carrinhos metálicos diretamente sobre a manta',
            'Criação de juntas de retração e dilatação preenchidas com mastique elástico a cada 2 metros',
            'Preservação do caimento original direcionado para os ralos de escoamento'
          ]
        }
      ]
    }
  ]
};
