import Script from 'next/script';
import Home from './home';

export default function HomePage() {
	const structured_Schema = {
		'@context': 'https://schema.org',
		'@type': 'Blog',
		url: 'https://devling.vercel.app/',
		mainEntityOfPage: {
			'@type': 'WebPage',
			'@id': 'https://devling.vercel.app/',
		},
		headline: 'Devling Blog',
		description:
			'Discover articles on travel, tech, and movies at Devling Blog — your one-stop spot for tasty reads, travel inspo, and film reviews!',
		publisher: {
			'@type': 'Organization',
			name: 'Devling',
			logo: {
				'@type': 'ImageObject',
				url: 'https://res.cloudinary.com/dycw73vuy/image/upload/v1760173027/Screenshot_2025-10-11_at_9.55.25_AM_c8ajaz.png',
			},
		},
		author: {
			'@type': 'Person',
			name: 'Darlington John',
		},
	};

	return (
		<>
			<Script
				id="structured-data-blog"
				type="application/ld+json"
				strategy="afterInteractive"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(structured_Schema),
				}}
			/>
			<Home />
		</>
	);
}

