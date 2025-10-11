import { NextRequest, NextResponse } from 'next/server';
import connectMongo from '~/lib/connect-mongo';
import Article from '~/lib/models/article';
import Category from '~/lib/models/category';

export async function GET(
	req: NextRequest,
	{ params }: { params: Promise<{ category: string; article: string }> },
) {
	try {
		await connectMongo();
		const { category, article } = await params;
		if (!category || category.trim() === '') {
			return NextResponse.json(
				{
					error: 'Category not provided or invalid',
				},
				{ status: 405 },
			);
		}

		const existingCategory = await Category.findOne({ slug: category });
		if (!existingCategory) {
			return NextResponse.json(
				{ error: 'No category was found with this title' },
				{ status: 404 },
			);
		}

		const selectedArticle = await Article.findOne({ slug: article })
			.populate({
				path: 'category',
				select: 'title',
			})
			.populate({
				path: 'author',
				select: 'profile first_name last_name bio',
			});

		if (!selectedArticle) {
			return NextResponse.json({ error: 'Article not found' }, { status: 404 });
		}

		return NextResponse.json(
			{
				selectedArticle,
			},
			{ status: 200 },
		);
	} catch (error) {
		console.log(error);
		return NextResponse.json(
			{ error: 'A server error occurred' },
			{ status: 500 },
		);
	}
}

