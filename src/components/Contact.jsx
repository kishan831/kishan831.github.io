import { useState } from 'react'
import { Mail, Github, Linkedin, Youtube, Send } from 'lucide-react'
import { Divider, Eyebrow, Reveal } from './primitives'
import { socials, FORMSPREE_ACTION } from '../data/portfolio'

const CONTACT_LINKS = [
  { Icon: Mail, label: 'Email', value: socials.email, href: `mailto:${socials.email}` },
  { Icon: Github, label: 'GitHub', value: 'github.com/kishan831', href: socials.github },
  { Icon: Linkedin, label: 'LinkedIn', value: 'Kishan Jaiswal', href: socials.linkedin },
  { Icon: Youtube, label: 'YouTube', value: 'Game Dev Channel', href: socials.youtube },
]

export default function Contact() {
  const [status, setStatus] = useState({ msg: '', ok: null })
  const [sending, setSending] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    const form = e.target
    setSending(true)
    setStatus({ msg: '', ok: null })
    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      })
      if (!res.ok) throw new Error('bad response')
      setStatus({ msg: "Thanks! I'll get back to you soon.", ok: true })
      form.reset()
    } catch {
      setStatus({ msg: 'Something went wrong. Please try again or email me directly.', ok: false })
    } finally {
      setSending(false)
    }
  }

  return (
    <section id="contact" className="relative z-10 py-[var(--space-section)]">
      <Divider />
      <div className="container-px max-w-5xl pt-[var(--space-section)]">
        <Reveal>
          <Eyebrow>Let's Connect</Eyebrow>
        </Reveal>

        <div className="grid gap-10 lg:grid-cols-5 lg:gap-14">
          <div className="lg:col-span-2">
            <Reveal>
              <h2 className="mb-4 font-heading text-fluid-xl font-bold leading-snug text-surface-50">
                Get In Touch
              </h2>
            </Reveal>
            <Reveal delay={0.05}>
              <p className="mb-8 text-[14px] leading-relaxed text-surface-400">
                I'm always interested in new opportunities — full-time, freelance, or contract
                Unity &amp; Game Development roles.
              </p>
            </Reveal>
            <div className="space-y-3">
              {CONTACT_LINKS.map(({ Icon, label, value, href }, i) => (
                <Reveal key={label} delay={i * 0.06}>
                  <a
                    href={href}
                    target={href.startsWith('http') ? '_blank' : undefined}
                    rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="card group flex items-center gap-3 rounded-xl p-4"
                  >
                    <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-mint-500/10">
                      <Icon size={16} className="text-mint-400" aria-hidden />
                    </span>
                    <span className="min-w-0">
                      <span className="block font-mono text-[11px] uppercase tracking-wider text-surface-500">
                        {label}
                      </span>
                      <span className="block truncate text-sm text-surface-200 transition group-hover:text-mint-400">
                        {value}
                      </span>
                    </span>
                  </a>
                </Reveal>
              ))}
            </div>
          </div>

          <div className="lg:col-span-3">
            <Reveal delay={0.1}>
              <div className="card rounded-2xl p-6 sm:p-8">
                <h3 className="mb-1 font-heading text-lg font-semibold text-surface-50">
                  Send a Message
                </h3>
                <p className="mb-6 text-xs text-surface-500">
                  Fill out the form and I'll get back to you as soon as possible.
                </p>
                <form action={FORMSPREE_ACTION} method="POST" onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field id="name" label="Name *" type="text" placeholder="Your name" />
                    <Field id="email" label="Email *" type="email" placeholder="you@email.com" />
                  </div>
                  <div>
                    <Label htmlFor="message">Message *</Label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={5}
                      placeholder="Tell me about your project..."
                      className="w-full resize-none rounded-xl border border-surface-500/10 bg-surface-800/60 px-4 py-3 text-sm text-surface-100 placeholder:text-surface-600 transition focus:border-mint-500/30 focus:outline-none focus:ring-1 focus:ring-mint-500/15"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={sending}
                    className="tap w-full gap-2 rounded-xl bg-mint-500 py-3.5 text-sm font-bold text-surface-900 transition-all duration-300 hover:shadow-[0_0_32px_rgba(0,214,138,0.2)] disabled:opacity-60"
                  >
                    {sending ? 'Sending…' : 'Send Message'}
                    {!sending && <Send size={16} />}
                  </button>
                  {status.msg && (
                    <p
                      className={`text-center text-xs ${
                        status.ok ? 'text-mint-400' : 'text-red-400'
                      }`}
                      role="status"
                    >
                      {status.msg}
                    </p>
                  )}
                </form>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}

function Label({ htmlFor, children }) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-surface-400"
    >
      {children}
    </label>
  )
}

function Field({ id, label, type, placeholder }) {
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <input
        id={id}
        name={id}
        type={type}
        required
        placeholder={placeholder}
        className="w-full rounded-xl border border-surface-500/10 bg-surface-800/60 px-4 py-3 text-sm text-surface-100 placeholder:text-surface-600 transition focus:border-mint-500/30 focus:outline-none focus:ring-1 focus:ring-mint-500/15"
      />
    </div>
  )
}
