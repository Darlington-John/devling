import { isValidObjectId } from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';
import connectMongo from '~/lib/connect-mongo';
import cloudinary from 'cloudinary';
import User from '~/lib/models/user';
import Topic from '~/lib/models/topic';
import Article from '~/lib/models/article';
import type { JSONContent } from '@tiptap/react';
import { base64ToBuffer } from '~/utils/base64-to-buffer';
import { uploadToCloudinary } from '~/utils/upload-to-cloud';

cloudinary.v2.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function processTipTapContent(
	content: JSONContent[],
): Promise<JSONContent[]> {
	return Promise.all(
		content.map(async (node) => {
			if (node.type === 'image' && node.attrs?.src?.startsWith('data:image')) {
				const buffer = base64ToBuffer(node.attrs.src);
				const uploaded = await uploadToCloudinary(buffer, 'wefithost_articles');
				return {
					...node,
					attrs: {
						...node.attrs,
						src: uploaded.secure_url,
					},
				};
			} else if (node.content) {
				const newContent = await processTipTapContent(node.content);
				return { ...node, content: newContent };
			}
			return node;
		}),
	);
}

export async function POST(
	req: NextRequest,
	{ params }: { params: Promise<{ topic: string; article: string }> },
) {
	try {
		await connectMongo();

		const { topic, article } = await params;
		console.log('article', article);
		const { content, adminId } = await req.json();

		// Validate IDs
		if (!isValidObjectId(adminId)) {
			return NextResponse.json(
				{ error: 'Admin Id not provided or invalid' },
				{ status: 400 },
			);
		}

		// Check admin
		const admin = await User.findById(adminId);
		if (!admin) {
			return NextResponse.json(
				{ error: 'No account was found with this Id' },
				{ status: 404 },
			);
		}
		if (admin.role === 'member') {
			return NextResponse.json(
				{ error: 'Only admins can perform this action' },
				{ status: 403 },
			);
		}

		// Validate topic
		const selectedTopic = await Topic.findOne({ slug: topic });
		if (!selectedTopic) {
			return NextResponse.json({ error: 'Topic not found' }, { status: 404 });
		}

		// Validate article
		const existingArticle = await Article.findOne({ slug: article });
		if (!existingArticle) {
			return NextResponse.json({ error: 'Article not found' }, { status: 404 });
		}

		const processedContent = await processTipTapContent(content?.content);
		const fullArticleContent: JSONContent = {
			type: 'doc',
			content: processedContent,
		};

		// Update article content
		existingArticle.article = fullArticleContent;
		await existingArticle.save();

		return NextResponse.json(
			{
				message: 'Article updated successfully',
				article_content: fullArticleContent,
			},

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

