
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    username: {
      type: String,
      required: true
    },
    isBlocked: {
      type: Boolean,
      required: true,
      default: false
    },
    twoFactorEnabled: {
      type: Boolean,
      required: true,
      default: false
    },
    twoFactorSecret: {
      type: String,
      default: null
    }
}, { timestamps: true });

userSchema.pre("save", async function(){
  if(this.isModified("password")){
    this.password = await bcrypt.hash(this.password, 10)
  }
})

userSchema.pre("findOneAndUpdate", async function () {
  let update = this.getUpdate();

  if (update.password) {
    const hashed = await bcrypt.hash(update.password, 10);

    this.setUpdate({
      ...update,
      password: hashed
    });
  }
})

export default mongoose.model('User', userSchema);
