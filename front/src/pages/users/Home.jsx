import React, { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { documentService } from "../../_services/document.service"

const formatDate = (iso) => {
    if (!iso) return "—"
    return new Date(iso).toLocaleString("fr-FR", {
        day: "2-digit", month: "2-digit", year: "numeric",
        hour: "2-digit", minute: "2-digit"
    })
}

const fileExt = (title = "") => {
    const m = title.match(/\.(md|txt)$/i)
    return m ? m[1].toLowerCase() : "txt"
}

const participantCount = (doc) => {
    const collabs = Array.isArray(doc.collaborators) ? doc.collaborators.length : 0
    return collabs + (doc.owner ? 1 : 0)
}

const Home = () => {
    const [docs, setDocs] = useState([])
    const [loading, setLoading] = useState(true)
    const [err, setErr] = useState(null)
    const [showModal, setShowModal] = useState(false)
    const [newName, setNewName] = useState("")
    const [newType, setNewType] = useState("txt")
    const [creating, setCreating] = useState(false)
    const [importing, setImporting] = useState(false)
    const fileInputRef = useRef(null)

    const loadDocs = () => {
        setLoading(true)
        documentService.getAll()
            .then(res => { setDocs(res.data); setLoading(false) })
            .catch(e => { setErr(e.message || "Erreur"); setLoading(false) })
    }

    useEffect(() => { loadDocs() }, [])

    const handleImportClick = () => {
        fileInputRef.current?.click()
    }

    const handleFileChange = async (e) => {
        const file = e.target.files?.[0]
        e.target.value = ""
        if (!file) return

        if (!/\.(md|txt)$/i.test(file.name)) {
            setErr("Seuls les fichiers .txt et .md sont acceptés")
            return
        }
        if (file.size > 1024 * 1024) {
            setErr("Fichier trop volumineux (max 1 Mo)")
            return
        }

        setImporting(true)
        try {
            const content = await file.text()
            await documentService.create({ title: file.name, content })
            loadDocs()
        } catch (e) {
            setErr(e.response?.data?.message || "Erreur import")
        } finally {
            setImporting(false)
        }
    }

    const handleCreate = async (e) => {
        e.preventDefault()
        if (!newName.trim()) return
        setCreating(true)
        const title = `${newName.trim()}.${newType}`
        try {
            await documentService.create({ title, content: "" })
            setShowModal(false)
            setNewName("")
            setNewType("txt")
            loadDocs()
        } catch (e) {
            setErr(e.response?.data?.message || "Erreur création")
        } finally {
            setCreating(false)
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center mt-10">
                <h2 className="text-2xl text-slate-500">Chargement…</h2>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-100 px-6 py-10">
            <div className="mx-auto max-w-7xl">
                <header className="mb-8 flex items-end justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800">Mes documents</h1>
                        <p className="mt-1 text-sm text-slate-500">
                            {docs.length} document{docs.length > 1 ? "s" : ""}
                        </p>
                    </div>
                </header>

                {err && (
                    <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {err}
                    </div>
                )}

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    <button
                        type="button"
                        onClick={() => setShowModal(true)}
                        className="flex aspect-square flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-slate-300 bg-white text-slate-400 transition hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-16 w-16">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        <span className="text-sm font-semibold">Nouveau document</span>
                    </button>

                    <button
                        type="button"
                        onClick={handleImportClick}
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
                        ref={fileInputRef}
                        type="file"
                        accept=".txt,.md,text/plain,text/markdown"
                        onChange={handleFileChange}
                        className="hidden"
                    />

                    {docs.map(doc => {
                        const ext = fileExt(doc.title)
                        return (
                            <Link
                                key={doc._id}
                                to={`/users/documents/${doc._id}`}
                                className="group flex aspect-square flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                            >
                                <div className="flex items-start justify-between">
                                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl text-xs font-bold uppercase ${
                                        ext === "md" ? "bg-purple-100 text-purple-600" : "bg-blue-100 text-blue-600"
                                    }`}>
                                        .{ext}
                                    </div>
                                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                                        👤 {participantCount(doc)}
                                    </span>
                                </div>

                                <div className="mt-4">
                                    <h3 className="line-clamp-2 text-base font-semibold text-slate-800 group-hover:text-blue-600">
                                        {doc.title}
                                    </h3>
                                    <p className="mt-2 text-xs text-slate-500">
                                        Modifié le {formatDate(doc.updatedAt || doc.createdAt)}
                                    </p>
                                </div>
                            </Link>
                        )
                    })}
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
                    <form
                        onSubmit={handleCreate}
                        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
                    >
                        <h2 className="text-xl font-bold text-slate-800">Nouveau document</h2>
                        <p className="mt-1 text-sm text-slate-500">Choisissez un nom et un format</p>

                        <label className="mt-5 block text-sm font-medium text-slate-700">
                            Nom du fichier
                        </label>
                        <input
                            autoFocus
                            type="text"
                            value={newName}
                            onChange={e => setNewName(e.target.value)}
                            placeholder="mon-document"
                            className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        />

                        <label className="mt-5 block text-sm font-medium text-slate-700">Format</label>
                        <div className="mt-2 grid grid-cols-2 gap-3">
                            {["txt", "md"].map(t => (
                                <button
                                    type="button"
                                    key={t}
                                    onClick={() => setNewType(t)}
                                    className={`rounded-lg border px-4 py-3 text-sm font-semibold uppercase transition ${
                                        newType === t
                                            ? "border-blue-500 bg-blue-50 text-blue-600"
                                            : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                                    }`}
                                >
                                    .{t}
                                </button>
                            ))}
                        </div>

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setShowModal(false)}
                                className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100"
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                disabled={creating || !newName.trim()}
                                className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-blue-700 disabled:opacity-50"
                            >
                                {creating ? "Création…" : "Créer"}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    )
}

export default Home
