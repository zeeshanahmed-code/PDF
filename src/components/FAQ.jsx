import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const faqs = [
  {
    question: 'Are my PDF files secure and private?',
    answer: 'Yes, completely. All PDF processing happens directly in your browser using JavaScript. Your files are never uploaded to our servers or any third-party service. Your documents stay on your device at all times.'
  },
  {
    question: 'Is PDF Master free to use?',
    answer: 'Yes, all tools on PDF Master are 100% free. There are no hidden fees, no subscription required, and no account needed. Simply visit the site and start using any tool.'
  },
  {
    question: 'What is the maximum file size I can process?',
    answer: 'Since processing happens locally in your browser, the limit depends on your device\'s available memory. Generally, files up to 100MB work well on modern devices. Very large files (200MB+) may be slow depending on your hardware.'
  },
  {
    question: 'Can I use PDF Master on my phone or tablet?',
    answer: 'Yes! PDF Master is fully responsive and works on all modern devices including smartphones and tablets. It works on iOS Safari, Android Chrome, and all major mobile browsers.'
  },
  {
    question: 'Does PDF Master support password-protected PDFs?',
    answer: 'For most tools, you can provide the password to unlock a protected PDF before processing. The Unlock PDF tool specifically helps you remove password protection from PDFs you own.'
  },
  {
    question: 'What browsers are supported?',
    answer: 'PDF Master works on all modern browsers including Chrome, Firefox, Safari, Edge, and Opera. We recommend using the latest version of your browser for the best experience.'
  },
  {
    question: 'Will using PDF Master affect the quality of my PDFs?',
    answer: 'Most tools preserve the original quality. The Compress PDF tool gives you control over the compression level so you can balance file size and quality. Convert tools use high-quality rendering for best results.'
  }
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null)

  return (
    <section id="faq" className="py-16 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-700 text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-500 text-lg">
            Everything you need to know about PDF Master.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="border border-gray-200 rounded-xl overflow-hidden"
            >
              <button
                className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                aria-expanded={openIndex === i}
              >
                <span className="font-500 text-gray-900 pr-4">{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-400 shrink-0 transition-transform ${openIndex === i ? 'rotate-180' : ''}`}
                />
              </button>
              {openIndex === i && (
                <div className="px-6 pb-5 text-gray-600 leading-relaxed text-sm border-t border-gray-100 pt-4 fade-in">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
