import mongoose, { Schema, model, Document, Model, Types } from 'mongoose';
import { JSONContent } from '@tiptap/react';
interface IArticle extends Document {
	image: string;
	slug: string;
	title: string;
	category: Types.ObjectId;

	description: string;
	article: JSONContent;
	author: Types.ObjectId;
	featured: boolean;
	published: boolean;
}

const ArticleSchema = new Schema<IArticle>(
	{
		title: { type: String, required: true },
		category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
		author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
		description: { type: String, required: true },
		image: { type: String, required: true },
		slug: { type: String },

		featured: { type: Boolean, default: false },
		published: { type: Boolean, default: false },
		article: { type: Schema.Types.Mixed },
	},
	{ timestamps: true },
);

const Article: Model<IArticle> =
	mongoose.models.Article || model<IArticle>('Article', ArticleSchema);

export default Article;
export type { IArticle };

