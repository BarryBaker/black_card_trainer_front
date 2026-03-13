const fieldOptions = {
  pot: ['SRP', '3BP'],
  stack: ['50bb', '100bb'],
  street: ['Flop', 'Turn'],
};

const positionOptionsByScenario = {
  'SRP:100bb:Flop': [
    ['BTN', 'BB'],
    ['MP', 'BB'],
    ['CO', 'BTN', 'BB'],
    ['MP', 'CO', 'BTN'],
    ['SB', 'BB'],
    ['CO', 'BTN'],
    ['EP', 'BTN'],
  ],
  'SRP:100bb:Turn': [
    ['BTN', 'BB'],
    ['MP', 'BB'],

    ['SB', 'BB'],
    ['CO', 'BTN'],
    ['EP', 'BTN'],
  ],
  '3BP:100bb:Flop': [
    ['BTN', 'SB'],
    ['CO', 'BTN'],
    ['CO', 'BTN', 'SB'],
    ['EP', 'CO', 'BTN'],
    ['CO', 'SB'],
    ['EP', 'CO'],
    ['MP', 'SB'],
    ['SB', 'BB'],
  ],
  '3BP:100bb:Turn': [
    ['BTN', 'SB'],
    ['CO', 'BTN'],

    ['CO', 'SB'],
    ['EP', 'CO'],
    ['MP', 'SB'],
    ['SB', 'BB'],
  ],
};

function buildLineOptionsUrl() {
  const baseUrl = import.meta.env.VITE_BASE_URL?.replace(/\/$/, '') ?? '';
  return `${baseUrl}/api/db/lines`;
}

function buildScenarioKey(pot, stack, street) {
  return `${pot}:${stack}:${street}`;
}

const fieldLabels = {
  pot: 'Pot',
  stack: 'Stack',
  street: 'Street',
};

const styles = {
  panel: {
    marginTop: '28px',
    padding: '24px',
    width: 'fit-content',
    maxWidth: '100%',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '28px',
    background: 'rgba(7, 16, 25, 0.78)',
    backdropFilter: 'blur(18px)',
    boxShadow: '0 24px 60px rgba(0, 0, 0, 0.34)',
  },
  heading: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    fontSize: 'clamp(1.8rem, 3vw, 2.8rem)',
  },
  copy: {
    margin: 0,
    color: '#a8b5c1',
    maxWidth: '60ch',
  },
  grid: {
    display: 'flex',
    gap: '18px',
    marginTop: '24px',
    flexWrap: 'wrap',
    width: 'fit-content',
    maxWidth: '100%',
  },
  fieldCard: {
    display: 'grid',
    height: '400px',
    width: '240px',
    gap: '12px',
    padding: '18px',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '22px',
    background: 'rgba(255, 255, 255, 0.04)',
    boxSizing: 'border-box',
    overflowY: 'auto',
    overflowX: 'hidden',
  },
  fieldCardCompact: {
    height: '200px',
    width: '128px',
    justifySelf: 'start',
  },
  fieldLabel: {
    fontSize: '0.92rem',
    color: '#dbe2ea',
  },
  fieldHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
  },
  optionGroup: {
    display: 'grid',
    gap: '8px',
    gridAutoRows: '40px',
  },
  positionGroup: {
    display: 'grid',
    gap: '10px',
  },
  positionScenario: {
    display: 'grid',
    gap: '8px',
    gridAutoRows: '40px',
  },
  optionBtn: {
    width: '100%',
    height: '100%',
    minHeight: '40px',
    padding: '0 10px',
    border: '1px solid rgba(255, 255, 255, 0.14)',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.68rem',
    fontWeight: 500,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    background: 'rgba(255, 255, 255, 0.05)',
    color: '#c8d4de',
    transition: 'background 0.15s, color 0.15s, border-color 0.15s',
  },
  optionBtnActive: {
    background: 'linear-gradient(135deg, #f1a34a 0%, #d8782d 100%)',
    border: '1px solid transparent',
    color: '#120e09',
    fontWeight: 700,
  },
  iconActions: {
    display: 'flex',
    gap: '6px',
  },
  iconBtn: {
    width: '26px',
    height: '26px',
    padding: 0,
    border: '1px solid rgba(255, 255, 255, 0.14)',
    borderRadius: '7px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    lineHeight: 1,
    background: 'rgba(255, 255, 255, 0.05)',
    color: '#c8d4de',
    transition: 'background 0.15s, color 0.15s, border-color 0.15s',
  },
  requestPreview: {
    marginTop: '24px',
    padding: '18px',
    borderRadius: '22px',
    background: 'rgba(0, 0, 0, 0.2)',
    border: '1px solid rgba(255, 255, 255, 0.06)',
  },
  pre: {
    margin: 0,
    overflow: 'auto',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    color: '#d7e0e8',
  },
  primaryAction: {
    padding: '11px 18px',
    border: '1px solid rgba(86, 210, 240, 0.42)',
    borderRadius: '10px',
    cursor: 'pointer',
    background: 'linear-gradient(135deg, rgba(10, 49, 67, 0.98) 0%, rgba(21, 90, 110, 0.98) 100%)',
    color: '#d9f7ff',
    fontWeight: 600,
    letterSpacing: '0.02em',
    transition: 'transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease',
  },
  primaryActionDisabled: {
    cursor: 'not-allowed',
    opacity: 0.55,
    boxShadow: 'none',
  },
};

