import React from 'react';
import { Card } from '../../../components/ui/Card';
import { useCostCenterTree } from '../hooks';
import { Spinner } from '../../../components/ui/Spinner';
import type { CostCenter, CostCenterTree } from '../types';

interface CostCenterTreeViewProps {
  onCostCenterSelect?: (costCenter: CostCenter) => void;
  activeOnly?: boolean;
  className?: string;
}

interface TreeNodeProps {
  node: CostCenterTree;
  level: number;
  onSelect?: (costCenter: CostCenter) => void;
}

const TreeNode: React.FC<TreeNodeProps> = ({ node, level, onSelect }) => {
  const [isExpanded, setIsExpanded] = React.useState(level < 2);

  const getLevelColor = (nodeLevel: number) => {
    const colors = [
      'text-blue-700',   // Nivel 0
      'text-green-700',  // Nivel 1
      'text-yellow-700', // Nivel 2
      'text-purple-700', // Nivel 3
      'text-pink-700',   // Nivel 4
      'text-gray-700'    // Nivel 5+
    ];
    return colors[nodeLevel] || colors[colors.length - 1];
  };

  const getIndentation = (nodeLevel: number) => {
    return nodeLevel * 20;
  };

  const handleNodeClick = () => {
    if (onSelect) {
      // Simular un objeto CostCenter completo basado en CostCenterTree
      const costCenter: CostCenter = {
        id: node.id,
        code: node.code,
        name: node.name,
        level: node.level,
        is_active: node.is_active,
        // Propiedades que no están en CostCenterTree pero son requeridas
        description: '',
        parent_id: undefined,
        created_at: '',
        updated_at: '',
        full_code: node.code,
        is_leaf: node.children.length === 0,
        parent_name: undefined,
        children_count: node.children.length,
        movements_count: 0
      };
      onSelect(costCenter);
    }
  };

  return (
    <div>
      <div 
        className={`flex items-center py-2 px-2 hover:bg-gray-50 cursor-pointer rounded-md ${
          !node.is_active ? 'opacity-60' : ''
        }`}
        style={{ paddingLeft: `${getIndentation(level) + 8}px` }}
        onClick={handleNodeClick}
      >
        {/* Icono de expansión */}
        {node.children.length > 0 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="mr-2 p-1 hover:bg-gray-200 rounded"
          >
            {isExpanded ? (
              <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        )}

        {/* Icono de centro de costo */}
        <div className="mr-3">
          {node.children.length > 0 ? (
            <svg className={`w-5 h-5 ${getLevelColor(level)}`} fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
            </svg>
          ) : (
            <svg className={`w-5 h-5 ${getLevelColor(level)}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          )}
        </div>

        {/* Información del centro de costo */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <code className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
              {node.code}
            </code>
            <span className={`text-sm font-medium ${getLevelColor(level)} truncate`}>
              {node.name}
            </span>
          </div>
          
          <div className="flex items-center space-x-2 mt-1">
            <span className="text-xs text-gray-500">Nivel {node.level}</span>
            {node.children.length > 0 && (
              <span className="text-xs text-gray-500">
                {node.children.length} hijo{node.children.length !== 1 ? 's' : ''}
              </span>
            )}
            {!node.is_active && (
              <span className="text-xs text-red-500 font-medium">Inactivo</span>
            )}
          </div>
        </div>
      </div>

      {/* Nodos hijos */}
      {isExpanded && node.children.length > 0 && (
        <div>
          {node.children.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              level={level + 1}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const CostCenterTreeView: React.FC<CostCenterTreeViewProps> = ({
  onCostCenterSelect,
  activeOnly = true,
  className = ''
}) => {
  const { costCenterTree, loading, error, refetch } = useCostCenterTree(activeOnly);

  if (loading) {
    return (
      <Card className={className}>
        <div className="card-body text-center py-8">
          <Spinner size="lg" />
          <p className="text-gray-600 mt-2">Cargando estructura de centros de costo...</p>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <div className="card-body text-center py-8">
          <p className="text-red-600 mb-4">Error al cargar la estructura: {error}</p>
          <button
            onClick={() => refetch()}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Reintentar
          </button>
        </div>
      </Card>
    );
  }

  if (costCenterTree.length === 0) {
    return (
      <Card className={className}>
        <div className="card-body text-center py-8">
          <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" />
          </svg>
          <p className="text-gray-500">No hay centros de costo disponibles</p>
          {!activeOnly && (
            <p className="text-gray-400 text-sm mt-2">
              Asegúrate de que existan centros de costo creados
            </p>
          )}
        </div>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <div className="card-header">
        <div className="flex justify-between items-center">
          <h3 className="card-title">Estructura de Centros de Costo</h3>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              {costCenterTree.length} centro{costCenterTree.length !== 1 ? 's' : ''} raíz
            </span>
            <button
              onClick={() => refetch()}
              className="text-blue-600 hover:text-blue-700 text-sm"
              title="Actualizar estructura"
            >
              🔄
            </button>
          </div>
        </div>
      </div>
      
      <div className="card-body">
        <div className="space-y-1 max-h-96 overflow-y-auto">
          {costCenterTree.map((rootNode) => (
            <TreeNode
              key={rootNode.id}
              node={rootNode}
              level={0}
              onSelect={onCostCenterSelect}
            />
          ))}
        </div>
        
        {/* Leyenda */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 mb-2">Leyenda:</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-blue-700" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
              </svg>
              <span className="text-gray-600">Centro padre</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="text-gray-600">Centro hoja</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
