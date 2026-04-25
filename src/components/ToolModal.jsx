import { useEffect } from 'react'
import { X } from 'lucide-react'
import MergePDF from '../tools/MergePDF'
import SplitPDF from '../tools/SplitPDF'
import CompressPDF from '../tools/CompressPDF'
import RotatePDF from '../tools/RotatePDF'
import PDFToJPG from '../tools/PDFToJPG'
import JPGToPDF from '../tools/JPGToPDF'
import PDFToPNG from '../tools/PDFToPNG'
import PDFToText from '../tools/PDFToText'
import ProtectPDF from '../tools/ProtectPDF'
import UnlockPDF from '../tools/UnlockPDF'
import DeletePages from '../tools/DeletePages'
import ReorderPages from '../tools/ReorderPages'
import ExtractImages from '../tools/ExtractImages'
import ExtractText from '../tools/ExtractText'

const toolMap = {
  'Merge PDF': { component: MergePDF, title: 'Merge PDF Files', desc: 'Combine multiple PDFs into one document' },
  'Split PDF': { component: SplitPDF, title: 'Split PDF', desc: 'Split a PDF into multiple files or by page range' },
  'Compress PDF': { component: CompressPDF, title: 'Compress PDF', desc: 'Reduce PDF file size while keeping quality' },
  'Rotate PDF': { component: RotatePDF, title: 'Rotate PDF', desc: 'Rotate pages in your PDF document' },
  'PDF to JPG': { component: PDFToJPG, title: 'PDF to JPG', desc: 'Convert PDF pages to high-quality JPG images' },
  'JPG to PDF': { component: JPGToPDF, title: 'JPG to PDF', desc: 'Convert JPG/PNG images to a PDF file' },
  'PDF to PNG': { component: PDFToPNG, title: 'PDF to PNG', desc: 'Convert PDF pages to PNG images' },
  'PDF to Text': { component: PDFToText, title: 'PDF to Text', desc: 'Extract all text from your PDF' },
  'Protect PDF': { component: ProtectPDF, title: 'Protect PDF', desc: 'Add password protection to your PDF' },
  'Unlock PDF': { component: UnlockPDF, title: 'Unlock PDF', desc: 'Remove password from a PDF file' },
  'Delete Pages': { component: DeletePages, title: 'Delete PDF Pages', desc: 'Remove specific pages from a PDF' },
  'Reorder Pages': { component: ReorderPages, title: 'Reorder PDF Pages', desc: 'Rearrange pages in your PDF' },
  'Extract Images': { component: ExtractImages, title: 'Extract Images', desc: 'Extract all images from a PDF' },
  'Extract Text': { component: ExtractText, title: 'Extract Text', desc: 'Extract text content from a PDF' },
}

export default function ToolModal({ tool, onClose }) {
  const config = toolMap[tool]

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  if (!config) return null

  const Component = config.component

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="relative w-full sm:max-w-lg max-h-[90vh] sm:max-h-[85vh] bg-white sm:rounded-2xl rounded-t-2xl overflow-hidden shadow-2xl flex flex-col fade-in">
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-5 border-b border-gray-100">
          <div>
            <h2 id="modal-title" className="text-xl font-700 text-gray-900">{config.title}</h2>
            <p className="text-sm text-gray-500 mt-0.5">{config.desc}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors ml-4 shrink-0"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 p-6">
          <Component />
        </div>
      </div>
    </div>
  )
}
