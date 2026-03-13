const SUIT_MAP = {
  s: { char: '♠', color: '#1a1a2e' },
  h: { char: '♥', color: '#952d22' },
  d: { char: '♦', color: '#1c5c87' },
  c: { char: '♣', color: '#1d8347' },
};

const RANK_DISPLAY = {
  T: '10',
};

function Card({ rank, suit, faceDown, scale = 1 }) {
  const w = Math.round(48 * scale);
  const h = Math.round(68 * scale);
  const r = Math.round(7 * scale);

  if (faceDown) {
    return (
      <div
        style={{
          width: w,
          height: h,
          borderRadius: r,
          background: 'linear-gradient(135deg, #1a3a5c 0%, #0d1f33 100%)',
          border: '2px solid rgba(255,255,255,0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
        }}
      >
        <span style={{ fontSize: Math.round(18 * scale), opacity: 0.3 }}>🂠</span>
      </div>
    );
  }

  const s = SUIT_MAP[suit] || { char: suit, color: '#888' };
  const display = RANK_DISPLAY[rank] || rank;

  return (
    <div
      style={{
        width: w,
        height: h,
        borderRadius: r,
        background: s.color,
        border: '2px solid rgba(255,255,255,0.18)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.35)',
        color: '#fff',
        fontWeight: 700,
        lineHeight: 1,
        userSelect: 'none',
        position: 'relative',
      }}
    >
      <span style={{ fontSize: Math.round(22 * scale) }}>{display}</span>
      <span style={{ fontSize: Math.round(17 * scale), marginTop: Math.round(2 * scale) }}>
        {s.char}
      </span>
    </div>
  );
}

/** Parse a string like "AsKdTs8h" into [{rank,suit},...] */
export function parseCards(str) {
  if (!str) return [];
  const cards = [];
  for (let i = 0; i < str.length; i += 2) {
    cards.push({ rank: str[i], suit: str[i + 1] });
  }
  return cards;
}

export default Card;
