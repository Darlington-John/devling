import { isValidObjectId } from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';
import connectMongo from '~/lib/connect-mongo';
import Alert from '~/lib/models/alerts';
import Article from '~/lib/models/article';
import User from '~/lib/models/user';

export async function DELETE(req: NextRequest) {
	try {
		await connectMongo();
		const { adminId, articleId } = await req.json();
		if (!isValidObjectId(adminId)) {
			return NextResponse.json(
				{ error: 'Admin Id not provided or invalid' },
				{ status: 400 },
			);
		}

		if (!isValidObjectId(articleId)) {
			return NextResponse.json(
				{ error: 'Article Id not provided or invalid' },
				{ status: 400 },
			);
		}

		const admin = await User.findById(adminId);
		if (admin?.role === 'member') {
			return NextResponse.json(
				{ error: 'Only admins are allowed to perform this action' },
				{ status: 403 },
			);
		}

		const article = await Article.findByIdAndDelete(articleId);
		if (!article) {
			return NextResponse.json(
				{ error: 'No article found with this ID' },
				{ status: 404 },
			);
		}
		await Alert.create({
			type: 'article_deleted',
			message: `deleted an article: '${article.title ?? 'unknown'}'`,
			triggered_by: adminId,
			status: 'delete', // this is where you can use your status to color alerts
		});
		return NextResponse.json(
			{ message: 'Article deleted successfully' },
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

