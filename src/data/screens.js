import {
  Play, User, Code2, FolderGit2, Briefcase, Trophy, GraduationCap, Mail, Power,
} from 'lucide-react'

/**
 * The nine screens. This is the only file to edit when content changes —
 * no component reads anything hard-coded about a specific screen.
 *
 * plate: basename under /plates/, resolved to responsive AVIF and WebP.
 */
export const screens = [
  {
    id: 'start',
    label: 'START GAME',
    Icon: Play,
    accent: '#ff3e88',
    accentHi: '#ff7ab0',
    objective: 'BUILD NEXT-LEVEL REAL-TIME SYSTEMS',
    plate: '1-start',
    parallax: true,
  },
  {
    id: 'about',
    label: 'ABOUT ME',
    Icon: User,
    accent: '#ff8a3d',
    accentHi: '#ffad74',
    objective: 'LEARN WHO YOU ARE DEALING WITH',
    plate: '2-about',
  },
  {
    id: 'skills',
    label: 'SKILLS',
    Icon: Code2,
    accent: '#7c6cff',
    accentHi: '#a79bff',
    objective: 'REVIEW UNLOCKED ABILITIES',
    plate: '3-skills',
  },
  {
    id: 'projects',
    label: 'PROJECTS',
    Icon: FolderGit2,
    accent: '#19c8ff',
    accentHi: '#6bdcff',
    objective: 'INSPECT THE COMPLETED BUILDS',
    plate: '4-projects',
  },
  {
    id: 'experience',
    label: 'EXPERIENCE',
    Icon: Briefcase,
    accent: '#5b7cff',
    accentHi: '#8fa5ff',
    objective: 'TRACE THE FULL CAREER PATH',
    plate: '5-experience',
  },
  {
    id: 'achievements',
    label: 'ACHIEVEMENTS',
    Icon: Trophy,
    accent: '#ff2e63',
    accentHi: '#ff6f93',
    objective: 'COLLECT EVERY UNLOCKED TROPHY',
    plate: '6-achievements',
  },
  {
    id: 'academy',
    label: 'ACADEMY',
    Icon: GraduationCap,
    accent: '#ffb43d',
    accentHi: '#ffcd7a',
    objective: 'SHARE WHAT THE JOURNEY TAUGHT',
    plate: '7-academy',
  },
  {
    id: 'contact',
    label: 'CONTACT',
    Icon: Mail,
    accent: '#3dd6ff',
    accentHi: '#84e6ff',
    objective: 'OPEN A SECURE LINE OF CONTACT',
    plate: '8-contact',
  },
  {
    id: 'exit',
    label: 'EXIT GAME',
    Icon: Power,
    accent: '#ff9e6b',
    accentHi: '#ffc0a0',
    objective: 'RIDE OFF INTO THE SUNRISE',
    plate: '9-exit',
  },
]

export const screenIds = screens.map((s) => s.id)

export const DEFAULT_SCREEN_ID = 'start'

export function getScreen(id) {
  return screens.find((s) => s.id === id)
}
