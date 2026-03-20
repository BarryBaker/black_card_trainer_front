// import ActionCapsule from './ActionCapsule';
import { useEffect, useState } from 'react';
import TreeNode from './TreeNode';

const styles = {
  panel: {
    height: '100%',
    // minHeight: '380px',
    borderRadius: '18px',
    // border: '1px solid rgba(255, 255, 255, 0.12)',
    // background: 'rgba(255, 255, 255, 0.03)',
    // paddingTop: '16px',
    // overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
  },
  // empty: {
  //   margin: 0,
  //   color: 'rgba(255, 255, 255, 0.62)',
  //   fontSize: '0.92rem',
  // },
  // tree: {
  //   // display: 'flex',
  //   // flexDirection: 'column',
  //   // gap: '8px',
  //   paddingLeft: '4px',
  // },
};

function hasTaskHandInTree(node) {
  if (!node || typeof node !== 'object') {
    return false;
  }

  if (node.taskhand === true) {
    return true;
  }

  const children = Array.isArray(node.subtree) ? node.subtree : [];
  return children.some((child) => hasTaskHandInTree(child));
}

function initializeNodeVisibility(node) {
  const children = Array.isArray(node?.subtree) ? node.subtree : [];
  const nextChildren = children.map((child) => initializeNodeVisibility(child));
  const hasTaskHand =
    node?.taskhand === true || nextChildren.some((child) => hasTaskHandInTree(child));

  return {
    ...node,
    show: hasTaskHand ? true : Boolean(node?.show),
    subtree: nextChildren,
  };
}

function Tree({ nodes, onNodeCardsClick }) {
  const [treeNodes, setTreeNodes] = useState(Array.isArray(nodes) ? nodes : []);

  useEffect(() => {
    setTreeNodes(Array.isArray(nodes) ? nodes.map((node) => initializeNodeVisibility(node)) : []);
  }, [nodes]);

  const handleNodeClick = (clickedIndex) => {
    setTreeNodes((currentNodes) =>
      currentNodes.map((node, index) =>
        index === clickedIndex ? { ...node, show: !node?.show } : node
      )
    );
  };

  const handleMassClick = (event, node) => {
    event.stopPropagation();
    if (
      node?.cards &&
      typeof node.cards === 'object' &&
      Object.keys(node.cards).length > 0 &&
      onNodeCardsClick
    ) {
      onNodeCardsClick(node.cards);
    }
  };

  if (!Array.isArray(nodes)) {
    return (
      <div style={styles.panel}>
        <p style={styles.empty}></p>
      </div>
    );
  }

  return (
    <div style={styles.panel}>
      <div style={styles.tree}>
        {treeNodes.map((node, index) => (
          <div key={`${node?.best_feature ?? 'n/a'}-${index}`}>
            <TreeNode
              node={node}
              hasTaskHand={hasTaskHandInTree(node)}
              showSubtree={node?.show}
              onClick={() => handleNodeClick(index)}
              onMassClick={(event) => handleMassClick(event, node)}
            />
            {node?.subtree?.length > 0 && node.show && (
              <div style={{ marginLeft: '33px' }}>
                <Tree nodes={node?.subtree} onNodeCardsClick={onNodeCardsClick} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Tree;
