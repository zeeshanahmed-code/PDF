import { Upload, Settings, Download } from 'lucide-react'

const steps = [
  {
    icon: Upload,
    title: 'Select Your File',
    description: 'Click the tool you need, then drag & drop or click to select your PDF file from your device.',
    color: 'bg-blue-50 text-blue-600',
    step: '01'
  },
  {
    icon: Settings,
    title: 'Configure Options',
    description: 'Adjust settings like page ranges, compression level, rotation angle, or password as needed.',
    color: 'bg-green-50 text-green-600',
    step: '02'
  },
  {
    icon: Download,
    title: 'Download Result',
    description: 'Your file is processed instantly in the browser. Download the result — nothing is uploaded to any server.',
    color: 'bg-orange-50 text-orange-600',
    step: '03'
  }
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-700 text-gray-900 mb-4">How It Works</h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Three simple steps — no account, no upload, no waiting.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, i) => {
            const Icon = step.icon
            return (
              <div key={i} className="relative text-center">
                {/* Connector line */}
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-1/2 right-0 h-0.5 bg-gray-200 z-0" style={{left: '60%', right: '-40%'}} />
                )}
                <div className="relative z-10">
                  <div className="relative inline-flex items-center justify-center mb-4">
                    <div className={`w-20 h-20 rounded-2xl flex items-center justify-center ${step.color}`}>
                      <Icon className="w-9 h-9" />
                    </div>
                    <span className="absolute -top-2 -right-2 w-7 h-7 bg-gray-900 text-white text-xs font-700 rounded-full flex items-center justify-center">
                      {i + 1}
                    </span>
                  </div>
                  <h3 className="text-xl font-600 text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-500 leading-relaxed">{step.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
