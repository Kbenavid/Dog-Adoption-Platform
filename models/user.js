import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// Define what each user document looks like in MongoDB
const userSchema = new mongoose.Schema(
  {
    // Username field — must be unique
    username: {
      type: String,
      required: true,
      unique: true,   // prevents duplicates
      trim: true,     // removes whitespace
      minlength: 3,
      maxlength: 50,
    },

    // Hashed password (never store the plain one)
    passwordHash: {
      type: String,
      required: true,
    },
  },
  { timestamps: true } // adds createdAt and updatedAt automatically
);

// 🔐 Compare plaintext password with hashed version when logging in
userSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.passwordHash);
};

// 🔐 Helper to hash a password before saving a new user
userSchema.statics.hashPassword = async function (plain) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plain, salt);
};

// Export the model so it can be imported elsewhere
export default mongoose.model("User", userSchema);