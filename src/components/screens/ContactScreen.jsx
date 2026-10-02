import { useState } from 'react'
import { Mail, Send } from 'lucide-react'
import { Github, Linkedin, Youtube } from '../BrandIcons'
import { socials, FORMSPREE_ACTION } from '../../data/portfolio'

const CHANNELS = [
  { Icon: Mail, label: 'Email', value: socials.email, href: `mailto:${socials.email}` },
  { Icon: Linkedin, label: 'LinkedIn', value: '/in/kishan-jaiswal', href: socials.linkedin },
  { Icon: Github, label: 'GitHub', value: '/kishan831', href: socials.github },
  { Icon: Youtube, label: 'YouTube', value: 'Gameplay demos', href: socials.youtube },
]

const FIELD_CLASS =
  'min-h-[44px] w-full rounded-lg border border-bone/15 bg-ink-950/60 px-3.5 py-2.5 text-sm text-bone placeholder:text-bone/60 focus:border-[var(--accent)] focus:outline-hidden'

const LABEL_CLASS =
  'mb-1 block font-mono text-[10px] uppercase tracking-[0.16em] text-bone/60'

export default function ContactScreen() {
  const [errors, setErrors] = useState([])
  const [sent, setSent] = useState(false)

  function onSubmit(event) {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    const name = String(data.get('name') || '').trim()
    const email = String(data.get('email') || '').trim()
    const message = String(data.get('message') || '').trim()

    const found = []
    if (!name) found.push('Name is required.')
    if (!email) found.push('Email is required.')
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) found.push('Email looks invalid.')
    if (!message) found.push('Message is required.')

    setErrors(found)
    if (found.length > 0) return

    if (FORMSPREE_ACTION) {
      form.submit()
      return
    }

    const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`)
    window.location.href = `mailto:${socials.email}?subject=${encodeURIComponent(
      `Portfolio enquiry from ${name}`,
    )}&body=${body}`
    setSent(true)
  }

  return (
    <div className="max-w-xl">
      <h1 className="font-display mb-1 text-[var(--fs-screen)] uppercase italic leading-none text-bone">
        Contact
      </h1>
      <p className="script-sub mb-6 text-[clamp(1rem,0.9rem+0.8vw,1.6rem)]">Let&apos;s connect</p>

      <ul className="mb-6 space-y-1.5">
        {CHANNELS.map(({ Icon, label, value, href }) => (
          <li key={label}>
            <a
              href={href}
              target={href.startsWith('mailto:') ? undefined : '_blank'}
              rel="noopener noreferrer"
              className="tap w-full justify-start gap-3 rounded-lg border border-bone/10 bg-ink-950/55 px-3.5 py-2.5 hover:border-[var(--accent)]/40"
            >
              <Icon size={14} className="shrink-0 text-[var(--accent)]" aria-hidden />
              <span className="min-w-0">
                <span className="block font-mono text-[9px] uppercase tracking-[0.18em] text-bone/60">
                  {label}
                </span>
                <span className="block truncate text-sm text-bone">{value}</span>
              </span>
            </a>
          </li>
        ))}
      </ul>

      {errors.length > 0 && (
        <ul role="alert" className="mb-3 space-y-1 rounded-lg border border-red-500/40 bg-red-500/10 px-3.5 py-2.5">
          {errors.map((e) => (
            <li key={e} className="text-xs text-red-200">
              {e}
            </li>
          ))}
        </ul>
      )}

      {sent && (
        <p className="mb-3 rounded-lg border border-mint-500/40 bg-mint-500/10 px-3.5 py-2.5 text-xs text-mint-500">
          Your mail client should be opening. If it did not, write to {socials.email}.
        </p>
      )}

      <form
        onSubmit={onSubmit}
        action={FORMSPREE_ACTION || undefined}
        method={FORMSPREE_ACTION ? 'POST' : undefined}
        noValidate
        className="space-y-2.5"
      >
        <div>
          <label htmlFor="name" className={LABEL_CLASS}>
            Name
          </label>
          <input id="name" name="name" required className={FIELD_CLASS} placeholder="Your name" />
        </div>
        <div>
          <label htmlFor="email" className={LABEL_CLASS}>
            Email
          </label>
          <input id="email" name="email" type="email" required className={FIELD_CLASS} placeholder="you@company.com" />
        </div>
        <div>
          <label htmlFor="message" className={LABEL_CLASS}>
            Message
          </label>
          <textarea id="message" name="message" rows={4} required className={`${FIELD_CLASS} resize-none`} placeholder="What are you building?" />
        </div>
        <button
          type="submit"
          className="tap gap-2 rounded-lg px-5 py-3 font-mono text-[12px] font-bold tracking-[0.12em] text-ink-950"
          style={{ background: 'var(--accent)' }}
        >
          <Send size={14} aria-hidden /> SEND MESSAGE
        </button>
      </form>
    </div>
  )
}
