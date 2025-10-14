import mongoose, { Schema, model, Document, Model } from 'mongoose';

interface INewsletterSubscription extends Document {
	email: string;
}

const NewsletterSubscriptionSchema = new Schema<INewsletterSubscription>(
	{
		email: { type: String, required: true, unique: true },
	},
	{ timestamps: true },
);

const NewsletterSubscription: Model<INewsletterSubscription> =
	mongoose.models.NewsletterSubscription ||
	model('NewsletterSubscription', NewsletterSubscriptionSchema);
export default NewsletterSubscription;
export type { INewsletterSubscription };

