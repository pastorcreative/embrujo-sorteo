import { useState, useCallback, useEffect } from 'react'
import type { FBPage } from '../types/facebook.d'
import {
  initFacebook,
  loginWithFacebook,
  logoutFromFacebook,
  getPages,
  getPagesThroughBusiness,
  getGrantedPermissions,
  getPostComments,
  extractPostId,
} from '../services/facebook'

type LoginStatus = 'disconnected' | 'connecting' | 'connected'

interface UseFacebookReturn {
  loginStatus: LoginStatus
  userName: string | null
  pages: FBPage[]
  selectedPage: FBPage | null
  postUrl: string
  importedNames: string[]
  allowDuplicates: boolean
  isLoading: boolean
  error: string | null
  login: () => Promise<void>
  logout: () => Promise<void>
  selectPage: (page: FBPage) => void
  setPostUrl: (url: string) => void
  setAllowDuplicates: (value: boolean) => void
  fetchComments: () => Promise<void>
  clearImported: () => void
}

export function useFacebook(): UseFacebookReturn {
  const [loginStatus, setLoginStatus] = useState<LoginStatus>('disconnected')
  const [userName, setUserName] = useState<string | null>(null)
  const [pages, setPages] = useState<FBPage[]>([])
  const [selectedPage, setSelectedPage] = useState<FBPage | null>(null)
  const [postUrl, setPostUrl] = useState('')
  const [importedNames, setImportedNames] = useState<string[]>([])
  const [allowDuplicates, setAllowDuplicates] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Inicializar el SDK al montar
  useEffect(() => {
    initFacebook().catch(() => {
      // El SDK fallará silenciosamente si el App ID no está configurado
    })
  }, [])

  const login = useCallback(async () => {
    setError(null)
    setLoginStatus('connecting')
    try {
      await initFacebook()
      const accessToken = await loginWithFacebook()

      // Verificar permisos realmente concedidos
      const granted = await getGrantedPermissions(accessToken)
      if (!granted.includes('pages_show_list')) {
        throw new Error(
          'No se concedió el permiso para acceder a las páginas. ' +
          'En el diálogo de Facebook, asegúrate de no desmarcar el acceso a las páginas y vuelve a intentarlo.'
        )
      }

      // Obtener nombre del usuario
      const nameResponse = await new Promise<string>((resolve, reject) => {
        window.FB.api('/me', { fields: 'name', access_token: accessToken }, (res) => {
          const r = res as unknown as { name?: string; error?: { message: string } }
          if (r.error) reject(new Error(r.error.message))
          else if (r.name) resolve(r.name)
          else reject(new Error('No se pudo obtener el nombre.'))
        })
      })
      setUserName(nameResponse)

      // Obtener páginas: primero por perfil directo, luego por Business Manager
      let userPages = await getPages(accessToken)
      if (userPages.length === 0) {
        userPages = await getPagesThroughBusiness(accessToken)
      }
      if (userPages.length === 0) {
        throw new Error(
          'No se encontraron páginas. Asegúrate de ser administrador de al menos una Página de Facebook ' +
          'y de haber concedido acceso a la app en el diálogo de inicio de sesión.'
        )
      }
      setPages(userPages)
      if (userPages.length === 1) setSelectedPage(userPages[0])

      setLoginStatus('connected')
    } catch (err) {
      setLoginStatus('disconnected')
      const msg = err instanceof Error ? err.message : ''
      if (
        msg.toLowerCase().includes('invalid scope') ||
        msg.toLowerCase().includes('invalid_scope') ||
        msg.toLowerCase().includes('este contenido no está disponible')
      ) {
        setError(
          'Los permisos requeridos no están disponibles. ' +
          'En Meta for Developers, cambia el tipo de app de "Consumer" a "Business" ' +
          '(Configuración → Avanzado → Tipo de app) y vuelve a intentarlo.'
        )
      } else {
        setError(msg || 'Error al conectar con Facebook.')
      }
    }
  }, [])

  const logout = useCallback(async () => {
    await logoutFromFacebook()
    setLoginStatus('disconnected')
    setUserName(null)
    setPages([])
    setSelectedPage(null)
    setPostUrl('')
    setImportedNames([])
    setError(null)
  }, [])

  const selectPage = useCallback((page: FBPage) => {
    setSelectedPage(page)
    setImportedNames([])
    setError(null)
  }, [])

  const fetchComments = useCallback(async () => {
    if (!selectedPage || !postUrl.trim()) return
    setError(null)
    setIsLoading(true)
    setImportedNames([])

    try {
      const postId = extractPostId(postUrl.trim())
      if (!postId) {
        throw new Error('No se pudo extraer el ID del post. Verifica que la URL sea correcta.')
      }

      const names = await getPostComments(postId, selectedPage.access_token, allowDuplicates)

      if (names.length === 0) {
        setError('No se encontraron comentarios con nombre de usuario en esta publicación.')
      } else {
        setImportedNames(names)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al obtener los comentarios.')
    } finally {
      setIsLoading(false)
    }
  }, [selectedPage, postUrl, allowDuplicates])

  const clearImported = useCallback(() => {
    setImportedNames([])
  }, [])

  return {
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
  }
}
