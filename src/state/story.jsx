import { createContext, useContext, useEffect, useState } from 'react'
import { MOMENTS } from '../data/scenario'

const StoryContext = createContext(null)

export function StoryProvider({ children }) {
  const [index, setIndex] = useState(0)
  const go = (i) => setIndex(Math.max(0, Math.min(MOMENTS.length - 1, i)))

  useEffect(() => {
    const onKey = (e) => {
      if (e.target.closest?.('input, textarea, select')) return
      if (e.key === 'ArrowRight') go(index + 1)
      if (e.key === 'ArrowLeft') go(index - 1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [index])

  return (
    <StoryContext.Provider value={{ index, moment: MOMENTS[index], go, total: MOMENTS.length }}>
      {children}
    </StoryContext.Provider>
  )
}

export const useStory = () => useContext(StoryContext)
