import Document from "../models/document.model.js";
import User from "../models/user.model.js";

const getAllDocs = async(req, res, next) => {
    try{
        const userId = req.user?.id;
        if(!userId){
            return res.status(401).json({ message: "Unauthorized" });
        }
        const docs = await Document.find({
            $or: [{ owner: userId }, { collaborators: userId }]
        });
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
            owner: req.user.id,
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
        const userId = req.user?.id;
        if(!userId){
            return res.status(401).json({ message: "Unauthorized" });
        }

        const doc = await Document.findById(req.params.id);
        if(!doc){
            return res.status(404).json({ message: "document doesn't exist" });
        }

        const collaborators = doc.collaborators || [];
        const participantCount = collaborators.length + (doc.owner ? 1 : 0);

        //si le document a un seul participant on le supprime
        if(participantCount <= 1){
            await Document.findByIdAndDelete(doc._id);
            return res.status(200).json({ message: "Document deleted", id: doc._id, deleted: true });
        }

        // on retire le user de la liste des participant
        if(doc.owner && doc.owner.toString() === userId){
            const [newOwner, ...rest] = collaborators;
            doc.owner = newOwner || null;
            doc.collaborators = rest;
        }else{
            doc.collaborators = collaborators.filter(c => c.toString() !== userId);
        }
        await doc.save();
        return res.status(200).json({ message: "Left document", id: doc._id, deleted: false });
    }catch (error){
        console.log(error);
        return res.status(500).json({message: "Server error", error: error});
    };
};

const addCollaborator = async(req, res, next) => {
    try{
        const userId = req.user?.id;
        if(!userId){
            return res.status(401).json({ message: "Unauthorized" });
        }

        const { email } = req.body || {};
        if(!email || typeof email !== 'string' || email.trim() === ''){
            return res.status(400).json({ message: "email is required" });
        }

        const doc = await Document.findById(req.params.id);
        if(!doc){
            return res.status(404).json({ message: "document doesn't exist" });
        }

        const isOwner = doc.owner && doc.owner.toString() === userId;
        const isCollaborator = (doc.collaborators || []).some(c => c.toString() === userId);
        if(!isOwner && !isCollaborator){
            return res.status(403).json({ message: "Forbidden" });
        }

        const user = await User.findOne({ email: email.trim() });
        if(!user){
            return res.status(404).json({ message: "Utilisateur introuvable" });
        }

        if(doc.owner && doc.owner.toString() === user._id.toString()){
            return res.status(409).json({ message: "Cet utilisateur est déjà propriétaire" });
        }
        if((doc.collaborators || []).some(c => c.toString() === user._id.toString())){
            return res.status(409).json({ message: "Cet utilisateur est déjà collaborateur" });
        }

        doc.collaborators.push(user._id);
        await doc.save();
        return res.status(200).json(doc);
    }catch (error){
        console.log(error);
        return res.status(500).json({message: "Server error", error: error});
    };
};

export { getAllDocs, getDocById, addDoc, updateDoc, deleteDoc, addCollaborator};