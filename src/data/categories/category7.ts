/**
 * category7.ts
 * Categoria 07 da EAP: Louças, Metais, Limpeza Final, Comissionamento e Entrega da Obra
 * Ordem cronológica: serviços 162 a 185
 */

import { EAPCategoryTemplate } from '../eapTypes';

export const CATEGORY_7_LIMPEZA_COMISSIONAMENTO_ENTREGA: EAPCategoryTemplate = {
  id: 'cat-11',
  code: '11',
  name: 'Louças, Metais, Limpeza Final, Comissionamento e Entrega da Obra',
  order: 11,
  description: 'Instalação de louças sanitárias e metais de acabamento, complementos elétricos e luminárias finais, paisagismo externo, testes e comissionamento integral de equipamentos e sistemas prediais, limpeza pós-obra profissional, desinfecção microbiológica de reservatórios de água, vistorias técnicas, elaboração de As-Built e entrega oficial das chaves.',
  subCategories: [
    {
      id: 'sub-07-01',
      code: '07.01',
      name: 'Instalação de Louças, Metais e Acessórios Sanitários',
      order: 1,
      services: [
        {
          id: 'srv-07-01-162',
          code: '07.01.162',
          name: 'Instalação de vasos sanitários com caixa acoplada, anel de vedação antibacteriano e parafusos de latão',
          order: 162,
          categoryCode: '07',
          categoryName: 'Louças, Metais, Limpeza Final, Comissionamento e Entrega da Obra',
          subCategoryName: 'Instalação de Louças, Metais e Acessórios Sanitários',
          defaultResponsible: 'Encanador de Acabamento',
          defaultEstimatedDays: 4,
          description: 'Fixação de bacias sanitárias com buchas e parafusos de latão niquelado inoxidável, assentamento com anel de cera/borracha com guia antibacteriana e calafetação da base com silicone anti-mofo.',
          checklist: [
            'Instalação de anel de vedação com guia plástico centrado exatamente no tubo de esgoto de 100mm',
            'Aperto equilibrado dos parafusos laterais com arruelas plásticas para não trincar a louça cerâmica',
            'Regulagem da bóia e mecanismo de descarga de duplo acionamento (3 litros e 6 litros) para economia de água',
            'Teste de estanqueidade e ausência de refluxo de odores após 10 descargas consecutivas'
          ]
        },
        {
          id: 'srv-07-01-163',
          code: '07.01.163',
          name: 'Instalação de cubas de embutir e sobrepor, lavatórios e tanques de inox com sifões articulados',
          order: 163,
          categoryCode: '07',
          categoryName: 'Louças, Metais, Limpeza Final, Comissionamento e Entrega da Obra',
          subCategoryName: 'Instalação de Louças, Metais e Acessórios Sanitários',
          defaultResponsible: 'Encanador / Marmorista',
          defaultEstimatedDays: 4,
          description: 'Colagem de cubas sob bancadas com massa plástica e silicone neutro com grampos metálicos inferiores, montagem de válvulas de escoamento click/inox e conexão com sifões rígidos ou extensíveis.',
          checklist: [
            'Fixação estrutural das cubas de embutir com grampos de aço inoxidável colados na pedra',
            'Vedação de válvula de escoamento com anéis originais e silicone neutro sem aperto excessivo',
            'Instalação de sifão com fecho hídrico regulamentar de 50mm para evitar retorno de mau cheiro',
            'Teste de vazão contínua com cuba cheia sem qualquer gotejamento nas conexões'
          ]
        },
        {
          id: 'srv-07-01-164',
          code: '07.01.164',
          name: 'Instalação de torneiras, misturadores monocomando, duchas higiênicas e chuveiros com arejadores',
          order: 164,
          categoryCode: '07',
          categoryName: 'Louças, Metais, Limpeza Final, Comissionamento e Entrega da Obra',
          subCategoryName: 'Instalação de Louças, Metais e Acessórios Sanitários',
          defaultResponsible: 'Encanador de Acabamento',
          defaultEstimatedDays: 4,
          description: 'Instalação de torneiras de bancada e parede com fita veda-rosca de teflon de alta densidade, flexíveis em malha de aço trançada, registros de gaveta e pressão com canoplas e chuveiros com redutores de vazão.',
          checklist: [
            'Instalação de arejadores de vazão constante para eficiência hídrica e conforto',
            'Instalação de registro de bloqueio dedicado com canopla cromada para ducha higiênica',
            'Conferência do aperto dos engates flexíveis com anel de borracha original sem uso de ferramentas cortantes',
            'Alinhamento e nivelamento visual das canoplas de acabamento rentes ao azulejo'
          ]
        },
        {
          id: 'srv-07-01-165',
          code: '07.01.165',
          name: 'Fixação de acessórios de banheiro (papeleiras, toalheiros, cabides e barras de apoio de acessibilidade NBR 9050)',
          order: 165,
          categoryCode: '07',
          categoryName: 'Louças, Metais, Limpeza Final, Comissionamento e Entrega da Obra',
          subCategoryName: 'Instalação de Louças, Metais e Acessórios Sanitários',
          defaultResponsible: 'Instalador de Acessórios / Pedreiro',
          defaultEstimatedDays: 3,
          description: 'Furação de revestimentos cerâmicos com brocas de vídia sem lascar as peças, fixação com buchas plásticas e parafusos de inox de kits de acessórios e barras de apoio em aço inox polido nos sanitários acessíveis (PNE).',
          checklist: [
            'Conferência das alturas normatizadas de papeleiras (0,60m) e toalheiros (1,40m)',
            'Ancoragem reforçada das barras de apoio para suportar carga estática superior a 150 kgf',
            'Aperto dos parafusos com chave além do alinhamento perfeito de prumo e nível'
          ]
        }
      ]
    },
    {
      id: 'sub-07-02',
      code: '07.02',
      name: 'Acabamentos Elétricos e Iluminação Definitiva',
      order: 2,
      services: [
        {
          id: 'srv-07-02-166',
          code: '07.02.166',
          name: 'Instalação de espelhos, placas, tomadas de energia (10A e 20A) e interruptores modulares',
          order: 166,
          categoryCode: '07',
          categoryName: 'Louças, Metais, Limpeza Final, Comissionamento e Entrega da Obra',
          subCategoryName: 'Acabamentos Elétricos e Iluminação Definitiva',
          defaultResponsible: 'Eletricista Instalador',
          defaultEstimatedDays: 5,
          description: 'Montagem dos módulos elétricos em suportes parafusados nas caixas 4x2 e 4x4, diferenciação visual ou gravação indelével de tomadas de 20A (vermelhas ou identificadas) e encaixe de placas de acabamento.',
          checklist: [
            'Diferenciação clara das tomadas de 20A nos pontos de micro-ondas, lava-louças e ar-condicionado',
            'Alinhamento e nivelamento perfeitamente na horizontal das placas de espelho com nível de bolha',
            'Aperto seguro dos parafusos de borne sem deixar cobre exposto para fora do módulo condutor',
            'Teste com medidor de polaridade e tensão em 100% das tomadas residenciais'
          ]
        },
        {
          id: 'srv-07-02-167',
          code: '07.02.167',
          name: 'Instalação e ligação de luminárias LED, plafons de embutir, spots e fitas de LED decorativas',
          order: 167,
          categoryCode: '07',
          categoryName: 'Louças, Metais, Limpeza Final, Comissionamento e Entrega da Obra',
          subCategoryName: 'Acabamentos Elétricos e Iluminação Definitiva',
          defaultResponsible: 'Eletricista de Acabamento',
          defaultEstimatedDays: 5,
          description: 'Conexão dos drivers e fontes de alimentação 12V/24V, fixação de aros de embutir com molas de pressão nos forros de gesso e testes funcionais de acendimento e dimerização por circuitos.',
          checklist: [
            'Instalação de fontes de alimentação de fita LED em locais ventilados e acessíveis para manutenção',
            'Uso de conectores de engate rápido tipo mola (Wago) para conexões elétricas seguras nos tetos',
            'Conferência da temperatura de cor das lâmpadas (3000K quente / 4000K neutro) conforme projeto luminotécnico',
            'Inspeção para certificar que nenhum gesso ou forro foi quebrado ou marcado de sujeira durante o encaixe'
          ]
        },
        {
          id: 'srv-07-02-168',
          code: '07.02.168',
          name: 'Identificação de todos os circuitos nos quadros de disjuntores com etiquetas permanentes e diagrama unifilar',
          order: 168,
          categoryCode: '07',
          categoryName: 'Louças, Metais, Limpeza Final, Comissionamento e Entrega da Obra',
          subCategoryName: 'Acabamentos Elétricos e Iluminação Definitiva',
          defaultResponsible: 'Técnico em Eletrotécnica',
          defaultEstimatedDays: 2,
          description: 'Fixação de etiquetas impressas indeléveis em cada disjuntor indicando sua função (ex: Tomadas Cozinha, Iluminação Sala, Chuveiro 1) e colagem do diagrama unifilar plastificado na face interna da tampa do quadro.',
          checklist: [
            'Conferência circuito por circuito desarmando o disjuntor para validar a etiquetação correspondente',
            'Plastificação e colagem do diagrama unifilar de ligações atualizado na porta do QGD',
            'Fechamento e travamento das tampas acrílicas/metálicas de proteção contra toque acidental'
          ]
        }
      ]
    },
    {
      id: 'sub-07-03',
      code: '07.03',
      name: 'Paisagismo, Calçadas e Pavimentação Externa',
      order: 3,
      services: [
        {
          id: 'srv-07-03-169',
          code: '07.03.169',
          name: 'Execução de calçadas externas de concreto estampado, piso intertravado (paver) e guias pré-moldadas',
          order: 169,
          categoryCode: '07',
          categoryName: 'Louças, Metais, Limpeza Final, Comissionamento e Entrega da Obra',
          subCategoryName: 'Paisagismo, Calçadas e Pavimentação Externa',
          defaultResponsible: 'Calceteiro / Equipe de Pavimentação',
          defaultEstimatedDays: 6,
          description: 'Compactação mecanizada do subleito com placa vibratória, assentamento de colchão de areia e montagem travada de blocos de concreto intertravados com contenção perimetral e rejunte de areia fina.',
          checklist: [
            'Compactação da base com grau de compactação mínimo de 95% do Proctor Normal',
            'Declividade transversal de 2% direcionada para sarjetas pluviais externas',
            'Instalação de piso tátil direcional e de alerta para acessibilidade universal na calçada pública',
            'Compactação final sobre os pavers com placa vibratória com proteção emborrachada'
          ]
        },
        {
          id: 'srv-07-03-170',
          code: '07.03.170',
          name: 'Preparação de solo com adubação, plantio de grama em leivas, arbustos e árvores com irrigação automatizada',
          order: 170,
          categoryCode: '07',
          categoryName: 'Louças, Metais, Limpeza Final, Comissionamento e Entrega da Obra',
          subCategoryName: 'Paisagismo, Calçadas e Pavimentação Externa',
          defaultResponsible: 'Paisagista / Jardineiro Especializado',
          defaultEstimatedDays: 5,
          description: 'Descompactação da terra vegetal, correção de pH e adubação orgânica, assentamento de placas de grama Esmeralda ou São Carlos bem unidas e batidas, plantio de mudas com tutoramento e testes de aspersores.',
          checklist: [
            'Preparo da terra vegetal com adubo fosfatado e esterco curtido',
            'Bateção das leivas de grama com soquete para eliminação de bolsas de ar radiculares',
            'Amarração de mudas arbóreas em tutores de madeira com fita elástica (sem estrangulamento do caule)',
            'Teste de setorização e raio de alcance dos aspersores do sistema de irrigação automatizado'
          ]
        }
      ]
    },
    {
      id: 'sub-07-04',
      code: '07.04',
      name: 'Comissionamento e Testes Finais de Sistemas Prediais',
      order: 4,
      services: [
        {
          id: 'srv-07-04-171',
          code: '07.04.171',
          name: 'Teste e balanceamento hidrostático das bombas de recalque, incêndio e pressurizadores de água',
          order: 171,
          categoryCode: '07',
          categoryName: 'Louças, Metais, Limpeza Final, Comissionamento e Entrega da Obra',
          subCategoryName: 'Comissionamento e Testes Finais de Sistemas Prediais',
          defaultResponsible: 'Engenheiro Mecânico / Técnico de Bombas',
          defaultEstimatedDays: 3,
          description: 'Medição da corrente elétrica em operação contínua, sentido de rotação dos motores trifásicos, verificação da vazão e pressão manométrica de trabalho e calibração dos relés de sobrecarga e falta de fase.',
          checklist: [
            'Conferência do sentido de rotação dos eixos dos rotores das bombas',
            'Medição da corrente nominal (ampères) sob carga em comparação com os dados de placa',
            'Calibração e teste de comutação automática entre bomba principal e bomba reserva',
            'Teste dos sensores de nível automático boia e chave de fluxo'
          ]
        },
        {
          id: 'srv-07-04-172',
          code: '07.04.172',
          name: 'Comissionamento do grupo gerador de emergência com quadro de transferência automática (QTA) em carga',
          order: 172,
          categoryCode: '07',
          categoryName: 'Louças, Metais, Limpeza Final, Comissionamento e Entrega da Obra',
          subCategoryName: 'Comissionamento e Testes Finais de Sistemas Prediais',
          defaultResponsible: 'Engenheiro Eletricista / Especialista em Geradores',
          defaultEstimatedDays: 2,
          description: 'Simulação de blecaute com desligamento da chave de entrada da concessionária, temporização de partida do motor a diesel, transferência de carga em menos de 10 segundos e operação estável por 2 horas.',
          checklist: [
            'Medição do tempo de acionamento e estabilização de frequência (60 Hz) e tensão (380V/220V)',
            'Operação ininterrupta com 100% dos circuitos essenciais conectados (bombas, elevadores e emergência)',
            'Inspeção do nível de óleo lubrificante, arrefecimento e abastecimento com óleo diesel S10',
            'Emissão do laudo de teste em carga com banco de resistências ou carga real da edificação'
          ]
        },
        {
          id: 'srv-07-04-173',
          code: '07.04.173',
          name: 'Comissionamento e certificação dos elevadores de passageiros e de serviço com órgão fiscalizador',
          order: 173,
          categoryCode: '07',
          categoryName: 'Louças, Metais, Limpeza Final, Comissionamento e Entrega da Obra',
          subCategoryName: 'Comissionamento e Testes Finais de Sistemas Prediais',
          defaultResponsible: 'Empresa Fabricante de Elevadores / Engenheiro Mecânico Responsável',
          defaultEstimatedDays: 4,
          description: 'Ensaios de pesagem de cabine, teste de atuação do freio mecânico de segurança contra queda livre (freio paraquedas), nivelamento milimétrico nas paradas de pavimento e emissão do Alvará de Instalação e Funcionamento.',
          checklist: [
            'Teste estático e dinâmico de sobrecarga com pesos padrão de 125% da capacidade nominal',
            'Nivelamento milimétrico da soleira da cabine com o piso do pavimento em todos os andares',
            'Teste dos botões de emergência, intercomunicador de cabine com a portaria e luz de emergência interna',
            'Emissão do Relatório de Inspeção Anual (RIA) e termo de liberação para passageiros'
          ]
        },
        {
          id: 'srv-07-04-174',
          code: '07.04.174',
          name: 'Teste geral do sistema de alarme, detecção de fumaça, pressurização de escadas e combate a incêndio com simulação',
          order: 174,
          categoryCode: '07',
          categoryName: 'Louças, Metais, Limpeza Final, Comissionamento e Entrega da Obra',
          subCategoryName: 'Comissionamento e Testes Finais de Sistemas Prediais',
          defaultResponsible: 'Engenheiro de Segurança do Trabalho / Comandante de Bombeiros',
          defaultEstimatedDays: 3,
          description: 'Simulação integrada de incêndio com fumaça teste: acionamento dos detectores, desligamento do ar-condicionado de conforto, acionamento do ventilador de pressurização da escada de emergência e liberação das portas corta-fogo com eletroímãs.',
          checklist: [
            'Medição da pressão diferencial na escada de emergência com micromanômetro (mínimo de 50 Pa)',
            'Abertura e fechamento com mola aérea de todas as portas corta-fogo com vedação hermética',
            'Disparo de hidrante no pavimento mais desfavorável com medição de vazão e pressão manométrica residual',
            'Auditoria de conformidade com as Instruções Técnicas (ITs) do Corpo de Bombeiros Militar'
          ]
        }
      ]
    },
    {
      id: 'sub-07-05',
      code: '07.05',
      name: 'Limpeza Fina Especializada e Pós-Obra',
      order: 5,
      services: [
        {
          id: 'srv-07-05-175',
          code: '07.05.175',
          name: 'Remoção pesada de entulhos residuais, fitas de proteção, adesivos e películas de esquadrias',
          order: 175,
          categoryCode: '07',
          categoryName: 'Louças, Metais, Limpeza Final, Comissionamento e Entrega da Obra',
          subCategoryName: 'Limpeza Fina Especializada e Pós-Obra',
          defaultResponsible: 'Equipe de Limpeza de Obras / Ajudantes',
          defaultEstimatedDays: 3,
          description: 'Retirada de todas as proteções plásticas de bancadas e pisos, remoção de películas protetoras de caixilhos de alumínio antes de fundirem com o sol e destinação correta de resíduos em caçambas licenciadas.',
          checklist: [
            'Remoção de fitas adesivas com solventes biodegradáveis neutros sem manchar as tintas das esquadrias',
            'Separação e destinação ecológica de plásticos, papelões e resíduos inertes (Resolução CONAMA 307)',
            'Varrição grossa de todas as lajes e garagens'
          ]
        },
        {
          id: 'srv-07-05-176',
          code: '07.05.176',
          name: 'Limpeza química e mecânica especializada de pisos de porcelanato e azulejos com detergentes desincrustantes',
          order: 176,
          categoryCode: '07',
          categoryName: 'Louças, Metais, Limpeza Final, Comissionamento e Entrega da Obra',
          subCategoryName: 'Limpeza Fina Especializada e Pós-Obra',
          defaultResponsible: 'Profissionais de Limpeza Técnica Pós-Obra',
          defaultEstimatedDays: 5,
          description: 'Aplicação de desincrustante ácido/alcalino específico com lavadora industrial monodisco com disco macio, neutralização com água pura e aspiração total de resíduos sem agredir o brilho do porcelanato.',
          checklist: [
            'Proibição absoluta de ácido muriático ou produtos corrosivos que queimam o esmalte e os rejuntes',
            'Enxágue abundante e remoção total do produto com extratora e aspirador de água profissional',
            'Secagem com panos de microfibra e aplicação de cera protetora temporária se necessário'
          ]
        },
        {
          id: 'srv-07-05-177',
          code: '07.05.177',
          name: 'Limpeza técnica de vidros internos e externos com equipamento de segurança e remoção de marcas de silicone',
          order: 177,
          categoryCode: '07',
          categoryName: 'Louças, Metais, Limpeza Final, Comissionamento e Entrega da Obra',
          subCategoryName: 'Limpeza Fina Especializada e Pós-Obra',
          defaultResponsible: 'Limpador de Vidros Técnico (Alpinista Industrial NR 35)',
          defaultEstimatedDays: 4,
          description: 'Raspagem cuidadosa de respingos de tinta e silicone com raspador de lâmina de aço inox lubrificada, lavagem com aplicador de microfibra e rodo de borracha com água deionizada para acabamento cristalino.',
          checklist: [
            'Inspeção da lâmina do raspador a cada folha de vidro para não causar micro-riscos no vidro temperado',
            'Remoção completa de poeiras nos trilhos e canais de drenagem das esquadrias de alumínio',
            'Acabamento translúcido e sem manchas em todas as janelas, portas balcão e espelhos'
          ]
        },
        {
          id: 'srv-07-05-178',
          code: '07.05.178',
          name: 'Limpeza fina de marcenarias, louças, metais e aspiração de pó em todos os cômodos e forros',
          order: 178,
          categoryCode: '07',
          categoryName: 'Louças, Metais, Limpeza Final, Comissionamento e Entrega da Obra',
          subCategoryName: 'Limpeza Fina Especializada e Pós-Obra',
          defaultResponsible: 'Equipe de Limpeza Fina de Entrega',
          defaultEstimatedDays: 4,
          description: 'Aspiração de pós finos em rebaixos de forros e canaletas, higienização de portas, fechaduras e rodapés com limpadores multiuso neutros e lustro de metais sanitários cromados com flanela seca.',
          checklist: [
            'Aspiração profunda de interiores de ralos e cantos de rodapés',
            'Polimento de louças e torneiras cromadas deixando superfícies brilhantes e livres de marcas de dedos',
            'Aplicação de selos ou faixas adesivas higiênicas descartáveis nas tampas dos vasos sanitários'
          ]
        }
      ]
    },
    {
      id: 'sub-07-06',
      code: '07.06',
      name: 'Desinfecção de Reservatórios e Ensaios de Potabilidade da Água',
      order: 6,
      services: [
        {
          id: 'srv-07-06-179',
          code: '07.06.179',
          name: 'Lavagem profunda, desinfecção com solução de hipoclorito de sódio e enxágue dos reservatórios superior e inferior',
          order: 179,
          categoryCode: '07',
          categoryName: 'Louças, Metais, Limpeza Final, Comissionamento e Entrega da Obra',
          subCategoryName: 'Desinfecção de Reservatórios e Ensaios de Potabilidade da Água',
          defaultResponsible: 'Empresa Especializada em Higienização de Caixas d’Água',
          defaultEstimatedDays: 2,
          description: 'Esgotamento da água de teste da obra, escovação mecânica de paredes e fundo dos reservatórios de concreto, sanitização com solução clorada de 50 ppm por 2 horas e enxágue abundante antes do abastecimento final.',
          checklist: [
            'Proibição do uso de sabões em pó ou químicos perfumados nas superfícies internas',
            'Desinfecção com hipoclorito de sódio de grau alimentício com tempo de contato regulamentar',
            'Fechamento hermético das tampas de inspeção com travas e tela de proteção mosquiteiro nos suspiros'
          ]
        },
        {
          id: 'srv-07-06-180',
          code: '07.06.180',
          name: 'Coleta de amostras de água e emissão de laudo laboratorial de potabilidade físico-química e microbiológica',
          order: 180,
          categoryCode: '07',
          categoryName: 'Louças, Metais, Limpeza Final, Comissionamento e Entrega da Obra',
          subCategoryName: 'Desinfecção de Reservatórios e Ensaios de Potabilidade da Água',
          defaultResponsible: 'Laboratório Químico Acreditado / Químico Responsável',
          defaultEstimatedDays: 4,
          description: 'Coleta asseptizada em frascos esterilizados na torneira mais distante e no reservatório para análise de coliformes totais, Escherichia coli, turbidez, pH e cloro residual livre conforme Portaria GM/MS nº 888.',
          checklist: [
            'Preservação térmica das amostras em caixa isotérmica com gelo até a chegada ao laboratório',
            'Resultado negativo para coliformes e patógenos microbiológicos',
            'Emissão do Laudo de Potabilidade oficial atestando aptidão da água para consumo humano'
          ]
        }
      ]
    },
    {
      id: 'sub-07-07',
      code: '07.07',
      name: 'Vistoria Técnica, Manual do Proprietário e Entrega da Obra (As-Built)',
      order: 7,
      services: [
        {
          id: 'srv-07-07-181',
          code: '07.07.181',
          name: 'Vistoria técnica pente-fino da construtora com preenchimento de checklist de entrega por unidade autônoma',
          order: 181,
          categoryCode: '07',
          categoryName: 'Louças, Metais, Limpeza Final, Comissionamento e Entrega da Obra',
          subCategoryName: 'Vistoria Técnica, Manual do Proprietário e Entrega da Obra (As-Built)',
          defaultResponsible: 'Engenheiro Residente / Equipe de Controle de Qualidade',
          defaultEstimatedDays: 5,
          description: 'Inspeção minuciosa com prancheta/tablet testando 100% de portas, fechaduras, janelas, torneiras, caimentos de ralos, pintura e azulejos, abrindo ordens de serviço imediatas para reparo pré-vistoria do cliente.',
          checklist: [
            'Preenchimento de checklist digital com fotos de cada cômodo de todas as unidades',
            'Resolução de 100% das não conformidades identificadas antes do agendamento com o cliente',
            'Liberação formal da unidade no sistema de gestão com o status "Pronto para Vistoria"'
          ]
        },
        {
          id: 'srv-07-07-182',
          code: '07.07.182',
          name: 'Elaboração e consolidação do As-Built de todas as disciplinas de engenharia e arquitetura',
          order: 182,
          categoryCode: '07',
          categoryName: 'Louças, Metais, Limpeza Final, Comissionamento e Entrega da Obra',
          subCategoryName: 'Vistoria Técnica, Manual do Proprietário e Entrega da Obra (As-Built)',
          defaultResponsible: 'Engenheiro Coordenador de Projetos / Projetistas',
          defaultEstimatedDays: 6,
          description: 'Atualização definitiva dos arquivos de projeto em formato DWG, IFC/BIM e PDF refletindo com fidelidade todas as alterações físicas executadas na obra (traçados de prumadas, caixas embutidas e circuitos elétricos).',
          checklist: [
            'Levantamento métrico in loco de qualquer alteração de traçado ou parede executada diferente do projeto inicial',
            'Consolidação dos arquivos digitais em pasta de entrega com índice estruturado',
            'Validação e assinatura de todos os engenheiros projetistas responsáveis pelas disciplinas'
          ]
        },
        {
          id: 'srv-07-07-183',
          code: '07.07.183',
          name: 'Vistoria final do Corpo de Bombeiros e emissão do AVCB (Auto de Vistoria do Corpo de Bombeiros)',
          order: 183,
          categoryCode: '07',
          categoryName: 'Louças, Metais, Limpeza Final, Comissionamento e Entrega da Obra',
          subCategoryName: 'Vistoria Técnica, Manual do Proprietário e Entrega da Obra (As-Built)',
          defaultResponsible: 'Engenheiro de Segurança / Bombeiro Militar Vistoriador',
          defaultEstimatedDays: 7,
          description: 'Acompanhamento da vistoria in loco do Corpo de Bombeiros Militar, teste prático das rotas de fuga, alarmes, bombas, extintores e portas corta-fogo para aprovação oficial da edificação.',
          checklist: [
            'Apresentação de todas as ARTs e notas fiscais de materiais antichama e extintores certificados',
            'Aprovação na simulação de pressurização e manobra dos hidrantes diante dos vistoriadores',
            'Obtenção do certificado digital do AVCB ou CLCB oficial do Estado'
          ]
        },
        {
          id: 'srv-07-07-184',
          code: '07.07.184',
          name: 'Vistoria municipal e obtenção da Certidão de Conclusão da Obra (Habite-se)',
          order: 184,
          categoryCode: '07',
          categoryName: 'Louças, Metais, Limpeza Final, Comissionamento e Entrega da Obra',
          subCategoryName: 'Vistoria Técnica, Manual do Proprietário e Entrega da Obra (As-Built)',
          defaultResponsible: 'Engenheiro Coordenador / Fiscal da Prefeitura',
          defaultEstimatedDays: 10,
          description: 'Inspeção urbanística pelos fiscais da prefeitura municipal certificando que a construção foi executada conforme projeto aprovado, recuos legais, calçadas acessíveis e vagas de estacionamento.',
          checklist: [
            'Comprovação de quitação do ISS da construção civil e certidões negativas das concessionárias',
            'Verificação in loco de áreas construídas e índices de permeabilidade e recuos',
            'Emissão da Certidão de Habite-se / Alvará de Conclusão de Obras definitivo'
          ]
        },
        {
          id: 'srv-07-07-185',
          code: '07.07.185',
          name: 'Entrega formal das chaves aos proprietários com entrega do Manual do Proprietário e das Áreas Comuns',
          order: 185,
          categoryCode: '07',
          categoryName: 'Louças, Metais, Limpeza Final, Comissionamento e Entrega da Obra',
          subCategoryName: 'Vistoria Técnica, Manual do Proprietário e Entrega da Obra (As-Built)',
          defaultResponsible: 'Engenheiro Residente / Diretor de Operações / Atendimento ao Cliente',
          defaultEstimatedDays: 5,
          description: 'Vistoria conjunta com o cliente comprador, teste de funcionamento de todos os itens, assinatura do Termo de Recebimento de Chaves e entrega do Manual do Proprietário conforme NBR 14037 e NBR 5674.',
          checklist: [
            'Acompanhamento do cliente cômodo a cômodo com checklist impresso de entrega',
            'Assinatura do Termo de Recebimento Definitivo de Chaves sem pendências pendentes',
            'Entrega do kit de chaves mestre, tags de acesso eletrônico e controles de garagem',
            'Entrega do Manual do Proprietário impresso e digital com prazos de garantia e plano de manutenção preventiva'
          ]
        }
      ]
    }
  ]
};
