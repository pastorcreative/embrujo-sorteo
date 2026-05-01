import type { FBPage, FBComment, FBApiResponse } from '../types/facebook.d'

const APP_ID = import.meta.env.VITE_FACEBOOK_APP_ID as string

// Promesa compartida: múltiples llamadas simultáneas devuelven la misma
let initPromise: Promise<void> | null = null

/** Carga el FB JS SDK dinámicamente una sola vez y devuelve la misma promesa si ya está en curso */
export function initFacebook(): Promise<void> {
  if (initPromise) return initPromise

  initPromise = new Promise((resolve) => {
    // fbAsyncInit se define ANTES de inyectar el script para evitar race conditions
    window.fbAsyncInit = () => {
      window.FB.init({
        appId: APP_ID,
        cookie: true,
        xfbml: false,
        version: 'v22.0',
      })
      resolve()
    }

    if (document.getElementById('facebook-jssdk')) {
      // El script ya existe: si FB ya está disponible, inicializar directamente
      if (window.FB) {
        window.FB.init({ appId: APP_ID, cookie: true, xfbml: false, version: 'v22.0' })
        resolve()
      }
      // Si el script existe pero FB todavía no, fbAsyncInit se encargará
      return
    }

    const script = document.createElement('script')
    script.id = 'facebook-jssdk'
    script.src = 'https://connect.facebook.net/es_ES/sdk.js'
    script.async = true
    script.defer = true
    document.head.appendChild(script)
  })

  return initPromise
}

/** Inicia sesión con Facebook solicitando los permisos necesarios */
export function loginWithFacebook(): Promise<string> {
  return new Promise((resolve, reject) => {
    window.FB.login(
      (response) => {
        if (response.status === 'connected') {
          resolve(response.authResponse.accessToken)
        } else {
          reject(new Error('El usuario canceló el inicio de sesión o no autorizó la app.'))
        }
      },
      { scope: 'pages_show_list,pages_read_engagement,pages_read_user_content,business_management' }
    )
  })
}

/** Cierra sesión de Facebook */
export function logoutFromFacebook(): Promise<void> {
  return new Promise((resolve) => {
    window.FB.logout(() => resolve())
  })
}

/** Devuelve el nombre del usuario conectado */
export function getUsername(): Promise<string> {
  return new Promise((resolve, reject) => {
    window.FB.api<{ name: string }>('/me', { fields: 'name' }, (response) => {
      if (response.error || !response.data) {
        // /me no devuelve data[], sino el objeto directamente
        const res = response as unknown as { name?: string; error?: { message: string } }
        if (res.error) return reject(new Error(res.error.message))
        if (res.name) return resolve(res.name)
        reject(new Error('No se pudo obtener el nombre del usuario.'))
        return
      }
      reject(new Error('Respuesta inesperada de la API.'))
    })
  })
}

/** Obtiene las páginas gestionadas por el usuario autenticado (perfil directo) */
export function getPages(accessToken: string): Promise<FBPage[]> {
  return new Promise((resolve, reject) => {
    window.FB.api<FBPage>(
      '/me/accounts',
      { fields: 'id,name,access_token', limit: 50, access_token: accessToken },
      (response) => {
        if (response.error) {
          reject(new Error(response.error.message))
          return
        }
        resolve(response.data ?? [])
      }
    )
  })
}

/**
 * Obtiene páginas vinculadas a Business Manager.
 * Fallback para cuando /me/accounts no devuelve nada porque las páginas
 * están gestionadas a través de Meta Business Suite.
 */
export async function getPagesThroughBusiness(accessToken: string): Promise<FBPage[]> {
  // 1. Obtener negocios del usuario
  const businesses = await new Promise<{ id: string; name: string }[]>((resolve) => {
    window.FB.api<{ id: string; name: string }>(
      '/me/businesses',
      { fields: 'id,name', access_token: accessToken },
      (response) => resolve(response.data ?? [])
    )
  })

  if (businesses.length === 0) return []

  // 2. Para cada negocio, obtener las páginas que posee u opera
  const pageArrays = await Promise.all(
    businesses.map(
      (biz) =>
        new Promise<FBPage[]>((resolve) => {
          window.FB.api<FBPage>(
            `/${biz.id}/owned_pages`,
            { fields: 'id,name,access_token', limit: 50, access_token: accessToken },
            (response) => resolve(response.data ?? [])
          )
        })
    )
  )

  // Aplanar y deduplicar por ID de página
  const seen = new Set<string>()
  return pageArrays.flat().filter((p) => {
    if (seen.has(p.id)) return false
    seen.add(p.id)
    return true
  })
}

