import express from "express"
import db from "./db/db.js"
import cors from "cors"
import userRoutes from "./routes/user.route.js"
import docRoutes from "./routes/document.route.js"

const app = express()

app.use(express.json())

db()

app.use(cors({
    origin: "http://localhost:5173",
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: "Origin, X-Requested-With, x-access-token, role, Content, Accept, Content-Type, Authorization"
}));

const port  = process.env.PORT

app.listen(port, () => {
    console.log(`Le serveur écoute sur le port ${port}`)
})

app.use("/users", userRoutes)
app.use("/documents", docRoutes)