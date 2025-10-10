import Image from 'next/image';
import Link from 'next/link';
import { FaAngleDown } from 'react-icons/fa';
import { useTopicsContext } from '~/app/context/topics-context';

import { usePopup } from '~/utils/toggle-popups';
import loadingIcon from '~/public/icons/spin-purple.svg';
import { useParams, usePathname } from 'next/navigation';
import { useEffect } from 'react';
const TopicsDropdown = () => {
	const { topic: topic_param } = useParams();
	const {
		isActive: dropdown,
		isVisible: dropdownVisible,
		togglePopup: toggleDropdown,
		ref: dropdownRef,
	} = usePopup();
	const pathname = usePathname();
	const { topics, isFetching, error } = useTopicsContext();
	useEffect(() => {
		if (dropdown) {
			toggleDropdown();
		}
		// eslint-disable-next-line
	}, [pathname]);
	return (
		<div className="relative">
			<button
				className="flex items-center gap-2 duration-150 link-style-dark text-silver"
				onClick={toggleDropdown}
			>
				<span>Topics</span>
				<FaAngleDown
					className={`duration-150 ${dropdownVisible ? 'rotate-180' : ''}`}
				/>
			</button>
			{dropdown && (
				<div
					className={`w-[200px]        p-2  flex flex-col       duration-300 absolute top-8 left-0    shadow-2xl  rounded-lg text-[16px] z-40 bg-navy radial gap-0.5 border-grey border ${
						dropdownVisible ? 'opacity-100' : 'opacity-0'
					}`}
					ref={dropdownRef}
				>
					{error ? (
						<span className="text-xs">An error occurred</span>
					) : isFetching ? (
						<div className="flex w-full h-[180px] bg-deepBlue items-center justify-center">
							<Image src={loadingIcon} className="w-10" alt="loading" />
						</div>
					) : topics && topics.length > 0 ? (
						topics.map((topic) => (
							<Link
								href={`/topics/${topic.slug}`}
								key={topic?.title}
								className={`py-1.5 text-start px-2 duration-150 uppercase ${
									topic.title === topic_param
										? 'bg-deepBlue  text-white'
										: 'hover:bg-grey text-white'
								}`}
							>
								{topic?.title}
							</Link>
						))
					) : (
						<span className="text-sm text-silver">No topics yet</span>
					)}
				</div>
			)}
		</div>
	);
};

export default TopicsDropdown;

