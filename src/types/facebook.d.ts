// Declaraciones TypeScript para el Facebook JS SDK (window.FB)

interface FBAuthResponse {
  accessToken: string
  expiresIn: number
  signedRequest: string
  userID: string
}

interface FBLoginStatusResponse {
  status: 'connected' | 'not_authorized' | 'unknown'
  authResponse: FBAuthResponse | null
}

interface FBLoginResponse {
  status: 'connected' | 'not_authorized' | 'unknown'
  authResponse: FBAuthResponse
}

interface FBApiResponse<T = Record<string, unknown>> {
  data?: T[]
  error?: {
    message: string
    type: string
    code: number
  }
  paging?: {
    cursors?: { before: string; after: string }
    next?: string
  }
}

interface FBPage {
  id: string
  name: string
  access_token: string
}

interface FBComment {
  id: string
  from?: {
    id: string
    name: string
  }
  message?: string
}

interface FBInitParams {
  appId: string
  cookie?: boolean
  xfbml?: boolean
  version: string
}

interface FacebookStatic {
  init(params: FBInitParams): void
  login(callback: (response: FBLoginResponse) => void, options?: { scope: string }): void
  logout(callback?: () => void): void
  getLoginStatus(callback: (response: FBLoginStatusResponse) => void): void
  api<T = Record<string, unknown>>(
    path: string,
    params: Record<string, string | number>,
    callback: (response: FBApiResponse<T>) => void
  ): void
  api<T = Record<string, unknown>>(
    path: string,
    callback: (response: FBApiResponse<T>) => void
  ): void
}

declare global {
  interface Window {
    FB: FacebookStatic
    fbAsyncInit?: () => void
  }
}

export type { FBPage, FBComment, FBAuthResponse, FBLoginStatusResponse, FBApiResponse }
