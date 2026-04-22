import { useContext } from 'react'
import { SorteoContext } from '../context/SorteoContext'

export const useSorteo = () => {
  const ctx = useContext(SorteoContext)
  if (!ctx) throw new Error('useSorteo debe usarse dentro de SorteoProvider')
  return ctx
}
