import Axios from "./caller.service"

const getAll = () => Axios.get("/documents/")

const getOne = (id) => Axios.get(`/documents/${id}`)

const create = (payload) => Axios.post("/documents/add", payload)

const update = (id, payload) => Axios.put(`/documents/${id}`, payload)

const remove = (id) => Axios.delete(`/documents/${id}`)

const addCollaborator = (id, email) => Axios.post(`/documents/${id}/collaborators`, { email })

export const documentService = {
    getAll, getOne, create, update, remove, addCollaborator,
}
