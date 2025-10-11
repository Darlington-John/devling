import mongoose, { Schema, model, Document, Model, Types } from 'mongoose';

interface IAlert extends Document {
	_id: string;
	type: string;
	triggered_by: Types.ObjectId;
	link: {
		url: string;
		label: string;
	};
	message: string;
	status: string;
}

const AlertSchema = new Schema<IAlert>(
	{
		type: {
			type: String,
			required: true,
			enum: [
				'article_created',
				'article_deleted',
				'article_edited',
				'article_published',
				'article_unpublished',
				'article_featured',
				'article_unfeatured',
				'category_created',
				'category_deleted',
				'category_edited',
				'comment_created',
				'comment_deleted',
				'comment_edited',
				'account_deleted',
				'account_messaged',
				'user_subscribed',
				'role_changed',
				'member_blocked',
				'member_unblocked',
				'ip_blocked',
				'ip_unblocked',
			],
		},

		// Who triggered the action
		triggered_by: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: false,
			default: null,
		},

		// Optional link to related resource
		link: {
			url: { type: String },
			label: { type: String }, // e.g. "View Article", "View Comment"
		},

		// A human-friendly message
		message: {
			type: String,
			required: true,
		},

		// Status for UI coloring
		status: {
			type: String,
			enum: ['delete', 'create', 'edit', 'info'],
			default: 'create',
		},
	},
	{ timestamps: true },
);

const Alert: Model<IAlert> =
	mongoose.models.Alert || model('Alert', AlertSchema);
export default Alert;
export type { IAlert };

