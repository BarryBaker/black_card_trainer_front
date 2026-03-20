import ActionCapsule from './ActionCapsule';
import Card, { parseCards } from './Card';

const styles = {
  wrap: {
    marginTop: '16px',
    // height: '295px',
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    overflowY: 'auto',
    scrollbarGutter: 'stable',
    flex: 1,
    minHeight: '200px',
  },
  row: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    // padding: '8px 10px',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '14px',
    background: 'rgba(255, 255, 255, 0.035)',
    color: '#f8f3e9',
    cursor: 'pointer',
    textAlign: 'left',
  },
  cards: {
    display: 'flex',
    alignItems: 'center',
    gap: '2px',
    minWidth: 'fit-content',
  },
  text: {
    flex: 1,
    minWidth: 0,
    fontSize: '0.86rem',
    color: 'rgba(248, 243, 233, 0.82)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
};

function isAnswerCorrect(taskPayload) {
  const previousActions = Object.values(taskPayload?.task ?? {})[0] ?? null;
  const previousMaxAction = previousActions
    ? Object.entries(previousActions).reduce(
        (maxKey, [key, value]) => (value > previousActions[maxKey] ? key : maxKey),
        Object.keys(previousActions)[0]
      )
    : null;
  return previousMaxAction === taskPayload?.answerGiven;
}

function SessionTaskHistory({ taskPayloads, onTaskClick }) {
  if (taskPayloads.length === 0) {
    return null;
  }

  return (
    <div style={styles.wrap}>
      {[...taskPayloads].reverse().map((taskPayload, index) => {
        const taskActions = Object.values(taskPayload?.task ?? {})[0] ?? null;
        const holecards = Object.keys(taskPayload?.task ?? {})[0] ?? '';
        const scale = 0.4;
        return (
          <button
            key={`${taskPayload?.id ?? 'task'}-${index}`}
            type="button"
            style={styles.row}
            onClick={() => onTaskClick(taskPayload)}
          >
            <ActionCapsule actions={taskActions} shouldNormalize={false} />
            <span style={styles.cards}>
              {parseCards(taskPayload?.board).map((card, cardIndex) => (
                <Card
                  key={`board-${taskPayload?.id ?? index}-${cardIndex}`}
                  rank={card.rank}
                  suit={card.suit}
                  scale={scale}
                />
              ))}
            </span>
            <span style={styles.cards}>
              {parseCards(holecards).map((card, cardIndex) => (
                <Card
                  key={`hero-${taskPayload?.id ?? index}-${cardIndex}`}
                  rank={card.rank}
                  suit={card.suit}
                  scale={scale}
                />
              ))}
            </span>
            <span style={styles.text}>{taskPayload?.line}</span>
            <span
              // title={isAnswerCorrect(taskPayload, taskPayload.answerGiven) ? 'Correct!' : 'Incorrect'}
              style={{
                fontSize: '1.1rem',
                lineHeight: 1,
                color: isAnswerCorrect(taskPayload) ? '#4cde80' : '#ff5f5f',
              }}
            >
              {isAnswerCorrect(taskPayload) ? '✓' : '✗'}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export default SessionTaskHistory;
