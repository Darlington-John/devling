import { NextResponse } from 'next/server';
import connectMongo from '~/lib/connect-mongo';
import Category from '~/lib/models/category';

export async function GET() {
	try {
		await connectMongo();

		// Fetch categories sorted by latest first
		const categories = await Category.find().sort({ createdAt: -1 });

		return NextResponse.json({ response: categories }, { status: 200 });
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ error: 'Failed to fetch categories' },
			{ status: 500 },
		);
	}
}

