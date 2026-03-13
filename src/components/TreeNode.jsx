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
};

function TreeNode({ node, index }) {
  const safeIndentation = Number.isFinite(node?.indentation) ? node.indentation : 0;
  const safeBestFeature = node?.best_feature ?? '';
  const isTaskHand = node?.taskhand === true;

  return (
    safeIndentation === 0 && (
      <div style={styles.row}>
        {Array.from({ length: safeIndentation }).map((_, i) => (
          <div
            key={i}
            style={i === 0 ? { ...styles.indent, ...styles.firstIndent } : styles.indent}
          />
        ))}
        <ActionCapsule actions={node?.action} label={safeBestFeature} />
        <div style={styles.signalWrap}>
          {isTaskHand ? (
            <div
              style={styles.signal}
              title="Task hand is in this group"
              aria-label="Task hand indicator"
            >
              *
            </div>
          ) : null}
        </div>
      </div>
    )
  );
}

export default TreeNode;
