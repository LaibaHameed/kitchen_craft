import mongoose from 'mongoose';

const PantrySchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true }, 
  ingredients: [
    {
      id: { type: String, required: true }, 
      name: { type: String, required: true }, 
    },
  ],
});

const PantryModel = mongoose.models.Pantry || mongoose.model('Pantry', PantrySchema);

export { PantryModel };
