import { isValidObjectId } from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';
import connectMongo from '~/lib/connect-mongo';
import cloudinary from 'cloudinary';
import User from '~/lib/models/user';
import Category from '~/lib/models/category';
import { slugify } from '~/utils/slugify';
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
		const category = formData.get('category');

		// Validate IDs
		if (!isValidObjectId(adminId)) {
			return NextResponse.json(
				{ error: 'Admin Id not provided or invalid' },
				{ status: 400 },
			);
		}

		if (!isValidObjectId(category)) {
			return NextResponse.json(
				{ error: 'Category Id not provided or invalid' },
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

		// Find category to update
		const existingCategory = await Category.findById(category);
		if (!existingCategory) {
			return NextResponse.json(
				{ error: 'Category not found' },
				{ status: 404 },
			);
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
		let imageUrl = existingCategory.image;
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

		// Update category
		existingCategory.title = title;
		existingCategory.description = description;
		existingCategory.slug = slugify(title);
		existingCategory.image = imageUrl;

		await existingCategory.save();
		await Alert.create({
			type: 'category_edited',
			message: `edited a category: '${title}'`,
			triggered_by: admin._id,
			link: {
				url: `/categories/${existingCategory.slug}`,
				label: 'View category',
			},
			status: 'edit',
		});
		return NextResponse.json(
			{ message: 'Category updated successfully' },
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

