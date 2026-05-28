import React, { useEffect, useState } from 'react';
import { fileService } from '../../_services/file.service';
import { useParams } from 'react-router-dom';

const ViewContent = () => {

    const [file, setFile] = useState(null)
    const [loaded, setLoaded] = useState(false)
    const [err, setErr] = useState(null)

    const { _id } = useParams()

    useEffect(() => {
        fileService.viewFileById(_id)
            .then(res => {
                setFile(res.data)
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
            <>
                <div>
                    <iframe
                        src={file.name}
                        className="w-full h-[800px] rounded-xl border"
                        title="PDF"
        />
                </div>
                <div className='mt-5 text-center'>
                    <a className='rounded-xl mt-5 bg-green-600 px-5 py-4 text-center font-semibold text-white shadow-md transition hover:bg-blue-700 active:scale-[0.98]' href="/files">Retour</a>
                </div>
            </>
        );
    }

};

export default ViewContent;