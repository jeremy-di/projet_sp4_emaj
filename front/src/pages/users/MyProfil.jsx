import React, { useState } from 'react';
import { useEffect } from 'react';
import { userService } from '../../_services/user.service';

const MyProfil = () => {

    const [infos, setInfos] = useState(null)
    const [loaded, setLoaded] = useState(false)
    const [err, setErr] = useState(null)

    useEffect(() => {
        userService.getMe()
            .then(res => {
                console.log(res.data)
                setInfos(res.data)
                setLoaded(true)
            })
            .catch(error => {
                setErr(error)
                setLoaded(true)
            })
    }, [])

    if (!loaded) {
        return(
            <div className='flex justify-center mt-5'>
                <h2 className='text-4xl text-green-500'>Chargement...</h2>
            </div>
        )
    }
    else if (err) {
        return(
            <div className='flex justify-center mt-5'>
                <h2 className='text-4xl text-red-500'>Erreur : {err}</h2>
            </div>
        )
    }
    else {
        return (
            <div className="min-h-screen bg-slate-100 px-4 py-10">
                <div className="mx-auto max-w-2xl rounded-2xl bg-white p-8 shadow-xl">

                    <div className="mb-8 flex items-center gap-5">
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-600 text-3xl font-bold text-white shadow-lg">
                            {infos.username[0].toUpperCase()}
                        </div>

                        <div>
                            <h2 className="text-3xl font-bold text-slate-800">
                                Bienvenue {infos.username}
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Gérez les informations de votre compte
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4">

                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                            <p className="text-sm font-medium text-slate-500">
                                Adresse email
                            </p>

                            <p className="mt-2 text-lg font-semibold text-slate-800">
                                {infos.email}
                            </p>
                        </div>

                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                            <p className="text-sm font-medium text-slate-500">
                                Rôle
                            </p>

                            <div className="mt-3">
                                <span className={`rounded-full px-4 py-2 text-sm font-semibold ${
                                    infos.role === "admin"
                                        ? "bg-red-100 text-red-600"
                                        : "bg-blue-100 text-blue-600"
                                }`}>
                                    {infos.role}
                                </span>
                            </div>
                        </div>

                    </div>

                    <div className="mt-8 grid gap-4 sm:grid-cols-2">

                        <a
                            href=""
                            className="rounded-xl bg-blue-600 px-5 py-4 text-center font-semibold text-white shadow-md transition hover:bg-blue-700 active:scale-[0.98]"
                        >
                            Modifier mes informations
                        </a>

                        <a
                            href=""
                            className="rounded-xl bg-slate-800 px-5 py-4 text-center font-semibold text-white shadow-md transition hover:bg-slate-900 active:scale-[0.98]"
                        >
                            Modifier mon mot de passe
                        </a>

                    </div>
                </div>
            </div>
        );
    }

};

export default MyProfil;