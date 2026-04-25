import { useState, useRef } from 'react'
import { Upload, File, X } from 'lucide-react'

export default function FileDropZone({ onFilesSelected, multiple = false, accept = '.pdf', label = 'PDF' }) {
  const [dragging, setDragging] = useState(false)
  const [files, setFiles] = useState([])
  const inputRef = useRef(null)

  const handleFiles = (incoming) => {
    const arr = Array.from(incoming)
    if (!multiple) {
      setFiles([arr[0]])
      onFilesSelected([arr[0]])
    } else {
      const merged = [...files, ...arr]
      setFiles(merged)
      onFilesSelected(merged)
    }
  }

  const removeFile = (index) => {
    const updated = files.filter((_, i) => i !== index)
    setFiles(updated)
    onFilesSelected(updated)
  }

  const onDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    handleFiles(e.dataTransfer.files)
  }

  return (
    <div>
      <div
        className={`drop-zone border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
          dragging ? 'border-blue-500 bg-blue-50 drag-over' : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
        }`}
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        role="button"
        aria-label={`Drop ${label} file here or click to browse`}
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          multiple={multiple}
          accept={accept}
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <Upload className={`w-12 h-12 mx-auto mb-3 ${dragging ? 'text-blue-500' : 'text-gray-300'}`} />
        <p className="text-gray-700 font-500 mb-1">
          {dragging ? 'Release to upload' : `Drop ${label} file${multiple ? 's' : ''} here`}
        </p>
        <p className="text-gray-400 text-sm">or <span className="text-blue-600">click to browse</span></p>
        <p className="text-gray-400 text-xs mt-2">Supports {accept.replace(/\./g, '').replace(/,/g, ', ').toUpperCase()}</p>
      </div>

      {files.length > 0 && (
        <ul className="mt-3 space-y-2">
          {files.map((file, i) => (
            <li key={i} className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3 text-sm">
              <div className="flex items-center gap-3 min-w-0">
                <File className="w-5 h-5 text-blue-500 shrink-0" />
                <span className="text-gray-700 truncate">{file.name}</span>
                <span className="text-gray-400 shrink-0">({(file.size / 1024).toFixed(1)} KB)</span>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); removeFile(i) }}
                className="text-gray-400 hover:text-red-500 transition-colors ml-2"
                aria-label={`Remove ${file.name}`}
              >
                <X className="w-4 h-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
