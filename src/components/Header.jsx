import { useState, useEffect } from 'react'
import { FileText, Menu, X, ChevronDown } from 'lucide-react'

const toolGroups = [
  {
    label: 'Organize',
    tools: ['Merge PDF', 'Split PDF', 'Delete Pages', 'Reorder Pages']
  },
  {
    label: 'Optimize',
    tools: ['Compress PDF', 'Rotate PDF']
  },
  {
    label: 'Convert',
    tools: ['PDF to JPG', 'JPG to PDF', 'PDF to PNG', 'PDF to Text']
  },
  {
    label: 'Security',
    tools: ['Protect PDF', 'Unlock PDF']
  },
  {
    label: 'Extract',
    tools: ['Extract Images', 'Extract Text']
  }
]

export default function Header({ onToolSelect }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-md' : 'bg-white/95 backdrop-blur-sm'
      }`}
      role="banner"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 group" aria-label="PDF Master Home">
            <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm group-hover:bg-blue-700 transition-colors">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-700 text-gray-900">
              PDF <span className="text-blue-600">Master</span>
            </span>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6" role="navigation" aria-label="Main navigation">
            <div className="relative">
              <button
                className="flex items-center gap-1 text-gray-600 hover:text-blue-600 font-500 transition-colors text-sm"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                aria-expanded={dropdownOpen}
                aria-haspopup="true"
              >
                All Tools <ChevronDown className={`w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {dropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                  {toolGroups.map(group => (
                    <div key={group.label}>
                      <div className="px-4 py-1.5 text-xs font-600 text-gray-400 uppercase tracking-wider">{group.label}</div>
                      {group.tools.map(tool => (
                        <button
                          key={tool}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                          onClick={() => { onToolSelect(tool); setDropdownOpen(false) }}
                        >
                          {tool}
                        </button>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <a href="#how-it-works" className="text-gray-600 hover:text-blue-600 font-500 transition-colors text-sm">How it Works</a>
            <a href="#faq" className="text-gray-600 hover:text-blue-600 font-500 transition-colors text-sm">FAQ</a>
            <button
              onClick={() => document.getElementById('tools').scrollIntoView({ behavior: 'smooth' })}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-600 hover:bg-blue-700 transition-colors shadow-sm"
            >
              Get Started
            </button>
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-gray-600 hover:text-gray-900"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
            aria-label="Toggle mobile menu"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 shadow-lg">
          {toolGroups.map(group => (
            <div key={group.label} className="mb-3">
              <div className="text-xs font-600 text-gray-400 uppercase tracking-wider mb-1">{group.label}</div>
              <div className="grid grid-cols-2 gap-1">
                {group.tools.map(tool => (
                  <button
                    key={tool}
                    className="text-left px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                    onClick={() => { onToolSelect(tool); setMenuOpen(false) }}
                  >
                    {tool}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </header>
  )
}
