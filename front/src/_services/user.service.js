import Axios from "./caller.service"

let login = (credentials) => {
    return Axios.post('/users/login', credentials)
}

let verify2FA = (code, tempToken) => {
    return Axios.post('/users/login/2fa', { token: code }, {headers: { Authorization: `Bearer ${tempToken}` }})
}

let generate2FA = () => {
    return Axios.post('/users/2fa/generate')
}

let enable2FA = (code) => {
    return Axios.post('/users/2fa/enable', { token: code })
}

let register = (credentials) => {
    return Axios.post('/register', credentials)
}

let getAllUsers = () => {
    return Axios.get('/users/get_all')
}

let getOneUser = (id) => {
    return Axios.get(`/users/${id}`)
}

let getMe = () => {
    return Axios.get('/users/profil/me')
}

let updateUser = (id, payload) => {
    return Axios.put(`/users/${id}`, payload)
}

let updateMe = (credentials) => {
    return Axios.patch('/users/updateme', credentials)
}

let updateMyPassword = (credentials) => {
    return Axios.patch('/users/updatemypass', credentials)
}

let deleteUser = (id) => {
    return Axios.delete(`/users/${id}`)
}

let saveToken = (token => {
    localStorage.setItem('token', token)
})

let getToken = () => {
    return localStorage.getItem('token')
}

let logout = () => {
    localStorage.removeItem('token')
}

let isLogged = () => {
    let token = localStorage.getItem('token')
    return !!token
}

export const userService = {
    login, verify2FA, generate2FA, enable2FA, register, getAllUsers, getOneUser, getMe, updateUser, updateMe, updateMyPassword, deleteUser, saveToken, getToken, logout, isLogged
}

