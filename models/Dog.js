import mongoose from "mongoose";

// The Dog schema defines what each dog document looks like in MongoDB
const dogSchema = new mongoose.Schema(
  {
    // Dog's name — required so each record has an identifier
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    // Optional short description
    description: {
      type: String,
      trim: true,
      maxlength: 1000,
    },

    // Dog's current status — either 'available' or 'adopted'
    status: {
      type: String,
      enum: ["available", "adopted"],
      default: "available",
      index: true, // speeds up filtering queries by status
    },

    // The user who originally registered the dog (reference to User model)
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // connects to the User collection
      required: true,
      index: true,
    },

    // The user who adopted the dog (null until adoption)
    adoptedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },

    // A thank-you message from adopter to owner (optional)
    thankYouMessage: {
      type: String,
      maxlength: 500,
      default: null,
    },

    // Timestamp of when the dog was adopted
    adoptedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true } // adds createdAt and updatedAt automatically
);

// Export model so controllers can import it
export default mongoose.model("Dog", dogSchema);