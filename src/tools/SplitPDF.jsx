import { useState } from 'react'
import { PDFDocument } from 'pdf-lib'
import FileDropZone from '../components/FileDropZone'
import { Download } from 'lucide-react'

export default function SplitPDF() {
  const [files, setFiles] = useState([])
  const [mode, setMode] = useState('range') // 'range' | 'each'
  const [range, setRange] = useState('')
  const [processing, setProcessing] = useState(false)
  const [results, setResults] = useState([])
  const [error, setError] = useState(null)
  const [pageCount, setPageCount] = useState(0)

  const onFile = async (f) => {
    setFiles(f)
    setResults([])
    setError(null)
    if (f[0]) {
      try {
        const bytes = await f[0].arrayBuffer()
        const doc = await PDFDocument.load(bytes)
        setPageCount(doc.getPageCount())
      } catch { setPageCount(0) }
    }
  }

  const parseRanges = (str, max) => {
    const parts = str.split(',').map(s => s.trim())
    const ranges = []
    for (const part of parts) {
      if (part.includes('-')) {
        const [a, b] = part.split('-').map(Number)
        if (!isNaN(a) && !isNaN(b) && a >= 1 && b <= max && a <= b) {
          ranges.push({ from: a - 1, to: b - 1 })
        }
      } else {
        const n = Number(part)
        if (!isNaN(n) && n >= 1 && n <= max) ranges.push({ from: n - 1, to: n - 1 })
      }
    }
    return ranges
  }

  const split = async () => {
    if (!files[0]) { setError('Please select a PDF file.'); return }
    setProcessing(true); setError(null); setResults([])
    try {
      const bytes = await files[0].arrayBuffer()
      const src = await PDFDocument.load(bytes)
      const count = src.getPageCount()
      const outputs = []

      if (mode === 'each') {
        for (let i = 0; i < count; i++) {
          const doc = await PDFDocument.create()
          const [page] = await doc.copyPages(src, [i])
          doc.addPage(page)
          const b = await doc.save()
          outputs.push({ name: `page_${i + 1}.pdf`, url: URL.createObjectURL(new Blob([b], { type: 'application/pdf' })) })
        }
      } else {
        const ranges = parseRanges(range, count)
        if (ranges.length === 0) { setError('Invalid page range. Use format: 1-3, 5, 7-9'); setProcessing(false); return }
        for (const r of ranges) {
          const doc = await PDFDocument.create()
          const indices = Array.from({ length: r.to - r.from + 1 }, (_, i) => r.from + i)
          const pages = await doc.copyPages(src, indices)
          pages.forEach(p => doc.addPage(p))
          const b = await doc.save()
          outputs.push({ name: `pages_${r.from + 1}-${r.to + 1}.pdf`, url: URL.createObjectURL(new Blob([b], { type: 'application/pdf' })) })
        }
      }
      setResults(outputs)
    } catch (e) {
      setError('Failed to split PDF. Make sure the file is a valid PDF.')
    }
    setProcessing(false)
  }

  return (
    <div className="space-y-5">
      <FileDropZone onFilesSelected={onFile} accept=".pdf" label="PDF" />

      {pageCount > 0 && (
        <p className="text-sm text-gray-500">This PDF has <strong className="text-gray-800">{pageCount} pages</strong></p>
      )}

      <div>
        <label className="block text-sm font-500 text-gray-700 mb-2">Split Mode</label>
        <div className="flex gap-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" value="range" checked={mode === 'range'} onChange={() => setMode('range')} className="text-blue-600" />
            <span className="text-sm text-gray-700">By page range</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" value="each" checked={mode === 'each'} onChange={() => setMode('each')} className="text-blue-600" />
            <span className="text-sm text-gray-700">Each page separately</span>
          </label>
        </div>
      </div>

      {mode === 'range' && (
        <div>
          <label className="block text-sm font-500 text-gray-700 mb-1">Page Ranges</label>
          <input
            type="text"
            placeholder="e.g. 1-3, 5, 7-9"
            value={range}
            onChange={e => setRange(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-400 mt-1">Separate ranges with commas. Example: 1-3, 5, 7-10</p>
        </div>
      )}

      {error && <p className="text-red-600 text-sm bg-red-50 px-4 py-3 rounded-xl">{error}</p>}

      <button
        onClick={split}
        disabled={!files[0] || processing}
        className="w-full bg-blue-600 text-white py-3 rounded-xl font-600 hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
      >
        {processing ? <><span className="spinner w-5 h-5 border-2 border-white border-t-transparent rounded-full" />Splitting...</> : 'Split PDF'}
      </button>

      {results.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-500 text-gray-700">{results.length} file{results.length > 1 ? 's' : ''} created:</p>
          {results.map((r, i) => (
            <a
              key={i}
              href={r.url}
              download={r.name}
              className="flex items-center justify-between bg-green-50 border border-green-100 px-4 py-3 rounded-xl text-sm hover:bg-green-100 transition-colors"
            >
              <span className="text-gray-700">{r.name}</span>
              <Download className="w-4 h-4 text-green-600" />
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
