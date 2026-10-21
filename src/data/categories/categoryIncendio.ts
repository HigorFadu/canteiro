/**
 * categoryIncendio.ts
 * Categoria da EAP: Sistemas de Combate a Incêndio
 * Ordem cronológica: serviços 123 a 127
 */

import { EAPCategoryTemplate } from '../eapTypes';

export const CATEGORY_SISTEMAS_INCENDIO: EAPCategoryTemplate = {
  id: 'cat-09-incendio',
  code: '09',
  name: 'Sistemas de Combate a Incêndio',
  order: 9,
  description: 'Rede de hidrantes e sprinklers em tubos ranhurados grooved, casa de bombas de incêndio automatizada, alarme de emergência com botoeiras e detectores de fumaça, e sinalização fotoluminescente.',
  subCategories: [
    {
      id: 'sub-09-01',
      code: '09.01',
      name: 'Rede de Hidrantes e Sprinklers (Grooved)',
      order: 1,
      services: [
        {
          id: 'srv-09-01-123',
          code: '09.01.123',
          name: 'Instalação de tubulação de aço carbono soldada ou ranhurada (Grooved) para rede de hidrantes e sprinklers',
          order: 123,
          categoryCode: '09',
          categoryName: 'Sistemas de Combate a Incêndio',
          subCategoryName: 'Rede de Hidrantes e Sprinklers (Grooved)',
          defaultResponsible: 'Encanador Industrial / Soldador Grooved',
          defaultEstimatedDays: 7,
          description: 'Montagem de rede contra incêndio em tubos de aço galvanizado ou preto Schedule 40 com conexões ranhuradas tipo acoplamento mecânico rígido/flexível e pintura vermelha de segurança (NBR 13714).',
          checklist: [
            'Conferência do diâmetro mínimo das prumadas de hidrantes (geralmente DN 65 ou DN 75)',
            'Aperto com torque correto dos acoplamentos ranhurados grooved com lubrificação das borrachas',
            'Instalação dos bicos de chuveiros automáticos (sprinklers) pendentes ou upright com ampola termossensível'
          ]
        },
        {
          id: 'srv-09-01-124',
          code: '09.01.124',
          name: 'Montagem da casa de bombas de incêndio com bomba principal, reserva e jockey automatizadas',
          order: 124,
          categoryCode: '09',
          categoryName: 'Sistemas de Combate a Incêndio',
          subCategoryName: 'Rede de Hidrantes e Sprinklers (Grooved)',
          defaultResponsible: 'Mecânico de Bombas / Eletricista de Comando',
          defaultEstimatedDays: 4,
          description: 'Assentamento e alinhamento a laser das bombas centrífugas de incêndio em bases antivibratórias com quadro elétrico de comando com partida estrela-triângulo ou soft-starter e pressostatos.',
          checklist: [
            'Regulagem dos pressostatos de partida escalonada (bomba jockey para micro-vazamentos e principal para abertura de hidrante)',
            'Instalação de manômetros de glicerina e válvulas de retenção de fluxo na linha de recalque',
            'Alimentação elétrica da bomba principal com circuito independente e antichama vindo antes da chave geral da concessionária'
          ]
        },
        {
          id: 'srv-09-01-125',
          code: '09.01.125',
          name: 'Instalação de caixas de hidrantes completas com mangueiras tipo 2, esguichos reguláveis e chaves Storz',
          order: 125,
          categoryCode: '09',
          categoryName: 'Sistemas de Combate a Incêndio',
          subCategoryName: 'Rede de Hidrantes e Sprinklers (Grooved)',
          defaultResponsible: 'Técnico de Instalações PPCI',
          defaultEstimatedDays: 3,
          description: 'Fixação dos abrigos metálicos de hidrantes embutidos ou sobrepostos nas rotas de fuga com duas mangueiras de 15m revestidas internamente com borracha vulcanizada, chave Storz e esguicho.',
          checklist: [
            'Conferência da altura do registro de manobra tipo gaveta angular (1,30m do piso acabado)',
            'Inspeção do selo de conformidade da ABNT/INMETRO nas mangueiras e conexões',
            'Fechamento com porta envidraçada sinalizada com a palavra "INCÊNDIO" em letras vermelhas'
          ]
        }
      ]
    },
    {
      id: 'sub-09-02',
      code: '09.02',
      name: 'Alarme, Detecção e Iluminação de Emergência (PPCI)',
      order: 2,
      services: [
        {
          id: 'srv-09-02-126',
          code: '09.02.126',
          name: 'Infraestrutura de alarme de incêndio, botoeiras quebra-vidro, sinalizadores audiovisuais e detectores de fumaça',
          order: 126,
          categoryCode: '09',
          categoryName: 'Sistemas de Combate a Incêndio',
          subCategoryName: 'Alarme, Detecção e Iluminação de Emergência (PPCI)',
          defaultResponsible: 'Técnico em Sistemas de Alarme e Incêndio',
          defaultEstimatedDays: 4,
          description: 'Lançamento de cabo blindado trançado antichama (cabo shield) em laço fechado classe A ligando botoeiras de emergência, sirenes de 100dB com flash estroboscópico e central microprocessada.',
          checklist: [
            'Endereçamento digital individual de cada sensor ótico de fumaça e termo-velocimétrico',
            'Instalação de botoeiras de emergência manuais a cada 30m nos corredores de circulação',
            'Teste de comunicação da central de alarme com comutação automática para bateria em falta de energia'
          ]
        },
        {
          id: 'srv-09-02-127',
          code: '09.02.127',
          name: 'Instalação de iluminação de emergência com blocos autônomos e placas de sinalização fotoluminescente',
          order: 127,
          categoryCode: '09',
          categoryName: 'Sistemas de Combate a Incêndio',
          subCategoryName: 'Alarme, Detecção e Iluminação de Emergência (PPCI)',
          defaultResponsible: 'Eletricista / Bombeiro Civil',
          defaultEstimatedDays: 3,
          description: 'Fixação de luminárias de emergência autônomas de LED com autonomia mínima de 2 horas e colagem de placas fotoluminescentes sinalizando saídas, escadas enclausuradas e extintores (NBR 13434).',
          checklist: [
            'Teste de autonomia de corte de rede elétrica garantindo iluminância mínima de 3 lux em corredores e 5 lux em escadas',
            'Conferência do coeficiente de luminescência das placas (duração de luminescência superior a 60 minutos no escuro)',
            'Instalação de extintores portáteis de água pressurizada (AP) e pó químico seco (PQS) nos suportes normatizados'
          ]
        }
      ]
    }
  ]
};

export default CATEGORY_SISTEMAS_INCENDIO;
