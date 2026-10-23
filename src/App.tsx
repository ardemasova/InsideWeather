import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { WeatherSelector } from './components/WeatherSelector'
import { Philosophy } from './components/Philosophy'
import { AIJournal } from './components/AIJournal'
import { HowItWorks } from './components/HowItWorks'
import { Approaches } from './components/Approaches'
import { FinalCTA, Footer, Privacy } from './components/Closing'

export default function App() {
  return (
    <>
      <Header />
      <main id="main" tabIndex={-1} className="outline-none">
        <Hero />
        <WeatherSelector />
        <Philosophy />
        <AIJournal />
        <HowItWorks />
        <Approaches />
        <Privacy />
        <FinalCTA />
      </main>
      <Footer />
    </>
  )
}
