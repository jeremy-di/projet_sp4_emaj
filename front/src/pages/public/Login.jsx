import { useState } from "react"
import { userService } from "../../_services/user.service"

const Login = () => {
    const [credentials, setCredentials] = useState({
        email: "",
        password: ""
    })

    const [code2FA, setCode2FA] = useState("")
    const [tempToken, setTempToken] = useState("")
    const [need2FA, setNeed2FA] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [showPassword, setShowPassword] = useState(false)

    const handleChange = (e) => {
        setCredentials({
            ...credentials,
            [e.target.name]: e.target.value
        })
    }

    const handleLogin = async (e) => {
        e.preventDefault()
        setError("")
        setSuccess("")

        try {
            const response = await userService.login(credentials)

            if (response.data.twoFactorRequired) {
                setNeed2FA(true)
                setTempToken(response.data.tempToken)
                setSuccess("Code 2FA requis")
                return
            }

            userService.saveToken(response.data.token)
            setSuccess("Connexion réussie")
            window.location = "/users/myprofil"

        } catch (err) {
            setError(
                err.response?.data?.message ||
                err.response?.data?.msg ||
                err.message ||
                "Erreur de connexion"
            )
        }
    }

    const handleVerify2FA = async (e) => {
        e.preventDefault()
        setError("")
        setSuccess("")

        try {
            const response = await userService.verify2FA(code2FA, tempToken)

            userService.saveToken(response.data.token)
            setSuccess("Connexion réussie avec 2FA")
            window.location = "/users/myprofil"

        } catch (err) {
            setError(err.response?.data?.message || err.response?.data?.msg || "Code 2FA invalide")
        }
    }

    return (
        <main className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
            <section className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
                <h1 className="mb-2 text-center text-3xl font-bold text-slate-800">
                    Connexion
                </h1>

                <p className="mb-8 text-center text-sm text-slate-500">
                    Accède à ton espace collaboratif
                </p>

                {!need2FA ? (
                    <form onSubmit={handleLogin} className="space-y-5">
                        <div className="flex flex-col gap-2">
                            <label htmlFor="email" className="text-left text-sm font-medium text-slate-700">
                                Email
                            </label>
                            <input
                                id="email"
                                className="rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                type="email"
                                name="email"
                                value={credentials.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label htmlFor="password" className="text-left text-sm font-medium text-slate-700">
                                Mot de passe
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    className="w-full rounded-xl border border-slate-300 px-4 py-3 pr-12 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={credentials.password}
                                    onChange={handleChange}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(s => !s)}
                                    aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                                    className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-600"
                                >
                                    {showPassword ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-5 w-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-5 w-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white shadow-md transition hover:bg-blue-700 active:scale-[0.98]"
                        >
                            Se connecter
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleVerify2FA} className="space-y-5">
                        <div className="flex flex-col gap-2">
                            <label htmlFor="code2FA" className="text-left text-sm font-medium text-slate-700">
                                Code Authenticator
                            </label>
                            <input
                                id="code2FA"
                                className="rounded-xl border border-slate-300 px-4 py-3 text-center text-xl tracking-[0.4em] outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                                type="text"
                                value={code2FA}
                                onChange={(e) => setCode2FA(e.target.value)}
                                placeholder="123456"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white shadow-md transition hover:bg-emerald-700 active:scale-[0.98]"
                        >
                            Valider le code
                        </button>
                    </form>
                )}

                {error && (
                    <p className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-center text-sm font-medium text-red-600">
                        {error}
                    </p>
                )}

                {success && (
                    <p className="mt-5 rounded-xl bg-green-50 px-4 py-3 text-center text-sm font-medium text-green-600">
                        {success}
                    </p>
                )}
            </section>
        </main>
    )
}

export default Login