import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import socket, { connectSocket, disconnectSocket } from "../socket"
import { userService } from "../_services/user.service"
import { documentService } from "../_services/document.service"

export const useDocumentEditor = (documentId) => {
    const navigate = useNavigate()

    const [doc, setDoc] = useState(null)
    const [content, setContent] = useState("")
    const [loading, setLoading] = useState(true)
    const [err, setErr] = useState(null)
    const [connected, setConnected] = useState(false)
    const [participants, setParticipants] = useState([])
    const [messages, setMessages] = useState([])

    useEffect(() => {
        let cancelled = false

        documentService.getOne(documentId)
            .then(res => {
                if (cancelled) return
                setDoc(res.data)
                setContent(res.data.content || "")
                setLoading(false)
            })
            .catch(e => {
                if (cancelled) return
                setErr(e.response?.data?.message || "Document introuvable")
                setLoading(false)
            })

        return () => { cancelled = true }
    }, [documentId])

    useEffect(() => {
        const token = userService.getToken()
        if (!token) {
            navigate("/login")
            return
        }

        connectSocket(token)

        const onConnect = () => {
            setConnected(true)
            socket.emit("document:join", { documentId }, (res) => {
                if (!res?.ok) {
                    setErr(res?.error || "Accès refusé")
                    return
                }
                setParticipants(res.participants || [])
            })
        }
        const onDisconnect = () => setConnected(false)
        const onConnectError = (e) => setErr(`Socket: ${e.message}`)

        const onRemoteUpdate = ({ content: incoming, at }) => {
            setContent(incoming)
            setDoc(d => d ? { ...d, updatedAt: new Date(at).toISOString() } : d)
        }
        const onUserJoined = ({ userId, username, socketId }) => {
            setParticipants(p => p.some(x => x.userId === userId) ? p : [...p, { userId, username, socketId }])
            setMessages(m => [...m, { system: true, text: `${username || "Quelqu'un"} a rejoint`, at: Date.now() }])
        }
        const onUserLeft = ({ userId }) => {
            setParticipants(p => p.filter(x => x.userId !== userId))
        }
        const onChat = (msg) => setMessages(m => [...m, msg])

        socket.on("connect", onConnect)
        socket.on("disconnect", onDisconnect)
        socket.on("connect_error", onConnectError)
        socket.on("document:updated", onRemoteUpdate)
        socket.on("document:user-joined", onUserJoined)
        socket.on("document:user-left", onUserLeft)
        socket.on("chat:message", onChat)

        if (socket.connected) onConnect()

        return () => {
            socket.emit("document:leave", { documentId })
            socket.off("connect", onConnect)
            socket.off("disconnect", onDisconnect)
            socket.off("connect_error", onConnectError)
            socket.off("document:updated", onRemoteUpdate)
            socket.off("document:user-joined", onUserJoined)
            socket.off("document:user-left", onUserLeft)
            socket.off("chat:message", onChat)
            disconnectSocket()
        }
    }, [documentId, navigate])

    const updateContent = (next) => {
        setContent(next)
        socket.emit("document:update", { documentId, content: next })
    }

    const sendChat = (text) => {
        socket.emit("chat:message", { documentId, text })
    }

    const addCollaborator = async (email) => {
        const res = await documentService.addCollaborator(documentId, email)
        setDoc(res.data)
    }

    return {
        doc, content, loading, err, connected, participants, messages,
        updateContent, sendChat, addCollaborator
    }
}
