import { getCategory } from '~/utils/getCategory';
import { Metadata } from 'next';
import Category from './category';
import Script from 'next/script';

type Props = {
	params: Promise<{
		category: string;
	}>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const categoryParam = await params;
	const category = await getCategory(categoryParam?.category);

	if (!category) {
		return {
			title: 'Category not found',
			description: 'This category does not exist.',
		};
	}

	const url = `https://devling.vercel.app/categories/${categoryParam?.category}`;

	return {
		title: `Articles on ${category.title}`,
		description: category.description,
		alternates: {
			canonical: url,
		},
		openGraph: {
			title: `Articles on ${category.title}`,
			description: category.description,
			url,
			images: [
				{
					url: category.image,
					width: 1200,
					height: 630,
					alt: `Articles on ${category.title}`,
				},
			],
		},
		twitter: {
			card: 'summary_large_image',
			title: `Articles on ${category.title}`,
			description: category.description,
			images: [category.image],
		},
	};
}

export default async function CategoryPage({ params }: Props) {
	const categoryParam = await params;
	const category = await getCategory(categoryParam?.category);

	if (!category) return <Category />;

	const url = `https://devling.vercel.app/categories/${categoryParam?.category}`;

	// ✅ Build JSON-LD for Google
	const jsonLd = {
		'@context': 'https://schema.org',
		'@type': 'CollectionPage',
		name: `${category.title} Articles`,
		description: `Read articles and tips on ${category.title} from Devling.`,
		url,
		isPartOf: {
			'@type': 'Blog',
			name: 'Devling Blog',
			url: 'https://devling.vercel.app',
		},
		mainEntity: category.articles?.map((post) => ({
			'@type': 'BlogPosting',
			headline: post.title,
			url: `https://devling.vercel.app/categories/${categoryParam?.category}/${post.slug}`,
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
			<Category />
			<Script
				id="structured-data-category"
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
			/>
		</>
	);
}

