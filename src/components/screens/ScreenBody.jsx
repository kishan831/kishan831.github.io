import { getScreen } from '../../data/screens'
import StartScreen from './StartScreen'
import AboutScreen from './AboutScreen'
import SkillsScreen from './SkillsScreen'
import ProjectsScreen from './ProjectsScreen'
import ExperienceScreen from './ExperienceScreen'
import AchievementsScreen from './AchievementsScreen'

const BODIES = {
  start: StartScreen,
  about: AboutScreen,
  skills: SkillsScreen,
  projects: ProjectsScreen,
  experience: ExperienceScreen,
  achievements: AchievementsScreen,
}

export default function ScreenBody({ screenId }) {
  const Body = BODIES[screenId]
  if (Body) return <Body />

  const screen = getScreen(screenId)
  return (
    <h1 className="font-display text-[var(--fs-screen)] uppercase italic leading-none text-bone">
      {screen.label}
    </h1>
  )
}
