import { io } from "socket.io-client"

const URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3000"

const socket = io(URL, {
    autoConnect: false,
    withCredentials: true,
})

export function connectSocket(token) {
    socket.auth = { token }
    socket.connect()
}

export function disconnectSocket() {
    socket.disconnect()
}

export default socket
