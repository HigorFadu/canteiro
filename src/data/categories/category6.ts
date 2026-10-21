/**
 * category6.ts
 * Categoria 06 da EAP: Revestimentos, Acabamentos, Pisos, Pintura e Esquadrias
 * Ordem cronológica: serviços 134 a 161
 */

import { EAPCategoryTemplate } from '../eapTypes';

export const CATEGORY_6_REVESTIMENTOS_ACABAMENTOS: EAPCategoryTemplate = {
  id: 'cat-10',
  code: '10',
  name: 'Revestimentos, Acabamentos, Pisos, Pintura e Esquadrias',
  order: 10,
  description: 'Chapisco, emboço, reboco, impermeabilização de áreas molhadas, contrapiso com conforto acústico, revestimentos cerâmicos e porcelanatos, bancadas em pedras naturais, forros de gesso, esquadrias de alumínio e madeira, e pintura interna e externa.',
  subCategories: [
    {
      id: 'sub-06-01',
      code: '06.01',
      name: 'Revestimentos Argamassados e Gesso Liso',
      order: 1,
      services: [
        {
          id: 'srv-06-01-134',
          code: '06.01.134',
          name: 'Aplicação de chapisco tradicional e rolado com aditivo de alto desempenho em paredes e tetos',
          order: 134,
          categoryCode: '06',
          categoryName: 'Revestimentos, Acabamentos, Pisos, Pintura e Esquadrias',
          subCategoryName: 'Revestimentos Argamassados e Gesso Liso',
          defaultResponsible: 'Pedreiro / Servente',
          defaultEstimatedDays: 4,
          description: 'Limpeza prévia da alvenaria e estrutura de concreto, aplicação de chapisco convencional traço 1:3 ou chapisco rolado aditivado com polímero adesivo sintético (SBR) para garantir aderência.',
          checklist: [
            'Remoção de desmoldante, graxa e poeira das superfícies de concreto com hidrojateamento',
            'Umedecimento prévio das superfícies de blocos cerâmicos antes do lançamento',
            'Cobertura uniforme rugosa sem falhas ou películas lisas',
            'Cura úmida do chapisco por no mínimo 3 dias antes da aplicação do emboço'
          ]
        },
        {
          id: 'srv-06-01-135',
          code: '06.01.135',
          name: 'Execução de taliscas e mestras verticais com conferência de prumo e alinhamento milimétrico',
          order: 135,
          categoryCode: '06',
          categoryName: 'Revestimentos, Acabamentos, Pisos, Pintura e Esquadrias',
          subCategoryName: 'Revestimentos Argamassados e Gesso Liso',
          defaultResponsible: 'Pedreiro / Mestre de Obras',
          defaultEstimatedDays: 3,
          description: 'Fixação de caquinhos cerâmicos (taliscas) nas paredes com prumo de face e nível a laser para definição da espessura do emboço (15mm a 25mm) e puxamento de mestras verticais.',
          checklist: [
            'Espaçamento máximo de 1,80m a 2,00m entre mestras verticais para alcance da régua de alumínio',
            'Conferência do prumo vertical com régua de nível de 2 metros e nível laser',
            'Checagem do paralelismo entre paredes opostas para esquadro perfeito dos cômodos',
            'Espessura uniforme de argamassa sem ultrapassar 25mm em camada única'
          ]
        },
        {
          id: 'srv-06-01-136',
          code: '06.01.136',
          name: 'Aplicação de emboço e reboco sarrafeado e desempenado com argamassa estabilizada ou virada em obra',
          order: 136,
          categoryCode: '06',
          categoryName: 'Revestimentos, Acabamentos, Pisos, Pintura e Esquadrias',
          subCategoryName: 'Revestimentos Argamassados e Gesso Liso',
          defaultResponsible: 'Pedreiro de Acabamento',
          defaultEstimatedDays: 7,
          description: 'Lançamento e sarrafeamento da argamassa nas mestras com régua de alumínio, seguido de desempeno manual com desempenadeira de madeira ou esponja para regularização de base para pintura ou cerâmica.',
          checklist: [
            'Tempo de descanso (puxamento) adequado da argamassa antes do sarrafeamento',
            'Superfície perfeitamente plana sem ondulações (tolerância máxima de 3mm em régua de 2m)',
            'Acabamento desempenado áspero para áreas com cerâmica e fino camurçado para pintura',
            'Cura úmida contínua por 7 dias para prevenção de fissuras de retração plástica'
          ]
        },
        {
          id: 'srv-06-01-137',
          code: '06.01.137',
          name: 'Aplicação de gesso liso desempenado direto sobre alvenaria ou teto em ambientes secos',
          order: 137,
          categoryCode: '06',
          categoryName: 'Revestimentos, Acabamentos, Pisos, Pintura e Esquadrias',
          subCategoryName: 'Revestimentos Argamassados e Gesso Liso',
          defaultResponsible: 'Gesseiro de Parede',
          defaultEstimatedDays: 5,
          description: 'Aplicação manual de pasta de gesso lento com desempenadeira de aço inox em camadas cruzadas até obtenção de superfície espelhada, lisa e isenta de imperfeições.',
          checklist: [
            'Aplicação exclusiva em ambientes secos (quartos, salas e circulações internas)',
            'Espessura final controlada entre 3mm e 5mm sem bolhas ou caroços',
            'Alinhamento e quinas com cantoneiras plásticas ou metálicas embutidas',
            'Tempo mínimo de secagem e cura de 21 a 28 dias antes de qualquer pintura'
          ]
        }
      ]
    },
    {
      id: 'sub-06-02',
      code: '06.02',
      name: 'Impermeabilização de Áreas Molhadas e Varandas',
      order: 2,
      services: [
        {
          id: 'srv-06-02-138',
          code: '06.02.138',
          name: 'Regularização de pisos de banheiros, cozinhas, lavanderias e sacadas com caimento mínimo de 1% para ralos',
          order: 138,
          categoryCode: '06',
          categoryName: 'Revestimentos, Acabamentos, Pisos, Pintura e Esquadrias',
          subCategoryName: 'Impermeabilização de Áreas Molhadas e Varandas',
          defaultResponsible: 'Pedreiro / Impermeabilizador',
          defaultEstimatedDays: 3,
          description: 'Execução de argamassa cimento e areia com aditivo hidrofugante garantindo declividade de 1% a 2% direcionada aos ralos sifonados e secos e cantos arredondados (meia-cana).',
          checklist: [
            'Conferência do sentido do escoamento d’água em 100% da área do boxe e lavanderia',
            'Execução de meia-cana nos rodapés com raio de 5cm para apoio da impermeabilização',
            'Rebaixo de nível no piso do boxe de 1cm a 2cm em relação ao restante do banheiro'
          ]
        },
        {
          id: 'srv-06-02-139',
          code: '06.02.139',
          name: 'Aplicação de membrana polimérica semi-flexível bicomponente com tela de poliéster em ralos e cantos',
          order: 139,
          categoryCode: '06',
          categoryName: 'Revestimentos, Acabamentos, Pisos, Pintura e Esquadrias',
          subCategoryName: 'Impermeabilização de Áreas Molhadas e Varandas',
          defaultResponsible: 'Impermeabilizador Especializado',
          defaultEstimatedDays: 4,
          description: 'Pintura cruzada de 3 a 4 demãos de argamassa polimérica flexível ou poliuretano líquido, subindo 30cm nas paredes secas e até a altura do chuveiro (2,00m) na área do boxe.',
          checklist: [
            'Aplicação de fita de reforço ou véu de poliéster nos cantos vivos, ralos e canos passantes',
            'Respeito rigoroso ao intervalo de secagem entre as demãos cruzadas (4 a 6 horas)',
            'Subida da membrana a no mínimo 2,00m de altura em toda a área de lavagem e boxe',
            'Espessura mínima de película seca conforme recomendação do fabricante (NBR 11905)'
          ]
        },
        {
          id: 'srv-06-02-140',
          code: '06.02.140',
          name: 'Teste de estanqueidade obrigatório por 72 horas em banheiros, cozinhas e sacadas',
          order: 140,
          categoryCode: '06',
          categoryName: 'Revestimentos, Acabamentos, Pisos, Pintura e Esquadrias',
          subCategoryName: 'Impermeabilização de Áreas Molhadas e Varandas',
          defaultResponsible: 'Engenheiro Residente / Fiscal de Obras',
          defaultEstimatedDays: 4,
          description: 'Bloqueio estanque dos ralos com bujões de borracha e preenchimento de lâmina d’água de 5cm a 10cm de altura durante 72 horas ininterruptas com inspeção pelo pavimento inferior.',
          checklist: [
            'Vedação comprovada dos ralos sem refluxo de água',
            'Registro fotográfico no início e término do ensaio com régua de nível graduada',
            'Inspeção do teto e shafts do apartamento do andar inferior para certificar ausência de umidade',
            'Assinatura da Ficha de Verificação de Serviço (FVS) de impermeabilização'
          ]
        }
      ]
    },
    {
      id: 'sub-06-03',
      code: '06.03',
      name: 'Contrapiso e Regularização Acústica de Pisos',
      order: 3,
      services: [
        {
          id: 'srv-06-03-141',
          code: '06.03.141',
          name: 'Nivelamento a laser e batimento de nível de referência de contrapiso em todos os cômodos',
          order: 141,
          categoryCode: '06',
          categoryName: 'Revestimentos, Acabamentos, Pisos, Pintura e Esquadrias',
          subCategoryName: 'Contrapiso e Regularização Acústica de Pisos',
          defaultResponsible: 'Topógrafo / Mestre de Obras',
          defaultEstimatedDays: 2,
          description: 'Transferência de cotas de nível com nível a laser rotativo calibrado, marcando a espessura de acabamento de piso considerando variações de soleiras e diferentes pisos (vinílico, porcelanato e madeira).',
          checklist: [
            'Compatibilização prévia das espessuras finais de cada tipo de revestimento de piso',
            'Marcação de faixas de nível nas paredes a 1,00m de altura de referência em todo o pavimento',
            'Compensação dos rebaixos de áreas molhadas e nivelamento exato nas portas de entrada'
          ]
        },
        {
          id: 'srv-06-03-142',
          code: '06.03.142',
          name: 'Execução de contrapiso autonivelante ou farofa com manta acústica anti-impacto (NBR 15575)',
          order: 142,
          categoryCode: '06',
          categoryName: 'Revestimentos, Acabamentos, Pisos, Pintura e Esquadrias',
          subCategoryName: 'Contrapiso e Regularização Acústica de Pisos',
          defaultResponsible: 'Pedreiro de Piso / Equipe de Contrapiso',
          defaultEstimatedDays: 5,
          description: 'Instalação de manta acústica de polietileno expandido sobre a laje com dobras de rodapé de 10cm (piso flutuante) e aplicação de argamassa semisseca (farofa) compactada e sarrafeada.',
          checklist: [
            'Sobreposição de 10cm nas mantas acústicas vedadas com fita adesiva larga',
            'Subida perimetral da manta acústica em todas as paredes para evitar pontes acústicas estruturais',
            'Compactação enérgica da argamassa com soquete e desempeno mecânico com helicóptero ou manual',
            'Espessura mínima de 4cm de contrapiso armado com tela galvanizada antifissura sobre a manta'
          ]
        },
        {
          id: 'srv-06-03-143',
          code: '06.03.143',
          name: 'Corte e vedação de juntas de dilatação e retração do contrapiso com selante flexível de poliuretano',
          order: 143,
          categoryCode: '06',
          categoryName: 'Revestimentos, Acabamentos, Pisos, Pintura e Esquadrias',
          subCategoryName: 'Contrapiso e Regularização Acústica de Pisos',
          defaultResponsible: 'Pedreiro / Operador de Serra Clipper',
          defaultEstimatedDays: 2,
          description: 'Serragem das juntas de indução a cada 4x4 metros ou nas passagens de portas com serra diamantada após 24 horas da execução, seguida de aplicação de cordão delimitador e selante elástico PU.',
          checklist: [
            'Corte com profundidade de 1/3 da espessura do contrapiso',
            'Limpeza com ar comprimido para remoção total de pó de corte',
            'Aplicação de primer e selante elástico de poliuretano flexível na junta'
          ]
        }
      ]
    },
    {
      id: 'sub-06-04',
      code: '06.04',
      name: 'Revestimentos Cerâmicos, Porcelanatos e Pedras Naturais',
      order: 4,
      services: [
        {
          id: 'srv-06-04-144',
          code: '06.04.144',
          name: 'Paginação e assentamento de porcelanato retificado com argamassa colante AC-III e niveladores de piso',
          order: 144,
          categoryCode: '06',
          categoryName: 'Revestimentos, Acabamentos, Pisos, Pintura e Esquadrias',
          subCategoryName: 'Revestimentos Cerâmicos, Porcelanatos e Pedras Naturais',
          defaultResponsible: 'Azulejista / Assentador de Porcelanato',
          defaultEstimatedDays: 7,
          description: 'Assentamento de placas de porcelanato em piso com dupla colagem (desempenadeira dentada de 10mm na base e no tardoz da peça), niveladores com cunhas plásticas e alicate de tração.',
          checklist: [
            'Conferência do projeto de paginação para distribuição estética de recortes nas extremidades menos visíveis',
            'Aplicação obrigatória de dupla colagem em peças de grande formato (dimensões superiores a 60x60cm)',
            'Uso de ventosas de sucção para manuseio seguro das placas de porcelanato',
            'Conferência contínua de desníveis (dente) com régua de alumínio e dedo indicador (máximo zero dente)'
          ]
        },
        {
          id: 'srv-06-04-145',
          code: '06.04.145',
          name: 'Assentamento de azulejos e revestimentos cerâmicos em paredes até o teto com alinhamento a laser',
          order: 145,
          categoryCode: '06',
          categoryName: 'Revestimentos, Acabamentos, Pisos, Pintura e Esquadrias',
          subCategoryName: 'Revestimentos Cerâmicos, Porcelanatos e Pedras Naturais',
          defaultResponsible: 'Azulejista Profissional',
          defaultEstimatedDays: 6,
          description: 'Instalação de revestimentos de parede em banheiros e cozinhas com argamassa AC-II ou AC-III, alinhamento rigoroso das juntas horizontais e verticais com cruzetas espaçadoras e recorte perfeito em pontos hidráulicos.',
          checklist: [
            'Conferência do alinhamento a laser da primeira fiada apoiada sobre régua guia parafusada',
            'Furos circulares executados com serra-copo diamantada refrigerada em tubos e saídas roscáveis',
            'Verificação de 100% de preenchimento de argamassa batendo levemente com martelo de borracha',
            'Limpeza imediata da superfície das peças com esponja úmida antes da secagem da cola'
          ]
        },
        {
          id: 'srv-06-04-146',
          code: '06.04.146',
          name: 'Instalação de soleiras, peitoris, pingadeiras e bancadas em granito, mármore ou quartzo',
          order: 146,
          categoryCode: '06',
          categoryName: 'Revestimentos, Acabamentos, Pisos, Pintura e Esquadrias',
          subCategoryName: 'Revestimentos Cerâmicos, Porcelanatos e Pedras Naturais',
          defaultResponsible: 'Marmorista / Pedreiro de Acabamento',
          defaultEstimatedDays: 4,
          description: 'Assentamento e calafetação de soleiras nas portas de divisão de ambientes, peitoris com pingadeira saliente de 2cm sob janelas e chumbamento de bancadas de cozinha/banheiro em mãos-francesas de aço.',
          checklist: [
            'Nivelamento perfeito de soleiras sem desnível pontiagudo perigoso ao caminhar',
            'Conferência do caimento externo dos peitoris para direcionamento da chuva para fora da fachada',
            'Chumbamento robusto dos suportes metálicos de bancadas com graute ou chumbador químico epóxi',
            'Calafetação das juntas entre pedra e revestimento cerâmico com silicone acético antifungo'
          ]
        },
        {
          id: 'srv-06-04-147',
          code: '06.04.147',
          name: 'Aplicação de rejunte epóxi ou resinado flexível e limpeza imediata de resíduos',
          order: 147,
          categoryCode: '06',
          categoryName: 'Revestimentos, Acabamentos, Pisos, Pintura e Esquadrias',
          subCategoryName: 'Revestimentos Cerâmicos, Porcelanatos e Pedras Naturais',
          defaultResponsible: 'Azulejista / Ajudante Especializado',
          defaultEstimatedDays: 3,
          description: 'Abertura e limpeza profunda dos frisos com espátula e aspirador, mistura dos componentes e preenchimento total das juntas com desempenadeira de borracha, seguido de remoção de névoa residual com limpador específico.',
          checklist: [
            'Remoção prévia de todos os restos de argamassa e espaçadores plásticos das juntas',
            'Preenchimento sem falhas, bolhas de ar ou afundamentos de junta',
            'Limpeza com água e esponja macia no tempo correto para não descolorir nem queimar o rejunte',
            'Proteção do piso rejuntado com plástico-bolha ou papelão ondulado contra tráfego da obra'
          ]
        }
      ]
    },
    {
      id: 'sub-06-05',
      code: '06.05',
      name: 'Forros e Tetos Rebaixados em Gesso',
      order: 5,
      services: [
        {
          id: 'srv-06-05-148',
          code: '06.05.148',
          name: 'Estruturação e fixação de tirantes para forro de gesso acartonado FGE (drywall aramado ou perfis F530)',
          order: 148,
          categoryCode: '06',
          categoryName: 'Revestimentos, Acabamentos, Pisos, Pintura e Esquadrias',
          subCategoryName: 'Forros e Tetos Rebaixados em Gesso',
          defaultResponsible: 'Gesseiro / Montador de Forro',
          defaultEstimatedDays: 4,
          description: 'Locação a laser da cota inferior do forro, fixação de pinos de aço na laje de teto com pistola finca-pinos, tirantes reguláveis de aço galvanizado e perfis canaleta metálicos F530 espaçados a 60cm.',
          checklist: [
            'Conferência do pé-direito livre mínimo exigido no projeto de arquitetura',
            'Espaçamento máximo de 1,00m entre tirantes de sustentação na laje de teto',
            'Nivelamento milimétrico de toda a malha metálica com nível laser 360 graus'
          ]
        },
        {
          id: 'srv-06-05-149',
          code: '06.05.149',
          name: 'Fixação de placas de gesso com tabica perimetral metálica de dilatação (efeito forro flutuante)',
          order: 149,
          categoryCode: '06',
          categoryName: 'Revestimentos, Acabamentos, Pisos, Pintura e Esquadrias',
          subCategoryName: 'Forros e Tetos Rebaixados em Gesso',
          defaultResponsible: 'Montador de Gesso / Ajudante',
          defaultEstimatedDays: 4,
          description: 'Instalação de cantoneira metálica tipo tabica branca ou pré-pintada ao redor de todo o perímetro da parede para absorver movimentações estruturais e fixação das placas de gesso com parafusos ponta agulha.',
          checklist: [
            'Instalação de tabica perimetral com junta livre de 20mm evitando trincas de contato com a parede',
            'Parafusamento a cada 20cm com parafusos fosfatizados afundados levemente sem romper a fita',
            'Tratamento de todas as juntas de placas com fita microperfurada e massa própria de acabamento'
          ]
        },
        {
          id: 'srv-06-05-150',
          code: '06.05.150',
          name: 'Abertura precisa de nichos, cortineiros embutidos e furações para luminárias e difusores de ar',
          order: 150,
          categoryCode: '06',
          categoryName: 'Revestimentos, Acabamentos, Pisos, Pintura e Esquadrias',
          subCategoryName: 'Forros e Tetos Rebaixados em Gesso',
          defaultResponsible: 'Gesseiro / Eletricista',
          defaultEstimatedDays: 2,
          description: 'Corte e confecção de cortineiros iluminados na divisa com janelas, nichos decorativos e corte com serra-copo dos pontos para embutir spots de LED, plafons e grelhas de ar condicionado conforme projeto luminotécnico.',
          checklist: [
            'Marcação precisa dos centros dos pontos luminotécnicos a partir do projeto de iluminação',
            'Reforço estrutural com perfis metálicos em volta de luminárias pesadas ou ventiladores',
            'Bordas dos cortes lixadas e sem rebarbas para encaixe suave dos aros de embutir'
          ]
        }
      ]
    },
    {
      id: 'sub-06-06',
      code: '06.06',
      name: 'Esquadrias de Alumínio, Vidros e Fachadas',
      order: 6,
      services: [
        {
          id: 'srv-06-06-151',
          code: '06.06.151',
          name: 'Fixação e chumbamento de contramarcos de alumínio com esquadro e prumo conferidos',
          order: 151,
          categoryCode: '06',
          categoryName: 'Revestimentos, Acabamentos, Pisos, Pintura e Esquadrias',
          subCategoryName: 'Esquadrias de Alumínio, Vidros e Fachadas',
          defaultResponsible: 'Serralheiro de Alumínio / Pedreiro',
          defaultEstimatedDays: 4,
          description: 'Instalação dos quadros de contramarco nos vãos de alvenaria com grampos chumbados com argamassa forte, verificação rigorosa de diagonais com fita métrica e conferência de prumo e nível.',
          checklist: [
            'Conferência do esquadro pela igualdade das duas diagonais do vão (diferença máxima tolerada de 2mm)',
            'Garantia do recuo padrão em relação ao plano do emboço acabado',
            'Chumbamento com argamassa forte traço 1:3 sem vazios nos pontos de fixação'
          ]
        },
        {
          id: 'srv-06-06-152',
          code: '06.06.152',
          name: 'Instalação de caixilhos de alumínio anodizado ou pintura eletrostática com gaxetas de borracha EPDM',
          order: 152,
          categoryCode: '06',
          categoryName: 'Revestimentos, Acabamentos, Pisos, Pintura e Esquadrias',
          subCategoryName: 'Esquadrias de Alumínio, Vidros e Fachadas',
          defaultResponsible: 'Instalador de Esquadrias de Alumínio',
          defaultEstimatedDays: 5,
          description: 'Aparafusamento dos caixilhos nos contramarcos com parafusos de aço inox, regulagem de roldanas com rolamento blindado, colocação de escovas de vedação e gaxetas de borracha EPDM anti-ruído.',
          checklist: [
            'Uso exclusivo de parafusos em aço inoxidável para evitar corrosão galvânica',
            'Deslizamento suave e silencioso das folhas de correr com roldanas de rolamento duplo de nylon',
            'Calafetação perimetral externa com selante de poliuretano ou silicone neutro de cura química'
          ]
        },
        {
          id: 'srv-06-06-153',
          code: '06.06.153',
          name: 'Colocação de vidros laminados, temperados e duplos insulados com silicone estrutural neutro',
          order: 153,
          categoryCode: '06',
          categoryName: 'Revestimentos, Acabamentos, Pisos, Pintura e Esquadrias',
          subCategoryName: 'Esquadrias de Alumínio, Vidros e Fachadas',
          defaultResponsible: 'Vidraceiro Especializado',
          defaultEstimatedDays: 4,
          description: 'Montagem de vidros de segurança laminados ou temperados nas espessuras de projeto (NBR 7199), assentados sobre calços de neoprene e vedados com fita VHB e silicone neutro estrutural resistente a raios UV.',
          checklist: [
            'Instalação de vidros laminados obrigatórios em parapeitos e alturas inferiores a 1,10m do piso',
            'Presença do selo indelével do fabricante atestando vidro de segurança e têmpera',
            'Aplicação contínua e sem bolhas de cordão de silicone nos perfis de vedação',
            'Remoção de resíduos e aplicação de sinalização visual preventiva com adesivos nos vidros transparentes'
          ]
        },
        {
          id: 'srv-06-06-154',
          code: '06.06.154',
          name: 'Instalação de guarda-corpos de alumínio e vidro temperado conforme ensaio NBR 14718',
          order: 154,
          categoryCode: '06',
          categoryName: 'Revestimentos, Acabamentos, Pisos, Pintura e Esquadrias',
          subCategoryName: 'Esquadrias de Alumínio, Vidros e Fachadas',
          defaultResponsible: 'Montador Especializado em Guarda-Corpo',
          defaultEstimatedDays: 3,
          description: 'Ancoragem estrutural química ou por parabolts de inox nos elementos de concreto das varandas e escadas, altura mínima de 1,10m e ensaio de carga estática horizontal e impacto de corpo mole.',
          checklist: [
            'Profundidade mínima de ancoragem mecânica de 70mm no concreto estrutural da viga de borda',
            'Altura livre mínima do corrimão de 1,10m em relação ao piso acabado da sacada',
            'Garantia de que o espaçamento entre elementos verticais não ultrapasse 11cm (proteção infantil)',
            'Emissão do laudo de conformidade e ensaio destrutivo/não-destrutivo conforme NBR 14718'
          ]
        }
      ]
    },
    {
      id: 'sub-06-07',
      code: '06.07',
      name: 'Esquadrias de Madeira e Fechaduras',
      order: 7,
      services: [
        {
          id: 'srv-06-07-155',
          code: '06.07.155',
          name: 'Fixação de marcos e alizares (portais) de madeira com espuma expansiva de poliuretano e parafusos',
          order: 155,
          categoryCode: '06',
          categoryName: 'Revestimentos, Acabamentos, Pisos, Pintura e Esquadrias',
          subCategoryName: 'Esquadrias de Madeira e Fechaduras',
          defaultResponsible: 'Carpinteiro de Esquadrias',
          defaultEstimatedDays: 4,
          description: 'Travamento dos marcos de madeira tratada com sarrafos reguladores, conferência de prumo de ambos os lados e injeção de espuma de poliuretano expansivo nos vãos laterais com calafetação anti-umidade na base.',
          checklist: [
            'Conferência do esquadro interno do marco e paralelismo milimétrico das duas pernas laterais',
            'Aplicação de isolamento impermeável ou selador na base inferior do marco em contato com o contrapiso',
            'Injeção de espuma de PU controlada aguardando 24 horas antes da retirada dos sarrafos de escoramento'
          ]
        },
        {
          id: 'srv-06-07-156',
          code: '06.07.156',
          name: 'Instalação de portas prontas de madeira com batentes amortecedores e dobradiças em aço inox',
          order: 156,
          categoryCode: '06',
          categoryName: 'Revestimentos, Acabamentos, Pisos, Pintura e Esquadrias',
          subCategoryName: 'Esquadrias de Madeira e Fechaduras',
          defaultResponsible: 'Marceneiro / Instalador de Portas',
          defaultEstimatedDays: 5,
          description: 'Instalação de folhas de portas frisadas ou lisas pré-pintadas com 3 dobradiças de aço inox com rolamento por folha, folga perimetral padrão de 3mm e fita de borracha amortecedora no batente.',
          checklist: [
            'Folga uniforme de 3mm nas laterais e topo e folga inferior de 6mm a 10mm sobre o piso acabado',
            'Fixação das três dobradiças com parafusos de comprimento suficiente para engaste firme no marco',
            'Instalação de borracha de amortecimento contínua no rebaixo do batente para fecho silencioso'
          ]
        },
        {
          id: 'srv-06-07-157',
          code: '06.07.157',
          name: 'Colocação de fechaduras mecânicas e digitais com teste de chave-mestra e batedores de piso',
          order: 157,
          categoryCode: '06',
          categoryName: 'Revestimentos, Acabamentos, Pisos, Pintura e Esquadrias',
          subCategoryName: 'Esquadrias de Madeira e Fechaduras',
          defaultResponsible: 'Marceneiro / Chaveiro Técnico',
          defaultEstimatedDays: 3,
          description: 'Usinagem precisa na folha e no marco com gabarito tupia, colocação de maçanetas tipo alavanca de acessibilidade, cilindros com chave e batedores magnéticos de piso fixados para proteção de paredes.',
          checklist: [
            'Conferência do recolhimento suave do trinco e funcionamento da lingueta de trava com a chave',
            'Instalação de maçaneta em altura padrão de 1,00m a 1,05m do piso acabado',
            'Fixação de batedor com amortecedor no chão para impedir batida da maçaneta contra o revestimento da parede',
            'Configuração e teste de senhas e tags nas fechaduras eletrônicas digitais'
          ]
        }
      ]
    },
    {
      id: 'sub-06-08',
      code: '06.08',
      name: 'Pintura Interna, Externa e Texturas de Fachada',
      order: 8,
      services: [
        {
          id: 'srv-06-08-158',
          code: '06.08.158',
          name: 'Lixamento e aplicação de fundo preparador e selador acrílico em paredes e tetos',
          order: 158,
          categoryCode: '06',
          categoryName: 'Revestimentos, Acabamentos, Pisos, Pintura e Esquadrias',
          subCategoryName: 'Pintura Interna, Externa e Texturas de Fachada',
          defaultResponsible: 'Pintor Profissional / Ajudante',
          defaultEstimatedDays: 4,
          description: 'Remoção de poeiras residuais e partículas soltas com escovação e lixa, seguida de aplicação homogênea de selador acrílico pigmentado ou fundo preparador de paredes para uniformizar a absorção da alvenaria.',
          checklist: [
            'Limpeza e aspiração do pó das paredes e cantos antes da aplicação do líquido selador',
            'Aplicação uniforme com rolo de lã de carneiro sem escorrimentos',
            'Tempo de secagem de no mínimo 6 horas antes da etapa de emassamento'
          ]
        },
        {
          id: 'srv-06-08-159',
          code: '06.08.159',
          name: 'Aplicação de massa corrida PVA em ambientes secos e massa acrílica em áreas molháveis',
          order: 159,
          categoryCode: '06',
          categoryName: 'Revestimentos, Acabamentos, Pisos, Pintura e Esquadrias',
          subCategoryName: 'Pintura Interna, Externa e Texturas de Fachada',
          defaultResponsible: 'Pintor de Acabamento',
          defaultEstimatedDays: 7,
          description: 'Aplicação de 2 a 3 demãos de massa corrida com desempenadeira de aço inox flexível, seguida de lixamento mecânico com lixadeira girafa acoplada a aspirador industrial sob luz rasante (lâmpada piloto).',
          checklist: [
            'Uso obrigatório de massa acrílica resistente à umidade em banheiros, cozinhas, lavanderias e varandas',
            'Lixamento com lixas de grão progressivo (grão 150 até grão 220)',
            'Inspeção com holofote de luz rasante para identificação e correção de micro-imperfeições e ondulações',
            'Remoção meticulosa de todo o pó com pano microfibra ligeiramente umedecido'
          ]
        },
        {
          id: 'srv-06-08-160',
          code: '06.08.160',
          name: 'Aplicação de 2 a 3 demãos de tinta látex acrílica premium fosca ou acetinada em paredes e tetos',
          order: 160,
          categoryCode: '06',
          categoryName: 'Revestimentos, Acabamentos, Pisos, Pintura e Esquadrias',
          subCategoryName: 'Pintura Interna, Externa e Texturas de Fachada',
          defaultResponsible: 'Pintor Profissional',
          defaultEstimatedDays: 6,
          description: 'Pintura de tetos e paredes internas com tinta acrílica lavável de primeira linha com rolo de microfibra anti-respingo e pincéis de cerdas sintéticas para recorte de quinas e rodapés.',
          checklist: [
            'Isolamento e proteção de rodapés, esquadrias e pisos com fita crepe automotiva e lona plástica',
            'Diluição controlada com água potável estritamente na proporção indicada na embalagem',
            'Respeito rigoroso ao intervalo de cura de 4 horas entre demãos sucessivas',
            'Uniformidade visual da película de tinta sem manchas de rolo, marcas de emenda ou sombras'
          ]
        },
        {
          id: 'srv-06-08-161',
          code: '06.08.161',
          name: 'Aplicação de textura projetada, hidrorrepelente e pintura elastomérica em fachadas externas',
          order: 161,
          categoryCode: '06',
          categoryName: 'Revestimentos, Acabamentos, Pisos, Pintura e Esquadrias',
          subCategoryName: 'Pintura Interna, Externa e Texturas de Fachada',
          defaultResponsible: 'Pintor Fachadeiro (Alpinista Industrial / Balancim)',
          defaultEstimatedDays: 8,
          description: 'Projeção de textura acrílica hidrorepelente com pistola caneca e compressor ou aplicação de revestimento monocamada com pintura elastomérica flexível capaz de acomodar microfissuras da fachada externa.',
          checklist: [
            'Instalação e verificação diária de cabos de aço e trava-quedas para balancins elétricos (NR 18 e NR 35)',
            'Aplicação prévia de fundo impermeabilizante selador elastomérico em toda a fachada externa',
            'Conferência da uniformidade da granulometria da textura sem quebras de pano ou marcas de andaime',
            'Aplicação de selante de poliuretano estrutural em todas as juntas de dilatação de fachada'
          ]
        }
      ]
    }
  ]
};
