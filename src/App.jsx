import { useEffect, useState } from 'react';
import TaskFilters from './components/TaskFilters';
import TrainerView from './components/TrainerView';

function buildTrainTaskUrl() {
  const baseUrl = import.meta.env.VITE_BASE_URL?.replace(/\/$/, '') ?? '';
  return `${baseUrl}/api/db/train`;
}

function createTaskEntry(taskPayload, tree = null, treeStatus = 'idle') {
  return {
    taskPayload,
    tree,
    treeStatus,
  };
}

function getTaskHand(taskPayload) {
  return Object.keys(taskPayload?.task ?? {})[0] ?? null;
}

function cloneTaskPayload(taskPayload) {
  if (typeof structuredClone === 'function') {
    return structuredClone(taskPayload);
  }

  return JSON.parse(JSON.stringify(taskPayload));
}

function updateEntryTree(entry, taskId, treeStatus, tree = null) {
  if (!entry || entry.taskPayload?.id !== taskId) {
    return entry;
  }

  return {
    ...entry,
    tree,
    treeStatus,
  };
}

function App() {
  const [pot, setPot] = useState('SRP');
  const [stack, setStack] = useState('100bb');
  const [street, setStreet] = useState('Flop');
  const [positions, setPositions] = useState([]);
  const [hero, setHero] = useState('');
  const [linesOptions, setLinesOptions] = useState([]);
  const [lines, setLines] = useState([]);
  const [activeView, setActiveView] = useState('filters');
  const [prevEntry, setPrevEntry] = useState(null);
  const [currentEntry, setCurrentEntry] = useState(null);
  const [nextEntry, setNextEntry] = useState(null);
  const [board, setBoard] = useState({
    flopPaired: null,
    flopStraight: null,
    flopFlush: null,
    flopSuited: null,
    turnPaired: null,
    turnStraight: null,
    turnFlush: null,
    turnSuited: null,
  });
  const [isGeneratingTask, setIsGeneratingTask] = useState(false);
  const [answer, setAnswer] = useState(null);
  const [score, setScore] = useState(null);
  const [sessionTaskPayloads, setSessionTaskPayloads] = useState([]);
  const [showCurrent, setShowCurrent] = useState(false);

  useEffect(() => {
    if (!pot || !stack || !street || positions.length === 0 || !hero) {
      setLinesOptions([]);
      setLines([]);
    }
  }, [pot, stack, street, positions, hero]);

  useEffect(() => {
    setPrevEntry(null);
    setCurrentEntry(null);
    setNextEntry(null);
    setAnswer(null);
    setScore(null);
    setSessionTaskPayloads([]);
    setShowCurrent(false);
  }, [pot, stack, street, positions, hero, lines, board]);

  function handleLinesOptionsChange(nextLineOptions) {
    setLinesOptions(nextLineOptions);
    setLines((currentLines) =>
      currentLines.filter((lineOption) => nextLineOptions.includes(lineOption))
    );
  }

  async function requestTaskPayload() {
    const response = await fetch(buildTrainTaskUrl(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        pot,
        stack: parseInt(stack, 10),
        street: street.toLowerCase(),
        pos: positions.join('_'),
        hero,
        line: lines,
        board,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to generate train task: ${response.status}`);
    }

    const payload = await response.json();

    if (!payload) {
      throw new Error('Train response did not include a task payload');
    }

    return payload;
  }

  async function requestTree(taskId, taskhand) {
    const baseUrl = import.meta.env.VITE_BASE_URL?.replace(/\/$/, '') ?? '';
    const response = await fetch(`${baseUrl}/api/db/tree`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: taskId, taskhand }),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch tree: ${response.status}`);
    }

    const payload = await response.json();

    if (!payload) {
      throw new Error('Tree response did not include a payload');
    }
    console.log('Fetched tree:', payload);
    return payload;
  }

  function setTreeStateForTask(taskId, treeStatus, tree = null) {
    setPrevEntry((entry) => updateEntryTree(entry, taskId, treeStatus, tree));
    setCurrentEntry((entry) => updateEntryTree(entry, taskId, treeStatus, tree));
    setNextEntry((entry) => updateEntryTree(entry, taskId, treeStatus, tree));
  }

  async function fetchTreeForEntry(taskPayload) {
    const taskId = taskPayload?.id;
    const taskhand = getTaskHand(taskPayload);

    if (!taskId || !taskhand) {
      throw new Error('Cannot fetch tree without a task id and task hand');
    }

    setTreeStateForTask(taskId, 'loading');

    try {
      const treePayload = await requestTree(taskId, taskhand);
      setTreeStateForTask(taskId, 'ready', treePayload);
      return treePayload;
    } catch (error) {
      setTreeStateForTask(taskId, 'error');
      throw error;
    }
  }

  async function handleGenerateTask(getNext = false) {
    if (isGeneratingTask) {
      return false;
    }

    setIsGeneratingTask(true);

    try {
      if (getNext) {
        const prefetchedTask = await requestTaskPayload();
        setNextEntry(createTaskEntry(prefetchedTask, null, 'idle'));
        fetchTreeForEntry(prefetchedTask).catch(console.error);
        return true;
      }

      const [currentTask, prefetchedTask] = await Promise.all([
        requestTaskPayload(),
        requestTaskPayload(),
      ]);

      setPrevEntry(null);
      setCurrentEntry(createTaskEntry(currentTask, null, 'loading'));
      setNextEntry(createTaskEntry(prefetchedTask, null, 'idle'));
      setAnswer(null);

      fetchTreeForEntry(prefetchedTask).catch(console.error);
      await fetchTreeForEntry(currentTask);

      return true;
    } catch (error) {
      console.error(error);
      return false;
    } finally {
      setIsGeneratingTask(false);
    }
  }

  function handleSolveTask(selectedAnswer) {
    if (!currentEntry?.taskPayload || !nextEntry?.taskPayload) {
      return;
    }

    const solvedTaskPayload = {
      ...cloneTaskPayload(currentEntry.taskPayload),
      answerGiven: selectedAnswer,
    };

    setSessionTaskPayloads((currentTaskPayloads) => [...currentTaskPayloads, solvedTaskPayload]);

    // Calculate score first
    const actions = Object.values(currentEntry.taskPayload?.task ?? {})[0] ?? null;
    const maxAction = actions
      ? Object.entries(actions).reduce(
          (maxKey, [key, value]) => (value > actions[maxKey] ? key : maxKey),
          Object.keys(actions)[0]
        )
      : null;

    const isCorrect = maxAction === selectedAnswer;
    setScore((prevScore) => {
      if (prevScore === null) {
        return {
          correct: isCorrect ? 1 : 0,
          total: 1,
        };
      }
      return {
        correct: prevScore.correct + (isCorrect ? 1 : 0),
        total: prevScore.total + 1,
      };
    });

    // Resume with the function
    setAnswer(selectedAnswer);

    setPrevEntry({
      ...currentEntry,
      taskPayload: solvedTaskPayload,
    });
    setCurrentEntry(nextEntry);
    setNextEntry(null);
    setShowCurrent(false);

    handleGenerateTask(true);
  }

  function handleSessionTaskClick(taskPayload) {
    if (!taskPayload) {
      return;
    }

    setPrevEntry(createTaskEntry(taskPayload, null, 'loading'));
    fetchTreeForEntry(taskPayload).catch(console.error);
  }

  function handleBackToFilters() {
    setActiveView('filters');
    setPrevEntry(null);
    setCurrentEntry(null);
    setNextEntry(null);
    setAnswer(null);
    setScore(null);
    setSessionTaskPayloads([]);
    setShowCurrent(false);
  }

  function handlePotChange(nextPot) {
    setPot(nextPot);
    setPositions([]);
    setHero('');
    setLinesOptions([]);
    setLines([]);
  }

  function handleStackChange(nextStack) {
    setStack(nextStack);
    setPositions([]);
    setHero('');
    setLinesOptions([]);
    setLines([]);
  }

  function handleStreetChange(nextStreet) {
    setStreet(nextStreet);
    setPositions([]);
    setHero('');
    setLinesOptions([]);
    setLines([]);
  }

  return (
    <div className="app-shell">
      {activeView === 'filters' && (
        <header className="hero-panel">
          <p className="eyebrow" style={{ paddingTop: '20px' }}>
            Pot-Limit Omaha GTO Trainer
          </p>
          {/* <h1>Black Card Trainer</h1> */}
        </header>
      )}

      <main>
        {activeView === 'filters' ? (
          <TaskFilters
            pot={pot}
            stack={stack}
            street={street}
            positions={positions}
            hero={hero}
            linesOptions={linesOptions}
            lines={lines}
            onPotChange={handlePotChange}
            onStackChange={handleStackChange}
            onStreetChange={handleStreetChange}
            onPositionsChange={setPositions}
            onHeroChange={setHero}
            onLinesOptionsChange={handleLinesOptionsChange}
            onLinesChange={setLines}
            board={board}
            onBoardChange={setBoard}
            onGenerateTask={handleGenerateTask}
            isGeneratingTask={isGeneratingTask}
            setActiveView={setActiveView}
          />
        ) : (
          <TrainerView
            taskPayload={currentEntry?.taskPayload ?? null}
            prevTaskPayload={prevEntry?.taskPayload ?? null}
            nextTaskPayload={nextEntry?.taskPayload ?? null}
            onSessionTaskClick={handleSessionTaskClick}
            sessionTaskPayloads={sessionTaskPayloads}
            prevTree={prevEntry?.tree ?? null}
            prevTreeStatus={prevEntry?.treeStatus ?? 'idle'}
            tree={currentEntry?.tree ?? null}
            treeStatus={currentEntry?.treeStatus ?? 'idle'}
            showCurrent={showCurrent}
            onShowCurrentChange={setShowCurrent}
            score={score}
            onBack={handleBackToFilters}
            isGeneratingTask={isGeneratingTask}
            handleGenerateTask={handleSolveTask}
          />
        )}
      </main>
    </div>
  );
}

export default App;