/** Devuelve los permisos que el usuario realmente ha concedido */
export function getGrantedPermissions(accessToken: string): Promise<string[]> {
  return new Promise((resolve) => {
    window.FB.api<{ permission: string; status: string }>(
      '/me/permissions',
      { access_token: accessToken },
      (response) => {
        const granted = (response.data ?? [])
          .filter(p => p.status === 'granted')
          .map(p => p.permission)
        resolve(granted)
      }
    )
  })
}

/**
 * Extrae el ID numérico de un post de Facebook desde distintos formatos de URL.
 * Soporta:
 *  - https://www.facebook.com/PageName/posts/123456789
 *  - https://www.facebook.com/permalink.php?story_fbid=123456789&id=987654321
 *  - https://www.facebook.com/groups/groupname/posts/123456789
 *  - https://www.facebook.com/photo/?fbid=123456789&set=...
 *  - https://www.facebook.com/photo.php?fbid=123456789
 *  - https://www.facebook.com/video.php?v=123456789
 *  - https://www.facebook.com/watch/?v=123456789
 *  - https://www.facebook.com/reel/123456789
 *  - https://www.facebook.com/PageName/videos/123456789
 */
export function extractPostId(url: string): string | null {
  try {
    const parsed = new URL(url)

    // /posts/POSTID
    const postsMatch = parsed.pathname.match(/\/posts\/(\d+)/)
    if (postsMatch) return postsMatch[1]

    // permalink.php?story_fbid=POSTID
    const storyFbId = parsed.searchParams.get('story_fbid')
    if (storyFbId) return storyFbId

    // photo/?fbid=POSTID  o  photo.php?fbid=POSTID
    const fbid = parsed.searchParams.get('fbid')
    if (fbid) return fbid

    // video.php?v=POSTID  o  watch/?v=POSTID
    const v = parsed.searchParams.get('v')
    if (v) return v

    // /reel/POSTID  o  /videos/POSTID
    const reelOrVideo = parsed.pathname.match(/\/(?:reel|videos)\/(\d+)/)
    if (reelOrVideo) return reelOrVideo[1]

    // Fallback: último segmento numérico de la ruta
    const segments = parsed.pathname.split('/').filter(Boolean)
    const lastNumeric = segments.reverse().find(s => /^\d+$/.test(s))
    if (lastNumeric) return lastNumeric

    return null
  } catch {
    return null
  }
}

/**
 * Obtiene todos los comentarios de una publicación con paginación automática.
 * Devuelve un array de nombres. Si allowDuplicates=false, deduplica por user ID.
 */
export async function getPostComments(
  postId: string,
  pageAccessToken: string,
  allowDuplicates: boolean
): Promise<string[]> {
  const seenIds = new Set<string>()
  const names: string[] = []
  let nextCursor: string | undefined

  const fetchPage = (): Promise<FBApiResponse<FBComment>> =>
    new Promise((resolve, reject) => {
      const params: Record<string, string | number> = {
        fields: 'from{id,name}',
        limit: 100,
        order: 'chronological',
        filter: 'stream',
        access_token: pageAccessToken,
      }
      if (nextCursor) params.after = nextCursor

      window.FB.api<FBComment>(`/${postId}/comments`, params, (response) => {
        if (response.error) {
          reject(new Error(response.error.message))
          return
        }
        resolve(response)
      })
    })

  // Bucle de paginación con cursor
  for (;;) {
    const response = await fetchPage()
    const comments = response.data ?? []

    for (const comment of comments) {
      const from = comment.from
      if (!from?.name) continue

      if (!allowDuplicates) {
        if (seenIds.has(from.id)) continue
        seenIds.add(from.id)
      }

      names.push(from.name)
    }

    // Si no hay página siguiente, salir
    const after = response.paging?.cursors?.after
    if (!after || !response.paging?.next) break
    nextCursor = after
  }

  return names
}
