import { isValidObjectId } from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';
import connectMongo from '~/lib/connect-mongo';
import cloudinary from 'cloudinary';
import User from '~/lib/models/user';
import Category from '~/lib/models/category';
import { slugify } from '~/utils/slugify';
import Article from '~/lib/models/article';
import Alert from '~/lib/models/alerts';

cloudinary.v2.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(
	req: NextRequest,
	{ params }: { params: Promise<{ category: string }> },
) {
	try {
		await connectMongo();
		const { category } = await params;

		const formData = await req.formData();
		const adminId = formData.get('adminId');
		const title = formData.get('title') as string;
		const description = formData.get('description') as string;
		const uploaded_image = formData.get('uploaded_image');
		const selected_category = formData.get('selected_category') as
			| string
			| null;
		// Validate IDs and required fields
		if (!isValidObjectId(adminId)) {
			return NextResponse.json(
				{ error: 'Admin Id not provided or invalid' },
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

		if (!(uploaded_image instanceof File) || uploaded_image.size === 0) {
			return NextResponse.json(
				{ error: 'An image is required' },
				{ status: 400 },
			);
		}
		const MAX_SIZE = 3 * 1024 * 1024;
		if (uploaded_image.size > MAX_SIZE) {
			return NextResponse.json(
				{
					error: `Image too large. Please upload an image smaller than ${
						MAX_SIZE / (1024 * 1024)
					}MB`,
				},
				{ status: 400 },
			);
		}
		// Check admin account
		const admin = await User.findById(adminId);
		if (!admin) {
			return NextResponse.json(
				{ error: 'No account was found with this Id' },
				{ status: 404 },
			);
		}

		if (admin.role === 'member') {
			return NextResponse.json(
				{ error: 'Only admins are allowed to perform this action' },
				{ status: 403 },
			);
		}
		const categorySlug = selected_category?.trim()
			? selected_category
			: category;

		const selectedCategory = await Category.findOne({ slug: categorySlug });
		if (!selectedCategory) {
			return NextResponse.json(
				{ error: 'Category not found' },
				{ status: 404 },
			);
		}
		const existingArticle = await Article.findOne({ slug: slugify(title) });
		if (existingArticle) {
			return NextResponse.json(
				{ error: 'A article with this name already exists' },
				{ status: 400 },
			);
		}

		// Upload image
		const buffer = Buffer.from(await uploaded_image.arrayBuffer());
		const uploadResult = await new Promise<{ secure_url: string }>(
			(resolve, reject) => {
				const uploadStream = cloudinary.v2.uploader.upload_stream(
					{
						folder: 'devling_articles',
						transformation: [{ quality: 'auto', fetch_format: 'auto' }],
						public_id: slugify(title),
						overwrite: true,
						invalidate: true,
					},
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

		// Create category
		const newArticle = await Article.create({
			image: uploadResult?.secure_url || '',
			slug: slugify(title),
			title: title,
			category: selectedCategory._id,

			description: description,

			author: adminId,
		});

		await Alert.create({
			type: 'article_created',
			message: `created a new article: '${title}'`,
			triggered_by: admin._id,
			link: {
				url: `/categories/${selectedCategory.slug}/${newArticle.slug}`,
				label: 'View article',
			},
			status: 'create',
		});
		return NextResponse.json(
			{ message: 'Article created successfully' },
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

