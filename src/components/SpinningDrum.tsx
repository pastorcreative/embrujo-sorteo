import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface SpinningDrumProps {
  nombres: string[]
  isSpinning: boolean
  ganador: string | null
}

export const SpinningDrum = ({ nombres, isSpinning }: SpinningDrumProps) => {
  const [displayedIndex, setDisplayedIndex] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (isSpinning) {
      let speed = 60
      let elapsed = 0
      const totalDuration = 3200

      const tick = () => {
        setDisplayedIndex(prev => (prev + 1) % nombres.length)
        elapsed += speed

        // Deceleración progresiva en el último segundo
        if (elapsed > totalDuration * 0.65) {
          speed = Math.min(speed * 1.08, 320)
        }

        if (intervalRef.current) clearTimeout(intervalRef.current)
        if (elapsed < totalDuration) {
          intervalRef.current = setTimeout(tick, speed)
        }
      }

      intervalRef.current = setTimeout(tick, speed)
    }

    return () => {
      if (intervalRef.current) clearTimeout(intervalRef.current)
    }
  }, [isSpinning, nombres.length])

  const visibleCount = 5
  const getVisible = () => {
    return Array.from({ length: visibleCount }, (_, i) => {
      const offset = i - Math.floor(visibleCount / 2)
      const idx = ((displayedIndex + offset) % nombres.length + nombres.length) % nombres.length
      return { nombre: nombres[idx], offset }
    })
  }

  if (nombres.length === 0) return null

  return (
    <div className="relative w-full max-w-sm mx-auto overflow-hidden" style={{ height: '280px' }}>
      {/* Fade top/bottom */}
      <div
        className="absolute inset-x-0 top-0 z-10 pointer-events-none"
        style={{
          height: '80px',
          background: 'linear-gradient(to bottom, var(--color-bg) 0%, transparent 100%)',
        }}
      />
      <div
        className="absolute inset-x-0 bottom-0 z-10 pointer-events-none"
        style={{
          height: '80px',
          background: 'linear-gradient(to top, var(--color-bg) 0%, transparent 100%)',
        }}
      />

      {/* Marco central */}
      <div
        className="absolute inset-x-4 z-20 pointer-events-none rounded-xl"
        style={{
          top: '50%',
          transform: 'translateY(-50%)',
          height: '52px',
          border: '2px solid var(--color-accent)',
          boxShadow: '0 0 20px var(--color-accent-glow), inset 0 0 20px var(--color-accent-glow)',
        }}
      />

      {/* Nombres */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-0">
        <AnimatePresence mode="popLayout">
          {getVisible().map(({ nombre, offset }) => {
            const isCurrent = offset === 0
            const abs = Math.abs(offset)
            return (
              <motion.div
                key={`${nombre}-${offset}`}
                initial={{ opacity: 0, y: -30 }}
                animate={{
                  opacity: abs === 0 ? 1 : abs === 1 ? 0.5 : 0.2,
                  y: 0,
                  scale: abs === 0 ? 1 : abs === 1 ? 0.85 : 0.7,
                }}
                exit={{ opacity: 0, y: 30 }}
                transition={{ duration: 0.08 }}
                className="w-full text-center select-none px-8"
                style={{
                  height: '56px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: "'Playfair Display', serif",
                  fontSize: isCurrent ? '1.6rem' : '1.1rem',
                  fontWeight: isCurrent ? 700 : 400,
                  color: isCurrent ? 'var(--color-accent)' : 'var(--color-text)',
                  textShadow: isCurrent && isSpinning ? '0 0 20px var(--color-accent-glow)' : 'none',
                  pointerEvents: 'none',
                }}
              >
                {nombre}
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>


    </div>
  )
}
