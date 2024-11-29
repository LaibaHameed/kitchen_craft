import mongoose from 'mongoose';

const PantrySchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true }, // User's unique ID
  ingredients: [
    {
      id: { type: String, required: true }, // Unique ingredient ID
      name: { type: String, required: true }, // Ingredient name
    },
  ],
});

const PantryModel = mongoose.models.Pantry || mongoose.model('Pantry', PantrySchema);

export { PantryModel };
