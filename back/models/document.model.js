import mongoose from 'mongoose';

const docSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        default: ''
    },
    lastModifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
        default: null
    }
}, {timestamps: true});

export default mongoose.model('Document', docSchema);