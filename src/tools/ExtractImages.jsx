import { useState } from 'react'
import * as pdfjsLib from 'pdfjs-dist'
import FileDropZone from '../components/FileDropZone'
import { Download, Image } from 'lucide-react'

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`

export default function ExtractImages() {
  const [files, setFiles] = useState([])
  const [processing, setProcessing] = useState(false)
  const [results, setResults] = useState([])
  const [error, setError] = useState(null)

  const extract = async () => {
    if (!files[0]) { setError('Please select a PDF file.'); return }
    setProcessing(true); setError(null); setResults([])
    try {
      const bytes = await files[0].arrayBuffer()
      const pdf = await pdfjsLib.getDocument({ data: bytes }).promise
      const images = []

      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum)
        const ops = await page.getOperatorList()
        const imgNames = new Set()

        for (let i = 0; i < ops.fnArray.length; i++) {
          if (ops.fnArray[i] === pdfjsLib.OPS.paintImageXObject || ops.fnArray[i] === pdfjsLib.OPS.paintInlineImageXObject) {
            const imgRef = ops.argsArray[i][0]
            if (imgRef && !imgNames.has(imgRef)) {
              imgNames.add(imgRef)
              try {
                const img = await page.objs.get(imgRef)
                if (img && img.data) {
                  const canvas = document.createElement('canvas')
                  canvas.width = img.width
                  canvas.height = img.height
                  const ctx = canvas.getContext('2d')
                  const imageData = ctx.createImageData(img.width, img.height)
                  imageData.data.set(img.data)
                  ctx.putImageData(imageData, 0, 0)
                  images.push({ url: canvas.toDataURL('image/png'), name: `page${pageNum}_img${images.length + 1}.png`, page: pageNum })
                }
              } catch {}
            }
          }
        }
      }

      if (images.length === 0) {
        setError('No extractable images found in this PDF. Some PDFs use vector graphics or embedded images in formats that cannot be extracted this way.')
      } else {
        setResults(images)
      }
    } catch (e) {
      setError('Failed to extract images from PDF.')
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
      {error && <p className="text-red-600 text-sm bg-red-50 px-4 py-3 rounded-xl">{error}</p>}

      <button
        onClick={extract}
        disabled={!files[0] || processing}
        className="w-full bg-blue-600 text-white py-3 rounded-xl font-600 hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
      >
        {processing ? <><span className="spinner w-5 h-5 border-2 border-white border-t-transparent rounded-full" />Extracting...</> : <><Image className="w-4 h-4" />Extract Images</>}
      </button>

      {results.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-500 text-gray-700">{results.length} image{results.length > 1 ? 's' : ''} found</p>
            {results.length > 1 && <button onClick={downloadAll} className="text-sm text-blue-600 hover:text-blue-700 font-500">Download All</button>}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {results.map((r, i) => (
              <div key={i} className="relative group rounded-xl overflow-hidden border border-gray-200 aspect-square">
                <img src={r.url} alt={`Image from page ${r.page}`} className="w-full h-full object-contain bg-gray-50" />
                <a href={r.url} download={r.name} className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 text-white text-sm font-500 transition-opacity">
                  <Download className="w-4 h-4" /> Download
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
