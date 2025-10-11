import { NextRequest, NextResponse } from 'next/server';
import connectMongo from '~/lib/connect-mongo';
import Article from '~/lib/models/article';
import '~/lib/models/category'; // ensures Category model is registered
import '~/lib/models/user';
import { getReadingTime } from '~/utils/get-reading-time';
export async function GET(req: NextRequest) {
	try {
		await connectMongo();
		const { searchParams } = new URL(req.url);
		const adminParam = searchParams.get('admin');
		const admin = adminParam ? adminParam === 'true' : false;

		let rawArticles;
		if (admin) {
			rawArticles = await Article.find({})
				.limit(9)
				.populate({
					path: 'category',
					select: 'title',
				})
				.populate({
					path: 'author',
					select: 'profile first_name last_name',
				})
				.lean();
		} else {
			rawArticles = await Article.find({ published: true, featured: true })
				.limit(9)
				.populate({
					path: 'category',
					select: 'title',
				})
				.populate({
					path: 'author',
					select: 'profile first_name last_name',
				})
				.lean();
		}

		// Add duration field & strip out article body
		const articles = rawArticles.map((article) => {
			const duration = getReadingTime(article.article || '');
			return {
				...article,
				duration,
				article: undefined, // don’t return full article text
			};
		});

		const articlesLength = await Article.countDocuments({});
		return NextResponse.json(
			{ response: articles, articlesLength },
			{ status: 200 },
		);
	} catch (error) {
		console.log(error);
		return NextResponse.json(
			{ error: 'A server error occured' },
			{ status: 500 },
		);
	}
}

