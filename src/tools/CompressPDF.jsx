import { useState } from 'react'
import { PDFDocument } from 'pdf-lib'
import FileDropZone from '../components/FileDropZone'
import { Download } from 'lucide-react'

export default function CompressPDF() {
  const [files, setFiles] = useState([])
  const [level, setLevel] = useState('medium')
  const [processing, setProcessing] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [stats, setStats] = useState(null)

  const compress = async () => {
    if (!files[0]) { setError('Please select a PDF file.'); return }
    setProcessing(true); setError(null); setResult(null); setStats(null)
    try {
      const bytes = await files[0].arrayBuffer()
      const src = await PDFDocument.load(bytes, { updateMetadata: false })
      const out = await PDFDocument.create()
      const pages = await out.copyPages(src, src.getPageIndices())
      pages.forEach(p => out.addPage(p))

      const useObjectStreams = level !== 'low'
      const compressed = await out.save({ useObjectStreams, addDefaultPage: false })

      const origSize = bytes.byteLength
      const newSize = compressed.byteLength
      setStats({ orig: origSize, new: newSize, saved: Math.round((1 - newSize / origSize) * 100) })

      const blob = new Blob([compressed], { type: 'application/pdf' })
      setResult(URL.createObjectURL(blob))
    } catch (e) {
      setError('Failed to process PDF. Make sure the file is a valid PDF.')
    }
    setProcessing(false)
  }

  const levels = [
    { id: 'low', label: 'Low Compression', desc: 'Minimal size reduction, best quality' },
    { id: 'medium', label: 'Medium Compression', desc: 'Good balance of size and quality' },
    { id: 'high', label: 'High Compression', desc: 'Maximum size reduction' }
  ]

  const fmt = (b) => b > 1024 * 1024 ? `${(b / 1024 / 1024).toFixed(2)} MB` : `${(b / 1024).toFixed(1)} KB`

  return (
    <div className="space-y-5">
      <FileDropZone onFilesSelected={setFiles} accept=".pdf" label="PDF" />

      <div>
        <label className="block text-sm font-500 text-gray-700 mb-2">Compression Level</label>
        <div className="space-y-2">
          {levels.map(l => (
            <label key={l.id} className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${level === l.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
              <input type="radio" value={l.id} checked={level === l.id} onChange={() => setLevel(l.id)} className="mt-0.5" />
              <div>
                <div className="text-sm font-500 text-gray-800">{l.label}</div>
                <div className="text-xs text-gray-500">{l.desc}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {error && <p className="text-red-600 text-sm bg-red-50 px-4 py-3 rounded-xl">{error}</p>}

      <button
        onClick={compress}
        disabled={!files[0] || processing}
        className="w-full bg-blue-600 text-white py-3 rounded-xl font-600 hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
      >
        {processing ? <><span className="spinner w-5 h-5 border-2 border-white border-t-transparent rounded-full" />Compressing...</> : 'Compress PDF'}
      </button>

      {stats && (
        <div className="bg-gray-50 rounded-xl p-4 grid grid-cols-3 gap-4 text-center text-sm">
          <div>
            <div className="text-gray-500">Original</div>
            <div className="font-600 text-gray-800">{fmt(stats.orig)}</div>
          </div>
          <div>
            <div className="text-gray-500">Compressed</div>
            <div className="font-600 text-gray-800">{fmt(stats.new)}</div>
          </div>
          <div>
            <div className="text-gray-500">Saved</div>
            <div className={`font-600 ${stats.saved > 0 ? 'text-green-600' : 'text-gray-600'}`}>{stats.saved}%</div>
          </div>
        </div>
      )}

      {result && (
        <a
          href={result}
          download="compressed.pdf"
          className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-xl font-600 hover:bg-green-700 transition-colors"
        >
          <Download className="w-5 h-5" /> Download Compressed PDF
        </a>
      )}
    </div>
  )
}
