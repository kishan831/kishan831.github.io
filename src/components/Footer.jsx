import { Github, Linkedin, Youtube, Gamepad2, PenTool } from 'lucide-react'

const SOCIALS = [
  { href: 'https://github.com/kishan831', label: 'GitHub', Icon: Github },
  {
    href: 'https://www.linkedin.com/in/kishan-jaiswal-2586a4220/',
    label: 'LinkedIn',
    Icon: Linkedin,
  },
  {
    href: 'https://www.youtube.com/channel/UCrN0559CtMg-NeUi-9bqrTQ',
    label: 'YouTube',
    Icon: Youtube,
  },
  { href: 'https://unitydev831.itch.io', label: 'itch.io', Icon: Gamepad2 },
  { href: 'https://medium.com/@jaiswalkishan628', label: 'Medium', Icon: PenTool },
]

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/[0.06] py-7">
      <div className="container-px flex flex-col items-center justify-between gap-3 sm:flex-row">
        <p className="font-mono text-[11px] text-surface-500">
          &copy; {new Date().getFullYear()} Kishan Jaiswal
        </p>
        <div className="flex items-center gap-1">
          {SOCIALS.map(({ href, label, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="tap text-surface-500 transition hover:text-mint-400"
            >
              <Icon size={18} />
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}
