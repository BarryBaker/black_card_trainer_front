import ActionCapsule from './ActionCapsule';
import TreeNode from './TreeNode';

const styles = {
  panel: {
    height: '100%',
    minHeight: '380px',
    borderRadius: '18px',
    // border: '1px solid rgba(255, 255, 255, 0.12)',
    background: 'rgba(255, 255, 255, 0.03)',
    paddingTop: '16px',
    overflowY: 'auto',
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

function Tree({ nodes, overall_actions }) {
  if (!Array.isArray(nodes)) {
    return (
      <div style={styles.panel}>
        <p style={styles.empty}>No tree data available.</p>
      </div>
    );
  }

  return (
    <div style={styles.panel}>
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        <ActionCapsule actions={overall_actions} />
      </div>

      <div style={styles.tree}>
        {nodes.map((node, index) => (
          <TreeNode key={`${node?.best_feature ?? 'n/a'}-${index}`} node={node} index={index} />
        ))}
      </div>
    </div>
  );
}

export default Tree;
