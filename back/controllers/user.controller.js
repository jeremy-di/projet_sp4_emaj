
import User from "../models/user.model.js"
import userValidation from "../validations/user.validation.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { authenticator } from "@otplib/preset-default"
import qrcode from "qrcode"

const register = async(req,res)=>{
    try {
        const {body} = req
        if(!body){
            return res.status(400).json({message: "No data in the request"})
        }
        const {error} = userValidation(body).userCreate
        if(error){
            return res.status(401).json(error.details[0].message)
        }
        const searchUser = await User.findOne({email: body.email})
        if(searchUser){
            return res.status(401).json({message: "user already exists"})
        }
        const user = new User(body)
        const newUser = await user.save()
        return res.status(201).json(newUser)        
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Server error", error: error})
    }
}

const generate2FA = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)

        if (!user) {
            return res.status(404).json({ msg : "Userr not found" })
        }

        const secret = authenticator.generateSecret()

        const otpauth = authenticator.keyuri(
            user.email,
            "sp4_emaj",
            secret
        )

        const qrcodeImage = await qrcode.toDataURL(otpauth)

        user.twoFactorSecret = secret
        await user.save()

        return res.status(200).json({ msg: "QRCODE geneated", qrcodeImage })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ msg: "Server error", error: error })        
    }
}

const enable2FA = async (req, res) => {
    try {
            const { token } = req.body
            const user = await User.findById(req.user.id)

            if (!user) {
                return res.status(404).json({ msg : "Userr not found" })
            }

            if (!user.twoFactorSecret) {
                return res.status(400).json({ message: "2FA secret not genrated" })
            }

            const isValid = authenticator.verify({
                token,
                secret: user.twoFactorSecret
            })

            if (!isValid) {
                return res.status(400).json({ message: "Invalid 2FA code" })
            }
            
            user.twoFactorEnabled = true
            await user.save()

            return res.status(200).json({ msg : "2FA enabled successfully" })
        } catch (error) {
            console.log(error)
            return res.status(500).json({ msg: "Server error", error: error })
        }
}

const login = async(req, res) => {
    try {
        const {email, password } = req.body
        const { error } = userValidation(req.body).userLogin
    
        if(error){
            return res.status(401).json(error.details[0].message)
        }

        const user = await User.findOne({ email: email})
        if(!user){
            return res.status(400).json({message: "invalid credentials"})
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch){
            return res.status(400).json({message: "invalid invalides"})
        }

        if (user.isBlocked) {
            return res.status(403).json({ msg: "Your account is blocked" })
        }

        if (user.twoFactorEnabled) {
            const tempToken = jwt.sign({ id: user._id, email:  user.email, role: user.role, twoFactorPending: true }, process.env.SECRET_KEY, { expiresIn: "5m" })
            
            return res.status(200).json({ msg: "2FA required", twoFactorRequired: true, tempToken })
        }


        res.status(200).json({
            message: user.email+" is connected",
            token: jwt.sign({ id: user._id, email:  user.email }, process.env.SECRET_KEY, { expiresIn: "12h" })
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Server error", error: error})
    }
}

const verify2FA = async (req, res) => {
    try {
        const { token } = req.body

        const authHeader = req.headers["authorization"]
        const temptoken = authHeader && authHeader.split(" ")[1]

        if (!temptoken) {
            return res.status(401).json({ msg: "Missing tempory token" })
        }

        const decoded = jwt.verify(temptoken, process.env.SECRET_KEY)

        if(!decoded.twoFactorPending) {
            return res.status(403).json({ msg: "Invalid tempory token" })
        }

        const user = await User.findById(decoded.id)

        if(!user) {
            return res.status(404).json({ msg: "User not found" })
        }

        const isValid = authenticator.verify({
            token,
            secret: user.twoFactorSecret
        })

        if(!isValid) {
            return res.status(400).json({ msg: "Invalid 2FA code" })
        }

        const finalToken = jwt.sign({ id: user._id, email:  user.email, role: user.role }, process.env.SECRET_KEY, { expiresIn: "12h" })

        return res.status(200).json({
            message: user.email+" is connected",
            token: finalToken
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Server error", error })
    }
}

const getAllUsers = async(req, res) => {
    try {
        const users = await User.find()
        return res.status(200).json(users)
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Server error", error: error})
    }
}

const getUserById = async(req,res) => {
    try {
        const user = await User.findById(req.params.id)
        if(!user){
            return res.status(404).json({message: "user doesn't exist"})
        }
        return res.status(200).json(user)
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Server error", error: error})
    }
}

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password")
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

const updateUser = async(req,res) => {
    try {
        const {body} = req
        if(!body){
            return res.status(400).json({message: "No data in the request"})
        }

        const {error} = userValidation(body).userUpdate
        if(error){
            return res.status(401).json(error.details[0].message)
        }
        const updatedUser = await User.findByIdAndUpdate(req.params.id, body, {new: true})
        if(!updatedUser){
            res.status(404).json({message: "user doesn't exist"})
        }
        return res.status(200).json(updatedUser)
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Server error", error: error})
    }
}

const updateMe = async (req, res) => {
    try {
        const { username, email } = req.body;

        if (!username && !email) {
        return res.status(400).json({ message: "No data to update" });
        }

        const { error } = userValidation(req.body).userUpdateMe
        if (error) {
        return res.status(401).json(error.details[0].message);
        }

        const userId = req.user?.id || req.user?._id;

        const updatedUser = await User.findByIdAndUpdate(
        userId,
        { username, email },
        { new: true, runValidators: true, context: "query" }
        ).select("-password");

        if (!updatedUser) {
        return res.status(404).json({ message: "User doesn't exist" });
        }

    return res.status(200).json(updatedUser);
    }  catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error", error });
  }
}

const updateMyPassword = async (req, res) => {
    try {
        const { oldPassword, newPassword, confirmPassword } = req.body;

        if (!oldPassword || !newPassword || !confirmPassword) {
        return res.status(400).json({ message: "All fields are required" });
        }

        if (newPassword !== confirmPassword) {
        return res.status(400).json({ message: "Les mots de passe ne correspondent pas" });
        }

        const userId = req.user?.id
        if (!userId) {
        return res.status(400).json({ message: "Unauthorized" });
        }

        const user = await User.findById(userId).select("+password");
        if (!user) {
        return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
        return res.status(400).json({ message: "L'ancien mot de passe est incorrect" });
        }

        user.password = newPassword;
        await user.save();

        return res.status(200).json({ message: "Le mot de passe à bien été modifié" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error", error });
    }
}

const deleteUser = async(req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id)
        if(!user){
            return res.status(404).json({message: "user doesn't exist"})
        }
        return res.status(200).json({message: "user a été supprimé"})
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Server error", error: error})
    }
}

export { register, generate2FA, enable2FA, login, verify2FA, getAllUsers, getUserById, getMe, updateUser, updateMe, updateMyPassword, deleteUser }