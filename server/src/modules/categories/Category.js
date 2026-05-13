import mongoose from 'mongoose';

const categoryServiceSchema = new mongoose.Schema({
  serviceName: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  professionalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Professional'
  }
}, { _id: true });

const categorySchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
    enum: [101, 102, 103, 104, 105, 106, 107, 108, 109]
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  services: {
    type: [categoryServiceSchema],
    default: []
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

categorySchema.index({ isActive: 1 });

export default mongoose.model('Category', categorySchema);