import mongoose from 'mongoose';

const variantSchema = new mongoose.Schema({
  ram: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true }
});

const productSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String 
  },
  subCategoryId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'SubCategory', 
    required: true 
  },
  variants: [variantSchema],
  images: [String]
}, { timestamps: true });

export default mongoose.model('Product', productSchema);