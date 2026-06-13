import Nav from './components/Nav'
import Hero from './components/Hero'
import Footer from './components/Footer'

export default function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        {/* Sections (About, Skills, Experience, Projects, Contact) land in Phases 1–3 */}
      </main>
      <Footer />
    </>
  )
}
