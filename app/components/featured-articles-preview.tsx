'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FaCircle } from 'react-icons/fa';
import { backup_data } from '~/data/dummy-featured-articles';
import { IArticle } from '~/types/article';
import { useFetch } from '~/utils/fetch-page-data';
import { formatDate } from '~/utils/format-date';
import { slugify } from '~/utils/slugify';

const FeaturedArticlesPreview = () => {
	const {
		fetchedData: featured_articles,
		isFetching,
		hasError,
	} = useFetch<IArticle[]>({
		basePath: `/api/fetch-articles/fetch-featured-articles`,
		ids: [],
		// dataKey: 'categoryDetails',
	});
	let articles;
	if (
		isFetching ||
		hasError ||
		!featured_articles ||
		featured_articles.length === 0
	) {
		articles = backup_data;
	} else {
		articles = featured_articles;
	}
	const [isHovered, setIsHovered] = useState(false);
	const [currentIndex, setCurrentIndex] = useState(() => {
		if (!articles || articles.length === 0) return 0;
		return Math.floor(Math.random() * articles.length);
	});

	const [fadeOut, setFadeOut] = useState(false);

	useEffect(() => {
		if (!articles || articles.length === 0 || isHovered) return;

		const interval = setInterval(() => {
			setFadeOut(true); // start fade out

			setTimeout(() => {
				let newIndex = Math.floor(Math.random() * articles.length);

				// avoid repeating the same article
				while (articles.length > 1 && newIndex === currentIndex) {
					newIndex = Math.floor(Math.random() * articles.length);
				}

				setCurrentIndex(newIndex);
				setFadeOut(false); // start fade in
			}, 500); // match fade transition
		}, 8000);

		return () => clearInterval(interval);
	}, [articles, currentIndex, isHovered]);

	const article = articles?.[currentIndex] ?? null;
	return (
		<section
			className={`flex  w-full aspect-[465/301] overflow-hidden relative items-end rounded-lg duration-500`}
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
				alt="article image"
				className={`absolute top-0 left-0 w-full h-full object-cover z-2 duration-150 ${
					fadeOut ? 'opacity-0' : 'opacity-100'
				}`}
			/>
			<div className="flex flex-col gap-3 relative z-30 max-w-[900px] items-start p-8 py-16 max-lg:py-8 max-lg:max-w-full  max-xl:gap-2 max-md:px-4 text-white  max-2xs:py-4 font-semibold max-2xs:font-normal max-md:gap-0">
				<button className="bg-blue  text-white text-lg h-[40px] px-2.5 duration-150 rounded-sm max-md:h-[25px] max-md:text-xs">
					Featured
				</button>
				<h2 className="text-[32px] poppins-bold max-2xl:text-2xl max-xl:text-xl max-xs:text-base  line-clamp-2">
					{article?.title}
				</h2>
				<p className="text-lg max-2xl:text-base max-xl:text-sm  line-clamp-2 max-lg:line-clamp-1">
					{article?.description}
				</p>
				<div className="flex gap-4 items-center text-lg max-2xl:text-base max-xl:text-sm max-2xs:hidden">
					<span>
						{formatDate((article?.createdAt || ('' as string)) ?? '')}
					</span>
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

export default FeaturedArticlesPreview;

