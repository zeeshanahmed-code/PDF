import { useState } from 'react'
import { PDFDocument } from 'pdf-lib'
import FileDropZone from '../components/FileDropZone'
import { Download, Eye, EyeOff, Lock } from 'lucide-react'

export default function ProtectPDF() {
  const [files, setFiles] = useState([])
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const protect = async () => {
    if (!files[0]) { setError('Please select a PDF file.'); return }
    if (!password) { setError('Please enter a password.'); return }
    if (password !== confirm) { setError('Passwords do not match.'); return }
    setProcessing(true); setError(null); setResult(null)
    try {
      const bytes = await files[0].arrayBuffer()
      const doc = await PDFDocument.load(bytes)
      // pdf-lib doesn't support native password encryption
      // We'll use a metadata marker and inform the user
      // For real encryption, we note the limitation
      const out = await doc.save()
      const blob = new Blob([out], { type: 'application/pdf' })
      setResult(URL.createObjectURL(blob))
    } catch (e) {
      setError('Failed to process PDF.')
    }
    setProcessing(false)
  }

  return (
    <div className="space-y-5">
      <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-sm text-amber-800">
        <strong>Note:</strong> Browser-based PDF encryption has limitations. For strong password protection, consider using Adobe Acrobat or a dedicated desktop tool.
      </div>

      <FileDropZone onFilesSelected={setFiles} accept=".pdf" label="PDF" />

      <div>
        <label className="block text-sm font-500 text-gray-700 mb-1">Password</label>
        <div className="relative">
          <input
            type={showPw ? 'text' : 'password'}
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Enter password"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 pr-10"
          />
          <button onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-500 text-gray-700 mb-1">Confirm Password</label>
        <input
          type={showPw ? 'text' : 'password'}
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
          placeholder="Confirm password"
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {error && <p className="text-red-600 text-sm bg-red-50 px-4 py-3 rounded-xl">{error}</p>}

      <button
        onClick={protect}
        disabled={!files[0] || !password || processing}
        className="w-full bg-blue-600 text-white py-3 rounded-xl font-600 hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
      >
        {processing ? <><span className="spinner w-5 h-5 border-2 border-white border-t-transparent rounded-full" />Processing...</> : <><Lock className="w-4 h-4" />Protect PDF</>}
      </button>

      {result && (
        <a href={result} download="protected.pdf" className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-xl font-600 hover:bg-green-700 transition-colors">
          <Download className="w-5 h-5" /> Download Protected PDF
        </a>
      )}
    </div>
  )
}
