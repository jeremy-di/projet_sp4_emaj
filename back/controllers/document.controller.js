import Document from "../models/document.model.js";

const getAllDocs = async(req, res, next) => {
    try{
        const docs = await Document.find();
        return res.status(200).json(docs);
    }catch(error){
        console.log(error);
        res.status(500).json({message : "Server Error", error: error});
    };
};

const getDocById = async(req, res, next) => {
    try{
        const doc = await Document.findById(req.params.id);
        if(!doc){
            return res.status(404).json({message: "document doesn't exist"});
        };
        return res.status(200).json(doc);
    }catch (error){
        console.log(error);
        res.status(500).json({message: "Server error", error: error});
    };
};

const addDoc = async(req, res, next) => {
    try{
        const { title, content } = req.body || {};

        if(!req.user || !req.user.id){
            return res.status(401).json({ message: "Unauthorized" });
        }

        if(!title || typeof title !== 'string' || title.trim() === ''){
            return res.status(400).json({ message: "title is required" });
        }

        const doc = new Document({
            title: title.trim(),
            content: content || "",
            lastModifiedBy: req.user.id
        });
        const saved = await doc.save();
        return res.status(201).json(saved);
    }catch (error){
        console.log(error);
        return res.status(500).json({message: "Server error", error: error});
    };
};

const updateDoc = async(req, res, next) => {
    try{
        const { title, content, lastModifiedBy } = req.body || {};
        const update = {};
        if(title !== undefined){
            if(typeof title !== 'string' || title.trim() === ''){
                return res.status(400).json({ message: "title must be a non-empty string" });
            }
            update.title = title.trim();
        }
        if(content !== undefined) update.content = content;
        if(lastModifiedBy !== undefined) update.lastModifiedBy = lastModifiedBy || null;

        if(Object.keys(update).length === 0){
            return res.status(400).json({ message: "No fields to update" });
        }

        const updated = await Document.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
        if(!updated){
            return res.status(404).json({ message: "document doesn't exist" });
        }
        return res.status(200).json(updated);
    }catch (error){
        console.log(error);
        res.status(500).json({message: "Server error", error: error});
    };
};

const deleteDoc = async(req, res, next) => {
    try{
        const deleted = await Document.findByIdAndDelete(req.params.id);
        if(!deleted){
            return res.status(404).json({ message: "document doesn't exist" });
        }
        return res.status(200).json({ message: "Document deleted", id: deleted._id });
    }catch (error){
        console.log(error);
        return res.status(500).json({message: "Server error", error: error});
    };
};

export { getAllDocs, getDocById, addDoc, updateDoc, deleteDoc};