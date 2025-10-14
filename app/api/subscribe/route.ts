import { NextRequest, NextResponse } from 'next/server';
import connectMongo from '~/lib/connect-mongo';
import NewsletterSubscription from '~/lib/models/newsletter_subscriptions';

export async function POST(req: NextRequest) {
	try {
		await connectMongo();
		const { email } = await req.json();

		if (!email || email.trim() === '') {
			return NextResponse.json(
				{
					error: 'An email is required',
				},
				{ status: 400 },
			);
		}

		const isSubscribed = await NewsletterSubscription.findOne({ email: email });
		if (isSubscribed) {
			return NextResponse.json(
				{ error: 'The email has already been subscribed to my newsletter' },
				{ status: 409 },
			);
		}

		await NewsletterSubscription.create({ email: email });
		return NextResponse.json(
			{ message: 'Thanks for subscribing to my newsletter' },
			{ status: 200 },
		);
	} catch (error) {
		console.log(error);
		return NextResponse.json({
			error: 'A server error occurred',
			status: 500,
		});
	}
}

