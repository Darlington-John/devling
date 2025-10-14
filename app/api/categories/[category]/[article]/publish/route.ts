import { isValidObjectId } from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';
import connectMongo from '~/lib/connect-mongo';
import User from '~/lib/models/user';
import Category from '~/lib/models/category';
import Article from '~/lib/models/article';
import Alert from '~/lib/models/alerts';
import { mailOptions, transporter } from '~/lib/nodemailer';
import NewsletterSubscription from '~/lib/models/newsletter_subscriptions';

export async function PATCH(
	req: NextRequest,
	{ params }: { params: Promise<{ category: string; article: string }> },
) {
	try {
		await connectMongo();

		const { category, article } = await params;
		const { adminId } = await req.json();

		// Validate admin ID
		if (!isValidObjectId(adminId)) {
			return NextResponse.json(
				{ error: 'Admin ID not provided or invalid' },
				{ status: 400 },
			);
		}

		// Check admin existence and role
		const admin = await User.findById(adminId);
		if (!admin) {
			return NextResponse.json(
				{ error: 'No account was found with this ID' },
				{ status: 404 },
			);
		}
		if (admin.role === 'member') {
			return NextResponse.json(
				{ error: 'Only admins can perform this action' },
				{ status: 403 },
			);
		}

		// Validate category and article
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

		// Toggle published status
		existingArticle.published = !existingArticle.published;
		await existingArticle.save();

		await Alert.create({
			type: 'article_published',
			message: `${
				existingArticle.published ? 'published' : 'unpublished'
			} an article: ${existingArticle.title}`,
			triggered_by: admin._id,
			link: {
				url: `/categories/${selectedCategory.slug}/${existingArticle.slug}`,
				label: 'Published article',
			},
			status: 'info',
		});

		const message = existingArticle.published
			? 'Article published successfully'
			: 'Article unpublished successfully';

		if (existingArticle.published) {
			const subscribers = await NewsletterSubscription.find({}, 'email');

			if (subscribers.length === 0) {
				return NextResponse.json(
					{ message: 'No subscribers to send notifications to.' },
					{ status: 200 },
				);
			}

			const articleUrl = `https://devling.vercel.app/topics/${selectedCategory.slug}/${existingArticle.slug}`;

			// Prepare all email sending promises
			const emailPromises = subscribers.map((sub) => {
				const unsubscribeUrl = `https://devling.vercel.app/unsubscribe?email=${encodeURIComponent(
					sub.email,
				)}`;

				const htmlContent = `
     <table role="presentation" cellpadding="0" cellspacing="0" width="100%"
    style="background-color: #0F1214; font-family: Arial, sans-serif; margin: 0; padding: 0;">
    <tr>
        <td align="center" style="padding: 40px 10px;">
            <table cellpadding="0" cellspacing="0" width="100%"
                style="max-width: 500px; background: #091926; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); border: 1px solid #043362">
                <tr>
                    <td align="center" style="background-color: #0F1214; padding: 25px;">
                        <img src="https://res.cloudinary.com/dycw73vuy/image/upload/v1760176571/Screenshot_2025-10-05_at_9.26.29_PM-removebg-preview_deooob.png"
                            alt="Devling Logo" width="200" style="display: block;" />
                    </td>
                </tr>
                <tr>
                    <td align="left" style="padding-left: 30px; padding-top:10px;">
                        <h2 style="font-size: 14px; color: #9cf; margin-bottom: 0px;">
                            A new article just dropped!
                        </h2>
                    </td>
                </tr>
                <tr>
                    <td align="center" style="padding: 20px;">
                        <img src="${
													existingArticle?.image ||
													'https://via.placeholder.com/500x300'
												}" alt="${
					existingArticle?.title || 'Devling Blog Article'
				}" width="500"
                            style="max-width: 95%; height: auto;" />
                    </td>
                </tr>
                <tr>
                    <td style="padding: 0 30px 30px;">
                        <h3 style="font-size: 22px; color: #9cf; margin-bottom: 10px;">
                            ${existingArticle?.title}
                        </h3>
                        <p style="font-size: 14px; line-height: 22px; color: #b7cad4; margin: 0 0 20px;">
                            ${existingArticle?.description}
                        </p>
                        <div style="margin-bottom: 20px;">
                            <a href="${articleUrl}" target="_blank" rel="noopener noreferrer"
                                style="background-color: #3399FF; color: #ffffff; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-size: 14px; font-weight: bold; letter-spacing: 0.5px; display: inline-block;">
                                Read Full Article
                            </a>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td align="center" style="background-color: #0F1214; padding: 15px;">
                        <p style="font-size: 12px; color: #b7cad4; margin: 0;">
                            You're receiving this email because you subscribed to <strong>Devling Blog</strong>
                            newsletter.
                        </p>
                        <p style="font-size: 12px; color: #b7cad4; margin-top: 5px;">
                            <a href="${unsubscribeUrl}"
                                style="color: hsl(1.74 64.49% 80.04%); text-decoration: underline;">Unsubscribe</a>
                        </p>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>
    `;

				return transporter.sendMail({
					...mailOptions,
					to: sub.email,
					from: process.env.EMAIL,
					subject: 'A new article just dropped!',
					html: htmlContent,
				});
			});

			// Run all emails in parallel
			await Promise.all(emailPromises);
		}

		return NextResponse.json({ message }, { status: 200 });
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ error: 'A server error occurred' },
			{ status: 500 },
		);
	}
}

