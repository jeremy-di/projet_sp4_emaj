import { useEffect, useState } from "react"
import { documentService } from "../_services/document.service"

export const useDocuments = () => {
    const [docs, setDocs] = useState([])
    const [loading, setLoading] = useState(true)
    const [err, setErr] = useState(null)
    const [importing, setImporting] = useState(false)

    const loadDocs = () => {
        setLoading(true)
        documentService.getAll()
            .then(res => { setDocs(res.data); setLoading(false) })
            .catch(e => { setErr(e.message || "Erreur"); setLoading(false) })
    }

    useEffect(() => { loadDocs() }, [])

    const importDoc = async (file) => {
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

    const createDoc = async (title) => {
        try {
            await documentService.create({ title, content: "" })
            loadDocs()
            return true
        } catch (e) {
            setErr(e.response?.data?.message || "Erreur création")
            return false
        }
    }

    const deleteDoc = async (id) => {
        try {
            await documentService.remove(id)
            loadDocs()
        } catch (e) {
            setErr(e.response?.data?.message || "Erreur suppression")
        }
    }

    return { docs, loading, err, importing, importDoc, createDoc, deleteDoc }
}
