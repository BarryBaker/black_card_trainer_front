const styles = {
  scoreCapsule: {
    display: 'flex',
    flexDirection: 'column',
    width: '50%',
    alignItems: 'center',
    justifyContent: 'center', // Center children vertically
    padding: '0px 20px',
    // border: 0,
    border: '1px solid rgba(255, 255, 255, 0.12)', // Standard border draws outside content box
    boxSizing: 'border-box', // Ensures border is included inside the element's dimensions
    //  padding: '12px 18px',
    borderRadius: '50px',
    // borderRadius: '999px',
    background: 'rgba(255, 255, 255, 0.06)',
    color: '#f8f3e9',
    fontWeight: 500,
    fontSize: '0.95rem',
    cursor: 'default',
    // display: 'inline-block',
  },
  scoreValue: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: '10px',
  },
  label: {
    fontSize: '0.55rem',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: 'rgba(255, 255, 255, 0.62)',
  },
  mainScore: {
    fontSize: '1rem',
    fontWeight: 600,
  },
  percentage: {
    fontSize: '0.85rem',
    color: '#ffca76',
    fontWeight: 600,
  },
};

export default function ScoreCapsule({ score }) {
  if (!score || score.total === 0) {
    return null;
  }

  const percentage = Math.round((score.correct / score.total) * 100);

  return (
    <div style={styles.scoreCapsule}>
      <div style={styles.scoreValue}>
        <p style={styles.label}>Score</p>
        <div style={styles.mainScore}>
          {score.correct}/{score.total}
        </div>
        <div style={styles.percentage}>{percentage}%</div>
      </div>
    </div>
  );
}
