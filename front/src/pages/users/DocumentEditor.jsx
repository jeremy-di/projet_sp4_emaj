import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { useDocumentEditor } from "../../hooks/useDocumentEditor"
import { useCall } from "../../useCall"
import EditorHeader from "../../components/documents/EditorHeader"
import ChatPanel from "../../components/documents/ChatPanel"
import IncomingCallModal from '../../components/documents/IncomingCallModal'
import { userService } from '../../_services/user.service';

const DocumentEditor = () => {
    const { id: documentId } = useParams()
    const {
        doc, content, loading, err, connected, participants, messages,
        updateContent, sendChat, addCollaborator
    } = useDocumentEditor(documentId)

    const {
        callState, caller, remoteAudioRef,
        startCall, acceptCall, rejectCall, endCall
    } = useCall()

    const [username, setUsername] = useState("")
    const [error, setError] = useState(null)
    const [loaded, setLoaded] = useState(false)
    const [chatOpen, setChatOpen] = useState(true)

    useEffect(() => {
        userService.getMe()
            .then(res => {
                setUsername(res.data.username || "Un participant")
                setLoaded(true)
            })
            .catch(error => {
                setError("Impossible de charger les informations")
                setLoaded(true)
            })
    }, [])

    if (loading) {
        return (
            <div className="flex justify-center mt-10">
                <h2 className="text-2xl text-slate-500">Chargement…</h2>
            </div>
        )
    }

    if (err && !doc) {
        return (
            <div className="min-h-screen bg-slate-100 px-6 py-10">
                <div className="mx-auto max-w-2xl rounded-2xl bg-white p-8 text-center shadow">
                    <h2 className="text-2xl font-bold text-red-600">{err}</h2>
                    <Link to="/users/home" className="mt-4 inline-block rounded-lg bg-slate-800 px-5 py-2 text-sm font-semibold text-white">
                        Retour
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="flex h-[calc(100vh-64px)] bg-slate-100">
            <audio ref={remoteAudioRef} autoPlay />

            {callState === 'incoming' && (
                <IncomingCallModal
                    caller={caller}
                    onAccept={acceptCall}
                    onReject={rejectCall}
                />
            )}

            <main className="flex flex-1 flex-col">
                <EditorHeader
                    title={doc?.title}
                    connected={connected}
                    participantCount={participants.length + 1}
                    participants={participants}
                    chatOpen={chatOpen}
                    onToggleChat={() => setChatOpen(o => !o)}
                    onAddCollaborator={addCollaborator}
                    callState={callState}
                    onCall={(targetSocketId) => startCall(targetSocketId, username)}
                    onEndCall={endCall}
                />

                <textarea
                    value={content}
                    onChange={e => updateContent(e.target.value)}
                    className="flex-1 resize-none bg-white p-4"
                />
            </main>

            {chatOpen && <ChatPanel messages={messages} onSend={sendChat} />}
        </div>
    )
}

export default DocumentEditor