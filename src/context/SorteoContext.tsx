import { createContext, useState, useCallback, type ReactNode } from 'react'

export interface SorteoState {
  nombres: string[]
  nombreProhibido: string | null
  ganador: string | null
  isSpinning: boolean
  addNombre: (nombre: string) => void
  removeNombre: (nombre: string) => void
  setNombreProhibido: (nombre: string | null) => void
  ejecutarSorteo: () => void
  resetGanador: () => void
  reset: () => void
}

export const SorteoContext = createContext<SorteoState | null>(null)

export const SorteoProvider = ({ children }: { children: ReactNode }) => {
  const [nombres, setNombres] = useState<string[]>([])
  const [nombreProhibido, setNombreProhibido] = useState<string | null>(null)
  const [ganador, setGanador] = useState<string | null>(null)
  const [isSpinning, setIsSpinning] = useState(false)

  const addNombre = useCallback((nombre: string) => {
    const trimmed = nombre.trim()
    if (!trimmed) return
    setNombres(prev => prev.includes(trimmed) ? prev : [...prev, trimmed])
  }, [])

  const removeNombre = useCallback((nombre: string) => {
    setNombres(prev => prev.filter(n => n !== nombre))
    setNombreProhibido(prev => prev === nombre ? null : prev)
  }, [])

  const ejecutarSorteo = useCallback(() => {
    const elegibles = nombres.filter(n => n !== nombreProhibido)
    if (elegibles.length === 0) return
    setIsSpinning(true)
    setGanador(null)

    setTimeout(() => {
      const idx = Math.floor(Math.random() * elegibles.length)
      setGanador(elegibles[idx])
      setIsSpinning(false)
    }, 3500)
  }, [nombres, nombreProhibido])

  const resetGanador = useCallback(() => {
    setGanador(null)
  }, [])

  const reset = useCallback(() => {
    setGanador(null)
    setIsSpinning(false)
  }, [])

  return (
    <SorteoContext.Provider
      value={{
        nombres,
        nombreProhibido,
        ganador,
        isSpinning,
        addNombre,
        removeNombre,
        setNombreProhibido,
        ejecutarSorteo,
        resetGanador,
        reset,
      }}
    >
      {children}
    </SorteoContext.Provider>
  )
}
