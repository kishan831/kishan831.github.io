import { useEffect, useState } from 'react'

function hhmm(date) {
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

/** Minute resolution on purpose — a per-second tick would re-render the HUD 60× more often for no gain. */
export default function Clock() {
  const [now, setNow] = useState(() => hhmm(new Date()))

  useEffect(() => {
    const id = setInterval(() => setNow(hhmm(new Date())), 15000)
    return () => clearInterval(id)
  }, [])

  return <span className="font-mono text-[13px] tabular-nums text-bone">{now}</span>
}
