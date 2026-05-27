import mongoose from 'mongoose';
import User from './user.model.js'

const filesSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    alt: {
      type: String,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
    }
}, { timestamps: true });

export default mongoose.model('Files', filesSchema);
