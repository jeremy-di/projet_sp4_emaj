import mongoose from 'mongoose';

const filesSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    alt: {
      type: String,
    },

}, { timestamps: true });

export default mongoose.model('Files', filesSchema);
