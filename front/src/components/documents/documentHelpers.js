export const formatDate = (iso) => {
    if (!iso) return "—"
    return new Date(iso).toLocaleString("fr-FR", {
        day: "2-digit", month: "2-digit", year: "numeric",
        hour: "2-digit", minute: "2-digit"
    })
}

export const fileExt = (title = "") => {
    const m = title.match(/\.(md|txt)$/i)
    return m ? m[1].toLowerCase() : "txt"
}

export const participantCount = (doc) => {
    const collabs = Array.isArray(doc.collaborators) ? doc.collaborators.length : 0
    return collabs + (doc.owner ? 1 : 0)
}
