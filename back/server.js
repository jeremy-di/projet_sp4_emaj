import express from "express"
import http from "http"
import { Server } from "socket.io"
import db from "./db/db.js"
import cors from "cors"
import userRoutes from "./routes/user.route.js"
import docRoutes from "./routes/document.route.js"
import filesRoutes from "./routes/files.route.js"
import initSockets from "./sockets/index.js"

const app = express()

app.use(express.json())

db()

app.use(cors({
    origin: "http://localhost:5173",
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: "Origin, X-Requested-With, x-access-token, role, Content, Accept, Content-Type, Authorization"
}));

app.use("/users", userRoutes)

const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
})

initSockets(io)

const port = process.env.PORT

server.listen(port, () => {
    console.log(`Le serveur écoute sur le port ${port}`)
})

app.use("/documents", docRoutes)
app.use("/files",filesRoutes)