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

        socket.on('join', (roomId) => {
            socket.join(roomId);
            console.log(`${socket.id} a rejoint la room ${roomId}`);

            socket.to(roomId).emit('peer-joined');
        });

        socket.on('offer', ({ roomId, offer }) => {
            socket.to(roomId).emit('offer', offer);
        });

        socket.on('answer', ({ roomId, answer }) => {
            socket.to(roomId).emit('answer', answer);
        });
        
        socket.on('ice-candidate', ({ roomId, candidate }) => {
            socket.to(roomId).emit('ice-candidate', candidate);
        });

        socket.on('call:invite', ({ roomId, targetSocketId, callerName }) => {
            io.to(targetSocketId).emit('call:incoming', {
                roomId,
                callerName,
                callerSocketId: socket.id
            })
        })

        socket.on('call:accepted', ({ callerSocketId, roomId }) => {
            io.to(callerSocketId).emit('call:accepted', { roomId })
        })

        socket.on('call:rejected', ({ callerSocketId }) => {
            io.to(callerSocketId).emit('call:rejected')
        })

        socket.on('call:ended', ({ roomId }) => {
            socket.to(roomId).emit('call:ended')
        })

        registerDocumentHandlers(io, socket)

        socket.on("disconnect", (reason) => {
            console.log(`Socket déconnecté : ${socket.id} (${reason})`)
        })
    })
}
