import { useState } from "react"

const AddCollaborator = ({ onAdd }) => {
    const [open, setOpen] = useState(false)
    const [email, setEmail] = useState("")
    const [msg, setMsg] = useState(null)

    const submit = async (e) => {
        e.preventDefault()
        const value = email.trim()
        if (!value) return
        try {
            await onAdd(value)
            setEmail("")
            setMsg({ ok: true, text: "Collaborateur ajouté" })
        } catch (err) {
            setMsg({ ok: false, text: err.response?.data?.message || "Erreur" })
        }
    }

    return (
        <div className="relative">
            <button
                onClick={() => { setOpen(o => !o); setMsg(null) }}
                title="Ajouter un collaborateur"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-5 w-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
            </button>
            {open && (
                <div className="absolute right-0 top-11 z-20 w-100 rounded-xl border border-slate-200 bg-white p-3 shadow-lg">
                    <form onSubmit={submit} className="flex gap-2">
                        <input
                            type="email"
                            autoFocus
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="email@exemple.com"
                            className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                        />
                        <button
                            type="submit"
                            disabled={!email.trim()}
                            className="rounded-lg bg-blue-600 px-2 py-2 text-sm font-semibold text-white disabled:opacity-50"
                        >
                            Ajouter
                        </button>
                    </form>
                    {msg && (
                        <p className={`mt-2 text-xs ${msg.ok ? "text-emerald-600" : "text-red-600"}`}>
                            {msg.text}
                        </p>
                    )}
                </div>
            )}
        </div>
    )
}

export default AddCollaborator
