import { isValidObjectId } from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';
import connectMongo from '~/lib/connect-mongo';
import Alert from '~/lib/models/alerts';
import Article from '~/lib/models/article';
import Blocked from '~/lib/models/blocked';
import CommentModel from '~/lib/models/comments';
import Category from '~/lib/models/category';
export async function PATCH(
	req: NextRequest,
	{ params }: { params: Promise<{ category: string; article: string }> },
) {
	try {
		await connectMongo();
		const { category, article } = await params;
		const { userId, commentEdit, commentId } = await req.json();

		if (commentEdit.trim() === '') {
			return NextResponse.json(
				{ error: 'Comment not provided' },
				{ status: 400 },
			);
		}
		if (!isValidObjectId(commentId)) {
			return NextResponse.json(
				{ error: 'CommentId not provided or invalid' },
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

		const existingComment = await CommentModel.findByIdAndUpdate(commentId, {
			comment: commentEdit,
		});

		await Alert.create({
			type: 'comment_edited',
			message: `edited a comment to: ${commentEdit}`,
			triggered_by: userId ? userId : null,
			link: {
				url: `/categories/${selectedCategory.slug}/${existingArticle.slug}`,
				label: 'View article',
			},
			status: 'edit',
		});
		if (!existingComment) {
			return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
		}

		return NextResponse.json(
			{ message: 'Comment edited successfully' },
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