function TaskFilters({
  pot,
  stack,
  street,
  positions,
  hero,
  linesOptions,
  lines,
  onPotChange,
  onStackChange,
  onStreetChange,
  onPositionsChange,
  onHeroChange,
  onLinesOptionsChange,
  onLinesChange,
  onGenerateTask,
  isGeneratingTask = false,
  setActiveView,
}) {
  const positionOptions = positionOptionsByScenario[buildScenarioKey(pot, stack, street)] ?? [];
  const canGenerateTask = positions.length > 0 && Boolean(hero);

  const filters = {
    Pot: pot,
    Stack: stack,
    Street: street,
    Positions: positions,
    Hero: hero,
    Lines: lines,
  };

  async function handleScenarioSeatClick(scenario, selectedHero) {
    onPositionsChange(scenario);
    onHeroChange(selectedHero);
    onLinesChange([]);

    try {
      const response = await fetch(buildLineOptionsUrl(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pot,
          stack: parseInt(stack),
          street,
          pos: scenario.join('_'),
          hero: selectedHero,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch line options: ${response.status}`);
      }

      const data = await response.json();
      const nextLineOptions = Array.isArray(data.lines) ? data.lines : [];
      onLinesOptionsChange(nextLineOptions);
    } catch (error) {
      console.error(error);
      onLinesOptionsChange([]);
    }
  }

  function isSelectedPosition(scenario, seat) {
    return positions.join('_') === scenario.join('_') && hero === seat;
  }

  function toggleLine(lineOption) {
    onLinesChange(
      lines.includes(lineOption)
        ? lines.filter((selectedLine) => selectedLine !== lineOption)
        : [...lines, lineOption]
    );
  }

  function selectAllLines() {
    onLinesChange(linesOptions);
  }

  function clearAllLines() {
    onLinesChange([]);
  }

  return (
    <section style={styles.panel}>
      <div style={styles.heading}>
        <div>
          <p style={styles.kicker}>Scenario Setup</p>
          <h2 style={styles.title}>Build a training spot</h2>
        </div>

        <button
          type="button"
          style={{
            ...styles.primaryAction,
            ...(canGenerateTask && !isGeneratingTask
              ? { boxShadow: '0 14px 24px rgba(38, 168, 200, 0.22)' }
              : styles.primaryActionDisabled),
          }}
          onClick={() => {
            setActiveView('trainer');
            onGenerateTask();
          }}
          disabled={!canGenerateTask || isGeneratingTask}
        >
          {isGeneratingTask ? 'Generating...' : 'Generate Training Task'}
        </button>
      </div>

      <div style={styles.grid}>
        {Object.entries(fieldOptions).map(([field, options]) => (
          <label key={field} style={{ ...styles.fieldCard, ...styles.fieldCardCompact }}>
            <span style={styles.fieldLabel}>{fieldLabels[field]}</span>
            <div style={styles.optionGroup}>
              {options.map((option) => (
                <button
                  key={option}
                  type="button"
                  style={{
                    ...styles.optionBtn,
                    ...((field === 'pot' ? pot : field === 'stack' ? stack : street) === option
                      ? styles.optionBtnActive
                      : {}),
                  }}
                  onClick={() => {
                    if (field === 'pot') {
                      onPotChange(option);
                      return;
                    }

                    if (field === 'stack') {
                      onStackChange(option);
                      return;
                    }

                    onStreetChange(option);
                  }}
                >
                  {option}
                </button>
              ))}
            </div>
          </label>
        ))}

        <label style={styles.fieldCard}>
          <span style={styles.fieldLabel}>Positions</span>
          <div style={styles.positionGroup}>
            {positionOptions.length === 0 ? (
              <span style={{ fontSize: '0.72rem', color: '#5a6a78' }}>
                No positions available for this pot and stack pairing
              </span>
            ) : (
              positionOptions.map((scenario) => (
                <div
                  key={scenario.join('_')}
                  style={{
                    ...styles.positionScenario,
                    gridTemplateColumns: `repeat(${scenario.length}, minmax(0, 1fr))`,
                  }}
                >
                  {scenario.map((seat) => (
                    <button
                      key={`${scenario.join('_')}-${seat}`}
                      type="button"
                      style={{
                        ...styles.optionBtn,
                        ...(isSelectedPosition(scenario, seat) ? styles.optionBtnActive : {}),
                      }}
                      onClick={() => handleScenarioSeatClick(scenario, seat)}
                    >
                      {seat}
                    </button>
                  ))}
                </div>
              ))
            )}
          </div>
        </label>

        <label style={styles.fieldCard}>
          <div style={styles.fieldHeader}>
            <span style={styles.fieldLabel}>Lines</span>
            <div style={styles.iconActions}>
              <button
                type="button"
                style={styles.iconBtn}
                onClick={selectAllLines}
                aria-label="Select all lines"
                title="Select all"
              >
                +
              </button>
              <button
                type="button"
                style={styles.iconBtn}
                onClick={clearAllLines}
                aria-label="Clear all lines"
                title="Clear all"
              >
                -
              </button>
            </div>
          </div>
          <div style={styles.optionGroup}>
            {linesOptions.length === 0 ? (
              <span style={{ fontSize: '0.72rem', color: '#5a6a78' }}>No lines available</span>
            ) : (
              linesOptions.map((lineOption) => (
                <button
                  key={lineOption}
                  type="button"
                  style={{
                    ...styles.optionBtn,
                    ...(lines.includes(lineOption) ? styles.optionBtnActive : {}),
                  }}
                  onClick={() => toggleLine(lineOption)}
                >
                  {lineOption}
                </button>
              ))
            )}
          </div>
        </label>
      </div>

      <div style={styles.requestPreview}>
        <p style={styles.kicker}>Outgoing Payload Preview</p>
        <pre style={styles.pre}>{JSON.stringify(filters, null, 2)}</pre>
      </div>
    </section>
  );
}

export default TaskFilters;
