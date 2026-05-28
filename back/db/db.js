import { connect } from 'mongoose'
import fixtureAdmin from '../seed/admin.fixture.js'

function db() {
    connect(process.env.DB_URI)
        .then(async () => {
            console.log("Connexion à la base de données établie")
            await fixtureAdmin()
        })
        .catch((error) => {console.log(error)})
}

export default db