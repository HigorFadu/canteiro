/**
 * disciplineUtils.ts
 * Utilitário de ordenação construtiva e metadados visuais de Disciplinas de Engenharia Civil.
 */

export interface DisciplineMeta {
  order: number;
  icon: string;
}

/**
 * Retorna a ordem construtiva e o ícone representativo de uma disciplina baseado em palavras-chave.
 * Sequência construtiva padrão:
 *  1. Preliminares / Terraplenagem / Canteiro -> order: 1, icon: '🚜'
 *  2. Fundações e Infraestrutura -> order: 2, icon: '🕳️'
 *  3. Estrutura e Supraestrutura -> order: 3, icon: '🏗️'
 *  4. Alvenaria e Vedação -> order: 4, icon: '🧱'
 *  5. Cobertura / Impermeabilização -> order: 5, icon: '🏠'
 *  6. Instalações Elétricas / Lógica -> order: 6, icon: '⚡'
 *  7. Instalações Hidráulicas / Pluviais -> order: 7, icon: '💧'
 *  8. Gás (GLP/GN) -> order: 8, icon: '🔥'
 *  9. Combate a Incêndio (PPCI) -> order: 9, icon: '🧯'
 * 10. Climatização (AVAC) -> order: 10, icon: '❄️'
 * 11. Revestimentos / Reboco / Gesso -> order: 11, icon: '🪨'
 * 12. Esquadrias / Vidros / Marcenaria -> order: 12, icon: '🚪'
 * 13. Pisos / Louças / Bancadas -> order: 13, icon: '🚽'
 * 14. Pintura / Acabamentos -> order: 14, icon: '🎨'
 * 99. Limpeza / Entrega / Outros -> order: 99, icon: '✨'
 */
