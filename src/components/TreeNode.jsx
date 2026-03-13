import ActionCapsule from './ActionCapsule';

const styles = {
  row: {
    display: 'flex',
    alignItems: 'center',
    // marginBottom: '10px',
  },
  indent: {
    alignSelf: 'stretch',
    width: '40px',
    flexShrink: 0,
    borderRight: '1px solid rgba(255, 255, 255, 0.12)',
  },
  firstIndent: {
    borderLeft: '1px solid rgba(255, 255, 255, 0.12)',
  },
  signalWrap: {
    width: '24px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: '6px',
    flexShrink: 0,
  },
  signal: {
    width: '16px',
    height: '16px',
    borderRadius: '999px',
    background: 'linear-gradient(180deg, #ffe29a 0%, #ffb340 100%)',
    border: '1px solid rgba(255, 255, 255, 0.65)',
    color: '#5f2700',
    fontSize: '11px',
    fontWeight: 900,
    lineHeight: '14px',
    textAlign: 'center',
    boxShadow: '0 1px 6px rgba(255, 160, 60, 0.45)',
  },
  mass: {
    marginLeft: '6px',
    fontSize: '0.78rem',
    color: 'rgba(255, 255, 255, 0.62)',
    width: '40px',
    // fontStyle: 'italic',
  },
  expandToggle: {
    width: '20px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: '2px',
    flexShrink: 0,
  },
  expandCaret: {
    width: 0,
    height: 0,
    borderTop: '5px solid transparent',
    borderBottom: '5px solid transparent',
    borderLeft: '7px solid rgba(255, 255, 255, 0.82)',
    transition: 'transform 0.18s ease',
    transformOrigin: '35% 50%',
  },
};




function TreeNode({ node, onClick,hasTaskHand, showSubtree }) {
  const safeIndentation = Number.isFinite(node?.indentation) ? node.indentation : 0;
  const safeBestFeature = node?.best_feature ?? '';
  const isTaskHand = node?.taskhand === true;

  return (
    safeIndentation === 0 && (
      <div
        style={{ ...styles.row, cursor: onClick ? 'pointer' : 'default' }}
        onClick={onClick}
      >
        {/* {Array.from({ length: safeIndentation }).map((_, i) => (
          <div
            key={i}
            style={i === 0 ? { ...styles.indent, ...styles.firstIndent } : styles.indent}
          />
        ))} */}
        <ActionCapsule actions={node?.action} label={safeBestFeature} />
        <div style={styles.mass}>
          {typeof node.mass === 'number' ? (node.mass * 100).toFixed(1) + '%' : ''}
        </div>
        {node?.subtree?.length > 0 && (
          <div
            style={styles.expandToggle}
            title={showSubtree ? 'Collapse' : 'Expand'}
            aria-label={showSubtree ? 'Collapse subtree' : 'Expand subtree'}
          >
            <div
              style={{
                ...styles.expandCaret,
                transform: showSubtree ? 'rotate(90deg)' : 'rotate(0deg)',
              }}
            />
          </div>
        )}
        <div style={styles.signalWrap}>
          {((isTaskHand && node.subtree.length === 0) || (hasTaskHand && !showSubtree)) && (
            <div
              style={styles.signal}
              title="Task hand is in this group"
              aria-label="Task hand indicator"
            >
              *
            </div>
          )}
        </div>
      </div>
    )
  );
}

export default TreeNode;
