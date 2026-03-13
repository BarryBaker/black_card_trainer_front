const styles = {
  scoreCapsule: {
    padding: '12px 18px',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    borderRadius: '50px',
    background: 'rgba(255, 255, 255, 0.06)',
    color: '#f8f3e9',
    fontWeight: 500,
    fontSize: '0.95rem',
    cursor: 'default',
    display: 'inline-block',
  },
  scoreValue: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
  },
  label: {
    fontSize: '0.75rem',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: 'rgba(255, 255, 255, 0.62)',
  },
  mainScore: {
    fontSize: '1.2rem',
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
