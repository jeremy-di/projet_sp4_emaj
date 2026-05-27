import { useState } from "react"
import { useNavigate } from "react-router-dom"
import API from "../services/api"
import Navbar from '../components/Navbar';

export default function CreateUser(){

    const navigate = useNavigate()

    const [form, setForm] = useState({
        email: "",
        password: "",
        username: ""
    })

    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async(e) => {
        e.preventDefault()
        setError("")
        setSuccess("")

        try {
            await API.post("/users/register", form)
            setSuccess("Utilisateur créé avec succès")
            setTimeout(() => {
                navigate("/admin")
            }, 1000)

        } catch (error) {
            console.log(error)
            setError(
                error.response?.data?.message ||
                "Erreur lors de la création"
            )
        }
    }

    return(
        <>
            <Navbar />
            <main className="bg-slate-100 px-2">
                <div className="min-h-screen flex items-center justify-center">
                    <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
                        <h1 className="text-3xl font-bold mb-6 text-center">
                            Ajouter un utilisateur
                        </h1>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <input
                                type="text"
                                name="username"
                                placeholder="Nom d'utilisateur"
                                value={form.username}
                                onChange={handleChange}
                                className="border p-3 rounded-lg outline-none focus:border-black"
                            />
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={form.email}
                                onChange={handleChange}
                                className="border p-3 rounded-lg outline-none focus:border-black"
                            />
                            <input
                                type="password"
                                name="password"
                                placeholder="Mot de passe"
                                value={form.password}
                                onChange={handleChange}
                                className="border p-3 rounded-lg outline-none focus:border-black"
                            />
                            {error && (
                                <p className="text-red-500 text-sm">
                                    {error}
                                </p>
                            )}
                            {success && (
                                <p className="text-green-500 text-sm">
                                    {success}
                                </p>
                            )}
                            <button type="submit"
                                className="bg-black text-white py-3 rounded-lg hover:opacity-90 transition"
                            >
                                Créer l'utilisateur
                            </button>
                        </form>
                    </div>
                </div>
            </main>
        </>
    )
}
