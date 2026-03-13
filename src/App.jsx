import { useEffect, useState } from 'react';
import TaskFilters from './components/TaskFilters';
import TrainerView from './components/TrainerView';

function buildTrainTaskUrl() {
  const baseUrl = import.meta.env.VITE_BASE_URL?.replace(/\/$/, '') ?? '';
  return `${baseUrl}/api/db/train`;
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
  const [prevTaskPayload, setPrevTaskPayload] = useState(null);
  const [taskPayload, setTaskPayload] = useState(null);
  const [nextTaskPayload, setNextTaskPayload] = useState(null);
  const [tree, setTree] = useState(null);
  const [prevTree, setPrevTree] = useState(null);
  const [nextTree, setNextTree] = useState(null);
  const [isGeneratingTask, setIsGeneratingTask] = useState(false);
  const [answer, setAnswer] = useState(null);
  const [score, setScore] = useState(null);

  useEffect(() => {
    if (!pot || !stack || !street || positions.length === 0 || !hero) {
      setLinesOptions([]);
      setLines([]);
    }
  }, [pot, stack, street, positions, hero]);

  useEffect(() => {
    setPrevTaskPayload(null);
    setTaskPayload(null);
    setNextTaskPayload(null);
    setTree(null);
    setPrevTree(null);
    setNextTree(null);
    setScore(null);
  }, [pot, stack, street, positions, hero, lines]);

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

  async function handleGenerateTask(getNext = false) {
    if (isGeneratingTask) {
      return;
    }

    setIsGeneratingTask(true);

    try {
      if (getNext) {
        const prefetchedTask = await requestTaskPayload();
        setNextTaskPayload(prefetchedTask);
        console.log('Prefetched Task:', prefetchedTask);
        // requestTree(prefetchedTask.id,Object.keys(prefetchedTask.task)[0]).then(setNextTree)
        return;
      }

      const currentTask = await requestTaskPayload();
      const prefetchedTask = await requestTaskPayload();
      console.log('Current Task:', currentTask, 'Prefetched Task:', prefetchedTask);

      setTaskPayload(currentTask);
      setNextTaskPayload(prefetchedTask);
      requestTree(currentTask.id, Object.keys(currentTask.task)[0]).then(setTree);
      // requestTree(prefetchedTask.id).then(setNextTree)
    } catch (error) {
      console.error(error);
    } finally {
      setIsGeneratingTask(false);
    }
  }

  function handleSolveTask(answer) {
    if (!taskPayload || !nextTaskPayload || isGeneratingTask) {
      return;
    }

    // Calculate score first
    const actions = Object.values(taskPayload?.task ?? {})[0] ?? null;
    const maxAction = actions
      ? Object.entries(actions).reduce(
          (maxKey, [key, value]) => (value > actions[maxKey] ? key : maxKey),
          Object.keys(actions)[0]
        )
      : null;
    console.log('Previous Max Action:', maxAction, 'User Answer:', answer);
    const isCorrect = maxAction === answer;
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
    setAnswer(answer);
    setPrevTaskPayload(taskPayload);
    setTaskPayload(nextTaskPayload);
    setTree(null);
    requestTree(taskPayload.id, Object.keys(taskPayload.task)[0]).then(setTree);
    handleGenerateTask(true);
  }

  function handleBackToFilters() {
    setActiveView('filters');
    setPrevTaskPayload(null);
    setTaskPayload(null);
    setNextTaskPayload(null);
    setTree(null);
    setPrevTree(null);
    setNextTree(null);
    setScore(null);
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
      <header className="hero-panel">
        <p className="eyebrow">Pot-Limit Omaha GTO Trainer</p>
        {/* <h1>Black Card Trainer</h1> */}
      </header>

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
            onGenerateTask={handleGenerateTask}
            isGeneratingTask={isGeneratingTask}
            setActiveView={setActiveView}
          />
        ) : (
          <TrainerView
            taskPayload={taskPayload}
            prevTaskPayload={prevTaskPayload}
            nextTaskPayload={nextTaskPayload}
            prevTree={prevTree}
            nextTree={nextTree}
            tree={tree}
            answer={answer}
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
