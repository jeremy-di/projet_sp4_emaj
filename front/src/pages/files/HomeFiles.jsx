import React, { useEffect, useRef, useState } from 'react';
import { fileService } from '../../_services/file.service';

const HomeFiles = () => {

    const [files, setFiles] = useState(null)
    const [loaded, setLoaded] = useState(false)
    const [err, setErr] = useState(null)

    useEffect(() => {
        fileService.viewFiles()
            .then(res => {
                console.log(res.data)
                setFiles(res.data)
                setLoaded(true)
            })
            .catch(error => {
                setErr(error)
                setLoaded(true)
            })
    }, [])

    const timeoutRef = useRef(null)

    const handleDeleteStart = (id) => {
        timeoutRef.current = setTimeout(async () => {
            try {
                await fileService.deleteFileById(id)
                setFiles(prev => prev.filter(file => file._id !== id))
            } catch (error) {
                console.log(error)
            }
        }, 1500)
    }

    const handledeleteCancel = () => {
        clearTimeout(timeoutRef.current)
    }

    const getFileType = (url) => {
        const extension = url.split(".").pop().toLowerCase()

        if (["pdf"].includes(extension)) {
            return "pdf"
        }

        if (["jpg", "jpeg", "png", "gif"].includes(extension)) {
            return "image"
        }

        return "unknown"
    }

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
                <div className="mx-auto max-w-4xl rounded-2xl bg-white p-8 shadow-xl">
                    <div className="mb-8 flex items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-800">
                                Gestion des imports de fichiers
                            </h1>
                            <p className="mt-2 text-sm text-slate-500">
                                Consultez, importez ou supprimez vos documents image ou PDF
                            </p>
                        </div>
    
                        <a
                            href="/files/new"
                            className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-md transition hover:bg-blue-700 active:scale-[0.98]"
                        >
                            Importer un fichier
                        </a>
                    </div>
    
                    <div className="overflow-hidden rounded-2xl border border-slate-200">
                        <table className="w-full border-collapse bg-white">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                                        Nom du fichier
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                                        Importateur
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                                        Type
                                    </th>
                                    <th className="px-6 py-4 text-right text-sm font-semibold text-slate-600">
                                        Actions <span className='text-xs text-amber-600'>( Un Appui long pour supprimer )</span>
                                    </th>
                                </tr>
                            </thead>
    
                            <tbody>
                                {files.length === 0 &&(
                                    <tr>
                                        <td className="px-6 py-4 font-medium text-slate-800">
                                            Pas de fichiers
                                        </td>
                                    </tr>
                                )}
                                {files.map(file => (
                                    <tr className="border-t border-slate-200 transition hover:bg-slate-50">
                                        <td className="px-6 py-4 font-medium text-slate-800">
                                            {file.name.split("/").pop()}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-slate-800">
                                            {file.user.username}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-slate-800">
                                            {getFileType(file.name) === "pdf" &&(
                                                "PDF"
                                            )}
                                            {getFileType(file.name) === "image" &&(
                                                "Image"
                                            )}
                                        </td>
        
                                        <td className="px-6 py-4">
                                            <div className="flex justify-end gap-3">
                                                <a
                                                    href={`/files/content/${file._id}`}
                                                    className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-900"
                                                >
                                                    Consulter
                                                </a>
        
                                                <a
                                                    onMouseDown={() => handleDeleteStart(file._id)}
                                                    onMouseUp={handledeleteCancel}
                                                    onMouseLeave={handledeleteCancel}
                                                    href=""
                                                    className="rounded-lg bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100"
                                                >
                                                    Supprimer
                                                </a>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }

};

export default HomeFiles;