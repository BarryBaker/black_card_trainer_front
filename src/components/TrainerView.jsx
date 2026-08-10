import { useEffect, useState } from 'react';
import PokerTable from './PokerTable';
import Tree from './Tree';
import ActionCapsule from './ActionCapsule';
import CardModal from './CardModal';
import ScoreCapsule from './ScoreCapsule';
import Card, { parseCards } from './Card';
import SessionTaskHistory from './SessionTaskHistory';
import { sortActions } from '../utils/actionSorting';

const styles = {
  panel: {
    width: '820px',
    height: '100vh',
    marginLeft: 'auto',
    marginRight: 'auto',
    padding: '12px',
    paddingTop: '10px',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '28px',
    background: 'rgba(7, 16, 25, 0.78)',
    backdropFilter: 'blur(18px)',
    boxShadow: '0 24px 60px rgba(0, 0, 0, 0.34)',
    display: 'flex',
    flexDirection: 'column',
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
    background: 'rgba(82, 106, 140, 0.34)',
    color: '#f8f3e9',
    fontWeight: 500,
    fontSize: '0.95rem',
    cursor: 'pointer',
  },
  actionButtonDisabled: {
    border: '1px solid rgba(119, 144, 179, 0.45)',
    background: 'rgba(255, 255, 255, 0.06)',
    color: 'rgba(231, 238, 247, 0.72)',
    cursor: 'not-allowed',
    boxShadow: 'inset 0 0 0 1px rgba(255, 255, 255, 0.06)',
  },
  splitRow: {
    display: 'flex',
    position: 'relative',
    gap: '16px',
    alignItems: 'stretch',
    flex: 1,
    minHeight: 0,
  },
  score: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    marginBottom: '12px',
    alignItems: 'center',
  },
  left: {
    flex: 10,
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
  },
  right: {
    position: 'relative',
    flex: 8,
    minWidth: 0,
    minHeight: 0,
    display: 'flex',
    flexDirection: 'column',
  },
  splitPaneTreeWrap: {
    position: 'relative',
    flex: 1,
    minWidth: 0,
    minHeight: 0,
  },
  splitPaneTree: {
    width: '100%',
    height: '100%',
    overflowY: 'auto',
    overflowX: 'auto',
    background: 'rgba(255, 255, 255, 0.03)',
    scrollbarGutter: 'stable',
    borderRadius: '12px',
  },
  previousNodeWrap: {
    margin: '0 0 14px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flexDirection: 'column',
  },
  previousNodeLabel: {
    margin: 0,
    fontSize: '0.74rem',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: 'rgba(255, 255, 255, 0.62)',
  },
  treeToggleLabel: {
    position: 'absolute',
    left: 0,
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.8rem',
    color: 'rgba(255, 255, 255, 0.82)',
  },
};

