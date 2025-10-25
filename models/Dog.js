import mongoose from 'mongoose';

const dogSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    description: { type: String, default: '', maxlength: 500 },

    // Who registered this dog
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    // Adoption status
    status: {
      type: String,
      enum: ['available', 'adopted'],
      default: 'available',
    },

    // If adopted
    adoptedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    thankYouMessage: { type: String, default: null, maxlength: 500 },
    adoptedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export default mongoose.model('Dog', dogSchema);