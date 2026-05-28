import { useState } from "react"
import { useDocuments } from "../../hooks/useDocuments"
import DocumentCard from "../../components/documents/DocumentCard"
import NewDocumentTile from "../../components/documents/NewDocumentTile"
import ImportDocumentTile from "../../components/documents/ImportDocumentTile"
import CreateDocumentModal from "../../components/documents/CreateDocumentModal"

const Home = () => {
    const { docs, loading, err, importing, importDoc, createDoc, deleteDoc } = useDocuments()
    const [showModal, setShowModal] = useState(false)

    const handleCreate = async (title) => {
        const ok = await createDoc(title)
        if (ok) setShowModal(false)
    }

    const handleDelete = (id) => {
        if (!window.confirm("Supprimer / quitter ce document ?")) return
        deleteDoc(id)
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
                    <NewDocumentTile onClick={() => setShowModal(true)} />
                    <ImportDocumentTile importing={importing} onFile={importDoc} />

                    {docs.map(doc => (
                        <DocumentCard key={doc._id} doc={doc} onDelete={handleDelete} />
                    ))}
                </div>
            </div>

            {showModal && (
                <CreateDocumentModal
                    onClose={() => setShowModal(false)}
                    onCreate={handleCreate}
                />
            )}
        </div>
    )
}

export default Home
