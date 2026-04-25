import { useState } from 'react'
import {
  GitMerge, Scissors, FileDown, RotateCw, Image, FileText,
  Lock, Unlock, Trash2, ArrowUpDown, FileImage, Type, FileUp
} from 'lucide-react'

const tools = [
  {
    id: 'merge-pdf',
    name: 'Merge PDF',
    description: 'Combine multiple PDF files into one document',
    icon: GitMerge,
    color: 'bg-blue-50 text-blue-600',
    border: 'hover:border-blue-300',
    badge: 'Popular'
  },
  {
    id: 'split-pdf',
    name: 'Split PDF',
    description: 'Split a PDF into multiple files or extract specific pages',
    icon: Scissors,
    color: 'bg-orange-50 text-orange-600',
    border: 'hover:border-orange-300',
    badge: 'Popular'
  },
  {
    id: 'compress-pdf',
    name: 'Compress PDF',
    description: 'Reduce PDF file size without losing quality',
    icon: FileDown,
    color: 'bg-green-50 text-green-600',
    border: 'hover:border-green-300',
    badge: 'Popular'
  },
  {
    id: 'rotate-pdf',
    name: 'Rotate PDF',
    description: 'Rotate PDF pages to any angle — 90°, 180°, or 270°',
    icon: RotateCw,
    color: 'bg-cyan-50 text-cyan-600',
    border: 'hover:border-cyan-300'
  },
  {
    id: 'pdf-to-jpg',
    name: 'PDF to JPG',
    description: 'Convert each PDF page to high-quality JPG images',
    icon: Image,
    color: 'bg-rose-50 text-rose-600',
    border: 'hover:border-rose-300',
    badge: 'Popular'
  },
  {
    id: 'jpg-to-pdf',
    name: 'JPG to PDF',
    description: 'Convert one or multiple JPG images into a PDF file',
    icon: FileUp,
    color: 'bg-pink-50 text-pink-600',
    border: 'hover:border-pink-300'
  },
  {
    id: 'pdf-to-png',
    name: 'PDF to PNG',
    description: 'Convert PDF pages to PNG images with transparent backgrounds',
    icon: FileImage,
    color: 'bg-violet-50 text-violet-600',
    border: 'hover:border-violet-300'
  },
  {
    id: 'pdf-to-text',
    name: 'PDF to Text',
    description: 'Extract all text content from a PDF document',
    icon: Type,
    color: 'bg-slate-50 text-slate-600',
    border: 'hover:border-slate-300'
  },
  {
    id: 'protect-pdf',
    name: 'Protect PDF',
    description: 'Add a password to secure your PDF from unauthorized access',
    icon: Lock,
    color: 'bg-amber-50 text-amber-600',
    border: 'hover:border-amber-300'
  },
  {
    id: 'unlock-pdf',
    name: 'Unlock PDF',
    description: 'Remove password protection from a PDF file',
    icon: Unlock,
    color: 'bg-teal-50 text-teal-600',
    border: 'hover:border-teal-300'
  },
  {
    id: 'delete-pages',
    name: 'Delete Pages',
    description: 'Remove specific pages from your PDF document',
    icon: Trash2,
    color: 'bg-red-50 text-red-600',
    border: 'hover:border-red-300'
  },
  {
    id: 'reorder-pages',
    name: 'Reorder Pages',
    description: 'Drag and drop to rearrange pages in your PDF',
    icon: ArrowUpDown,
    color: 'bg-sky-50 text-sky-600',
    border: 'hover:border-sky-300'
  },
  {
    id: 'extract-images',
    name: 'Extract Images',
    description: 'Extract all embedded images from a PDF document',
    icon: Image,
    color: 'bg-lime-50 text-lime-600',
    border: 'hover:border-lime-300'
  },
  {
    id: 'extract-text',
    name: 'Extract Text',
    description: 'Extract text from specific pages or entire PDF',
    icon: FileText,
    color: 'bg-indigo-50 text-indigo-700',
    border: 'hover:border-indigo-300'
  }
]

const categories = ['All', 'Organize', 'Optimize', 'Convert', 'Security', 'Extract']

const categoryMap = {
  'All': tools.map(t => t.id),
  'Organize': ['merge-pdf', 'split-pdf', 'delete-pages', 'reorder-pages'],
  'Optimize': ['compress-pdf', 'rotate-pdf'],
  'Convert': ['pdf-to-jpg', 'jpg-to-pdf', 'pdf-to-png', 'pdf-to-text'],
  'Security': ['protect-pdf', 'unlock-pdf'],
  'Extract': ['extract-images', 'extract-text']
}

export default function ToolsGrid({ onToolSelect }) {
  const [activeCategory, setActiveCategory] = useState('All')

  const visibleTools = tools.filter(t => categoryMap[activeCategory].includes(t.id))

  return (
    <section id="tools" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-700 text-gray-900 mb-4">
            All PDF Tools
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Everything you need to work with PDFs — free, fast, and private.
          </p>
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-10" role="tablist" aria-label="Tool categories">
          {categories.map(cat => (
            <button
              key={cat}
              role="tab"
              aria-selected={activeCategory === cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-500 transition-all ${
                activeCategory === cat
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Tools grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {visibleTools.map(tool => {
            const Icon = tool.icon
            return (
              <button
                key={tool.id}
                onClick={() => onToolSelect(tool.name)}
                className={`tool-card relative text-left p-5 rounded-2xl border border-gray-100 bg-white shadow-sm ${tool.border} hover:shadow-md transition-all group`}
                aria-label={`Open ${tool.name} tool`}
              >
                {tool.badge && (
                  <span className="absolute top-4 right-4 text-xs bg-blue-100 text-blue-700 font-500 px-2 py-0.5 rounded-full">
                    {tool.badge}
                  </span>
                )}
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${tool.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-gray-900 font-600 mb-1.5 text-base">{tool.name}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{tool.description}</p>
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
