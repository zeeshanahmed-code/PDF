import { Shield, Zap, Globe, ArrowRight, Star } from 'lucide-react'

export default function Hero({ onToolSelect }) {
  const popularTools = ['Merge PDF', 'Split PDF', 'Compress PDF', 'PDF to JPG']

  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-white to-slate-50 pt-24 pb-16 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-100 rounded-full opacity-40 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-slate-100 rounded-full opacity-60 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-700 text-sm font-500 px-4 py-1.5 rounded-full mb-6">
            <Star className="w-4 h-4 fill-blue-500 text-blue-500" />
            Trusted by 2,800+ users worldwide
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-700 text-gray-900 leading-tight mb-6">
            Free Online{' '}
            <span className="text-blue-600 relative">
              PDF Tools
              <svg className="absolute -bottom-2 left-0 right-0 w-full" viewBox="0 0 300 12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M2 9C50 3 100 1 150 3C200 5 250 7 298 3" stroke="#BFDBFE" strokeWidth="3" strokeLinecap="round"/>
              </svg>
            </span>
            {' '}for Everyone
          </h1>

          <p className="text-lg sm:text-xl text-gray-600 mb-8 leading-relaxed max-w-2xl mx-auto">
            Merge, split, compress, convert, rotate, and protect PDFs — all free, all private.
            Your files never leave your browser.
          </p>

          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-6 mb-10">
            <div className="flex items-center gap-2 text-gray-600 text-sm">
              <Shield className="w-5 h-5 text-green-500" />
              <span>100% Private</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 text-sm">
              <Zap className="w-5 h-5 text-yellow-500" />
              <span>Instant Processing</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 text-sm">
              <Globe className="w-5 h-5 text-blue-500" />
              <span>No Account Needed</span>
            </div>
          </div>

          {/* Quick tool buttons */}
          <div className="flex flex-wrap justify-center gap-3">
            {popularTools.map(tool => (
              <button
                key={tool}
                onClick={() => onToolSelect(tool)}
                className="group flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-5 py-2.5 rounded-xl text-sm font-500 hover:border-blue-400 hover:text-blue-600 hover:shadow-sm transition-all"
              >
                {tool}
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all" />
              </button>
            ))}
            <button
              onClick={() => document.getElementById('tools').scrollIntoView({ behavior: 'smooth' })}
              className="group flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-600 hover:bg-blue-700 shadow-sm transition-all"
            >
              View All Tools
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
