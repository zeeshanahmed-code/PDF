import { useState } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import Hero from './components/Hero'
import ToolsGrid from './components/ToolsGrid'
import HowItWorks from './components/HowItWorks'
import FAQ from './components/FAQ'
import ToolModal from './components/ToolModal'

export default function App() {
  const [activeTool, setActiveTool] = useState(null)

  return (
    <div className="min-h-screen bg-white">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded z-50">
        Skip to main content
      </a>
      <Header onToolSelect={setActiveTool} />
      <main id="main">
        <Hero onToolSelect={setActiveTool} />
        <ToolsGrid onToolSelect={setActiveTool} />
        <HowItWorks />
        <FAQ />
      </main>
      <Footer />
      {activeTool && (
        <ToolModal tool={activeTool} onClose={() => setActiveTool(null)} />
      )}
    </div>
  )
}
