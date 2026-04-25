import { useState } from 'react'
import { PDFDocument } from 'pdf-lib'
import FileDropZone from '../components/FileDropZone'
import { Download, ArrowUp, ArrowDown } from 'lucide-react'

export default function ReorderPages() {
  const [files, setFiles] = useState([])
  const [pageOrder, setPageOrder] = useState([])
  const [processing, setProcessing] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const onFile = async (f) => {
    setFiles(f); setResult(null); setError(null)
    if (f[0]) {
      const bytes = await f[0].arrayBuffer()
      const doc = await PDFDocument.load(bytes)
      setPageOrder(Array.from({ length: doc.getPageCount() }, (_, i) => i + 1))
    }
  }

  const move = (i, dir) => {
    const arr = [...pageOrder]
    const j = i + dir
    if (j < 0 || j >= arr.length) return
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
    setPageOrder(arr)
  }

  const reorder = async () => {
    if (!files[0]) { setError('Please select a PDF file.'); return }
    setProcessing(true); setError(null); setResult(null)
    try {
      const bytes = await files[0].arrayBuffer()
      const src = await PDFDocument.load(bytes)
      const doc = await PDFDocument.create()
      const indices = pageOrder.map(p => p - 1)
      const pages = await doc.copyPages(src, indices)
      pages.forEach(p => doc.addPage(p))
      const out = await doc.save()
      setResult(URL.createObjectURL(new Blob([out], { type: 'application/pdf' })))
    } catch (e) {
      setError('Failed to reorder PDF pages.')
    }
    setProcessing(false)
  }

  return (
    <div className="space-y-5">
      <FileDropZone onFilesSelected={onFile} accept=".pdf" label="PDF" />

      {pageOrder.length > 0 && (
        <div>
          <p className="text-sm text-gray-500 mb-2">Use arrows to reorder pages:</p>
          <div className="space-y-1.5 max-h-64 overflow-y-auto">
            {pageOrder.map((pageNum, i) => (
              <div key={i} className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-2.5">
                <span className="w-8 h-8 bg-blue-100 text-blue-700 rounded-lg flex items-center justify-center text-sm font-600 shrink-0">{i + 1}</span>
                <span className="flex-1 text-sm text-gray-700">Page {pageNum}</span>
                <div className="flex gap-1">
                  <button onClick={() => move(i, -1)} disabled={i === 0} className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30"><ArrowUp className="w-4 h-4" /></button>
                  <button onClick={() => move(i, 1)} disabled={i === pageOrder.length - 1} className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30"><ArrowDown className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {error && <p className="text-red-600 text-sm bg-red-50 px-4 py-3 rounded-xl">{error}</p>}

      <button
        onClick={reorder}
        disabled={!files[0] || processing}
        className="w-full bg-blue-600 text-white py-3 rounded-xl font-600 hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
      >
        {processing ? <><span className="spinner w-5 h-5 border-2 border-white border-t-transparent rounded-full" />Reordering...</> : 'Reorder Pages'}
      </button>

      {result && (
        <a href={result} download="reordered.pdf" className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-xl font-600 hover:bg-green-700 transition-colors">
          <Download className="w-5 h-5" /> Download Reordered PDF
        </a>
      )}
    </div>
  )
}
