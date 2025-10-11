import { isValidObjectId } from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';
import connectMongo from '~/lib/connect-mongo';
import User from '~/lib/models/user';
import Category from '~/lib/models/category';
import Article from '~/lib/models/article';
import Alert from '~/lib/models/alerts';

export async function PATCH(
	req: NextRequest,
	{ params }: { params: Promise<{ category: string; article: string }> },
) {
	try {
		await connectMongo();

		const { category, article } = await params;
		const { adminId } = await req.json();

		// Validate IDs
		if (!isValidObjectId(adminId)) {
			return NextResponse.json(
				{ error: 'Admin Id not provided or invalid' },
				{ status: 400 },
			);
		}

		// Check admin
		const admin = await User.findById(adminId);
		if (!admin) {
			return NextResponse.json(
				{ error: 'No account was found with this Id' },
				{ status: 404 },
			);
		}
		if (admin.role === 'member') {
			return NextResponse.json(
				{ error: 'Only admins can perform this action' },
				{ status: 403 },
			);
		}

		// Validate category
		const selectedCategory = await Category.findOne({ slug: category });
		if (!selectedCategory) {
			return NextResponse.json(
				{ error: 'Category not found' },
				{ status: 404 },
			);
		}

		// Validate article
		const existingArticle = await Article.findOne({ slug: article });
		if (!existingArticle) {
			return NextResponse.json({ error: 'Article not found' }, { status: 404 });
		}

		// Update article content
		existingArticle.published = !existingArticle.published;
		await existingArticle.save();
		await Alert.create({
			type: 'article_published',
			message: `${
				existingArticle.published ? 'published' : 'unpublished'
			} an article: ${existingArticle?.title}`,
			triggered_by: admin?._id,
			link: {
				url: `/categories/${selectedCategory?.slug}/${existingArticle?.slug}`,
				label: 'Published article',
			},
			status: 'info',
		});
		const message = existingArticle.published
			? 'Article published successfully'
			: 'Article unpublished successfully';

		return NextResponse.json(
			{
				message,
			},

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

