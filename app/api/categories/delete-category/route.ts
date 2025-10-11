import { isValidObjectId } from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';
import connectMongo from '~/lib/connect-mongo';
import User from '~/lib/models/user';
import Category from '~/lib/models/category';
import Article from '~/lib/models/article';
import Alert from '~/lib/models/alerts';

export async function DELETE(req: NextRequest) {
	try {
		await connectMongo();

		const { categoryId, adminId } = await req.json();

		if (!isValidObjectId(adminId)) {
			return NextResponse.json(
				{ error: 'Admin Id not provided or invalid' },
				{ status: 400 },
			);
		}

		if (!isValidObjectId(categoryId)) {
			return NextResponse.json(
				{ error: 'Category Id not provided or invalid' },
				{ status: 400 },
			);
		}

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

		const existingCategory = await Category.findByIdAndDelete(categoryId);
		await Article.deleteMany({ category: categoryId });
		await Alert.create({
			type: 'category_deleted',
			message: `deleted a category: '${existingCategory?.title}'`,
			triggered_by: admin._id,

			status: 'delete',
		});
		if (!existingCategory) {
			return NextResponse.json(
				{ error: 'Category not found' },
				{ status: 404 },
			);
		}

		return NextResponse.json(
			{ message: 'Category deleted successfully' },
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

