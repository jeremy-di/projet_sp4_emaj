import jwt from "jsonwebtoken"
import registerDocumentHandlers from "./documentEvents.js"

export default function initSockets(io) {
    io.use((socket, next) => {
        const token = socket.handshake.auth?.token
        if (!token) return next(new Error("Missing token"))

        jwt.verify(token, process.env.SECRET_KEY, (err, payload) => {
            if (err) return next(new Error("Invalid token"))
            socket.user = payload
            socket.data.user = payload
            next()
        })
    })

    io.on("connection", (socket) => {
        console.log(`Socket connecté : ${socket.id} (user: ${socket.user?.email || socket.user?.id})`)

        registerDocumentHandlers(io, socket)

        socket.on("disconnect", (reason) => {
            console.log(`Socket déconnecté : ${socket.id} (${reason})`)
        })
    })
}
