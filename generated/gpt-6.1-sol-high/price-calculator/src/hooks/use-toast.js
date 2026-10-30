import { useCallback, useEffect, useState } from 'react'

// Shared toast state, following Shadcn's useToast interface.
let current = null
const listeners = new Set()
let timer
export function toast({ title, description }) {
  clearTimeout(timer)
  current = { id: Date.now(), title, description }
  listeners.forEach((listener) => listener(current))
  timer = setTimeout(() => {
    current = null
    listeners.forEach((listener) => listener(null))
  }, 3500)
}
export function useToast() {
  const [message, setMessage] = useState(current)
  useEffect(() => { listeners.add(setMessage); return () => listeners.delete(setMessage) }, [])
  const dismiss = useCallback(() => { current = null; listeners.forEach((listener) => listener(null)) }, [])
  return { toast, toasts: message ? [message] : [], dismiss }
}
