
import Files from "../models/files.model.js"
import filesValidation from "../validations/files.validation.js"
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const createFiles = async(req,res)=>{
    try {
        const {body} = req
        if(!body){
            if(req.file){fs.unlinkSync("./uploads/"+req.file.filename)}
            return res.status(400).json({message: "No data in the request"})
        }
        if(req.file){
            body.name = req.protocol+'://'+req.get("host")+'/uploads/'+req.file.filename
        }
        const {error} = filesValidation(body).filesCreate
        if(error){
            if(req.file){fs.unlinkSync("./uploads/"+req.file.filename)}
            return res.status(401).json(error.details[0].message)
        }
        const files = new Files(body)
        const newFiles = await files.save()
        return res.status(201).json(newFiles)        
    } catch (error) {
        console.log(error)
        if(req.file){fs.unlinkSync("./uploads/"+req.file.filename)}
        res.status(500).json({message: "Server error", error: error})
    }
}

const getAllFiless = async(req, res) => {
    try {
        const filess = await Files.find()
        return res.status(200).json(filess)
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Server error", error: error})
    }
}

const getFilesById = async(req,res) => {
    try {
        const files = await Files.findById(req.params.id)
        if(!files){
            return res.status(404).json({message: "files doesn't exist"})
        }
        return res.status(200).json(files)
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Server error", error: error})
    }
}

const deleteFiles = async(req, res) => {
    try {
        const files = await Files.findById(req.params.id)
        if(!files){
            return res.status(404).json({message: "files doesn't exist"})
        }
        if(files.name){
            const oldPath = path.join(__dirname, '../uploads/', files.name.split('/').at(-1))
            if(fs.existsSync(oldPath)) {fs.unlinkSync(oldPath)}
        }
        await files.deleteOne()
        return res.status(200).json({message: "files has been deleted"})
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Server error", error: error})
    }
}

export { createFiles, getAllFiless, getFilesById, deleteFiles }