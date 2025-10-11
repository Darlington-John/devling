import Image from 'next/image';
import Link from 'next/link';
import { FaAngleDown } from 'react-icons/fa';
import { useCategoriesContext } from '~/app/context/categories-context';

import { usePopup } from '~/utils/toggle-popups';
import loadingIcon from '~/public/icons/spin-purple.svg';
import { useParams, usePathname } from 'next/navigation';
import { useEffect } from 'react';
const CategoriesDropdown = () => {
	const { category: category_param } = useParams();
	const {
		isActive: dropdown,
		isVisible: dropdownVisible,
		togglePopup: toggleDropdown,
		ref: dropdownRef,
	} = usePopup();
	const pathname = usePathname();
	const { categories, isFetching, error } = useCategoriesContext();
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
				<span>Categories</span>
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
					) : categories && categories.length > 0 ? (
						categories.map((category) => (
							<Link
								href={`/categories/${category.slug}`}
								key={category?.title}
								className={`py-1.5 text-start px-2 duration-150 uppercase ${
									category.title === category_param
										? 'bg-deepBlue  text-white'
										: 'hover:bg-grey text-white'
								}`}
							>
								{category?.title}
							</Link>
						))
					) : (
						<span className="text-sm text-silver">No categories yet</span>
					)}
				</div>
			)}
		</div>
	);
};

export default CategoriesDropdown;

