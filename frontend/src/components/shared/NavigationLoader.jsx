import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { useLoading } from '../../context/LoadingContext'

/**
 * Mounts inside a Router. Shows the pencil loader for a brief moment
 * on every pathname change (i.e. every sidebar navigation).
 */
export default function NavigationLoader() {
  const location  = useLocation()
  const { show, hide } = useLoading()
  const firstRender = useRef(true)

  useEffect(() => {
    // Skip the very first mount — page already loaded
    if (firstRender.current) { firstRender.current = false; return }

    show()
    const t = setTimeout(hide, 600)   // show pencil for 600 ms on nav
    return () => clearTimeout(t)
  }, [location.pathname])             // eslint-disable-line

  return null
}
