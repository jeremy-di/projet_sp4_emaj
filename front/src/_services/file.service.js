import Axios from "./caller.service"

let newFile = (formdata) => {
    return Axios.post('/files/new', formdata, { headers : { "Content-Type" : 'multipart/form-data' } })
}

let viewFiles = () => {
    return Axios.get('/files/all')
}

let viewFileById = (id) => {
    return Axios.get(`/files/${id}`)
}

let deleteFileById = (id) => {
    return Axios.delete(`/files/${id}`)
}


export const fileService = {
    newFile, viewFiles, viewFileById, deleteFileById
}

