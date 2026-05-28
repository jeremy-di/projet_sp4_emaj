import { Link } from "react-router-dom"
import AddCollaborator from "./AddCollaborator"

const EditorHeader = ({ title, connected, participantCount, chatOpen, onToggleChat, onAddCollaborator }) => (
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
            <button
                onClick={onToggleChat}
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
                {chatOpen ? "Masquer le chat" : "Chat"}
            </button>
        </div>
    </header>
)

export default EditorHeader
