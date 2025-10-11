import { Types } from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';
import connectMongo from '~/lib/connect-mongo';
import Article from '~/lib/models/article';
import CommentModel from '~/lib/models/comments';
import Category from '~/lib/models/category';

export async function GET(
	req: NextRequest,
	{
		params,
	}: {
		params: Promise<{ category: string; article: string }>;
	},
) {
	try {
		await connectMongo();
		const { article, category } = await params;

		const chosenCategory = await Category.findOne({
			slug: category,
		});

		if (!chosenCategory) {
			return NextResponse.json(
				{ error: `No category found with the name: ${article}` },
				{ status: 404 },
			);
		}

		const chosenArticle = await Article.findOne({ slug: article });
		if (!chosenArticle) {
			return NextResponse.json(
				{ error: `No article was found with the name ${article}` },
				{ status: 404 },
			);
		}

		const topLevelComments = await CommentModel.find({
			article_id: chosenArticle._id,
			parent_id: null,
		})
			.sort({ createdAt: -1 })
			.populate({
				path: 'comment_by',
				select: 'first_name last_name profile',
				options: { strictPopulate: false }, // avoid errors when empty
			});

		// normalize comment_by so it's consistent
		//eslint-disable-next-line
		const normalizeUser = (comment: any) => {
			if (!comment.comment_by || comment.comment_by === '') {
				comment.comment_by = {
					first_name: '',
					last_name: '',
					profile: null,
					guest: true,
				};
			}
			return comment;
		};

		async function fetchNestedReplies(commentId: Types.ObjectId) {
			const childReplies = await CommentModel.find({ parent_id: commentId })
				.sort({ createdAt: -1 })
				.populate({
					path: 'comment_by',
					select: 'first_name last_name profile',
					options: { strictPopulate: false },
				});
			//eslint-disable-next-line
			const nestedReplies: any = await Promise.all(
				childReplies.map(async (reply) => {
					const subReplies = await fetchNestedReplies(
						reply._id as Types.ObjectId,
					);
					const replyCount = await CommentModel.countDocuments({
						parent_id: reply._id,
					});

					return {
						...normalizeUser(reply.toObject()),
						replies: subReplies,
						replyCount,
					};
				}),
			);

			return nestedReplies;
		}

		const commentsWithReplies = await Promise.all(
			topLevelComments.map(async (comment) => {
				const nestedReplies = await fetchNestedReplies(
					comment._id as Types.ObjectId,
				);
				return {
					...normalizeUser(comment.toObject()),
					replies: nestedReplies,
					replyCount: await CommentModel.countDocuments({
						parent_id: comment._id,
					}),
				};
			}),
		);
		return NextResponse.json({ result: commentsWithReplies }, { status: 200 });
	} catch (error) {
		console.error('Fetch comments error:', error);
		return NextResponse.json(
			{ error: 'A server error occurred' },
			{ status: 500 },
		);
	}
}

