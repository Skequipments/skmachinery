import { Schema, model, models } from 'mongoose';

const SubCategorySchema = new Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  category: { type: String, required: true }, // Reference to Category title
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const SubCategory = models.SubCategory || model('SubCategory', SubCategorySchema);

export default SubCategory;