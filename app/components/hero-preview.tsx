'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FaCircle } from 'react-icons/fa';
import { IArticle } from '~/types/article';
import { formatDate } from '~/utils/format-date';
import { slugify } from '~/utils/slugify';

interface previewProps {
	articles: IArticle[] | null;
}
const HeroPreview = ({ articles }: previewProps) => {
	const [isHovered, setIsHovered] = useState(false);

	const [rendered_articles, setRenderedArticles] =
		//@ts-expect-error: typing not needed
		useState<IArticle[]>(backup_data);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [fadeOut, setFadeOut] = useState(false);

	useEffect(() => {
		if (articles && articles.length > 0) {
			setRenderedArticles(articles);

			// reset currentIndex safely
			setCurrentIndex(Math.floor(Math.random() * articles.length));
		}
	}, [articles]);

	useEffect(() => {
		if (!rendered_articles || rendered_articles.length === 0 || isHovered)
			return;

		const interval = setInterval(() => {
			setFadeOut(true);

			setTimeout(() => {
				let newIndex = Math.floor(Math.random() * rendered_articles.length);

				while (rendered_articles.length > 1 && newIndex === currentIndex) {
					newIndex = Math.floor(Math.random() * rendered_articles.length);
				}

				setCurrentIndex(newIndex);
				setFadeOut(false);
			}, 500);
		}, 6000);

		return () => clearInterval(interval);
	}, [rendered_articles, currentIndex, isHovered]);

	const article =
		rendered_articles?.[currentIndex] ?? rendered_articles[0] ?? null;
	return (
		<section
			className={`flex  aspect-[465/301] w-full overflow-hidden relative items-end rounded-lg  duration-500`}
			style={{
				backgroundImage: `url(${article?.image})`,
				backgroundSize: 'cover',
				backgroundPosition: 'center',
				backgroundColor: '#1f13467d',
			}}
		>
			<div className="w-full h-full absolute z-[20] object-cover top-0 left-0 bg-[#00000077] "></div>
			{/*eslint-disable-next-line */}
			<img
				src={article?.image}
				alt={'article image'}
				className={`absolute top-0 left-0 w-full h-full object-cover z-2 duration-150 ${
					fadeOut ? 'opacity-0' : 'opacity-100'
				}`}
			/>
			<div className="flex flex-col gap-3 relative z-30 max-w-[900px] items-start p-8 py-16 max-lg:py-8 max-lg:max-w-full  max-xl:gap-2 max-md:px-4 text-white  max-2xs:py-4 font-semibold max-2xs:font-normal max-md:gap-0">
				<h3 className="text-[32px] poppins-bold max-2xl:text-2xl max-xl:text-xl max-xs:text-base  line-clamp-2">
					{article?.title}
				</h3>
				<p className="text-lg max-2xl:text-base max-xl:text-sm  line-clamp-2 max-lg:line-clamp-1">
					{article?.description}
				</p>
				<div className="flex gap-4 items-center text-lg max-2xl:text-base max-xl:text-sm max-2xs:hidden">
					<span>{formatDate(article?.createdAt || ('' as string)) || ''}</span>
					<FaCircle className="text-[10px] " />
					<span>{article?.duration || '2'} mins read</span>
				</div>
				<Link
					href={`/categories/${slugify(article?.category?.title)}/${slugify(
						article?.title as string,
					)}`}
					onMouseEnter={() => setIsHovered(true)}
					onMouseLeave={() => setIsHovered(false)}
					className="link-style  text-lg max-2xl:text-base max-xl:text-sm max-xs:text-xs"
				>
					Read more...
				</Link>
			</div>
		</section>
	);
};

export default HeroPreview;

