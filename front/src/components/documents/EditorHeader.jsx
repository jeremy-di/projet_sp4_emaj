import { useState } from 'react'
import { Link } from "react-router-dom"
import AddCollaborator from "./AddCollaborator"

const EditorHeader = ({ title, connected, participantCount, chatOpen, onToggleChat,
  onAddCollaborator, participants, onCall, callState, onEndCall }) => {
  const [callMenuOpen, setCallMenuOpen] = useState(false)
  const [participantCalled, setParticipantCalled] = useState("")

  const inCall = callState === 'inCall'
  const calling = callState === 'calling'

  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-3">
        <div className="flex items-center gap-4">
            <Link to="/users/home" className="text-slate-500 hover:text-slate-800">←</Link>
            <div>
                <h1 className="text-lg font-semibold text-slate-800">{title}</h1>
                <p className="text-xs text-slate-500">
                    {connected ? "🟢 Connecté" : "Problème de connexion..."}
                    {" · "}{participantCount} participant{participantCount > 1 ? "s" : ""} sur ce document
                </p>
            </div>
        </div>
        <div className="flex items-center gap-2">
            <AddCollaborator onAdd={onAddCollaborator} />
            <div className="relative">
                {inCall ? (
                    <div className='flex tems-center gap-2'>
                        <p className='self-center'>Appel en cours avec {participantCalled}</p>
                        <button
                            onClick={onEndCall}
                            className="flex h-9 items-center gap-1.5 rounded-lg bg-red-500 px-3 text-sm font-medium text-white hover:bg-red-600"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 rotate-135">
                                <path fillRule="evenodd" d="M1.5 4.5a3 3 0 0 1 3-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 0 1-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 0 0 6.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 0 1 1.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 0 1-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5Z" clipRule="evenodd" />
                            </svg>
                            Raccrocher
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => !calling && setCallMenuOpen(o => !o)}
                        disabled={calling || participants.length === 0}
                        title={participants.length === 0 ? 'Aucun participant disponible' : 'Appeler un participant'}
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40"
                    >
                    {calling ? (
                        <span className="text-xs text-slate-500">...</span>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                            <path fillRule="evenodd" d="M1.5 4.5a3 3 0 0 1 3-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 0 1-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 0 0 6.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 0 1 1.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 0 1-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5Z" clipRule="evenodd" />
                        </svg>
                    )}
                    </button>
                )}

                {callMenuOpen && !inCall && (
                    <div className="absolute right-0 top-11 z-20 w-56 rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
                    <p className="mb-1 px-2 text-xs font-medium text-slate-400">Appeler un participant</p>
                    {participantCount === 0 ? (
                        <p className="px-2 py-1 text-xs text-slate-400">Aucun participant connecté</p>
                    ) : (
                        participants.map(p => (
                        <button
                            key={p.socketId}
                            onClick={() => {
                            onCall(p.socketId, p.username)
                            setCallMenuOpen(false)
                            setParticipantCalled(p.username)
                            }}
                            className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm text-slate-700 hover:bg-slate-50"
                        >
                            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600">
                            {p.username?.[0]?.toUpperCase() || '?'}
                            </span>
                            {p.username}
                        </button>
                        ))
                    )}
                    </div>
                )}
            </div>
            <button
                onClick={onToggleChat}
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
                {chatOpen ? "Masquer le chat" : "Chat"}
            </button>
        </div>
    </header>
  )
}

export default EditorHeader
