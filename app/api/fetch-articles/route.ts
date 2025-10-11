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
		const skip = parseInt(searchParams.get('skip') || '0', 10);
		const limit = parseInt(searchParams.get('limit') || '9', 10);
		const sortOrder = searchParams.get('sort') === 'oldest' ? 1 : -1;
		const search = searchParams.get('search') || '';
		const filterParam = searchParams.get('filter') || 'all';

		// Build filter
		//eslint-disable-next-line
		let filter: any = {};
		if (search) {
			filter = {
				$or: [
					{ title: { $regex: search, $options: 'i' } },
					{ description: { $regex: search, $options: 'i' } },
				],
			};
		}
		if (filterParam && filterParam !== 'all') {
			const categories = filterParam.split(',');
			filter.category =
				categories.length > 1 ? { $in: categories } : categories[0];
		}

		const baseFilter = admin ? {} : { published: true };
		const finalFilter = { ...baseFilter, ...filter };

		// Fetch with article field for duration calculation
		const rawArticles = await Article.find(finalFilter)
			.skip(skip)
			.limit(limit)
			.populate({ path: 'category', select: 'title' })
			.populate({ path: 'author', select: 'profile first_name last_name' })
			.sort({ createdAt: sortOrder })
			.lean();

		// Add duration field and remove article body
		const articles = rawArticles.map((article) => {
			const stats = getReadingTime(article.article || '');
			return {
				...article,
				duration: stats, // or stats.text for "3 min read"
				article: undefined, // strip the article body from response
			};
		});

		const articlesLength = await Article.countDocuments(finalFilter);

		return NextResponse.json(
			{ response: articles, articlesLength },
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

