import { useState, type KeyboardEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useSorteo } from '../hooks/useSorteo'

export const SetupPage = () => {
  const { nombres, nombreProhibido, addNombre, removeNombre, setNombreProhibido } = useSorteo()
  const [inputVal, setInputVal] = useState('')
  const navigate = useNavigate()

  const handleAdd = () => {
    const trimmed = inputVal.trim()
    if (!trimmed) return
    addNombre(trimmed)
    setInputVal('')
  }

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleAdd()
  }

  const toggleProhibido = (nombre: string) => {
    setNombreProhibido(nombreProhibido === nombre ? null : nombre)
  }

  const canStart = nombres.filter(n => n !== nombreProhibido).length >= 2

  return (
    <div className="min-h-dvh flex flex-col items-center px-4 py-10 gap-8"
      style={{ background: 'var(--color-bg)' }}>

      {/* Header */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <p className="text-sm tracking-[0.3em] uppercase mb-1 font-mono-custom"
          style={{ color: 'var(--color-accent)' }}>
          configuración
        </p>
        <h1 className="text-5xl md:text-6xl font-bold leading-tight"
          style={{ color: 'var(--color-text)', fontFamily: "'Playfair Display', serif" }}>
          Embrujo Modas
        </h1>
        <p className="text-base mt-2 opacity-60"
          style={{ color: 'var(--color-text)', fontFamily: "'DM Mono', monospace" }}>
          Añade los participantes del sorteo
        </p>
      </motion.div>

      {/* Input */}
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className="flex gap-2">
          <input
            type="text"
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Nombre del participante…"
            className="flex-1 px-4 py-3 rounded-xl text-base outline-none transition-all duration-200"
            style={{
              background: 'var(--color-surface)',
              color: 'var(--color-text)',
              border: '1.5px solid var(--color-border)',
              fontFamily: "'DM Mono', monospace",
            }}
            onFocus={e => e.currentTarget.style.borderColor = 'var(--color-accent)'}
            onBlur={e => e.currentTarget.style.borderColor = 'var(--color-border)'}
          />
          <button
            onClick={handleAdd}
            disabled={!inputVal.trim()}
            className="px-5 py-3 rounded-xl font-bold text-base transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: 'var(--color-accent)',
              color: 'oklch(98% 0.01 343)',
              border: 'none',
              fontFamily: "'Playfair Display', serif",
              boxShadow: '0 4px 18px var(--color-accent-glow)',
            }}
          >
            +
          </button>
        </div>
      </motion.div>

      {/* Lista de participantes */}
      <div className="w-full max-w-md flex flex-col gap-2">
        <AnimatePresence>
          {nombres.map((nombre) => {
            const isProhibido = nombre === nombreProhibido
            return (
              <motion.div
                key={nombre}
                layout
                initial={{ opacity: 0, x: -20, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 20, scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                className="flex items-center justify-between px-4 py-3 rounded-xl"
                style={{
                  background: isProhibido ? 'oklch(89% 0.06 343 / 0.6)' : 'var(--color-surface)',
                  border: `1.5px solid ${isProhibido ? 'var(--color-accent)' : 'var(--color-border)'}`,
                  boxShadow: isProhibido ? '0 2px 12px var(--color-accent-glow)' : 'none',
                }}
              >
                <span
                  className="text-base flex-1"
                  style={{
                    color: isProhibido ? 'var(--color-accent)' : 'var(--color-text)',
                    fontFamily: "'Playfair Display', serif",
                    fontStyle: isProhibido ? 'italic' : 'normal',
                  }}
                >
                  {nombre}
                </span>
                <div className="flex items-center gap-2">
                  {/* Toggle prohibido */}
                  <button
                    onClick={() => toggleProhibido(nombre)}
                    title={isProhibido ? 'Quitar exclusión' : 'Marcar como excluido'}
                    className="w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 text-xs"
                    style={{
                      background: isProhibido ? 'var(--color-accent)' : 'transparent',
                      border: `1.5px solid ${isProhibido ? 'var(--color-accent)' : 'var(--color-border)'}`,
                      color: isProhibido ? 'white' : 'var(--color-border)',
                    }}
                  >
                    {isProhibido ? '✕' : '⊘'}
                  </button>
                  {/* Eliminar */}
                  <button
                    onClick={() => removeNombre(nombre)}
                    className="w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 text-xs opacity-50 hover:opacity-100"
                    style={{
                      background: 'transparent',
                      border: '1.5px solid var(--color-border)',
                      color: 'var(--color-text)',
                    }}
                  >
                    ×
                  </button>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>

        {nombres.length === 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8 opacity-40 text-sm"
            style={{ fontFamily: "'DM Mono', monospace", color: 'var(--color-text)' }}
          >
            Sin participantes aún
          </motion.p>
        )}
      </div>

      {/* Leyenda excluidos */}
      {nombreProhibido && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-center"
          style={{ color: 'var(--color-accent)', fontFamily: "'DM Mono', monospace" }}
        >
          ⊘ <em>{nombreProhibido}</em> no puede ganar esta vez
        </motion.p>
      )}

      {/* Botón ir al sorteo */}
      <motion.button
        onClick={() => navigate('/sorteo')}
        disabled={!canStart}
        whileHover={canStart ? { scale: 1.03 } : {}}
        whileTap={canStart ? { scale: 0.97 } : {}}
        className="mt-2 px-10 py-4 rounded-2xl text-lg font-bold transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
        style={{
          background: canStart ? 'var(--color-text)' : 'var(--color-border)',
          color: 'var(--color-bg)',
          border: 'none',
          fontFamily: "'Playfair Display', serif",
          letterSpacing: '0.05em',
          boxShadow: canStart ? '0 6px 30px oklch(29.1% 0.149 302.717 / 0.25)' : 'none',
        }}
      >
        Ir al Sorteo →
      </motion.button>

      {!canStart && nombres.length > 0 && (
        <p className="text-xs opacity-50 -mt-4" style={{ fontFamily: "'DM Mono', monospace", color: 'var(--color-text)' }}>
          Necesitas al menos 2 participantes elegibles
        </p>
      )}
    </div>
  )
}
