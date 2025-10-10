import { getTopic } from '~/utils/getTopic';
import { Metadata } from 'next';
import Topic from './topic';
import Script from 'next/script';

type Props = {
	params: Promise<{
		topic: string;
	}>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const topicParam = await params;
	const topic = await getTopic(topicParam?.topic);

	if (!topic) {
		return {
			title: 'Topic not found',
			description: 'This topic does not exist.',
		};
	}

	const url = `https://devling.vercel.app/topics/${topicParam?.topic}`;

	return {
		title: `Articles on ${topic.title}`,
		description: topic.description,
		alternates: {
			canonical: url,
		},
		openGraph: {
			title: `Articles on ${topic.title}`,
			description: topic.description,
			url,
			images: [
				{
					url: topic.image,
					width: 1200,
					height: 630,
					alt: `Articles on ${topic.title}`,
				},
			],
		},
		twitter: {
			card: 'summary_large_image',
			title: `Articles on ${topic.title}`,
			description: topic.description,
			images: [topic.image],
		},
	};
}

export default async function TopicPage({ params }: Props) {
	const topicParam = await params;
	const topic = await getTopic(topicParam?.topic);

	if (!topic) return <Topic />;

	const url = `https://devling.vercel.app/topics/${topicParam?.topic}`;

	// ✅ Build JSON-LD for Google
	const jsonLd = {
		'@context': 'https://schema.org',
		'@type': 'CollectionPage',
		name: `${topic.title} Articles`,
		description: `Read articles and tips on ${topic.title} from WeFitHost Blog.`,
		url,
		isPartOf: {
			'@type': 'Blog',
			name: 'WeFitHost Blog',
			url: 'https://devling.vercel.app',
		},
		mainEntity: topic.articles?.map((post) => ({
			'@type': 'BlogPosting',
			headline: post.title,
			url: `https://devling.vercel.app/topics/${topicParam?.topic}/${post.slug}`,
			//@ts-expect-error: type date
			datePublished: post.createdAt,
			//@ts-expect-error: type date
			dateModified: post.updatedAt || post.createdAt,
			author: {
				'@type': 'Person',
				//@ts-expect-error: type string
				name: `${post.author?.first_name} ${post.author?.last_name || ''}`,
			},
		})),
	};

	return (
		<>
			<Topic />
			<Script
				id="structured-data-topic"
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
			/>
		</>
	);
}

