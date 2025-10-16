'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FaCircle } from 'react-icons/fa';
import { backup_data } from '~/data/dummy-featured-articles';
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

