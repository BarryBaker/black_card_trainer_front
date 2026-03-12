
import { sortActions } from '../utils/actionSorting'

const styles = {
  row: {
    display: 'flex',
    alignItems: 'center',
    // marginBottom: '10px',
  },
  indent: {
    alignSelf: 'stretch',
    width: '30px',
    flexShrink: 0,
    borderRight: '1px solid rgba(255, 255, 255, 0.12)',
  },
   firstIndent: {
   
     borderLeft: '1px solid rgba(255, 255, 255, 0.12)',
  },
  capsule: {
    position: 'relative',
    width: '120px',
    height: '20px',
    borderRadius: '10px',
    overflow: 'hidden',
    display: 'flex',
    border: '1px solid rgba(255, 255, 255, 0.24)',
    boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.22), 0 8px 18px rgba(0, 0, 0, 0.28)',
    background: 'rgba(0, 0, 0, 0.2)',
  },
//   emptyCapsule: {opacity: 0.7},
  label: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff6e8',
    fontWeight: 700,
    fontSize: '0.78rem',
    letterSpacing: '0.02em',
    textShadow: '0 1px 2px rgba(0, 0, 0, 0.65)',
    pointerEvents: 'none',
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
}

const segmentPalette = [
  'linear-gradient(180deg, #ffd18c 0%, #f3932d 100%)',
  'linear-gradient(180deg, #ff9556 0%, #e14b2f 100%)',
  'linear-gradient(180deg, #ce3119 0%, #7f1813 100%)',
  'linear-gradient(180deg, #ffd764 0%, #cc7c1f 100%)',
  'linear-gradient(180deg, #f4b57c 0%, #bc3d2e 100%)',
]

function normalizeSegments(actionMap) {
  if (!actionMap || typeof actionMap !== 'object') {
    return []
  }

  const orderedActions = sortActions(Object.keys(actionMap))
  const rawSegments = orderedActions.map(action => ({
    action,
    value: Number(actionMap[action]) || 0,
  }))
  const total = rawSegments.reduce((sum, segment) => sum + segment.value, 0)

  if (total <= 0) {
    const equalWidth = rawSegments.length > 0 ? 100 / rawSegments.length : 100
    return rawSegments.map(segment => ({
      ...segment,
      widthPercent: equalWidth,
    }))
  }

  return rawSegments.map(segment => ({
    ...segment,
    widthPercent: (segment.value / total) * 100,
  }))
}

function TreeNode({ node }) {
  const safeIndentation = Number.isFinite(node?.indentation) ? node.indentation : 0
  const safeBestFeature = node?.best_feature ?? ''
  const segments = normalizeSegments(node?.action)
  const isTaskHand = node?.taskhand === true

  return (
    <div style={styles.row}>
      {Array.from({ length: safeIndentation }).map((_, i) => (
        <div key={i} style={i === 0 ? { ...styles.indent, ...styles.firstIndent } : styles.indent} />
      ))}
      <div style={node.cards.length === 0 ? { ...styles.capsule, ...styles.emptyCapsule } : styles.capsule}>
        {segments.map((segment, index) => (
          <div
            key={`${segment.action}-${index}`}
            style={{
              width: `${segment.widthPercent}%`,
              background: segmentPalette[index % segmentPalette.length],
            }}
            title={`${segment.action}: ${(segment.value * 100).toFixed(1)}%`}
          />
        ))}
        <div style={styles.label}>{safeBestFeature}</div>
      </div>
      <div style={styles.signalWrap}>
        {isTaskHand ? (
          <div style={styles.signal} title="Task hand is in this group" aria-label="Task hand indicator">
            *
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default TreeNode
