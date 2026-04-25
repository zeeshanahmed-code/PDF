import { useState } from 'react'
import { PDFDocument } from 'pdf-lib'
import FileDropZone from '../components/FileDropZone'
import { Download, Trash2 } from 'lucide-react'

export default function DeletePages() {
  const [files, setFiles] = useState([])
  const [pages, setPages] = useState('')
  const [processing, setProcessing] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [pageCount, setPageCount] = useState(0)

  const onFile = async (f) => {
    setFiles(f); setResult(null); setError(null)
    if (f[0]) {
      const bytes = await f[0].arrayBuffer()
      const doc = await PDFDocument.load(bytes)
      setPageCount(doc.getPageCount())
    }
  }

  const deletePages = async () => {
    if (!files[0]) { setError('Please select a PDF file.'); return }
    if (!pages.trim()) { setError('Please enter page numbers to delete.'); return }
    setProcessing(true); setError(null); setResult(null)
    try {
      const bytes = await files[0].arrayBuffer()
      const src = await PDFDocument.load(bytes)
      const count = src.getPageCount()

      const toDelete = new Set()
      pages.split(',').forEach(s => {
        s = s.trim()
        if (s.includes('-')) {
          const [a, b] = s.split('-').map(Number)
          for (let i = a; i <= b; i++) if (i >= 1 && i <= count) toDelete.add(i - 1)
        } else {
          const n = Number(s)
          if (!isNaN(n) && n >= 1 && n <= count) toDelete.add(n - 1)
        }
      })

      if (toDelete.size >= count) { setError('Cannot delete all pages from a PDF.'); setProcessing(false); return }

      const keepIndices = Array.from({ length: count }, (_, i) => i).filter(i => !toDelete.has(i))
      const doc = await PDFDocument.create()
      const copied = await doc.copyPages(src, keepIndices)
      copied.forEach(p => doc.addPage(p))

      const out = await doc.save()
      setResult(URL.createObjectURL(new Blob([out], { type: 'application/pdf' })))
    } catch (e) {
      setError('Failed to delete pages from PDF.')
    }
    setProcessing(false)
  }

  return (
    <div className="space-y-5">
      <FileDropZone onFilesSelected={onFile} accept=".pdf" label="PDF" />

      {pageCount > 0 && <p className="text-sm text-gray-500">This PDF has <strong className="text-gray-800">{pageCount} pages</strong></p>}

      <div>
        <label className="block text-sm font-500 text-gray-700 mb-1">Pages to Delete</label>
        <input
          type="text"
          placeholder="e.g. 1, 3, 5-7"
          value={pages}
          onChange={e => setPages(e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
        <p className="text-xs text-gray-400 mt-1">Separate page numbers with commas. Use ranges like 5-8.</p>
      </div>

      {error && <p className="text-red-600 text-sm bg-red-50 px-4 py-3 rounded-xl">{error}</p>}

      <button
        onClick={deletePages}
        disabled={!files[0] || processing}
        className="w-full bg-red-600 text-white py-3 rounded-xl font-600 hover:bg-red-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
      >
        {processing ? <><span className="spinner w-5 h-5 border-2 border-white border-t-transparent rounded-full" />Deleting...</> : <><Trash2 className="w-4 h-4" />Delete Pages</>}
      </button>

      {result && (
        <a href={result} download="modified.pdf" className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-xl font-600 hover:bg-green-700 transition-colors">
          <Download className="w-5 h-5" /> Download Modified PDF
        </a>
      )}
    </div>
  )
}
