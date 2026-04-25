import { useState } from 'react'
import { PDFDocument } from 'pdf-lib'
import FileDropZone from '../components/FileDropZone'
import { Download, ArrowUp, ArrowDown, X } from 'lucide-react'

export default function JPGToPDF() {
  const [files, setFiles] = useState([])
  const [processing, setProcessing] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [previews, setPreviews] = useState([])

  const onFiles = (f) => {
    setFiles(f)
    setResult(null)
    const urls = f.map(file => URL.createObjectURL(file))
    setPreviews(urls)
  }

  const move = (i, dir) => {
    const f = [...files]; const p = [...previews]
    const j = i + dir
    if (j < 0 || j >= f.length) return
    ;[f[i], f[j]] = [f[j], f[i]]
    ;[p[i], p[j]] = [p[j], p[i]]
    setFiles(f); setPreviews(p)
  }

  const remove = (i) => {
    setFiles(files.filter((_, idx) => idx !== i))
    setPreviews(previews.filter((_, idx) => idx !== i))
  }

  const convert = async () => {
    if (!files.length) { setError('Please select at least one image.'); return }
    setProcessing(true); setError(null); setResult(null)
    try {
      const doc = await PDFDocument.create()
      for (const file of files) {
        const bytes = await file.arrayBuffer()
        let img
        if (file.type === 'image/png') {
          img = await doc.embedPng(bytes)
        } else {
          img = await doc.embedJpg(bytes)
        }
        const page = doc.addPage([img.width, img.height])
        page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height })
      }
      const out = await doc.save()
      const blob = new Blob([out], { type: 'application/pdf' })
      setResult(URL.createObjectURL(blob))
    } catch (e) {
      setError('Failed to convert images. Make sure files are valid JPG/PNG images.')
    }
    setProcessing(false)
  }

  return (
    <div className="space-y-5">
      <FileDropZone onFilesSelected={onFiles} multiple accept=".jpg,.jpeg,.png" label="JPG/PNG" />

      {previews.length > 0 && (
        <div>
          <p className="text-sm text-gray-500 mb-2">Reorder images:</p>
          <div className="space-y-2">
            {previews.map((url, i) => (
              <div key={i} className="flex items-center gap-3 bg-gray-50 rounded-xl px-3 py-2">
                <img src={url} alt={`Image ${i + 1}`} className="w-12 h-12 object-cover rounded-lg border border-gray-200" />
                <span className="flex-1 text-sm text-gray-700 truncate">{files[i]?.name}</span>
                <div className="flex gap-1">
                  <button onClick={() => move(i, -1)} disabled={i === 0} className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30"><ArrowUp className="w-4 h-4" /></button>
                  <button onClick={() => move(i, 1)} disabled={i === previews.length - 1} className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30"><ArrowDown className="w-4 h-4" /></button>
                  <button onClick={() => remove(i)} className="p-1 text-gray-400 hover:text-red-500"><X className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {error && <p className="text-red-600 text-sm bg-red-50 px-4 py-3 rounded-xl">{error}</p>}

      <button
        onClick={convert}
        disabled={!files.length || processing}
        className="w-full bg-blue-600 text-white py-3 rounded-xl font-600 hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
      >
        {processing ? <><span className="spinner w-5 h-5 border-2 border-white border-t-transparent rounded-full" />Converting...</> : 'Convert to PDF'}
      </button>

      {result && (
        <a href={result} download="images.pdf" className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-xl font-600 hover:bg-green-700 transition-colors">
          <Download className="w-5 h-5" /> Download PDF
        </a>
      )}
    </div>
  )
}
