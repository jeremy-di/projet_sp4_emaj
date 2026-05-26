import { useState } from "react"
import { userService } from "../../_services/user.service"

const Activation = () => {
    const [qrCode, setQrCode] = useState("")
    const [code, setCode] = useState("")
    const [message, setMessage] = useState("")
    const [error, setError] = useState("")

    const handleGenerate2FA = async () => {
        setMessage("")
        setError("")

        try {
            const response = await userService.generate2FA()
            setQrCode(response.data.qrcodeImage)
            setMessage("Scanne le QR Code avec ton application Authenticator")
        } catch (err) {
            setError(err.response?.data?.message || err.response?.data?.msg || "Erreur lors de la génération du QR Code")
        }
    }

    const handleEnable2FA = async (e) => {
        e.preventDefault()
        setMessage("")
        setError("")

        try {
            await userService.enable2FA(code)
            setMessage("2FA activée avec succès")
        } catch (err) {
            setError(err.response?.data?.message || err.response?.data?.msg || "Code 2FA invalide")
        }
    }

    return (
            <main className="min-h-screen bg-slate-100 px-4 py-10">
            <section className="mx-auto max-w-xl rounded-2xl bg-white p-8 shadow-xl">
            <h1 className="mb-2 text-center text-3xl font-bold text-slate-800">
                Options du compte
            </h1>

            <p className="mb-8 text-center text-sm text-slate-500">
                Configure la sécurité de ton compte
            </p>

            <button
                onClick={handleGenerate2FA}
                className="w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white shadow-md transition hover:bg-blue-700 active:scale-[0.98]"
            >
                Activer la 2FA
            </button>

            {qrCode && (
                <section className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-6">
                    <p className="mb-6 text-center text-sm text-slate-600">
                        Scanne ce QR Code avec Google Authenticator ou Microsoft Authenticator
                    </p>

                    <div className="flex justify-center">
                        <img
                            src={qrCode}
                            alt="QR Code 2FA"
                            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-md"
                        />
                    </div>

                    <form
                        onSubmit={handleEnable2FA}
                        className="mt-8 space-y-5"
                    >
                        <div className="flex flex-col gap-2">
                            <label
                                htmlFor="code2FA"
                                className="text-sm font-medium text-slate-700"
                            >
                                Code à 6 chiffres
                            </label>

                            <input
                                id="code2FA"
                                type="text"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                placeholder="123456"
                                className="rounded-xl border border-slate-300 px-4 py-3 text-center text-xl tracking-[0.4em] outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white shadow-md transition hover:bg-emerald-700 active:scale-[0.98]"
                        >
                            Confirmer l’activation
                        </button>
                    </form>
                </section>
            )}

            {message && (
                <p className="mt-6 rounded-xl bg-green-50 px-4 py-3 text-center text-sm font-medium text-green-600">
                    {message}
                </p>
            )}

            {error && (
                <p className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-center text-sm font-medium text-red-600">
                    {error}
                </p>
            )}
        </section>
    </main>
    )
}

export default Activation