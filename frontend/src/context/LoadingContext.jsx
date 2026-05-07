import { createContext, useContext, useState, useCallback } from 'react'
import Loader from '../components/shared/Loader'

const LoadingContext = createContext(null)

export function LoadingProvider({ children }) {
  const [state, setState] = useState({ visible: false, text: '' })

  const show = useCallback((text = '') => setState({ visible: true, text }), [])

  // Wait for React to paint the new content before hiding the loader.
  // requestAnimationFrame fires after the browser has rendered the frame,
  // so the page is never blank between loader-hide and content-show.
  const hide = useCallback(() => {
    requestAnimationFrame(() =>
      requestAnimationFrame(() =>
        setState({ visible: false, text: '' })
      )
    )
  }, [])

  const wrap = useCallback(async (fn, text = '') => {
    show(text)
    try { return await fn() }
    finally { hide() }
  }, [show, hide])

  return (
    <LoadingContext.Provider value={{ show, hide, wrap }}>
      <Loader visible={state.visible} text={state.text} />
      {children}
    </LoadingContext.Provider>
  )
}

export const useLoading = () => useContext(LoadingContext)
