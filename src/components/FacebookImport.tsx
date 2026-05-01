import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LogIn, LogOut, RefreshCw, Users, ToggleLeft, ToggleRight, AlertCircle, CheckCircle2, ChevronDown, Link, ChevronLeft, ChevronRight } from 'lucide-react'
import { useFacebook } from '../hooks/useFacebook'
import { useSorteo } from '../hooks/useSorteo'
import type { FBPage } from '../types/facebook.d'

const PAGE_SIZE = 10

export const FacebookImport = () => {
  const {
    loginStatus,
    userName,
    pages,
    selectedPage,
    postUrl,
    importedNames,
    allowDuplicates,
    isLoading,
    error,
    login,
    logout,
    selectPage,
    setPostUrl,
    setAllowDuplicates,
    fetchComments,
    clearImported,
  } = useFacebook()

  const { addNombres } = useSorteo()
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = Math.ceil(importedNames.length / PAGE_SIZE)
  const pageNames = importedNames.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
  const globalOffset = (currentPage - 1) * PAGE_SIZE

  // Resetear página al obtener nuevos resultados
  const handleFetchComments = () => {
    setCurrentPage(1)
    fetchComments()
  }

  const handleAddAll = () => {
    addNombres(importedNames)
    clearImported()
    setCurrentPage(1)
  }

  return (
    <div className="w-full max-w-md flex flex-col gap-4">

      {/* --- Paso 1: Conectar con Facebook --- */}
      <motion.div
        layout
        className="rounded-2xl px-5 py-4 flex flex-col gap-3"
        style={{ background: 'var(--color-surface)', border: '1.5px solid var(--color-border)' }}
      >
        <p className="text-xs uppercase tracking-widest opacity-50"
          style={{ fontFamily: "'DM Mono', monospace", color: 'var(--color-text)' }}>
          Paso 1 · Cuenta de Facebook
        </p>

        {loginStatus === 'disconnected' && (
          <button
            onClick={login}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl font-semibold transition-all duration-200"
            style={{
              background: '#1877F2',
              color: '#fff',
              border: 'none',
              fontFamily: "'DM Mono', monospace",
              fontSize: '0.9rem',
            }}
          >
            <FacebookIcon />
            Conectar con Facebook
          </button>
        )}

        {loginStatus === 'connecting' && (
          <div className="flex items-center gap-2 py-3 opacity-70"
            style={{ color: 'var(--color-text)', fontFamily: "'DM Mono', monospace", fontSize: '0.85rem' }}>
            <RefreshCw size={16} className="animate-spin" />
            Conectando…
          </div>
        )}

        {loginStatus === 'connected' && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={18} style={{ color: 'oklch(65% 0.2 145)' }} />
              <span style={{ color: 'var(--color-text)', fontFamily: "'DM Mono', monospace", fontSize: '0.85rem' }}>
                {userName}
              </span>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs opacity-60 hover:opacity-100 transition-opacity duration-200"
              style={{
                border: '1.5px solid var(--color-border)',
                background: 'transparent',
                color: 'var(--color-text)',
                fontFamily: "'DM Mono', monospace",
              }}
            >
              <LogOut size={13} strokeWidth={2} />
              Salir
            </button>
          </div>
        )}
      </motion.div>

      {/* --- Paso 2: Seleccionar Página --- */}
      <AnimatePresence>
        {loginStatus === 'connected' && (
          <motion.div
            layout
            key="step2"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="rounded-2xl px-5 py-4 flex flex-col gap-3"
            style={{ background: 'var(--color-surface)', border: '1.5px solid var(--color-border)' }}
          >
            <p className="text-xs uppercase tracking-widest opacity-50"
              style={{ fontFamily: "'DM Mono', monospace", color: 'var(--color-text)' }}>
              Paso 2 · Página de Facebook
            </p>

            {pages.length === 0 ? (
              <p className="text-sm opacity-50" style={{ color: 'var(--color-text)', fontFamily: "'DM Mono', monospace" }}>
                No se encontraron páginas gestionadas por esta cuenta.
              </p>
            ) : (
              <div className="relative">
                <select
                  value={selectedPage?.id ?? ''}
                  onChange={e => {
                    const page = pages.find((p: FBPage) => p.id === e.target.value)
                    if (page) selectPage(page)
                  }}
                  className="w-full appearance-none px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200 pr-10"
                  style={{
                    background: 'var(--color-surface)',
                    color: 'var(--color-text)',
                    border: `1.5px solid ${selectedPage ? 'var(--color-accent)' : 'var(--color-border)'}`,
                    fontFamily: "'DM Mono', monospace",
                  }}
                >
                  <option value="" disabled>Selecciona una página…</option>
                  {pages.map((page: FBPage) => (
                    <option key={page.id} value={page.id}>{page.name}</option>
                  ))}
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-50"
                  style={{ color: 'var(--color-text)' }} />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Paso 3: URL del post + opciones --- */}
      <AnimatePresence>
        {loginStatus === 'connected' && selectedPage && (
          <motion.div
            layout
            key="step3"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="rounded-2xl px-5 py-4 flex flex-col gap-4"
            style={{ background: 'var(--color-surface)', border: '1.5px solid var(--color-border)' }}
          >
            <p className="text-xs uppercase tracking-widest opacity-50"
              style={{ fontFamily: "'DM Mono', monospace", color: 'var(--color-text)' }}>
              Paso 3 · Publicación del sorteo
            </p>

            {/* Input URL */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Link size={15} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-40"
                  style={{ color: 'var(--color-text)' }} />
                <input
                  type="url"
                  value={postUrl}
                  onChange={e => setPostUrl(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') fetchComments() }}
                  placeholder="https://www.facebook.com/…/posts/…"
                  className="w-full pl-9 pr-4 py-3 rounded-xl text-sm outline-none transition-all duration-200"
                  style={{
                    background: 'var(--color-surface)',
                    color: 'var(--color-text)',
                    border: '1.5px solid var(--color-border)',
                    fontFamily: "'DM Mono', monospace",
                  }}
                  onFocus={e => e.currentTarget.style.borderColor = 'var(--color-accent)'}
                  onBlur={e => e.currentTarget.style.borderColor = 'var(--color-border)'}
                />
              </div>
            </div>

            {/* Toggle duplicados */}
            <button
              onClick={() => setAllowDuplicates(!allowDuplicates)}
              className="flex items-center gap-3 w-full text-left"
            >
              {allowDuplicates
                ? <ToggleRight size={24} style={{ color: 'var(--color-accent)', flexShrink: 0 }} />
                : <ToggleLeft size={24} style={{ color: 'var(--color-border)', flexShrink: 0 }} />
              }
              <div>
                <p className="text-sm" style={{ color: 'var(--color-text)', fontFamily: "'DM Mono', monospace" }}>
                  Permitir participantes duplicados
                </p>
                <p className="text-xs opacity-50" style={{ color: 'var(--color-text)', fontFamily: "'DM Mono', monospace" }}>
                  {allowDuplicates
                    ? 'Cada comentario cuenta como una participación'
                    : 'Un participante por persona (deduplicado)'}
                </p>
              </div>
            </button>

            {/* Botón importar */}
            <button
              onClick={handleFetchComments}
              disabled={!postUrl.trim() || isLoading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                background: 'var(--color-accent)',
                color: 'oklch(98% 0.01 343)',
                border: 'none',
                fontFamily: "'DM Mono', monospace",
                boxShadow: postUrl.trim() && !isLoading ? '0 4px 18px var(--color-accent-glow)' : 'none',
              }}
            >
              {isLoading ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  Cargando comentarios…
                </>
              ) : (
                <>
                  <Users size={16} strokeWidth={2} />
                  Importar comentarios
                </>
              )}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Error --- */}
      <AnimatePresence>
        {error && (
          <motion.div
            key="error"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            className="flex items-start gap-3 px-4 py-3 rounded-xl"
            style={{
              background: 'oklch(95% 0.03 20)',
              border: '1.5px solid oklch(70% 0.15 20)',
              color: 'oklch(40% 0.15 20)',
            }}
          >
            <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 2 }} />
            <p className="text-sm" style={{ fontFamily: "'DM Mono', monospace" }}>{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Preview de nombres importados --- */}
      <AnimatePresence>
        {importedNames.length > 0 && (
          <motion.div
            key="preview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="rounded-2xl px-5 py-4 flex flex-col gap-3"
            style={{ background: 'var(--color-surface)', border: '1.5px solid var(--color-accent)', boxShadow: '0 2px 16px var(--color-accent-glow)' }}
          >
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-widest"
                style={{ fontFamily: "'DM Mono', monospace", color: 'var(--color-accent)' }}>
                {importedNames.length} participante{importedNames.length !== 1 ? 's' : ''} encontrado{importedNames.length !== 1 ? 's' : ''}
              </p>
              {totalPages > 1 && (
                <p className="text-xs opacity-40"
                  style={{ fontFamily: "'DM Mono', monospace", color: 'var(--color-text)' }}>
                  Pág. {currentPage}/{totalPages}
                </p>
              )}
            </div>

            {/* Lista paginada */}
            <div className="flex flex-col gap-1">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentPage}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.15 }}
                  className="flex flex-col gap-1"
                >
                  {pageNames.map((name, i) => (
                    <div key={`${name}-${globalOffset + i}`} className="flex items-center gap-2 py-1.5 px-2 rounded-lg"
                      style={{ background: (globalOffset + i) % 2 === 0 ? 'transparent' : 'oklch(93% 0.03 343 / 0.5)' }}>
                      <span className="text-xs opacity-30 w-7 text-right shrink-0"
                        style={{ fontFamily: "'DM Mono', monospace", color: 'var(--color-text)' }}>
                        {globalOffset + i + 1}
                      </span>
                      <span className="text-sm"
                        style={{ color: 'var(--color-text)', fontFamily: "'Playfair Display', serif" }}>
                        {name}
                      </span>
                    </div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Controles de paginación */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all duration-200 disabled:opacity-25 disabled:cursor-not-allowed"
                  style={{
                    border: '1.5px solid var(--color-border)',
                    background: 'transparent',
                    color: 'var(--color-text)',
                    fontFamily: "'DM Mono', monospace",
                  }}
                >
                  <ChevronLeft size={13} strokeWidth={2} />
                  Anterior
                </button>

                {/* Indicadores de página */}
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                    .reduce<(number | '…')[]>((acc, p, idx, arr) => {
                      if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push('…')
                      acc.push(p)
                      return acc
                    }, [])
                    .map((item, idx) =>
                      item === '…' ? (
                        <span key={`ellipsis-${idx}`} className="text-xs opacity-30 px-1"
                          style={{ color: 'var(--color-text)', fontFamily: "'DM Mono', monospace" }}>…</span>
                      ) : (
                        <button
                          key={item}
                          onClick={() => setCurrentPage(item as number)}
                          className="w-6 h-6 rounded-md text-xs transition-all duration-200 flex items-center justify-center"
                          style={{
                            background: currentPage === item ? 'var(--color-accent)' : 'transparent',
                            color: currentPage === item ? 'oklch(98% 0.01 343)' : 'var(--color-text)',
                            border: currentPage === item ? 'none' : '1.5px solid var(--color-border)',
                            fontFamily: "'DM Mono', monospace",
                          }}
                        >
                          {item}
                        </button>
                      )
                    )
                  }
                </div>

                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all duration-200 disabled:opacity-25 disabled:cursor-not-allowed"
                  style={{
                    border: '1.5px solid var(--color-border)',
                    background: 'transparent',
                    color: 'var(--color-text)',
                    fontFamily: "'DM Mono', monospace",
                  }}
                >
                  Siguiente
                  <ChevronRight size={13} strokeWidth={2} />
                </button>
              </div>
            )}

            {/* Botón confirmar */}
            <button
              onClick={handleAddAll}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all duration-200"
              style={{
                background: 'var(--color-text)',
                color: 'var(--color-bg)',
                border: 'none',
                fontFamily: "'Playfair Display', serif",
                letterSpacing: '0.04em',
                boxShadow: '0 4px 20px oklch(29.1% 0.149 302.717 / 0.2)',
              }}
            >
              <LogIn size={16} strokeWidth={2.5} />
              Añadir al sorteo
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/** Icono SVG oficial de Facebook */
const FacebookIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
)
