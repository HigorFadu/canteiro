import React from 'react';
import { TreeNodeData } from '../../utils/treeUtils';

export interface TreeNodeProps {
  node: TreeNodeData;
  onAdd?: (parentPath: string) => void;
  onEdit?: (node: TreeNodeData) => void;
  onDelete?: (node: TreeNodeData) => void;
  onApontarServicos?: (fullPath: string) => void;
}

export const TreeNode: React.FC<TreeNodeProps> = ({
  node,
  onAdd,
  onEdit,
  onDelete,
  onApontarServicos,
}) => {
  const hasChildren = Boolean(node.children && node.children.length > 0);

  // Se o Node tiver 'children' (É uma pasta/grupo):
  // Renderize a tag HTML nativa <details className="mb-2 border rounded p-2"> (sem open para iniciar fechada).
  // Dentro de <summary className="font-bold flex justify-between cursor-pointer">,
  // exiba o nome do grupo E adicione o botão <button>+ Adicionar</button>.
  // Abaixo do summary, chame recursivamente <TreeNode/> para mapear os children.
  if (hasChildren) {
    return (
      <details className="mb-2 border rounded p-2 border-slate-800 bg-slate-900/70 text-white">
        <summary className="font-bold flex justify-between cursor-pointer items-center select-none py-1 gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-xs sm:text-sm font-bold text-white truncate">
              {node.name}
            </span>
            <span className="text-[10px] font-mono text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-full shrink-0">
              {node.children?.length} {node.children?.length === 1 ? 'item' : 'itens'}
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {onApontarServicos && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onApontarServicos(node.fullPath);
                }}
                className="px-2.5 py-1 text-xs font-semibold rounded bg-blue-600 hover:bg-blue-500 text-white cursor-pointer transition-colors shadow-sm"
              >
                🛠️ Apontar Serviço
              </button>
            )}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (onAdd) {
                  onAdd(node.fullPath);
                } else {
                  const novoNome = window.prompt('Nome do ambiente:');
                  if (novoNome && novoNome.trim()) {
                    window.dispatchEvent(
                      new CustomEvent('tree-node-add', {
                        detail: { parentPath: node.fullPath, name: novoNome.trim() },
                      })
                    );
                  }
                }
              }}
              className="px-2.5 py-1 text-xs font-semibold rounded bg-blue-600 hover:bg-blue-500 text-white cursor-pointer transition-colors shadow-sm flex items-center gap-1"
            >
              + Adicionar
            </button>
          </div>
        </summary>

        <div className="pl-3 sm:pl-4 pt-2 space-y-1 border-t border-slate-800/60 mt-1">
          {node.children!.map((child) => (
            <TreeNode
              key={child.id || child.fullPath}
              node={child}
              onAdd={onAdd}
              onEdit={onEdit}
              onDelete={onDelete}
              onApontarServicos={onApontarServicos}
            />
          ))}
        </div>
      </details>
    );
  }

  // Se o Node NÃO tiver 'children' (É o ambiente final/Leaf Node):
  // NÃO use a tag <details>. Renderize uma <div className="flex justify-between items-center pl-4 py-2 border-b">.
  return (
    <div className="flex justify-between items-center pl-4 py-2 border-b border-slate-800 hover:bg-slate-800/40 transition-colors gap-3">
      <div className="flex items-center gap-2 min-w-0 flex-1">
        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
        <span className="text-xs font-medium text-slate-200 truncate">
          {node.name}
        </span>
      </div>

      {/* Botões de Ação Exclusivos de Planejamento: Lápis e Lixeira (+ Apontar se habilitado) */}
      <div className="flex items-center gap-1.5 shrink-0">
        <button
          type="button"
          onClick={() => onEdit && onEdit(node)}
          className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer text-xs"
          title="Editar ambiente"
        >
          ✏️
        </button>

        <button
          type="button"
          onClick={() => onDelete && onDelete(node)}
          className="p-1 rounded text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer text-xs"
          title="Excluir ambiente"
        >
          🗑️
        </button>

        {onApontarServicos && (
          <button
            type="button"
            onClick={() => onApontarServicos(node.fullPath)}
            className="ml-2 px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-semibold transition-colors cursor-pointer"
          >
            🛠️ Apontar Serviço
          </button>
        )}
      </div>
    </div>
  );
};

export default TreeNode;
