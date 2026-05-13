import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from '../modules/categories/Category.js';

dotenv.config();

const categories = [
  { id: 101, name: 'Logo Design', description: 'Logo and brand identity design services' },
  { id: 102, name: 'Poster/Banner Design', description: 'Poster, banner, and social media design services' },
  { id: 103, name: 'Assignment Writing', description: 'Academic assignment and essay writing services' },
  { id: 104, name: 'Photo Editing', description: 'Photo retouching and editing services' },
  { id: 105, name: 'PDF Editing & Conversion', description: 'PDF editing and format conversion services' },
  { id: 106, name: 'Notes Making', description: 'Study notes and summary creation services' },
  { id: 107, name: 'Lab File Completion', description: 'Academic lab file and practical report services' },
  { id: 108, name: 'Thumbnail Design', description: 'YouTube and social media thumbnail design services' },
  { id: 109, name: 'Others', description: 'Services that do not fit other categories' }
];

async function seedCategories() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/jobjiffy';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    for (const cat of categories) {
      await Category.findOneAndUpdate(
        { id: cat.id },
        { $set: { name: cat.name, description: cat.description, isActive: true } },
        { upsert: true, new: true }
      );
      console.log(`Seeded category: ${cat.id} - ${cat.name}`);
    }

    console.log('Category seeding completed!');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error seeding categories:', error);
    process.exit(1);
  }
}

seedCategories();