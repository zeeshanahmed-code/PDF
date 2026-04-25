import { useState } from 'react'
import { PDFDocument } from 'pdf-lib'
import FileDropZone from '../components/FileDropZone'
import { Download, ArrowUp, ArrowDown, X } from 'lucide-react'

export default function MergePDF() {
  const [files, setFiles] = useState([])
  const [processing, setProcessing] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const moveFile = (index, dir) => {
    const arr = [...files]
    const swap = index + dir
    if (swap < 0 || swap >= arr.length) return
    ;[arr[index], arr[swap]] = [arr[swap], arr[index]]
    setFiles(arr)
  }

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  const merge = async () => {
    if (files.length < 2) { setError('Please add at least 2 PDF files.'); return }
    setProcessing(true); setError(null); setResult(null)
    try {
      const merged = await PDFDocument.create()
      for (const file of files) {
        const bytes = await file.arrayBuffer()
        const src = await PDFDocument.load(bytes)
        const pages = await merged.copyPages(src, src.getPageIndices())
        pages.forEach(p => merged.addPage(p))
      }
      const bytes = await merged.save()
      const blob = new Blob([bytes], { type: 'application/pdf' })
      setResult(URL.createObjectURL(blob))
    } catch (e) {
      setError('Failed to merge PDFs. Make sure all files are valid PDFs.')
    }
    setProcessing(false)
  }

  return (
    <div className="space-y-5">
      <FileDropZone onFilesSelected={setFiles} multiple accept=".pdf" label="PDF" />

      {files.length > 0 && (
        <div>
          <p className="text-sm text-gray-500 mb-2">Drag to reorder:</p>
          <ul className="space-y-2">
            {files.map((f, i) => (
              <li key={i} className="flex items-center gap-2 bg-gray-50 rounded-xl px-4 py-2.5 text-sm">
                <span className="w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-600 shrink-0">{i + 1}</span>
                <span className="flex-1 truncate text-gray-700">{f.name}</span>
                <div className="flex gap-1">
                  <button onClick={() => moveFile(i, -1)} disabled={i === 0} className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30"><ArrowUp className="w-4 h-4" /></button>
                  <button onClick={() => moveFile(i, 1)} disabled={i === files.length - 1} className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30"><ArrowDown className="w-4 h-4" /></button>
                  <button onClick={() => removeFile(i)} className="p-1 text-gray-400 hover:text-red-500"><X className="w-4 h-4" /></button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {error && <p className="text-red-600 text-sm bg-red-50 px-4 py-3 rounded-xl">{error}</p>}

      <button
        onClick={merge}
        disabled={files.length < 2 || processing}
        className="w-full bg-blue-600 text-white py-3 rounded-xl font-600 hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
      >
        {processing ? <><span className="spinner w-5 h-5 border-2 border-white border-t-transparent rounded-full" />Merging...</> : 'Merge PDFs'}
      </button>

      {result && (
        <a
          href={result}
          download="merged.pdf"
          className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-xl font-600 hover:bg-green-700 transition-colors"
        >
          <Download className="w-5 h-5" /> Download Merged PDF
        </a>
      )}
    </div>
  )
}
