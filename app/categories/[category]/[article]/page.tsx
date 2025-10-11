import { getArticle } from '~/utils/getArticle';
import Article from './article';
import { Metadata } from 'next';
import Script from 'next/script';

type Props = {
	params: Promise<{
		category: string;
		article: string;
	}>;
};

// ✅ Generate metadata dynamically for SEO + sharing
export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const articleParam = await params;
	const article = await getArticle(articleParam?.article);

	if (!article) {
		return {
			title: 'Article not found',
			description: 'This article does not exist.',
		};
	}

	const url = `https://devling.vercel.app/categories/${articleParam?.category}/${articleParam?.article}`;

	return {
		title: article.title,
		alternates: {
			canonical: url,
		},
		description: article.description,
		openGraph: {
			title: article.title,
			description: article.description,
			url,
			images: [
				{
					url: `${article.image.replace('/upload/', '/upload/f_jpg/')}`,
					width: 1200,
					height: 630,
					alt: article.title,
				},
			],
		},
		twitter: {
			card: 'summary_large_image',
			title: article.title,
			description: article.description,
			images: [article.image],
		},
	};
}

export default async function ArticlePage({ params }: Props) {
	const articleParam = await params;
	const article = await getArticle(articleParam?.article);

	if (!article) return <Article />;

	const url = `https://devling.vercel.app/categories/${articleParam?.category}/${articleParam?.article}`;

	const jsonLd = {
		'@context': 'https://schema.org',
		'@type': 'BlogPosting',
		mainEntityOfPage: {
			'@type': 'WebPage',
			'@id': url,
		},
		headline: article?.title,
		description: article?.description,
		image: article?.image,
		author: {
			'@type': 'Person',

			name:
				// @ts-expect-error: type string
				`${article?.author?.first_name}` +
				//  @ts-expect-error: type string
				` ${article?.author?.last_name || ''}`,
		},

		publisher: {
			'@type': 'Organization',
			name: 'Devling Blog',
			logo: {
				'@type': 'ImageObject',
				url: 'https://res.cloudinary.com/dycw73vuy/image/upload/v1760176571/Screenshot_2025-10-05_at_9.26.29_PM-removebg-preview_deooob.png',
			},
		},
		//@ts-expect-error: type Date
		datePublished: article.createdAt,
		//@ts-expect-error: type Date
		dateModified: article.updatedAt || article.createdAt,
	};

	return (
		<>
			<Article />
			<Script
				id="structured-data-article"
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
			/>
		</>
	);
}

