import { sortActions } from '../utils/actionSorting';

const styles = {
  capsule: {
    position: 'relative',
    width: '120px',
    minWidth: '120px',
    height: '20px',
    borderRadius: '10px',
    overflow: 'hidden',
    display: 'flex',
    border: '1px solid rgba(255, 255, 255, 0.24)',
    boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.22), 0 8px 18px rgba(0, 0, 0, 0.28)',
    background: 'rgba(0, 0, 0, 0.2)',
  },
  label: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff6e8',
    fontWeight: 600,
    fontSize: '0.78rem',
    letterSpacing: '0.02em',
    textShadow: '0 1px 2px rgba(0, 0, 0, 0.35)',
    pointerEvents: 'none',
  },
};

const segmentPalette = [
  'linear-gradient(180deg, #ffd18c 0%, #f3932d 100%)',
  'linear-gradient(180deg, #ff9556 0%, #e14b2f 100%)',
  'linear-gradient(180deg, #ce3119 0%, #7f1813 100%)',
  'linear-gradient(180deg, #ffd764 0%, #cc7c1f 100%)',
  'linear-gradient(180deg, #f4b57c 0%, #bc3d2e 100%)',
];

const actionColors = {
  F: 'linear-gradient(180deg, #6e9affb7 0%, #1f2a51c2 100%)',

  C: 'linear-gradient(180deg, #c1a44c 0%, #4b401f 100%)',
  R20: 'linear-gradient(180deg, #db5757 0%, #561b1b 100%)',
  R25: 'linear-gradient(180deg, #eb7979 0%, #5f2e2e 100%)',
  R33: 'linear-gradient(180deg, #d86767 0%, #662929 100%)',
   R40: 'linear-gradient(180deg, #d86767 0%, #662929 100%)',
  R50: 'linear-gradient(180deg, #b36060 0%, #422121 100%)',
  R66: 'linear-gradient(180deg, #9b4d4d 0%, #482525 100%)',
  R75: 'linear-gradient(180deg, #c05454e1 0%, #511f1f 100%)',
  R100: 'linear-gradient(180deg, #963a2c 0%, #3c0f0f 100%)',

  A: 'linear-gradient(180deg, #ce3419 0%, #551b16 100%)',
};

function getSegmentBackground(action, index) {
  return actionColors[action] || segmentPalette[index % segmentPalette.length];
}

function buildSegments(actions, shouldNormalize = true) {
  if (!actions || typeof actions !== 'object') {
    return [];
  }

  const orderedActions = sortActions(Object.keys(actions));
  const rawSegments = orderedActions.map((action) => ({
    action,
    value: Math.max(0, Number(actions[action]) || 0),
  }));

  if (!shouldNormalize) {
    return rawSegments.map((segment) => ({
      ...segment,
      widthPercent: segment.value,
    }));
  }

  const total = rawSegments.reduce((sum, segment) => sum + segment.value, 0);

  if (total <= 0) {
    const equalWidth = rawSegments.length > 0 ? 100 / rawSegments.length : 100;
    return rawSegments.map((segment) => ({
      ...segment,
      widthPercent: equalWidth,
    }));
  }

  return rawSegments.map((segment) => ({
    ...segment,
    widthPercent: (segment.value / total) * 100,
  }));
}

function ActionCapsule({ actions, label = '', shouldNormalize = true }) {
  const segments = buildSegments(actions, shouldNormalize);
  // console.log('Rendering ActionCapsule with actions:', actions, 'normalized segments:', segments);

  return (
    <div style={styles.capsule}>
      {segments.map((segment, index) => (
        <div
          key={`${segment.action}-${index}`}
          style={{
            width: `${segment.widthPercent}%`,
            background: getSegmentBackground(segment.action, index),
          }}
          title={`${segment.action}: ${(shouldNormalize ? (segment.value * 100).toFixed(1) : segment.value.toFixed(1))}%`}
        />
      ))}
      {label ? <div style={styles.label}>{label}</div> : null}
    </div>
  );
}

export default ActionCapsule;
