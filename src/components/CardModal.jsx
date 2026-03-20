import ActionCapsule from './ActionCapsule';
import Card, { parseCards } from './Card';

const RANK_PRIORITY = {
  A: 12,
  K: 11,
  Q: 10,
  J: 9,
  T: 8,
  9: 7,
  8: 6,
  7: 5,
  6: 4,
  5: 3,
  4: 2,
  3: 1,
  2: 0,
};

function compareComboRanks(leftCombo, rightCombo) {
  const leftCards = parseCards(leftCombo);
  const rightCards = parseCards(rightCombo);
  const maxLength = Math.max(leftCards.length, rightCards.length);

  for (let index = 0; index < maxLength; index += 1) {
    const leftRank = RANK_PRIORITY[leftCards[index]?.rank] ?? -1;
    const rightRank = RANK_PRIORITY[rightCards[index]?.rank] ?? -1;

    if (leftRank !== rightRank) {
      return rightRank - leftRank;
    }
  }

  return leftCombo.localeCompare(rightCombo);
}

const styles = {
  shell: {
    position: 'absolute',
    top: 0,
    right: 'calc(100% + 16px)',
    width: '85%',
    height: '100%',
    zIndex: 30,
    pointerEvents: 'none',
  },
  panel: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: '22px',
    border: '1px solid rgba(255, 255, 255, 0.14)',
    background: 'rgba(5, 12, 20, 0.96)',
    backdropFilter: 'blur(22px)',
    boxShadow: '0 30px 80px rgba(0, 0, 0, 0.48)',
    overflow: 'hidden',
    pointerEvents: 'auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '12px',
    padding: '16px 18px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
    background: 'linear-gradient(180deg, rgba(255, 203, 120, 0.14) 0%, rgba(255, 255, 255, 0.02) 100%)',
  },
  titleWrap: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  eyebrow: {
    margin: 0,
    fontSize: '0.72rem',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: 'rgba(255, 212, 145, 0.8)',
  },
  title: {
    margin: 0,
    fontSize: '1rem',
    fontWeight: 700,
    color: '#fff7eb',
  },
  close: {
    border: '1px solid rgba(255, 255, 255, 0.14)',
    borderRadius: '999px',
    background: 'rgba(255, 255, 255, 0.06)',
    color: '#fff7eb',
    cursor: 'pointer',
    padding: '8px 12px',
    fontSize: '0.84rem',
  },
  list: {
    flex: 1,
    minHeight: 0,
    overflowY: 'auto',
    padding: '12px 14px 14px',
    display: 'flex',
    flexDirection: 'column',
    gap: '1px',
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    // padding: '8px 10px',
    borderRadius: '14px',
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(220, 192, 192, 0.05)',
  },
  cards: {
    // minWidth: '170px',
    display: 'flex',
    alignItems: 'center',
    gap: '2px',
    flexWrap: 'wrap',
  },
//   comboText: {
//     minWidth: '82px',
//     fontSize: '0.76rem',
//     letterSpacing: '0.04em',
//     textTransform: 'uppercase',
//     color: 'rgba(255, 255, 255, 0.6)',
//   },
  strategy: {
    // flex: 1,
    // display: 'flex',
    // justifyContent: 'flex-end',
  },
  empty: {
    margin: 0,
    padding: '22px 10px',
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
  },
};

function CardModal({ cardsByCombo, onClose }) {
  const entries = Object.entries(cardsByCombo ?? {}).sort(([left], [right]) =>
    compareComboRanks(left, right)
  );

  return (
    <div style={styles.shell}>
      <div style={styles.panel} role="dialog" aria-modal="true" aria-label="Card strategies">
        <div style={styles.header}>
          <div style={styles.titleWrap}>
            <p style={styles.eyebrow}>Specific Combos</p>
            <p style={styles.title}>{entries.length} strategy lines</p>
          </div>
          <button type="button" style={styles.close} onClick={onClose}>
            Close
          </button>
        </div>
        <div style={styles.list}>
          {entries.length === 0 ? (
            <p style={styles.empty}>No combo strategy data for this node.</p>
          ) : (
            entries.map(([combo, actions]) => (
              <div key={combo} style={styles.row}>
                <div style={styles.cards}>
                  {parseCards(combo).map((card, index) => (
                    <Card key={`${combo}-${index}`} rank={card.rank} suit={card.suit} scale={0.5} />
                  ))}
                </div>
                {/* <div style={styles.comboText}>{combo}</div> */}
                <div style={styles.strategy}>
                  <ActionCapsule actions={actions} shouldNormalize={false} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default CardModal;