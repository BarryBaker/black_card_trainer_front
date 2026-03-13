import PokerTable from './PokerTable';
import Tree from './Tree';
import ActionCapsule from './ActionCapsule';
import ScoreCapsule from './ScoreCapsule';
import Card, { parseCards } from './Card';
import { sortActions } from '../utils/actionSorting';

const styles = {
  panel: {
    // marginTop: '28px',
    width: '900px',
    marginLeft: 'auto',
    marginRight: 'auto',
    padding: '24px',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '28px',
    background: 'rgba(7, 16, 25, 0.78)',
    backdropFilter: 'blur(18px)',
    boxShadow: '0 24px 60px rgba(0, 0, 0, 0.34)',
  },
  heading: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '24px',
    flexWrap: 'wrap',
  },
  kicker: {
    margin: 0,
    textTransform: 'uppercase',
    letterSpacing: '0.16em',
    fontSize: '0.74rem',
    color: '#ffca76',
  },
  title: {
    margin: '4px 0 0',
    // fontSize: 'clamp(1.8rem, 3vw, 2.8rem)',
  },
  secondaryAction: {
    padding: '12px 18px',
    border: 0,
    borderRadius: '999px',
    cursor: 'pointer',
    background: 'rgba(255, 255, 255, 0.08)',
    color: '#f8f3e9',
  },
  actionsWrap: {
    marginTop: '24px',
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px',
    justifyContent: 'center',
  },
  actionButton: {
    minWidth: '46px',
    padding: '8px 14px',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    borderRadius: '50px',
    background: 'rgba(255, 255, 255, 0.06)',
    color: '#f8f3e9',
    fontWeight: 500,
    fontSize: '0.95rem',
    cursor: 'pointer',
  },
  splitRow: {
    marginTop: '20px',
    display: 'flex',
    gap: '22px',
    alignItems: 'stretch',
  },
  splitPaneTable: {
    flex: 10,
    minWidth: 0,
  },
  splitPaneTree: {
    flex: 8,
    minWidth: 0,
    height: '750px',
    overflowY: 'auto',
    overflowX: 'hidden',
     background: 'rgba(255, 255, 255, 0.03)',
  },
  previousNodeWrap: {
    margin: '0 0 14px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  previousNodeLabel: {
    margin: 0,
    fontSize: '0.74rem',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: 'rgba(255, 255, 255, 0.62)',
  },
};

function TrainerView({
  taskPayload,
  onBack,
  isGeneratingTask,
  prevTaskPayload,
  nextTaskPayload,
  prevTree,
  nextTree,
  tree,
  handleGenerateTask,
  answer,
  score,
}) {
  if (!taskPayload) {
    return null;
  }

  const { stack, pot, pos, board, id, street, line, hero, task } = taskPayload;

  const holecards = Object.keys(task)[0];
  const titleText = line === '' ? 'Hero starts the action' : `Actions: ${line}`;
  const actions = sortActions(Object.keys(task[holecards]));
  const previousActions = Object.values(prevTaskPayload?.task ?? {})[0] ?? null;
  const previousMaxAction = previousActions
    ? Object.entries(previousActions).reduce(
        (maxKey, [key, value]) => (value > previousActions[maxKey] ? key : maxKey),
        Object.keys(previousActions)[0]
      )
    : null;

  return (
    <section style={styles.panel}>
      <div style={styles.heading}>
        <div>
          <p style={styles.kicker}>Training Surface</p>
          <p style={styles.title}>
            {pot} {stack} BB
          </p>
        </div>
        <button type="button" style={styles.secondaryAction} onClick={onBack}>
          Edit Filters
        </button>

        <div>
          {previousActions ? (
            <div style={styles.previousNodeWrap}>
              {/* <p style={styles.previousNodeLabel}>Previous Mix</p> */}
              <ActionCapsule actions={previousActions} />
              <span>Top: {previousMaxAction}</span>
              <span>Answer: {answer}</span>
              <span style={{ display: 'flex', gap: 2 }}>
                {parseCards(prevTaskPayload.board).map((c, i) => (
                  <Card key={i} rank={c.rank} suit={c.suit} scale={0.5} />
                ))}
              </span>
              <span style={{ display: 'flex', gap: 2 }}>
                {parseCards(Object.keys(prevTaskPayload.task)[0]).map((c, i) => (
                  <Card key={i} rank={c.rank} suit={c.suit} scale={0.5} />
                ))}
              </span>
            </div>
          ) : null}
        </div>
      </div>

      <div style={styles.splitRow}>
        <div style={styles.splitPaneTable}>
          <PokerTable
            stack={stack}
            pot={pot}
            pos={pos}
            line={line}
            board={board}
            hero={hero}
            holecards={holecards}
          />
          <div style={styles.actionsWrap}>
            {actions.map((action) => (
              <button
                key={action}
                type="button"
                style={styles.actionButton}
                onClick={() => handleGenerateTask(action)}
                disabled={isGeneratingTask || !nextTaskPayload}
              >
                {action}
              </button>
            ))}
          </div>
          <ScoreCapsule score={score} />
        </div>
        <div style={styles.splitPaneTree}>
          <Tree nodes={tree?.tree} />
        </div>
      </div>
    </section>
  );
}

export default TrainerView;