export function getDisciplineMeta(
  disciplineOrName: string | { technicalName?: string; name?: string; id?: string }
): DisciplineMeta {
  const name = (
    typeof disciplineOrName === 'string'
      ? disciplineOrName
      : disciplineOrName?.technicalName || disciplineOrName?.name || disciplineOrName?.id || ''
  )
    .toLowerCase()
    .trim();

  // 1. Preliminares / Terraplenagem / Canteiro -> order: 1, icon: '🚜'
  if (
    name.includes('preliminar') ||
    name.includes('terraplenagem') ||
    name.includes('canteiro') ||
    name.includes('locação') ||
    name.includes('locacao') ||
    name.includes('demolição') ||
    name.includes('demolicao')
  ) {
    return { order: 1, icon: '🚜' };
  }

  // 2. Fundações e Infraestrutura -> order: 2, icon: '🏗️'
  if (
    name.includes('fundação') ||
    name.includes('fundacao') ||
    name.includes('fundações') ||
    name.includes('fundacoes') ||
    name.includes('infraestrutura') ||
    name.includes('estaca') ||
    name.includes('sapata')
  ) {
    return { order: 2, icon: '🏗️' };
  }

  // 3. Estrutura e Supraestrutura -> order: 3, icon: '🏗️'
  if (
    name.includes('supraestrutura') ||
    name.includes('estrutura') ||
    name.includes('concreto') ||
    name.includes('pilar') ||
    name.includes('viga') ||
    name.includes('laje')
  ) {
    return { order: 3, icon: '🏗️' };
  }

  // 4. Alvenaria e Vedação -> order: 4, icon: '🧱'
  if (
    name.includes('alvenaria') ||
    name.includes('vedação') ||
    name.includes('vedacao') ||
    name.includes('vedações') ||
    name.includes('vedacoes') ||
    name.includes('parede')
  ) {
    return { order: 4, icon: '🧱' };
  }

  // 5. Cobertura / Impermeabilização -> order: 5, icon: '🏠'
  if (
    name.includes('cobertura') ||
    name.includes('impermeabilização') ||
    name.includes('impermeabilizacao') ||
    name.includes('telhad') ||
    name.includes('calha')
  ) {
    return { order: 5, icon: '🏠' };
  }

  // 6. Instalações Elétricas / Lógica -> order: 6, icon: '⚡'
  if (
    name.includes('elétric') ||
    name.includes('eletric') ||
    name.includes('comando') ||
    name.includes('automação') ||
    name.includes('automacao') ||
    name.includes('lógica') ||
    name.includes('logica') ||
    name.includes('cabeamento')
  ) {
    return { order: 6, icon: '⚡' };
  }

  // 7. Instalações Hidráulicas / Pluviais -> order: 7, icon: '💧'
  if (
    name.includes('hidráulic') ||
    name.includes('hidraulic') ||
    name.includes('pluvia') ||
    name.includes('esgoto') ||
    name.includes('sanitári') ||
    name.includes('sanitari') ||
    name.includes('hidrossanit') ||
    name.includes('água') ||
    name.includes('agua')
  ) {
    return { order: 7, icon: '💧' };
  }

  // 8. Gás (GLP/GN) -> order: 8, icon: '🔥'
  if (
    name.includes('gás') ||
    name.includes('gas') ||
    name.includes('glp') ||
    name.includes('gn')
  ) {
    return { order: 8, icon: '🔥' };
  }

  // 9. Combate a Incêndio (PPCI) -> order: 9, icon: '🧯'
  if (
    name.includes('incêndio') ||
    name.includes('incendio') ||
    name.includes('ppci') ||
    name.includes('sprinkler') ||
    name.includes('extintor') ||
    name.includes('hidrante')
  ) {
    return { order: 9, icon: '🧯' };
  }

  // 10. Climatização (AVAC) -> order: 10, icon: '❄️'
  if (
    name.includes('climatização') ||
    name.includes('climatizacao') ||
    name.includes('avac') ||
    name.includes('ar condicionado') ||
    name.includes('ventilação') ||
    name.includes('ventilacao') ||
    name.includes('exaustão') ||
    name.includes('exaustao')
  ) {
    return { order: 10, icon: '❄️' };
  }

  // 11. Revestimentos / Reboco / Gesso -> order: 11, icon: '🛠️'
  if (
    name.includes('revestimento') ||
    name.includes('reboco') ||
    name.includes('gesso') ||
    name.includes('emboço') ||
    name.includes('emboco') ||
    name.includes('forro')
  ) {
    return { order: 11, icon: '🛠️' };
  }

  // 12. Esquadrias / Vidros / Marcenaria -> order: 12, icon: '🚪'
  if (
    name.includes('esquadria') ||
    name.includes('vidro') ||
    name.includes('marcenaria') ||
    name.includes('porta') ||
    name.includes('janela') ||
    name.includes('serralheria')
  ) {
    return { order: 12, icon: '🚪' };
  }

  // 13. Pisos / Louças / Bancadas -> order: 13, icon: '🚽'
  if (
    name.includes('piso') ||
    name.includes('louça') ||
    name.includes('louca') ||
    name.includes('bancada') ||
    name.includes('metal') ||
    name.includes('metais') ||
    name.includes('granito') ||
    name.includes('mármore') ||
    name.includes('marmore')
  ) {
    return { order: 13, icon: '🚽' };
  }

  // 14. Pintura / Acabamentos -> order: 14, icon: '🎨'
  if (
    name.includes('pintura') ||
    name.includes('acabamento') ||
    name.includes('textura') ||
    name.includes('verniz')
  ) {
    return { order: 14, icon: '🎨' };
  }

  // 99. Limpeza / Entrega / Outros -> order: 99, icon: '✨'
  if (
    name.includes('limpeza') ||
    name.includes('entrega') ||
    name.includes('comissionamento') ||
    name.includes('vistoria') ||
    name.includes('outros')
  ) {
    return { order: 99, icon: '✨' };
  }

  return { order: 99, icon: '✨' };
}
