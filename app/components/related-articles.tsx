import { IArticle } from '~/types/article';
import ArticleCard from './cards/article-card/article-card';
import { useMemo } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
interface RelatedProps {
	header?: string;
	related_articles: IArticle[];
}

const RelatedArticlesSection = ({ header, related_articles }: RelatedProps) => {
	const shuffledArticles = useMemo(() => {
		if (!related_articles) return [];
		const copy = [...related_articles];
		return copy.sort(() => Math.random() - 0.5).slice(0, 5);
		// eslint-disable-next-line
	}, []);

	return (
		<aside className="flex w-full flex-col gap-5 max-2xl:gap-4  py-10 ">
			{header && (
				<h3 className="text-[28px] poppins-bold max-xl:text-xl text-fade-blue">{header}</h3>
			)}

			<Swiper
				pagination={{
					clickable: true,
				}}
				spaceBetween={10}
				slidesPerView={1.1}
				touchRatio={2} // makes it swipe more easily
				threshold={10}
				breakpoints={{
					// when window width is >= 640px
					800: {
						slidesPerView: 2.1,
						spaceBetween: 10,
					},
					// when window width is >= 1024px

					// when window width is >= 1440px
					1440: {
						slidesPerView: 3.1,
						spaceBetween: 10,
					},
				}}
			>
				{shuffledArticles.map((article) => (
					<SwiperSlide key={article._id}>
						<ArticleCard key={article._id} article={article} />
					</SwiperSlide>
				))}
			</Swiper>
			{/* <div className="grid grid-cols-3 max-2xs:flex max-2xs:flex-col  max-xl:grid-cols-2 max-dmd:grid-cols-1 gap-x-5 gap-y-8 max-xs:gap-2 ">
				{shuffledArticles.map((article) => (
					<ArticleCard key={article._id} article={article} />
				))}
			</div> */}
		</aside>
	);
};

export default RelatedArticlesSection;

