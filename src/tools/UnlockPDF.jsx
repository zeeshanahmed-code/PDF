import { useState } from 'react'
import { PDFDocument } from 'pdf-lib'
import FileDropZone from '../components/FileDropZone'
import { Download, Unlock, Eye, EyeOff } from 'lucide-react'

export default function UnlockPDF() {
  const [files, setFiles] = useState([])
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const unlock = async () => {
    if (!files[0]) { setError('Please select a PDF file.'); return }
    setProcessing(true); setError(null); setResult(null)
    try {
      const bytes = await files[0].arrayBuffer()
      const doc = await PDFDocument.load(bytes, {
        password: password || undefined,
        ignoreEncryption: !password
      })
      const out = await doc.save()
      const blob = new Blob([out], { type: 'application/pdf' })
      setResult(URL.createObjectURL(blob))
    } catch (e) {
      if (e.message?.includes('password')) {
        setError('Incorrect password or the file requires a password to open.')
      } else {
        setError('Failed to unlock PDF. This file may use encryption not supported by browser tools.')
      }
    }
    setProcessing(false)
  }

  return (
    <div className="space-y-5">
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-800">
        Only remove protection from PDFs you own or have permission to modify.
      </div>

      <FileDropZone onFilesSelected={setFiles} accept=".pdf" label="PDF" />

      <div>
        <label className="block text-sm font-500 text-gray-700 mb-1">PDF Password (if known)</label>
        <div className="relative">
          <input
            type={showPw ? 'text' : 'password'}
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Enter PDF password (optional)"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 pr-10"
          />
          <button onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {error && <p className="text-red-600 text-sm bg-red-50 px-4 py-3 rounded-xl">{error}</p>}

      <button
        onClick={unlock}
        disabled={!files[0] || processing}
        className="w-full bg-blue-600 text-white py-3 rounded-xl font-600 hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
      >
        {processing ? <><span className="spinner w-5 h-5 border-2 border-white border-t-transparent rounded-full" />Unlocking...</> : <><Unlock className="w-4 h-4" />Unlock PDF</>}
      </button>

      {result && (
        <a href={result} download="unlocked.pdf" className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-xl font-600 hover:bg-green-700 transition-colors">
          <Download className="w-5 h-5" /> Download Unlocked PDF
        </a>
      )}
    </div>
  )
}
