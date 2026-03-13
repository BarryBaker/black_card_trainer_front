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
  empty: {
    margin: 0,
    color: 'rgba(255, 255, 255, 0.62)',
    fontSize: '0.92rem',
  },
  //   tree: {
  //     display: 'flex',
  //     flexDirection: 'column',
  //     gap: '8px',
  //   },
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

function Tree({ nodes }) {
  const [treeNodes, setTreeNodes] = useState(Array.isArray(nodes) ? nodes : []);

  useEffect(() => {
    setTreeNodes(Array.isArray(nodes) ? nodes : []);
  }, [nodes]);

  const handleNodeClick = (clickedIndex) => {
    setTreeNodes((currentNodes) =>
      currentNodes.map((node, index) =>
        index === clickedIndex ? { ...node, show: !node?.show } : node
      )
    );
  };

  if (!Array.isArray(nodes)) {
    return (
      <div style={styles.panel}>
        <p style={styles.empty}>No tree data available.</p>
      </div>
    );
  }

  return (
    <div style={styles.panel}>
      {/* <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        <ActionCapsule actions={overall_actions} />
      </div> */}

      <div style={styles.tree}>
        {treeNodes.map((node, index) => (
          <div key={`${node?.best_feature ?? 'n/a'}-${index}`}>
            <TreeNode
              node={node}
              hasTaskHand={hasTaskHandInTree(node)}
              showSubtree={node?.show}
              onClick={() => handleNodeClick(index)}
            />
            {node?.subtree?.length > 0 && node.show && (
              <div style={{ marginLeft: '40px' }}>
                <Tree nodes={node?.subtree} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Tree;
