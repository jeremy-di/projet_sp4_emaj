import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../../_services/user.service';

const UpdatePassword = () => {

    const navigate = useNavigate()

    const [password, setPassword] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
    })
    const [err, setErr] = useState(null);
    const [ message, setMessage ] = useState("")

    const onChange = (e) => {
        setPassword({
        ...password,
        [e.target.name]: e.target.value
        });
    }

    const onSubmit = (e) => {
        e.preventDefault()
        userService.updateMyPassword(password)
            .then(res => {
                setMessage(res.data.message)
                navigate('/users/myprofil')
            })
            .catch(error => {
                setErr(error.response?.data?.message || "Erreur serveur");
            });
    }

    return (
        <div className="min-h-screen bg-slate-100 px-4 py-10">
            <div className="mx-auto max-w-xl rounded-2xl bg-white p-8 shadow-xl">

                {message && (
                    <div className="mb-6 rounded-xl bg-green-50 px-4 py-3 text-center text-sm font-medium text-green-600">
                        <p>{message || ""}</p>
                    </div>
                )}

                <h1 className="mb-2 text-center text-3xl font-bold text-slate-800">
                    Modifier mon mot de passe
                </h1>

                <p className="mb-8 text-center text-sm text-slate-500">
                    Sécurisez votre compte avec un nouveau mot de passe
                </p>

                <form onSubmit={onSubmit} className="space-y-5">

                    <div className="flex flex-col gap-2">
                        <label
                            htmlFor="oldPassword"
                            className="text-sm font-medium text-slate-700"
                        >
                            Ancien mot de passe
                        </label>

                        <input
                            className="rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                            type="password"
                            name="oldPassword"
                            value={password.oldPassword}
                            onChange={onChange}
                            id="oldPassword"
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label
                            htmlFor="newPassword"
                            className="text-sm font-medium text-slate-700"
                        >
                            Nouveau mot de passe
                        </label>

                        <input
                            className="rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                            type="password"
                            name="newPassword"
                            value={password.newPassword}
                            onChange={onChange}
                            id="newPassword"
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label
                            htmlFor="confirmPassword"
                            className="text-sm font-medium text-slate-700"
                        >
                            Confirmer le nouveau mot de passe
                        </label>

                        <input
                            className="rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                            type="password"
                            name="confirmPassword"
                            value={password.confirmPassword}
                            onChange={onChange}
                            id="confirmPassword"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white shadow-md transition hover:bg-blue-700 active:scale-[0.98]"
                    >
                        Valider
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UpdatePassword;