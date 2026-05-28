import User from "../models/user.model.js"

const fixtureAdmin = async () => {
    try {
        const adminEmail = process.env.ADMIN_EMAIL
        const adminPassword = process.env.ADMIN_PASSWORD
        const adminUsername = process.env.ADMIN_USERNAME || "admin"

        const existingAdmin = await User.findOne({
            $or: [
                { email: adminEmail },
                { role: "admin" }
            ]
        })

        if (existingAdmin) {
            console.log("Admin déja existant")
            return
        }

        const admin = new User({
            email: adminEmail,
            password: adminPassword,
            username: adminUsername,
            role: "admin",
            isBlocked: false,
            twoFactorEnabled: false,
            twoFactorSecret: null
        })

        await admin.save()

        console.log(
            `ADMIN CREE AUTOMATIQUEMENT
            Email : ${adminEmail}
            password : ${adminPassword}    
        `)
    } catch (error) {
        console.log("Erreur dans la création d'un admin :", error)
    }
}

export default fixtureAdmin