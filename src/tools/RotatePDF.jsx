import { useState } from 'react'
import { PDFDocument, degrees } from 'pdf-lib'
import FileDropZone from '../components/FileDropZone'
import { Download, RotateCw } from 'lucide-react'

export default function RotatePDF() {
  const [files, setFiles] = useState([])
  const [rotation, setRotation] = useState(90)
  const [target, setTarget] = useState('all')
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

  const rotate = async () => {
    if (!files[0]) { setError('Please select a PDF file.'); return }
    setProcessing(true); setError(null); setResult(null)
    try {
      const bytes = await files[0].arrayBuffer()
      const doc = await PDFDocument.load(bytes)
      const count = doc.getPageCount()

      let indices = Array.from({ length: count }, (_, i) => i)
      if (target === 'specific') {
        indices = pages.split(',').flatMap(s => {
          s = s.trim()
          if (s.includes('-')) {
            const [a, b] = s.split('-').map(Number)
            return Array.from({ length: b - a + 1 }, (_, i) => a + i - 1)
          }
          return [Number(s) - 1]
        }).filter(i => i >= 0 && i < count)
      }

      for (const i of indices) {
        const page = doc.getPage(i)
        const current = page.getRotation().angle
        page.setRotation(degrees((current + rotation) % 360))
      }

      const out = await doc.save()
      const blob = new Blob([out], { type: 'application/pdf' })
      setResult(URL.createObjectURL(blob))
    } catch (e) {
      setError('Failed to rotate PDF.')
    }
    setProcessing(false)
  }

  return (
    <div className="space-y-5">
      <FileDropZone onFilesSelected={onFile} accept=".pdf" label="PDF" />

      {pageCount > 0 && <p className="text-sm text-gray-500">This PDF has <strong className="text-gray-800">{pageCount} pages</strong></p>}

      <div>
        <label className="block text-sm font-500 text-gray-700 mb-2">Rotation Angle</label>
        <div className="grid grid-cols-3 gap-3">
          {[90, 180, 270].map(deg => (
            <label key={deg} className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border cursor-pointer transition-all ${rotation === deg ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
              <input type="radio" value={deg} checked={rotation === deg} onChange={() => setRotation(deg)} className="sr-only" />
              <RotateCw className="w-5 h-5 text-blue-600" style={{ transform: `rotate(${deg - 90}deg)` }} />
              <span className="text-sm font-500 text-gray-800">{deg}°</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-500 text-gray-700 mb-2">Apply To</label>
        <div className="flex gap-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" value="all" checked={target === 'all'} onChange={() => setTarget('all')} className="text-blue-600" />
            <span className="text-sm text-gray-700">All pages</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" value="specific" checked={target === 'specific'} onChange={() => setTarget('specific')} className="text-blue-600" />
            <span className="text-sm text-gray-700">Specific pages</span>
          </label>
        </div>
      </div>

      {target === 'specific' && (
        <input
          type="text"
          placeholder="e.g. 1, 3, 5-7"
          value={pages}
          onChange={e => setPages(e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
      )}

      {error && <p className="text-red-600 text-sm bg-red-50 px-4 py-3 rounded-xl">{error}</p>}

      <button
        onClick={rotate}
        disabled={!files[0] || processing}
        className="w-full bg-blue-600 text-white py-3 rounded-xl font-600 hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
      >
        {processing ? <><span className="spinner w-5 h-5 border-2 border-white border-t-transparent rounded-full" />Rotating...</> : 'Rotate PDF'}
      </button>

      {result && (
        <a href={result} download="rotated.pdf" className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-xl font-600 hover:bg-green-700 transition-colors">
          <Download className="w-5 h-5" /> Download Rotated PDF
        </a>
      )}
    </div>
  )
}
