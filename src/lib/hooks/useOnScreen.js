import { useState, useEffect } from 'react'

const useOnScreen = (ref) => {
  const [isIntersecting, setIntersecting] = useState(false)
  // useRef, damnit
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) =>
      setIntersecting(entry.isIntersecting)
    )
    if (ref.current) {
      observer.observe(ref.current)
    }
  }, [ref])
  return isIntersecting || null
}
export default useOnScreen
