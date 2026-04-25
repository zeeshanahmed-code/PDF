import { useState } from 'react'
import * as pdfjsLib from 'pdfjs-dist'
import FileDropZone from '../components/FileDropZone'
import { Download } from 'lucide-react'

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`

export default function PDFToPNG() {
  const [files, setFiles] = useState([])
  const [scale, setScale] = useState(2)
  const [processing, setProcessing] = useState(false)
  const [results, setResults] = useState([])
  const [error, setError] = useState(null)
  const [progress, setProgress] = useState(0)

  const convert = async () => {
    if (!files[0]) { setError('Please select a PDF file.'); return }
    setProcessing(true); setError(null); setResults([]); setProgress(0)
    try {
      const bytes = await files[0].arrayBuffer()
      const pdf = await pdfjsLib.getDocument({ data: bytes }).promise
      const images = []

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i)
        const viewport = page.getViewport({ scale })
        const canvas = document.createElement('canvas')
        canvas.width = viewport.width
        canvas.height = viewport.height
        const ctx = canvas.getContext('2d')
        await page.render({ canvasContext: ctx, viewport }).promise
        const dataUrl = canvas.toDataURL('image/png')
        images.push({ name: `page_${i}.png`, url: dataUrl, page: i })
        setProgress(Math.round((i / pdf.numPages) * 100))
      }
      setResults(images)
    } catch (e) {
      setError('Failed to convert PDF to PNG.')
    }
    setProcessing(false)
  }

  const downloadAll = () => {
    results.forEach(r => {
      const a = document.createElement('a'); a.href = r.url; a.download = r.name; a.click()
    })
  }

  return (
    <div className="space-y-5">
      <FileDropZone onFilesSelected={setFiles} accept=".pdf" label="PDF" />

      <div>
        <label className="block text-sm font-500 text-gray-700 mb-1">Resolution: {scale}x ({scale === 1 ? '72dpi' : scale === 2 ? '144dpi' : '216dpi'})</label>
        <input type="range" min="1" max="3" step="0.5" value={scale} onChange={e => setScale(Number(e.target.value))} className="w-full" />
      </div>

      {error && <p className="text-red-600 text-sm bg-red-50 px-4 py-3 rounded-xl">{error}</p>}

      <button
        onClick={convert}
        disabled={!files[0] || processing}
        className="w-full bg-blue-600 text-white py-3 rounded-xl font-600 hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
      >
        {processing ? <><span className="spinner w-5 h-5 border-2 border-white border-t-transparent rounded-full" />Converting... {progress}%</> : 'Convert to PNG'}
      </button>

      {processing && (
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-blue-600 rounded-full progress-bar" style={{ width: `${progress}%` }} />
        </div>
      )}

      {results.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-500 text-gray-700">{results.length} PNG{results.length > 1 ? 's' : ''} ready</p>
            {results.length > 1 && <button onClick={downloadAll} className="text-sm text-blue-600 hover:text-blue-700 font-500">Download All</button>}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {results.map((r, i) => (
              <div key={i} className="relative group rounded-xl overflow-hidden border border-gray-200 aspect-[3/4]">
                <img src={r.url} alt={`Page ${r.page}`} className="w-full h-full object-cover" />
                <a href={r.url} download={r.name} className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 text-white text-sm font-500 transition-opacity">
                  <Download className="w-4 h-4" /> Page {r.page}
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
