import Document from "../models/document.model.js"
import Message from "../models/message.model.js"
import { encrypt, decrypt } from "../utils/messageCrypto.js"

const SAVE_DEBOUNCE_MS = 1000
const HISTORY_LIMIT = 100

const pendingSaves = new Map()

function scheduleSave(documentId, content, userId) {
    const existing = pendingSaves.get(documentId)
    if (existing) clearTimeout(existing.timer)

    const timer = setTimeout(async () => {
        const job = pendingSaves.get(documentId)
        pendingSaves.delete(documentId)
        try {
            await Document.findByIdAndUpdate(documentId, {
                content: job.content,
                lastModifiedBy: job.userId
            })
        } catch (err) {
            console.error(`Auto-save failed for ${documentId}:`, err.message)
        }
    }, SAVE_DEBOUNCE_MS)

    pendingSaves.set(documentId, { timer, content, userId })
}

async function canAccess(documentId, userId) {
    const doc = await Document.findById(documentId).select("owner collaborators")
    if (!doc) return false
    if (doc.owner?.toString() === userId) return true
    return doc.collaborators?.some(c => c.toString() === userId)
}

export default function registerDocumentHandlers(io, socket) {
    const userId = socket.user?.id
    const username = socket.user?.username || socket.user?.email

    socket.on("document:join", async ({ documentId }, ack) => {
        if (!documentId || !userId) return ack?.({ ok: false, error: "Bad request" })

        const allowed = await canAccess(documentId, userId)
        if (!allowed) return ack?.({ ok: false, error: "Forbidden" })

        // les users qui sont deja  room
        const existing = await io.in(documentId).fetchSockets()
        const participants = [...new Map(
            existing.map(s => [s.data.user?.id, {
                userId: s.data.user?.id,
                username: s.data.user?.username || s.data.user?.email,
                socketId: s.id
            }])
        ).values()]

        const history = await Message.find({ document: documentId })
            .sort({ createdAt: 1 })
            .limit(HISTORY_LIMIT)
            .populate("sender", "username email")

        const messages = history.map(m => {
            let text
            try {
                text = decrypt(m.text)
            } catch {
                text = "[message illisible]"
            }
            return {
                text,
                userId: m.sender?._id,
                username: m.sender?.username || m.sender?.email,
                at: m.createdAt.getTime()
            }
        })

        socket.join(documentId)
        socket.to(documentId).emit("document:user-joined", {
            userId, username, socketId: socket.id
        })
        ack?.({ ok: true, participants, messages })
    })

    socket.on("document:leave", ({ documentId }) => {
        if (!documentId) return
        socket.leave(documentId)
        socket.to(documentId).emit("document:user-left", { userId, socketId: socket.id })
    })

    socket.on("document:update", ({ documentId, content }) => {
        if (!documentId || !socket.rooms.has(documentId)) return
        socket.to(documentId).emit("document:updated", {
            content, userId, username, at: Date.now()
        })
        scheduleSave(documentId, content, userId)
    })

    socket.on("document:cursor", ({ documentId, position }) => {
        if (!documentId || !socket.rooms.has(documentId)) return
        socket.to(documentId).emit("document:cursor", {
            position, userId, username, socketId: socket.id
        })
    })

    socket.on("chat:message", async ({ documentId, text }) => {
        if (!documentId || !socket.rooms.has(documentId)) return
        if (typeof text !== "string" || text.trim() === "") return
        const clean = text.trim()
        try {
            const saved = await Message.create({
                document: documentId,
                sender: userId,
                text: encrypt(clean)
            })
            io.to(documentId).emit("chat:message", {
                text: clean,
                userId,
                username,
                at: saved.createdAt.getTime()
            })
        } catch (err) {
            console.error(`chat save failed for ${documentId}:`, err.message)
        }
    })
}
