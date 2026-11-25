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
  trailingControl: {
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

function TreeNode({ node, onClick, onMassClick, hasTaskHand, showSubtree }) {
  const safeIndentation = Number.isFinite(node?.indentation) ? node.indentation : 0;
  const safeBestFeature = node?.best_feature ?? '';
  const isTaskHand = node?.taskhand === true;
  const hasChildren = Array.isArray(node?.subtree) && node.subtree.length > 0;
  const hasCards =
    node?.cards && typeof node.cards === 'object' && Object.keys(node.cards).length > 0;
  const handleToggle = hasChildren ? onClick : undefined;
  const toggleCursor = handleToggle ? 'pointer' : 'default';
  const handleMassClick = hasCards ? onMassClick : undefined;

  return (
    safeIndentation === 0 && (
      <div style={styles.row}>
        {/* {Array.from({ length: safeIndentation }).map((_, i) => (
          <div
            key={i}
            style={i === 0 ? { ...styles.indent, ...styles.firstIndent } : styles.indent}
          />
        ))} */}
        <div style={{ cursor: toggleCursor }} onClick={handleToggle}>
          <ActionCapsule actions={node?.action} label={safeBestFeature} />
        </div>
        <div style={{ ...styles.mass, cursor: toggleCursor }} onClick={handleToggle}>
          {typeof node.mass === 'number' ? (node.mass * 100).toFixed(1) + '%' : ''}
        </div>
        {hasChildren ? (
          <button
            type="button"
            className="tree-node-control"
            style={styles.trailingControl}
            title={showSubtree ? 'Collapse' : 'Expand'}
            aria-label={showSubtree ? 'Collapse subtree' : 'Expand subtree'}
            aria-expanded={Boolean(showSubtree)}
            onClick={handleToggle}
            disabled={!handleToggle}
          >
            <span
              aria-hidden="true"
              style={{
                ...styles.expandCaret,
                transform: showSubtree ? 'rotate(90deg)' : 'rotate(0deg)',
              }}
            />
          </button>
        ) : (
          <button
            type="button"
            className="tree-node-control tree-node-card-list"
            style={styles.trailingControl}
            title={handleMassClick ? 'Show cards' : 'No cards available'}
            aria-label="Show cards"
            onClick={handleMassClick}
            disabled={!handleMassClick}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.25"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <rect x="3" y="1.5" width="10" height="13" rx="1.5" />
              <path d="M5.5 5h5m-5 3h5m-5 3H9" />
            </svg>
          </button>
        )}
        <div style={styles.signalWrap}>
          {((isTaskHand && !hasChildren) || (hasTaskHand && !showSubtree)) && (
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
