import { useEffect, useState } from 'react'
import { ChevronUp } from 'lucide-react'

export default function ScrollTop() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 500)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Back to top"
      className={`tap card fixed bottom-5 right-5 z-50 rounded-full text-mint-400 transition-all duration-300 hover:bg-mint-500 hover:text-surface-900 ${
        show ? 'opacity-100' : 'pointer-events-none opacity-0'
      }`}
    >
      <ChevronUp size={20} />
    </button>
  )
}
