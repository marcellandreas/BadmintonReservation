import mongoose from 'mongoose';

const CourtSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  features: [{
    type: String
  }],
  courtType: {
    type: String,
    enum: ['Indoor', 'Outdoor'],
    default: 'Indoor'
  },
  surfaceType: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  image: {
    type: String,
    default: '/next.svg'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});


const Court = mongoose.model("Court", CourtSchema);

export default Court;
