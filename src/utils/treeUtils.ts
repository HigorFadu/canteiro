/**
 * treeUtils.ts
 * Utilitários para parsing de hierarquia e montagem de árvore de locais dinâmica (N níveis)
 */

export type LocationTreeObject = {
  [key: string]: LocationTreeObject;
};

export interface TreeNodeData {
  id: string;
  name: string;
  fullPath: string;
  children?: TreeNodeData[];
  originalId?: string;
  originalItem?: any;
}

/**
 * Converte um array plano de strings delimitadas por ' - ' em um Objeto aninhado.
 * Mantido para compatibilidade.
 */
export function buildTree(locationsArray: string[]): LocationTreeObject {
  const root: LocationTreeObject = {};

  locationsArray.forEach((locStr) => {
    if (!locStr || !locStr.trim()) return;
    const parts = locStr.split(' - ').map((p) => p.trim()).filter(Boolean);
    if (parts.length === 0) return;

    let current = root;
    parts.forEach((part) => {
      if (!current[part]) {
        current[part] = {};
      }
      current = current[part];
    });
  });

  return root;
}

/**
 * Converte um array plano de strings (ex: ['1º Andar - Apto 11 - Lavabo', '1º Andar - Apto 12'])
 * ou objetos com propriedade name/id em uma lista de TreeNodes aninhados com suporte a N níveis.
 */
export function buildTreeNodes(
  items: (string | { id?: string; name: string; [key: string]: any })[]
): TreeNodeData[] {
  const rootNodes: TreeNodeData[] = [];

  items.forEach((item, itemIdx) => {
    const rawPath = typeof item === 'string' ? item : item.name;
    const originalId = typeof item === 'string' ? `item-${itemIdx}` : item.id;
    if (!rawPath || !rawPath.trim()) return;

    const parts = rawPath.split(' - ').map((p) => p.trim()).filter(Boolean);
    if (parts.length === 0) return;

    let currentLevelList = rootNodes;
    let accumulatedPath = '';

    parts.forEach((part, partIdx) => {
      accumulatedPath = accumulatedPath ? `${accumulatedPath} - ${part}` : part;
      const isLeaf = partIdx === parts.length - 1;

      let existingNode = currentLevelList.find((n) => n.name === part);

      if (!existingNode) {
        existingNode = {
          id: `tree-node-${accumulatedPath}`,
          name: part,
          fullPath: accumulatedPath,
          children: isLeaf ? undefined : [],
          originalId: isLeaf ? originalId : undefined,
          originalItem: isLeaf && typeof item !== 'string' ? item : undefined,
        };
        currentLevelList.push(existingNode);
      } else {
        if (isLeaf) {
          existingNode.originalId = originalId;
          if (typeof item !== 'string') {
            existingNode.originalItem = item;
          }
        } else if (!existingNode.children) {
          existingNode.children = [];
        }
      }

      if (!isLeaf) {
        if (!existingNode.children) {
          existingNode.children = [];
        }
        currentLevelList = existingNode.children;
      }
    });
  });

  // Limpar arrays children vazios para garantir que folhas reais fiquem com children undefined
  const cleanupLeaves = (nodes: TreeNodeData[]) => {
    nodes.forEach((n) => {
      if (n.children && n.children.length === 0) {
        n.children = undefined;
      } else if (n.children && n.children.length > 0) {
        cleanupLeaves(n.children);
      }
    });
  };
  cleanupLeaves(rootNodes);

  return rootNodes;
}

export default buildTree;
