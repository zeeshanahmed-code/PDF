import { FileText, Github, Twitter, Shield, Zap, Globe } from 'lucide-react'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-gray-400" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-blue-500 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-700 text-white">PDF <span className="text-blue-400">Master</span></span>
            </div>
            <p className="text-sm leading-relaxed mb-4">
              Free online PDF tools. No upload required — all processing happens in your browser for maximum privacy.
            </p>
            <div className="flex gap-3">
              <a href="https://twitter.com/pdfmaster" aria-label="Twitter" className="hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="https://github.com/pdfmaster" aria-label="GitHub" className="hover:text-white transition-colors">
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* PDF Tools */}
          <div>
            <h3 className="text-white font-600 mb-4 text-sm uppercase tracking-wider">PDF Tools</h3>
            <ul className="space-y-2 text-sm">
              {['Merge PDF', 'Split PDF', 'Compress PDF', 'Rotate PDF', 'Delete Pages', 'Reorder Pages'].map(tool => (
                <li key={tool}>
                  <a href={`#${tool.toLowerCase().replace(/ /g, '-')}`} className="hover:text-white transition-colors">{tool}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Convert */}
          <div>
            <h3 className="text-white font-600 mb-4 text-sm uppercase tracking-wider">Convert & Extract</h3>
            <ul className="space-y-2 text-sm">
              {['PDF to JPG', 'JPG to PDF', 'PDF to PNG', 'PDF to Text', 'Extract Images', 'Extract Text'].map(tool => (
                <li key={tool}>
                  <a href={`#${tool.toLowerCase().replace(/ /g, '-')}`} className="hover:text-white transition-colors">{tool}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Security features */}
          <div>
            <h3 className="text-white font-600 mb-4 text-sm uppercase tracking-wider">Why PDF Master?</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <Shield className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />
                <span>100% private — files never leave your device</span>
              </li>
              <li className="flex items-start gap-2">
                <Zap className="w-4 h-4 text-yellow-400 mt-0.5 shrink-0" />
                <span>Instant processing — no waiting for uploads</span>
              </li>
              <li className="flex items-start gap-2">
                <Globe className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                <span>Works on all devices and browsers</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm">© {year} PDF Master. All rights reserved.</p>
          <div className="flex gap-6 text-sm">
            <a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="/terms" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="/contact" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
