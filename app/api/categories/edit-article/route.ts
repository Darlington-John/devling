import { isValidObjectId } from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';
import connectMongo from '~/lib/connect-mongo';
import cloudinary from 'cloudinary';
import User from '~/lib/models/user';
import { slugify } from '~/utils/slugify';
import Article from '~/lib/models/article';
import Alert from '~/lib/models/alerts';

cloudinary.v2.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function PATCH(req: NextRequest) {
	try {
		await connectMongo();

		const formData = await req.formData();
		const adminId = formData.get('adminId');
		const title = formData.get('title') as string;
		const description = formData.get('description') as string;
		const uploaded_image = formData.get('uploaded_image');
		const article_id = formData.get('article_id');
		const category = formData.get('category');
		// Validate IDs
		if (!isValidObjectId(adminId)) {
			return NextResponse.json(
				{ error: 'Admin Id not provided or invalid' },
				{ status: 400 },
			);
		}

		if (!isValidObjectId(article_id)) {
			return NextResponse.json(
				{ error: 'article Id not provided or invalid' },
				{ status: 400 },
			);
		}

		if (!title?.trim()) {
			return NextResponse.json({ error: 'Title is required' }, { status: 400 });
		}

		if (!description?.trim()) {
			return NextResponse.json(
				{ error: 'Description is required' },
				{ status: 400 },
			);
		}

		// Check admin role
		const admin = await User.findById(adminId);
		if (!admin) {
			return NextResponse.json(
				{ error: 'No account found with this Id' },
				{ status: 404 },
			);
		}

		if (admin.role === 'member') {
			return NextResponse.json(
				{ error: 'Only admins can perform this action' },
				{ status: 403 },
			);
		}

		// Find article to update
		const existingArticle = await Article.findById(article_id);
		if (!existingArticle) {
			return NextResponse.json({ error: 'article not found' }, { status: 404 });
		}
		const MAX_SIZE = 3 * 1024 * 1024;
		if (uploaded_image instanceof File && uploaded_image.size > MAX_SIZE) {
			return NextResponse.json(
				{
					error: `Image too large. Please upload an image smaller than ${
						MAX_SIZE / (1024 * 1024)
					}MB`,
				},
				{ status: 400 },
			);
		}
		// Handle image upload (if provided)
		let imageUrl = existingArticle.image;
		if (uploaded_image instanceof File && uploaded_image.size > 0) {
			const buffer = Buffer.from(await uploaded_image.arrayBuffer());
			const uploadResult = await new Promise<{ secure_url: string }>(
				(resolve, reject) => {
					const uploadStream = cloudinary.v2.uploader.upload_stream(
						{ folder: 'devling_articles' },
						(error, result) => {
							if (error) {
								reject(new Error(error.message || 'Upload failed'));
							} else {
								resolve(result as { secure_url: string });
							}
						},
					);
					uploadStream.end(buffer);
				},
			);
			imageUrl = uploadResult.secure_url;
		}

		// Update article
		existingArticle.title = title;
		existingArticle.description = description;
		existingArticle.slug = slugify(title);
		existingArticle.image = imageUrl;

		await existingArticle.save();
		await Alert.create({
			type: 'article_edited',
			message: `Edited an article '${title}'`,
			triggered_by: admin._id,
			link: {
				url: `/categories/${slugify(category as string)}/${
					existingArticle.slug
				}`,
				label: 'View article',
			},
			status: 'edit', // this is where you can use your status to color alerts
		});

		return NextResponse.json(
			{ message: 'article updated successfully' },
			{ status: 200 },
		);
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ error: 'A server error occurred' },
			{ status: 500 },
		);
	}
}

