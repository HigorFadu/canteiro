/**
 * eapTypes.ts
 * Definições de tipos para a EAP (Estrutura Analítica do Projeto)
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
