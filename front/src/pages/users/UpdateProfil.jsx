import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../../_services/user.service';

const UpdateProfil = () => {

    const navigate = useNavigate()

    const [infos, setInfos] = useState({
        username: "",
        email: ""
    })
    const [err, setErr] = useState(null)
    const [loaded, setLoaded] = useState(false)

    useEffect(() => {
        userService.getMe()
            .then(res => {
                setInfos({
                    username: res.data.username || "",
                    email: res.data.email || ""
                })
                setLoaded(true)
            })
            .catch(error => {
                setErr("Impossible de charger les informations")
                setLoaded(true)
            })
    }, [])

    const onChange = (e) => {
        setInfos({
            ...infos,
            [e.target.name]: e.target.value
        })
    }

    const onSubmit = (e) => {
        e.preventDefault()
        userService.updateMe(infos)
            .then(res => {
                console.log(res.data)
                navigate("/users/myprofil")
            })
            .catch(error => {
                setErr(error.response?.data?.message || "Erreur serveur")
            })
    }

    if (!loaded) {
        return(
            <div className='flex justify-center mt-5'>
                <h2 className='text-4xl text-green-500'>Chargement...</h2>
            </div>
        )
    }
    else {
        return (
            <div className="min-h-screen bg-slate-100 px-4 py-10">
                <div className="mx-auto max-w-xl rounded-2xl bg-white p-8 shadow-xl">
                    <h1 className="mb-2 text-center text-3xl font-bold text-slate-800">
                        Modifications du profil
                    </h1>

                    <p className="mb-8 text-center text-sm text-slate-500">
                        Mettez à jour vos informations personnelles
                    </p>

                    <form onSubmit={onSubmit} className="space-y-5">
                        <div className="flex flex-col gap-2">
                            <label htmlFor="username" className="text-sm font-medium text-slate-700">
                                Login
                            </label>

                            <input
                                className="rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                type="text"
                                name="username"
                                value={infos.username}
                                onChange={onChange}
                                id="username"
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label htmlFor="email" className="text-sm font-medium text-slate-700">
                                Email
                            </label>

                            <input
                                className="rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                type="text"
                                name="email"
                                value={infos.email}
                                onChange={onChange}
                                id="email"
                                required
                            />
                        </div>

                        {err && (
                            <p className="rounded-xl bg-red-50 px-4 py-3 text-center text-sm font-medium text-red-600">
                                {err}
                            </p>
                        )}

                        <button
                            type="submit"
                            className="w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white shadow-md transition hover:bg-blue-700 active:scale-[0.98]"
                        >
                            Valider les changements
                        </button>
                        <div>
                            <a href='/users/myprofil'
                                type="submit"
                                className="block text-center w-full rounded-xl bg-green-600 px-4 py-3 font-semibold text-white shadow-md transition hover:bg-blue-700 active:scale-[0.98]"
                            >
                                Retour
                            </a>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

};

export default UpdateProfil;