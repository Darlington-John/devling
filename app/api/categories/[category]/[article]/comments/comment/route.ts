import { NextRequest, NextResponse } from 'next/server';
import connectMongo from '~/lib/connect-mongo';
import Alert from '~/lib/models/alerts';
import Article from '~/lib/models/article';
import Blocked from '~/lib/models/blocked';
import CommentModel from '~/lib/models/comments';
import Category from '~/lib/models/category';
export async function POST(
	req: NextRequest,
	{ params }: { params: Promise<{ category: string; article: string }> },
) {
	try {
		await connectMongo();
		const { category, article } = await params;
		const { comment, userId, parentId: comment_parent_id } = await req.json();

		if (comment.trim() === '') {
			return NextResponse.json(
				{ error: 'Comment not provided' },
				{ status: 400 },
			);
		}
		if (category.trim() === '') {
			return NextResponse.json(
				{ error: 'Category not provided' },
				{ status: 400 },
			);
		}
		if (article.trim() === '') {
			return NextResponse.json(
				{ error: 'Article not provided' },
				{ status: 400 },
			);
		}

		// 🔑 Get the user's IP address
		const forwardedFor = req.headers.get('x-forwarded-for');
		const ip =
			forwardedFor?.split(',')[0]?.trim() || // first forwarded IP if multiple
			//@ts-expect-error: ip not available by default
			req.ip || // fallback
			'unknown';

		const isIpBlocked = await Blocked.findOne({ ip_address: ip });
		if (isIpBlocked) {
			return NextResponse.json(
				{
					error: isIpBlocked?.reason
						? `You have been blocked from commenting due to '${isIpBlocked?.reason}'`
						: 'You have been blocked from commenting',
				},
				{ status: 403 },
			);
		}

		// 🔒 Check if blocked by userId
		if (userId) {
			const isIdBlocked = await Blocked.findOne({ blocked: userId });
			if (isIdBlocked) {
				return NextResponse.json(
					{
						error: isIdBlocked?.reason
							? `You have been blocked from commenting due to '${isIdBlocked?.reason}'`
							: 'You have been blocked from commenting',
					},
					{ status: 403 },
				);
			}
		}

		const selectedCategory = await Category.findOne({ slug: category });
		if (!selectedCategory) {
			return NextResponse.json(
				{ error: 'Category not found' },
				{ status: 404 },
			);
		}

		const existingArticle = await Article.findOne({ slug: article });
		if (!existingArticle) {
			return NextResponse.json({ error: 'Article not found' }, { status: 404 });
		}

		await CommentModel.create({
			comment: comment,
			comment_by: userId ? userId : null,
			parent_id: comment_parent_id || null,
			article_id: existingArticle._id,
			ip_address: userId ? null : ip,
		});

		await Alert.create({
			type: 'comment_created',
			message: `made a comment: ${comment}`,
			triggered_by: userId ? userId : null,
			link: {
				url: `/categories/${selectedCategory.slug}/${existingArticle.slug}`,
				label: 'View article',
			},
			status: 'create',
		});

		return NextResponse.json(
			{ message: 'Comment made successfully' },
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

