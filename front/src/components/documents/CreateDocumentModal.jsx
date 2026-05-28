import { useState } from "react"

const CreateDocumentModal = ({ onClose, onCreate }) => {
    const [newName, setNewName] = useState("")
    const [newType, setNewType] = useState("txt")
    const [creating, setCreating] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!newName.trim()) return
        setCreating(true)
        try {
            await onCreate(`${newName.trim()}.${newType}`)
        } finally {
            setCreating(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <form
                onSubmit={handleSubmit}
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
                        onClick={onClose}
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
    )
}

export default CreateDocumentModal
