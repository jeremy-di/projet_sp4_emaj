import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fileService } from '../../_services/file.service';

const NewFile = () => {

    const navigate = useNavigate()

    const [name, setName] = useState(null)
    const [err, setErr] = useState(false)

    const onSubmit = async (e) => {
        e.preventDefault()
        const formdata = new FormData()
        formdata.append("name", name)

        const config = {headers: {'Content-Type' : 'multipart/form-data'}}

        try {
            const data = await fileService.newFile(formdata)
            navigate("/files")
            console.log(data)
        } catch (error) {
            console.log(error)
            setErr(error)
        }
    }

    if (err) {
        return (
            <div>
                <p>Erreur : {error}</p>
            </div>
        )
    }
    else {
        return (
            <div className="min-h-screen bg-slate-100 px-4 py-10">
                <div className="mx-auto max-w-xl rounded-2xl bg-white p-8 shadow-xl">

                    <div className="mb-8 text-center">
                        <h1 className="text-3xl font-bold text-slate-800">
                            Ajout d'un fichier
                        </h1>

                        <p className="mt-2 text-sm text-slate-500">
                            Importez un document dans votre espace collaboratif
                        </p>
                    </div>

                    <form onSubmit={onSubmit} className="space-y-6">

                        <div className="flex flex-col gap-2">

                            <label
                                htmlFor="name"
                                className="text-sm font-medium text-slate-700"
                            >
                                Fichier à ajouter
                            </label>

                            <input
                                type="file"
                                name="name"
                                id="name"
                                onChange={(e) => {
                                    setName(e.target.files[0])
                                }}
                                className="
                                    block w-full cursor-pointer rounded-xl
                                    border border-slate-300 bg-slate-50
                                    px-4 py-3 text-sm text-slate-700
                                    transition
                                    file:mr-4 file:rounded-lg
                                    file:border-0 file:bg-blue-600
                                    file:px-4 file:py-2
                                    file:font-semibold file:text-white
                                    hover:file:bg-blue-700
                                    focus:outline-none focus:ring-2
                                    focus:ring-blue-200
                                "
                            />
                        </div>

                        <button
                            type="submit"
                            className="
                                w-full rounded-xl bg-blue-600
                                px-4 py-3 font-semibold text-white
                                shadow-md transition
                                hover:bg-blue-700
                                active:scale-[0.98]
                            "
                        >
                            Ajouter
                        </button>

                    </form>
                </div>
            </div>
        );
    }

};

export default NewFile;