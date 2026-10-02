import StartScreen from './StartScreen'
import AboutScreen from './AboutScreen'
import SkillsScreen from './SkillsScreen'
import ProjectsScreen from './ProjectsScreen'
import ExperienceScreen from './ExperienceScreen'
import AchievementsScreen from './AchievementsScreen'
import AcademyScreen from './AcademyScreen'
import ContactScreen from './ContactScreen'
import ExitScreen from './ExitScreen'

const BODIES = {
  start: StartScreen,
  about: AboutScreen,
  skills: SkillsScreen,
  projects: ProjectsScreen,
  experience: ExperienceScreen,
  achievements: AchievementsScreen,
  academy: AcademyScreen,
  contact: ContactScreen,
  exit: ExitScreen,
}

export default function ScreenBody({ screenId }) {
  const Body = BODIES[screenId] ?? StartScreen
  return <Body />
}
