import express from "express"
import db from "./db/db.js"
import cors from "cors"

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