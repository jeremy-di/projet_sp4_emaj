import mongoose from "mongoose"

const messageSchema = new mongoose.Schema({
    document: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Document",
        required: true,
        index: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    text: {
        type: String,
        required: true
    }
}, { timestamps: true })

messageSchema.index({ document: 1, createdAt: 1 })

export default mongoose.model("Message", messageSchema)
