import { useEffect, useRef, useState } from 'react'
import Card, { parseCards } from './Card'

const POS_LABELS = {
  BTN: 'BTN', SB: 'SB', BB: 'BB', MP: 'MP', CO: 'CO', EP: 'EP',
}

// Canonical clockwise seat order (6-max)
const SEAT_ORDER = ['SB', 'BB', 'EP', 'MP', 'CO', 'BTN']

function seatXY(angle, rx, ry, cx, cy) {
  const rad = (angle - 90) * (Math.PI / 180)
  return { x: cx + rx * Math.cos(rad), y: cy + ry * Math.sin(rad) }
}

function PokerTable({ stack, pot, pos, line, board, hero, holecards }) {
  const boardCards = parseCards(board)
  const heroCards = parseCards(holecards)

  const BASE_W = 520
  const BASE_H = 340
  const HERO_SPACE = 80
  const containerRef = useRef(null)
  const [tableWidth, setTableWidth] = useState(BASE_W)

  useEffect(() => {
    if (!containerRef.current) {
      return undefined
    }

    const update = () => {
      const nextWidth = containerRef.current ? containerRef.current.clientWidth : BASE_W
      setTableWidth(nextWidth || BASE_W)
    }

    update()

    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', update)
      return () => window.removeEventListener('resize', update)
    }

    const observer = new ResizeObserver(update)
    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  // Parse positions from "SB_CO_BTN" → ['SB','CO','BTN']
  const positions = pos ? pos.split('_') : []
  const heroPos = hero || positions[0]

  // Villains = every position that isn't hero
  const villains = positions.filter(p => p !== heroPos)

  // Compute angle for a villain relative to hero (hero is fixed at 180°)
  const heroIdx = SEAT_ORDER.indexOf(heroPos)
  const villainSeats = villains.map(v => {
    const vIdx = SEAT_ORDER.indexOf(v)
    const dist = (vIdx - heroIdx + SEAT_ORDER.length) % SEAT_ORDER.length
    const angle = (180 + dist * (360 / SEAT_ORDER.length)) % 360
    return { angle, label: POS_LABELS[v] || v }
  })

  // Responsive table dimensions
  const W = Math.max(300, tableWidth)
  const scale = W / BASE_W
  const H = BASE_H * scale
  const cx = W / 2, cy = H / 2
  const rx = 200 * scale, ry = 120 * scale

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: H + HERO_SPACE * scale,
      margin: '24px 0 0',
    }}>
      <div ref={containerRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />
      {/* Felt */}
      <div style={{
        position: 'absolute', top: 0, left: 0, width: W, height: H,
        borderRadius: '50%',
        background: 'radial-gradient(ellipse at center, #1a6b3c 0%, #145a30 60%, #0e3d20 100%)',
        border: '6px solid #5c3a1e',
        boxShadow: 'inset 0 0 40px rgba(0,0,0,0.35), 0 8px 32px rgba(0,0,0,0.5)',
      }} />

      {/* Rail ring */}
      <div style={{
        position: 'absolute', top: -4, left: -4, width: W + 8, height: H + 8,
        borderRadius: '50%',
        border: '4px solid #8b5e34',
        pointerEvents: 'none',
      }} />

      {/* Pot */}
      <div style={{
        position: 'absolute',
        top: cy - 64 * scale, left: cx, transform: 'translateX(-50%)',
        textAlign: 'center', color: '#c8e6c9', fontSize: 12,
        fontWeight: 600, letterSpacing: '0.05em',
      }}>
        <div style={{
          background: 'rgba(0,0,0,0.35)', borderRadius: 10,
          padding: '4px 12px', marginBottom: 4,
        }}>
           {pot} {stack} BB
        </div>
      </div>

      {/* Board cards */}
      <div style={{
        position: 'absolute',
        top: cy - 6 * scale, left: cx, transform: 'translateX(-50%)',
        display: 'flex', gap: 4,
      }}>
        {boardCards.map((c, i) => (
          <Card key={i} rank={c.rank} suit={c.suit} />
        ))}
        {/* Empty board slots */}
        {Array.from({ length: Math.max(0, 5 - boardCards.length) }).map((_, i) => (
          <div key={`empty-${i}`} style={{
            width: 48, height: 68, borderRadius: 7,
            border: '1.5px dashed rgba(255,255,255,0.12)',
            background: 'rgba(0,0,0,0.15)',
          }} />
        ))}
      </div>

      {/* Villain seats */}
      {villainSeats.map((seat, i) => {
        const p = seatXY(seat.angle, rx + 24 * scale, ry + 24 * scale, cx, cy)
        return (
          <div key={i} style={{
            position: 'absolute',
            top: p.y, left: p.x, transform: 'translate(-50%, -50%)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
          }}>
            <div style={{ display: 'flex' }}>
              {[0, 1, 2, 3].map(i => (
                <div key={i} style={{ marginLeft: i === 0 ? 0 : -24, zIndex: i }}>
                  <Card faceDown />
                </div>
              ))}
            </div>
            <div style={{
              background: 'rgba(0,0,0,0.55)', borderRadius: 8,
              padding: '3px 10px', fontSize: 11, color: '#ddd',
              whiteSpace: 'nowrap',
            }}>
              {seat.label}
            </div>
          </div>
        )
      })}

      {/* Hero seat — always bottom center */}
      <div style={{
        position: 'absolute',
        bottom: 0, left: cx, transform: 'translateX(-50%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
      }}>
        <div style={{ display: 'flex', gap: 4 }}>
          {heroCards.map((c, i) => (
            <Card key={i} rank={c.rank} suit={c.suit} />
          ))}
        </div>
        <div style={{
          background: 'rgba(241,163,74,0.85)', borderRadius: 8,
          padding: '3px 12px', fontSize: 11, fontWeight: 700,
          color: '#120e09', whiteSpace: 'nowrap',
        }}>
          {POS_LABELS[heroPos] || heroPos} 
        </div>
      </div>

      {/* Line indicator */}
      {/* {line && (
        <div style={{
          position: 'absolute',
          top: cy + 52 * scale, left: cx, transform: 'translateX(-50%)',
          fontSize: 11, color: 'rgba(255,255,255,0.45)',
          letterSpacing: '0.08em', textTransform: 'uppercase',
          whiteSpace: 'nowrap',
        }}>
          {line}
        </div>
      )} */}
    </div>
  )
}

export default PokerTable