const backup_data = [
	{
		_id: '68aee7332d1722a1a2f99b38',
		title: 'How to Scale Your Reseller Hosting Business',
		category: {
			_id: '68aee2f52d1722a1a2f99ae5',
			title: 'hosting',
		},
		duration: 3,
		author: {
			_id: '68aee0442d1722a1a2f99ac1',
			first_name: 'Darlington',
			last_name: 'John',
			profile:
				'https://res.cloudinary.com/dl6pa30kz/image/upload/v1756291223/wefithost_blog_profiles/vmq5jhrmgipz99jw3o7l.png',
		},
		article: {},
		description:
			'Learn proven strategies to scale your reseller hosting business— boost profits, attract clients, and stand out in a competitive hosting market.',
		image:
			'https://res.cloudinary.com/dl6pa30kz/image/upload/v1756292915/wefithost_articles/hnfuvgpxoaqrfwtdupep.jpg',
		slug: 'how-to-scale-your-reseller-hosting-business',
		featured: true,
		published: true,
		createdAt: '2025-08-27T11:08:35.999Z',
		updatedAt: '2025-08-27T11:46:03.538Z',
		__v: 0,
	},
	{
		_id: '68aef3ee2d1722a1a2f99c92',
		title: 'Hosting Business Marketing Strategies',
		category: {
			_id: '68aee5412d1722a1a2f99b01',
			title: 'business',
		},
		duration: 3,
		author: {
			_id: '68aee0442d1722a1a2f99ac1',
			first_name: 'Darlington',
			last_name: 'John',
			profile:
				'https://res.cloudinary.com/dl6pa30kz/image/upload/v1756291223/wefithost_blog_profiles/vmq5jhrmgipz99jw3o7l.png',
		},
		article: {},
		description:
			'Boost your hosting business with proven marketing strategies to attract new clients, increase visibility, and maximize growth.',
		image:
			'https://res.cloudinary.com/dl6pa30kz/image/upload/v1756710521/wefithost_articles/qeam6adgcqyn7ozdj8ml.png',
		slug: 'hosting-business-marketing-strategies',
		featured: true,
		published: true,
		createdAt: '2025-08-27T12:02:54.701Z',
		updatedAt: '2025-08-27T12:15:13.473Z',
		__v: 0,
	},
	{
		_id: '68aef8922d1722a1a2f99d05',
		title: 'Shared Hosting vs. VPS: Which Is More Secure?',
		category: {
			_id: '68aee4202d1722a1a2f99af3',
			title: 'security',
		},
		duration: 3,
		author: {
			_id: '68aee0442d1722a1a2f99ac1',
			first_name: 'Darlington',
			last_name: 'John',
			profile:
				'https://res.cloudinary.com/dl6pa30kz/image/upload/v1756291223/wefithost_blog_profiles/vmq5jhrmgipz99jw3o7l.png',
		},
		article: {},
		description:
			'Choosing between shared hosting and VPS often comes down to performance and budget — but security should be a top priority too. In this article, we’ll compare both hosting types to help you understand which is more secure for your website and why.',
		image:
			'https://res.cloudinary.com/dl6pa30kz/image/upload/v1756679908/wefithost_articles/hxjernbnx6e6toupufmr.png',
		slug: 'shared-hosting-vs-vps-which-is-more-secure',
		featured: true,
		published: true,
		createdAt: '2025-08-27T12:22:42.018Z',
		updatedAt: '2025-08-27T12:47:13.684Z',
		__v: 0,
	},
	{
		_id: '68aeff8d2d1722a1a2f99d8d',
		title: 'Tips for Building Rich SEO: A Complete Guide to Ranking Higher',
		category: {
			_id: '68aee37c2d1722a1a2f99aec',
			title: 'tips',
		},
		duration: 3,
		author: {
			_id: '68aee0442d1722a1a2f99ac1',
			first_name: 'Darlington',
			last_name: 'John',
			profile:
				'https://res.cloudinary.com/dl6pa30kz/image/upload/v1756291223/wefithost_blog_profiles/vmq5jhrmgipz99jw3o7l.png',
		},
		article: {},
		description:
			'Boost your website’s visibility with proven SEO tips that enhance ranking, increase traffic, and build a strong online presence.',
		image:
			'https://res.cloudinary.com/dl6pa30kz/image/upload/v1756679270/wefithost_articles/gqdk4kigdlyqrxk4c3fe.png',
		slug: 'tips-for-building-rich-seo-a-complete-guide-to-ranking-higher',
		featured: true,
		published: true,
		createdAt: '2025-08-27T12:52:29.962Z',
		updatedAt: '2025-08-27T13:05:56.730Z',
		__v: 0,
	},
	{
		_id: '68af085c2d1722a1a2f99e6c',
		title: 'Dedicated Hosting Explained: Is It Worth the Cost?',
		category: {
			_id: '68aee2f52d1722a1a2f99ae5',
			title: 'hosting',
		},
		duration: 3,
		author: {
			_id: '68aee0442d1722a1a2f99ac1',
			first_name: 'Darlington',
			last_name: 'John',
			profile:
				'https://res.cloudinary.com/dl6pa30kz/image/upload/v1756291223/wefithost_blog_profiles/vmq5jhrmgipz99jw3o7l.png',
		},
		article: {},
		description:
			'Learn what dedicated hosting is, its benefits, drawbacks, and whether it’s worth the high cost. Perfect guide for businesses choosing the right hosting solution.',
		image:
			'https://res.cloudinary.com/dl6pa30kz/image/upload/v1756679001/wefithost_articles/q0bpniyi6fnystzjvgvn.png',
		slug: 'dedicated-hosting-explained-is-it-worth-the-cost',
		featured: true,
		published: true,
		createdAt: '2025-08-27T13:30:04.216Z',
		updatedAt: '2025-08-27T13:36:52.153Z',
		__v: 0,
	},
];

