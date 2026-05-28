import { useRef } from "react"

const ImportDocumentTile = ({ importing, onFile }) => {
    const inputRef = useRef(null)

    const handleChange = (e) => {
        const file = e.target.files?.[0]
        e.target.value = ""
        if (file) onFile(file)
    }

    return (
        <>
            <button
                type="button"
                onClick={() => inputRef.current?.click()}
                disabled={importing}
                className="flex aspect-square flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-slate-300 bg-white text-slate-400 transition hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-600 disabled:opacity-50"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-16 w-16">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
                <span className="text-sm font-semibold">
                    {importing ? "Import…" : "Importer un fichier"}
                </span>
                <span className="text-xs text-slate-400">.txt / .md</span>
            </button>

            <input
                ref={inputRef}
                type="file"
                accept=".txt,.md,text/plain,text/markdown"
                onChange={handleChange}
                className="hidden"
            />
        </>
    )
}

export default ImportDocumentTile
