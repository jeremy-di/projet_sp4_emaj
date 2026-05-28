import { useEffect, useRef, useState } from "react"

const formatTime = (ts) => new Date(ts).toLocaleTimeString("fr-FR", {
    hour: "2-digit", minute: "2-digit"
})

const ChatPanel = ({ messages, onSend }) => {
    const [input, setInput] = useState("")
    const endRef = useRef(null)

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    const submit = (e) => {
        e.preventDefault()
        const text = input.trim()
        if (!text) return
        onSend(text)
        setInput("")
    }

    return (
        <aside className="flex w-80 flex-col border-l border-slate-200 bg-white">
            <div className="border-b border-slate-200 px-4 py-3">
                <h2 className="text-sm font-semibold text-slate-800">Discussion</h2>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
                {messages.length === 0 && (
                    <p className="text-center text-xs text-slate-400">Pas encore de messages</p>
                )}
                {messages.map((m, i) => m.system ? (
                    <p key={i} className="text-center text-xs italic text-slate-400">{m.text}</p>
                ) : (
                    <div key={i} className="rounded-lg bg-slate-50 px-3 py-2">
                        <div className="flex items-baseline justify-between">
                            <span className="text-xs font-semibold text-blue-600">{m.username || "?"}</span>
                            <span className="text-[10px] text-slate-400">{formatTime(m.at)}</span>
                        </div>
                        <p className="mt-1 text-sm text-slate-700">{m.text}</p>
                    </div>
                ))}
                <div ref={endRef} />
            </div>

            <form onSubmit={submit} className="flex gap-2 border-t border-slate-200 p-3">
                <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Message…"
                    className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                />
                <button
                    type="submit"
                    disabled={!input.trim()}
                    className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white disabled:opacity-50"
                >
                    →
                </button>
            </form>
        </aside>
    )
}

export default ChatPanel
