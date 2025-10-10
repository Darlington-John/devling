import ArticleCard from '../cards/article-card/article-card';
import React from 'react';
import { IArticle } from '~/types/article';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';
interface gridProps {
	articles: IArticle[] | null;
	totalArticles: number;
	currentPage: number;
	pageSize: number;
	onPageChange: (page: number) => void;
	admin?: boolean;
}

export const ArticleGrid = ({
	articles,
	totalArticles,
	currentPage,
	pageSize,
	onPageChange,
	admin = false,
}: gridProps) => {
	const totalPages = Math.ceil(totalArticles / pageSize);
	const scrollToArticles = () => {
		const element = document.getElementById('articles-section');
		if (element) {
			element.scrollIntoView({ behavior: 'smooth' });
		}
	};

	const navigate = (to: number) => {
		scrollToArticles();
		if (to < 1 || to > totalPages) return;

		setTimeout(() => onPageChange(to), 1000);
	};
	return (
		<div className="w-full gap-8 duration-300">
			<div className="grid grid-cols-3 max-2xs:flex max-2xs:flex-col max-xl:grid-cols-2 max-md:grid-cols-1 gap-x-5 gap-y-8 max-xs:gap-2  w-full">
				{articles &&
					articles.map((article) => (
						<ArticleCard key={article._id} article={article} admin={admin} />
					))}
			</div>

			{/* pagination should be here */}
			{totalArticles > pageSize && (
				<div className="flex gap-2 justify-center mt-10 flex-wrap">
					<button
						onClick={() => currentPage > 1 && navigate(currentPage - 1)}
						disabled={currentPage === 1}
						className={`px-2 py-2 rounded-md  ${
							currentPage === 1
								? ' text-gray-500'
								: 'bg-deepBlue ring-blue hover:ring text-white  hover:ring-offset-2 duration-150 ring-offset-dark-navy'
						}`}
						aria-label="Previous page"
					>
						<MdKeyboardArrowLeft />
					</button>

					{Array.from({ length: totalPages }, (_, i) => i + 1)
						.filter(
							(page) =>
								page === 1 || // always show first
								page === totalPages || // always show last
								(page >= currentPage - 2 && page <= currentPage + 2), // show range around current
						)
						.map((page, index, arr) => {
							// Check if we need to add ellipsis before/after
							const prevPage = arr[index - 1];

							return (
								<React.Fragment key={page}>
									{prevPage && page - prevPage > 1 && (
										<span className="px-2">...</span>
									)}

									<button
										onClick={() => {
											navigate(page);
										}}
										className={`px-4 py-2 rounded-md text-sm ${
											page === currentPage
												? 'bg-blue text-white'
												: 'bg-deepBlue ring-blue hover:ring text-white  hover:ring-offset-2 duration-150 ring-offset-dark-navy'
										}`}
									>
										{page}
									</button>
								</React.Fragment>
							);
						})}
					<button
						onClick={() => navigate(currentPage + 1)}
						disabled={currentPage === totalPages}
						aria-label="Next page"
						className={`px-2 py-2 rounded-md  ${
							currentPage === totalPages
								? ' text-gray-500'
								: 'bg-deepBlue ring-blue hover:ring text-white  hover:ring-offset-2 duration-150 ring-offset-dark-navy'
						}`}
					>
						<MdKeyboardArrowRight />
					</button>
				</div>
			)}
		</div>
	);
};



