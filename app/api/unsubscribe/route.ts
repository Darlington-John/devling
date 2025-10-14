import { NextResponse } from 'next/server';
import connectMongo from '~/lib/connect-mongo';
import NewsletterSubscription from '~/lib/models/newsletter_subscriptions';

export async function POST(req: Request) {
	try {
		await connectMongo();
		const emailObject = await req.json();

		const email =
			typeof emailObject.email === 'object'
				? emailObject.email.email
				: emailObject.email;

		if (!email) {
			return NextResponse.json(
				{ error: 'Email not provided' },
				{ status: 400 },
			);
		}

		console.log(email);

		const subscriber = await NewsletterSubscription.findOne({ email });
		if (!subscriber) {
			return NextResponse.json(
				{ message: 'You’re already unsubscribed.' },
				{ status: 200 },
			);
		}

		await NewsletterSubscription.deleteOne({ email });

		return NextResponse.json(
			{ message: 'You have successfully been unsubscribed' },
			{ status: 200 },
		);
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ error: 'Something went wrong' },
			{ status: 500 },
		);
	}
}

