import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useSorteo } from '../hooks/useSorteo'
import { SpinningDrum } from '../components/SpinningDrum'
import { ResultModal } from '../components/ResultModal'

export const SorteoPage = () => {
  const { nombres, nombreProhibido, ganador, isSpinning, ejecutarSorteo, resetGanador } = useSorteo()
  const navigate = useNavigate()

  const elegibles = nombres.filter(n => n !== nombreProhibido)
  const canSortear = elegibles.length >= 2 && !isSpinning && !ganador

  return (
    <div
      className="min-h-dvh flex flex-col items-center justify-between px-4 py-10 gap-6 relative overflow-hidden"
      style={{ background: 'var(--color-bg)' }}
    >
      {/* Fondo decorativo */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: [
            'radial-gradient(ellipse 60% 40% at 50% 0%, oklch(59.2% 0.249 0.584 / 0.12) 0%, transparent 70%)',
            'radial-gradient(ellipse 40% 30% at 0% 100%, oklch(29.1% 0.149 302.717 / 0.08) 0%, transparent 60%)',
          ].join(', '),
        }}
      />

      {/* Header zona sorteo — limpia para captura */}
      <motion.div
        className="text-center z-10"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
      >
        <p
          className="text-xs tracking-[0.4em] uppercase mb-2"
          style={{ color: 'var(--color-accent)', fontFamily: "'DM Mono', monospace" }}
        >
          ✦ sorteo ✦
        </p>
        <h1
          className="text-5xl md:text-6xl font-bold"
          style={{ color: 'var(--color-text)', fontFamily: "'Playfair Display', serif" }}
        >
          El Embrujo
        </h1>
      </motion.div>

      {/* Drum principal */}
      <motion.div
        className="w-full z-10"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        {nombres.length > 0 ? (
          <SpinningDrum
            nombres={nombres}
            isSpinning={isSpinning}
            ganador={ganador}
          />
        ) : (
          <div
            className="text-center py-16 opacity-40"
            style={{ color: 'var(--color-text)', fontFamily: "'DM Mono', monospace", fontSize: '0.85rem' }}
          >
            No hay participantes.<br />Vuelve a configurar el sorteo.
          </div>
        )}
      </motion.div>

      {/* Info excluido */}
      {nombreProhibido && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs z-10"
          style={{ color: 'var(--color-accent)', fontFamily: "'DM Mono', monospace", opacity: 0.7 }}
        >
          ⊘ {nombreProhibido} excluido · {elegibles.length} en juego
        </motion.p>
      )}

      {/* Botones */}
      <div className="flex flex-col items-center gap-3 z-10 w-full max-w-xs">
        <motion.button
          onClick={ejecutarSorteo}
          disabled={!canSortear}
          whileHover={canSortear ? { scale: 1.04 } : {}}
          whileTap={canSortear ? { scale: 0.96 } : {}}
          animate={isSpinning ? { boxShadow: ['0 6px 30px var(--color-accent-glow)', '0 8px 50px var(--color-accent-glow)', '0 6px 30px var(--color-accent-glow)'] } : {}}
          transition={isSpinning ? { repeat: Infinity, duration: 1 } : {}}
          className="w-full py-5 rounded-2xl text-xl font-bold tracking-wide disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300"
          style={{
            background: 'var(--color-accent)',
            color: 'oklch(98% 0.01 343)',
            border: 'none',
            fontFamily: "'Playfair Display', serif",
            boxShadow: canSortear ? '0 6px 30px var(--color-accent-glow)' : 'none',
            cursor: canSortear ? 'pointer' : 'default',
          }}
        >
          {isSpinning ? '…girando…' : '¡Sortear!'}
        </motion.button>

        <button
          onClick={() => navigate('/setup')}
          className="text-sm opacity-50 hover:opacity-80 transition-opacity"
          style={{ background: 'none', border: 'none', color: 'var(--color-text)', fontFamily: "'DM Mono', monospace", cursor: 'pointer' }}
        >
          ← Volver a configurar
        </button>
      </div>

      {/* Participantes en pequeño (solo info, no pantalla captura) */}
      <div className="flex flex-wrap justify-center gap-2 z-10 max-w-sm opacity-50">
        {nombres.map(n => (
          <span
            key={n}
            className="text-xs px-2 py-1 rounded-md"
            style={{
              background: 'var(--color-surface-2)',
              color: n === nombreProhibido ? 'var(--color-accent)' : 'var(--color-text)',
              fontFamily: "'DM Mono', monospace",
              textDecoration: n === nombreProhibido ? 'line-through' : 'none',
            }}
          >
            {n}
          </span>
        ))}
      </div>

      <ResultModal ganador={ganador} onClose={resetGanador} />
    </div>
  )
}
