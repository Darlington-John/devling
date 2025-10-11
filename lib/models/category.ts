import mongoose, { Schema, model, Document, Model } from 'mongoose';

interface ICategory extends Document {
	title: string;
	description: string;
	image: string;
	slug: string;
}

const CategorySchema = new Schema<ICategory>(
	{
		title: { type: String, required: true, unique: true },
		description: { type: String, required: true },
		image: { type: String, required: true },
		slug: { type: String },
	},
	{ timestamps: true },
);

// ✅ Clean single definition & export
const Category: Model<ICategory> =
	mongoose.models.Category || model<ICategory>('Category', CategorySchema);

export default Category;
export type { ICategory };

