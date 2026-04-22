import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'

interface ResultModalProps {
  ganador: string | null
  onClose: () => void
}

export const ResultModal = ({ ganador, onClose }: ResultModalProps) => {
  const fired = useRef(false)

  useEffect(() => {
    if (ganador && !fired.current) {
      fired.current = true
      const colors = [
        'oklch(59.2% 0.249 0.584)',
        'oklch(29.1% 0.149 302.717)',
        'oklch(89.9% 0.061 343.231)',
        '#f472b6',
        '#c084fc',
      ]
      confetti({
        particleCount: 140,
        spread: 80,
        origin: { y: 0.55 },
        colors,
        scalar: 1.1,
      })
      setTimeout(() => {
        confetti({
          particleCount: 60,
          angle: 60,
          spread: 60,
          origin: { x: 0, y: 0.6 },
          colors,
        })
        confetti({
          particleCount: 60,
          angle: 120,
          spread: 60,
          origin: { x: 1, y: 0.6 },
          colors,
        })
      }, 400)
    }
    if (!ganador) fired.current = false
  }, [ganador])

  return (
    <AnimatePresence>
      {ganador && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={{ backdropFilter: 'blur(6px)', background: 'oklch(29.1% 0.149 302.717 / 0.55)' }}
        >
          <motion.div
            className="relative flex flex-col items-center gap-6 px-10 py-12 rounded-3xl max-w-sm w-full"
            initial={{ scale: 0.5, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: -20 }}
            transition={{ type: 'spring', stiffness: 350, damping: 24 }}
            onClick={e => e.stopPropagation()}
            style={{
              background: 'var(--color-surface)',
              border: '2px solid var(--color-accent)',
              boxShadow: '0 24px 80px oklch(29.1% 0.149 302.717 / 0.4), 0 0 40px var(--color-accent-glow)',
            }}
          >
            {/* Decoración superior */}
            <div
              className="absolute -top-px inset-x-8 h-px"
              style={{ background: 'linear-gradient(to right, transparent, var(--color-accent), transparent)' }}
            />

            <motion.p
              className="text-xs tracking-[0.4em] uppercase"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              style={{ fontFamily: "'DM Mono', monospace", color: 'var(--color-accent)' }}
            >
              ✦ el ganador es ✦
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15, type: 'spring', stiffness: 300 }}
              className="text-4xl md:text-5xl font-bold text-center leading-tight"
              style={{
                fontFamily: "'Playfair Display', serif",
                color: 'var(--color-text)',
              }}
            >
              {ganador}
            </motion.h2>

            {/* Línea decorativa */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="h-px w-24 rounded-full"
              style={{ background: 'var(--color-accent)' }}
            />

            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={onClose}
              className="px-8 py-3 rounded-xl font-bold text-sm tracking-widest uppercase"
              style={{
                background: 'var(--color-text)',
                color: 'var(--color-bg)',
                border: 'none',
                fontFamily: "'DM Mono', monospace",
                cursor: 'pointer',
              }}
            >
              Cerrar
            </motion.button>

            {/* Decoración inferior */}
            <div
              className="absolute -bottom-px inset-x-8 h-px"
              style={{ background: 'linear-gradient(to right, transparent, var(--color-accent), transparent)' }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
