import { useMemo } from 'react';
import { ITopic } from '~/types/topic';
import TopicCard from './cards/topic-card/topic-card';
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
interface RelatedProps {
	header?: string;
	related_topics: ITopic[];
}

const RelatedTopicsSection = ({ header, related_topics }: RelatedProps) => {
	const shuffledTopics = useMemo(() => {
		if (!related_topics) return [];
		const copy = [...related_topics];
		return copy.sort(() => Math.random() - 0.5);
		// eslint-disable-next-line
	}, []);

	return (
		<aside className="flex w-full flex-col gap-5 max-2xl:gap-4  py-10 max-xs:py-5">
			{header && (
				<h3 className="text-[28px] poppins-bold max-xl:text-xl text-fade-blue">
					{header}
				</h3>
			)}
			<Swiper
				pagination={{
					clickable: true,
				}}
				// touchRatio={} // makes it swipe more easily
				threshold={10}
				spaceBetween={10}
				breakpoints={{
					// when window width is >= 320px
					320: {
						slidesPerView: 1.1,
						spaceBetween: 15,
					},
					// when window width is >= 640px
					640: {
						slidesPerView: 2.1,
						spaceBetween: 10,
					},
					// when window width is >= 1024px
					1024: {
						slidesPerView: 3.1,
						spaceBetween: 10,
					},
					// when window width is >= 1440px
					1440: {
						slidesPerView: 3.1,
						spaceBetween: 10,
					},
				}}
			>
				{shuffledTopics.map((topic) => (
					<SwiperSlide key={topic._id}>
						<TopicCard
							key={topic._id}
							topic={topic}
							classname_override="flex flex-col items-start overflow-hidden  duration-300 bg-navy radial max-xs:gap-2  max-2xs:h-auto rounded-lg relative min-h-[430px] max-xl:min-h-[340px] max-xs:min-h-[370px] max-xs:min-h-[300px]  
 "
						/>
					</SwiperSlide>
				))}
			</Swiper>
		</aside>
	);
};

export default RelatedTopicsSection;

