import { useEffect, useState } from 'react'
import { useLottie } from 'lottie-react'
import { motion, AnimatePresence } from 'framer-motion'
import giftAnimation from '../assets/gift.json'

interface GiftDrumProps {
  totalParticipants: number
  isSpinning: boolean
  ganador: string | null
}

export const GiftDrum = ({ totalParticipants, isSpinning, ganador }: GiftDrumProps) => {
  const [showGanador, setShowGanador] = useState(false)
  const [particles, setParticles] = useState<{ id: number; x: number; delay: number }[]>([])

  const { View, setSpeed, play } = useLottie({
    animationData: giftAnimation,
    loop: true,
    autoplay: true,
    style: { width: 200, height: 200 },
  })

  // Controla la velocidad de la animación Lottie según el estado del sorteo
  useEffect(() => {
    if (isSpinning) {
      setSpeed(2.5)
      play()
    } else {
      setSpeed(1)
    }
  }, [isSpinning, setSpeed, play])

  // Oculta el ganador al iniciar un nuevo giro
  useEffect(() => {
    if (isSpinning) {
      setTimeout(() => setShowGanador(false), 0)
    }
  }, [isSpinning])

  // Revela el ganador con un pequeño delay tras terminar el giro
  useEffect(() => {
    if (ganador && !isSpinning) {
      const timer = setTimeout(() => {
        setShowGanador(true)
        // Genera partículas de celebración
        setParticles(
          Array.from({ length: 12 }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            delay: Math.random() * 0.5,
          }))
        )
      }, 300)
      return () => clearTimeout(timer)
    } else {
      setTimeout(() => {
        setShowGanador(false)
        setParticles([])
      }, 0)
    }
  }, [ganador, isSpinning])

  return (
    <div className="relative flex flex-col items-center gap-6">
      {/* Contador de participantes */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-sm tracking-widest uppercase"
        style={{
          color: 'var(--color-accent)',
          fontFamily: "'DM Mono', monospace",
          opacity: 0.7,
        }}
      >
        {totalParticipants} participante{totalParticipants !== 1 ? 's' : ''}
      </motion.p>

      {/* Contenedor de la animación Lottie */}
      <div className="relative">
        {/* Halo de luz pulsante durante el giro */}
        <AnimatePresence>
          {isSpinning && (
            <motion.div
              key="halo"
              className="absolute inset-0 rounded-full pointer-events-none"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: [0.4, 0.8, 0.4],
                scale: [1, 1.15, 1],
              }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
              style={{
                background:
                  'radial-gradient(circle, var(--color-accent-glow) 0%, transparent 70%)',
              }}
            />
          )}
        </AnimatePresence>

        <motion.div
          animate={
            isSpinning
              ? { rotate: [0, -4, 4, -4, 4, 0], scale: [1, 1.05, 1] }
              : { rotate: 0, scale: 1 }
          }
          transition={
            isSpinning
              ? { repeat: Infinity, duration: 0.4, ease: 'easeInOut' }
              : { duration: 0.3 }
          }
        >
          {View}
        </motion.div>

        {/* Partículas de celebración */}
        <AnimatePresence>
          {showGanador &&
            particles.map((p) => (
              <motion.div
                key={p.id}
                className="absolute w-2 h-2 rounded-full pointer-events-none"
                style={{
                  left: `${p.x}%`,
                  top: '50%',
                  background: 'var(--color-accent)',
                }}
                initial={{ opacity: 1, y: 0, scale: 1 }}
                animate={{ opacity: 0, y: -80, scale: 0.3 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.9, delay: p.delay, ease: 'easeOut' }}
              />
            ))}
        </AnimatePresence>
      </div>

      {/* Estado del sorteo */}
      <div className="text-center min-h-12 flex items-center justify-center">
        <AnimatePresence mode="wait">
          {isSpinning && (
            <motion.p
              key="spinning"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="text-base tracking-widest uppercase"
              style={{
                color: 'var(--color-text)',
                fontFamily: "'DM Mono', monospace",
                opacity: 0.6,
              }}
            >
              Sorteando…
            </motion.p>
          )}

          {showGanador && ganador && (
            <motion.div
              key="ganador"
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 18 }}
              className="flex flex-col items-center gap-2"
            >
              <p
                className="text-xs tracking-[0.35em] uppercase"
                style={{ color: 'var(--color-accent)', fontFamily: "'DM Mono', monospace" }}
              >
                ✦ ganador/a ✦
              </p>
              <p
                className="text-2xl font-bold text-center"
                style={{ color: 'var(--color-text)', fontFamily: "'Playfair Display', serif" }}
              >
                {ganador}
              </p>
            </motion.div>
          )}

          {!isSpinning && !ganador && (
            <motion.p
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="text-sm tracking-wider"
              style={{
                color: 'var(--color-text)',
                fontFamily: "'DM Mono', monospace",
                opacity: 0.45,
              }}
            >
              Pulsa el botón para sortear
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
