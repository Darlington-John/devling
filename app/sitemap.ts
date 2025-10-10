import { MetadataRoute } from 'next';
import connectMongo from '~/lib/connect-mongo';
import Article from '~/lib/models/article';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	await connectMongo();

	const articles = await Article.find({ published: true })
		.populate({ path: 'topic', select: 'slug' })
		.lean();

	const uniqueTopics = [
		// @ts-expect-error: it's defined
		...new Set((articles || []).map((a) => a?.topic?.slug).filter(Boolean)),
	];

	const articleUrls =
		(articles || [])
			// @ts-expect-error: it's defined
			.filter((a) => a?.topic?.slug && a?.slug)
			.map((article) => ({
				// @ts-expect-error: it's defined
				url: `https://devling.vercel.app/topics/${article.topic.slug}/${article.slug}`,
				// @ts-expect-error: it's defined
				lastModified: new Date(article.updatedAt),
			})) ?? [];

	const topicUrls = uniqueTopics.map((slug) => ({
		url: `https://devling.vercel.app/topics/${slug}`,
		lastModified: new Date(),
	}));

	return [
		{
			url: 'https://devling.vercel.app',
			lastModified: new Date(),
		},
		...articleUrls,
		...topicUrls,
	];
}

