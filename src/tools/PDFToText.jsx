import { useState } from 'react'
import * as pdfjsLib from 'pdfjs-dist'
import FileDropZone from '../components/FileDropZone'
import { Copy, Download, CheckCircle } from 'lucide-react'

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`

export default function PDFToText() {
  const [files, setFiles] = useState([])
  const [processing, setProcessing] = useState(false)
  const [text, setText] = useState('')
  const [error, setError] = useState(null)
  const [copied, setCopied] = useState(false)

  const extract = async () => {
    if (!files[0]) { setError('Please select a PDF file.'); return }
    setProcessing(true); setError(null); setText('')
    try {
      const bytes = await files[0].arrayBuffer()
      const pdf = await pdfjsLib.getDocument({ data: bytes }).promise
      let fullText = ''
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i)
        const content = await page.getTextContent()
        const pageText = content.items.map(item => item.str).join(' ')
        fullText += `--- Page ${i} ---\n${pageText}\n\n`
      }
      setText(fullText.trim() || 'No text found in this PDF.')
    } catch (e) {
      setError('Failed to extract text from PDF.')
    }
    setProcessing(false)
  }

  const copy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const download = () => {
    const blob = new Blob([text], { type: 'text/plain' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `${files[0]?.name.replace('.pdf', '')}_text.txt`
    a.click()
  }

  return (
    <div className="space-y-5">
      <FileDropZone onFilesSelected={setFiles} accept=".pdf" label="PDF" />
      {error && <p className="text-red-600 text-sm bg-red-50 px-4 py-3 rounded-xl">{error}</p>}

      <button
        onClick={extract}
        disabled={!files[0] || processing}
        className="w-full bg-blue-600 text-white py-3 rounded-xl font-600 hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
      >
        {processing ? <><span className="spinner w-5 h-5 border-2 border-white border-t-transparent rounded-full" />Extracting...</> : 'Extract Text'}
      </button>

      {text && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-500 text-gray-700">Extracted Text</p>
            <div className="flex gap-2">
              <button onClick={copy} className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-blue-600 transition-colors">
                {copied ? <><CheckCircle className="w-4 h-4 text-green-500" />Copied!</> : <><Copy className="w-4 h-4" />Copy</>}
              </button>
              <button onClick={download} className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-blue-600 transition-colors">
                <Download className="w-4 h-4" />Save .txt
              </button>
            </div>
          </div>
          <textarea
            readOnly
            value={text}
            className="w-full h-64 border border-gray-200 rounded-xl p-4 text-sm text-gray-700 resize-none focus:outline-none focus:border-blue-500 font-mono bg-gray-50"
          />
        </div>
      )}
    </div>
  )
}