function TrainerView({
  taskPayload,
  onBack,
  isGeneratingTask,
  prevTaskPayload,
  nextTaskPayload,
  sessionTaskPayloads,
  onSessionTaskClick,
  prevTree,
  tree,
  treeStatus,
  prevTreeStatus,
  showCurrent,
  onShowCurrentChange,
  handleGenerateTask,
  score,
}) {
  const [selectedNodeCards, setSelectedNodeCards] = useState(null);
  const displayTaskPayload = showCurrent ? taskPayload : prevTaskPayload;
  const displayTree = showCurrent ? tree : prevTree;
  const displayTreeStatus = showCurrent ? treeStatus : prevTreeStatus;

  useEffect(() => {
    setSelectedNodeCards(null);
  }, [showCurrent, prevTree, tree]);

  if (!taskPayload) {
    return null;
  }

  const { stack, pot, pos, board, id, street, line, hero, task } = taskPayload;

  const holecards = Object.keys(task)[0];
  const titleText = line === '' ? 'Hero starts the action' : `Actions: ${line}`;
  const actions = sortActions(Object.keys(task[holecards]));
  const areActionsDisabled = !nextTaskPayload;
  const previousActions = Object.values(prevTaskPayload?.task ?? {})[0] ?? null;
  const previousMaxAction = previousActions
    ? Object.entries(previousActions).reduce(
        (maxKey, [key, value]) => (value > previousActions[maxKey] ? key : maxKey),
        Object.keys(previousActions)[0]
      )
    : null;
  const previousAnswer = prevTaskPayload?.answerGiven ?? null;

  return (
    <section className="page-panel page-panel-trainer" style={styles.panel}>
      <div style={styles.splitRow}>
        <div style={styles.left}>
          <div style={styles.score}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
              }}
            >
              <div>
                <p style={styles.kicker}>Training Surface</p>
                <p style={styles.title}>
                  {pot} {stack} BB
                </p>
              </div>
              <div>
                <button type="button" style={styles.secondaryAction} onClick={onBack}>
                  Edit Filters
                </button>
              </div>
            </div>
            <ScoreCapsule score={score} />
          </div>
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
                style={{
                  ...styles.actionButton,
                  ...(areActionsDisabled ? styles.actionButtonDisabled : null),
                }}
                onClick={() => handleGenerateTask(action)}
                disabled={areActionsDisabled}
              >
                {action}
              </button>
            ))}
          </div>
          <SessionTaskHistory taskPayloads={sessionTaskPayloads} onTaskClick={onSessionTaskClick} />
        </div>
        <div style={styles.right}>
          {previousActions ? (
            <div style={styles.previousNodeWrap}>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexDirection: 'row' }}>
                <ActionCapsule actions={previousActions} shouldNormalize={false} />

                <span> {previousAnswer}</span>
                <span
                  title={previousMaxAction === previousAnswer ? 'Correct!' : 'Incorrect'}
                  style={{
                    fontSize: '1.1rem',
                    lineHeight: 1,
                    color: previousMaxAction === previousAnswer ? '#4cde80' : '#ff5f5f',
                  }}
                >
                  {previousMaxAction === previousAnswer ? '✓' : '✗'}
                </span>
                {previousMaxAction !== previousAnswer && <span>Correct: {previousMaxAction}</span>}
              </div>
              <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
                Board:
                {parseCards(prevTaskPayload?.board).map((c, i) => (
                  <Card key={i} rank={c.rank} suit={c.suit} scale={0.65} />
                ))}
              </div>
              <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
                Hero:
                {parseCards(Object.keys(prevTaskPayload?.task ?? {})[0] ?? '').map((c, i) => (
                  <Card key={i} rank={c.rank} suit={c.suit} scale={0.65} />
                ))}
              </div>
              <span>Line: {prevTaskPayload?.line}</span>
            </div>
          ) : null}
          <div style={styles.splitPaneTreeWrap}>
            {!previousActions && prevTreeStatus === 'loading' ? (
              <div style={styles.previousNodeWrap}>
                <span style={styles.previousNodeLabel}>Preparing analysis tree...</span>
              </div>
            ) : null}

            {selectedNodeCards ? (
              <CardModal
                cardsByCombo={selectedNodeCards}
                onClose={() => setSelectedNodeCards(null)}
              />
            ) : null}
            <div style={styles.splitPaneTree}>
              <div
                style={{
                  width: '100%',
                  display: 'flex',
                  position: 'relative',
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingBottom: '12px',
                  height: '32px',
                }}
              >
                <label style={styles.treeToggleLabel}>
                  <input
                    type="checkbox"
                    checked={showCurrent}
                    onChange={(event) => onShowCurrentChange(event.target.checked)}
                  />
                  Show current
                </label>
                {displayTree && <ActionCapsule actions={displayTree?.overall_actions} />}
              </div>
              {displayTaskPayload && displayTreeStatus === 'loading' ? (
                <p style={{ ...styles.empty, padding: '0 16px' }}>Analysis tree is loading...</p>
              ) : null}
              {displayTaskPayload && displayTreeStatus === 'error' ? (
                <p style={{ ...styles.empty, padding: '0 16px' }}>Analysis tree failed to load.</p>
              ) : null}
              <Tree nodes={displayTree?.tree} onNodeCardsClick={setSelectedNodeCards} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default TrainerView;
