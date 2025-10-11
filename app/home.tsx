'use client';
import ArticlesContainer from './components/articles-container/articles-container';

import { IArticle } from '~/types/article';
import { useCategoriesContext } from './context/categories-context';
import { useEffect, useState } from 'react';
import { apiRequest } from '~/utils/api-request';
import FeaturedArticlesPreview from './components/featured-articles-preview';
import RelatedCategoriesSection from './components/related-categories';

export default function Home() {
	const { categories } = useCategoriesContext();

	const [currentPage, setCurrentPage] = useState(1);
	const pageSize = 9; // articles per page

	const [pagedArticles, setPagedArticles] = useState<IArticle[]>([]);
	const [totalArticles, setTotalArticles] = useState(0);
	const [fetching, setFetching] = useState(true);
	const [error, setError] = useState('');
	const [selectedSort, setSelectedSort] = useState('newest');
	const [searchTerm, setSearchTerm] = useState('');
	const [activeFilter, setActiveFilter] = useState('all');

	useEffect(() => {
		const fetchPage = async () => {
			setFetching(true);
			setError('');
			await apiRequest({
				url: `/api/fetch-articles?skip=${
					(currentPage - 1) * pageSize
				}&limit=${pageSize}&sort=${selectedSort}&search=${searchTerm}&filter=${activeFilter}`,
				method: 'GET',
				onSuccess: (res) => {
					setPagedArticles(res.response);
					setTotalArticles(res.articlesLength);
				},
				onError: (error) => {
					setError(error);
				},
				onFinally: () => {
					setFetching(false);
				},
			});
		};

		fetchPage();
	}, [currentPage, selectedSort, searchTerm, activeFilter]);

	useEffect(() => {
		setCurrentPage(1);
	}, [searchTerm]);

	return (
		<main className="mx-auto  w-full">
			<div className="min-h-screen w-full py-8 gap-16 flex flex-col  max-w-[1500px] max-2xl:py-6 max-2xl:gap-10 mx-auto   max-2xl:px-10 max-xs:px-5 max-4xl:px-10">
				<FeaturedArticlesPreview />
				<section className="flex flex-col gap-4 max-w-[1500px]  w-full">
					<h1 className="text-4xl poppins-bold max-2xl:text-3xl max-xs:text-2xl text-fade-blue ">
						Devling Blog – Hosting Tips and Web Insights
					</h1>
					<h2 className="text-lg max-2xl:text-base max-w-[800px] max-2xs:text-sm text-silver">
						Devling Blog brings you the latest tips, updates, and insights on
						web hosting, website management, and digital tools — helping
						individuals and businesses build faster, smarter, and more secure
						online experiences
					</h2>
				</section>

				<ArticlesContainer
					pagedArticles={pagedArticles}
					totalArticles={totalArticles}
					currentPage={currentPage}
					setCurrentPage={setCurrentPage}
					pageSize={pageSize}
					selectedSort={selectedSort}
					setSelectedSort={setSelectedSort}
					searchTerm={searchTerm}
					setSearchTerm={setSearchTerm}
					activeFilter={activeFilter}
					setActiveFilter={setActiveFilter}
					fetching={fetching}
					error={error}
				/>
				{/* CTA Section */}

				{categories && categories?.length > 0 && (
					<>
						<RelatedCategoriesSection
							header="Explore Categories"
							related_categories={categories}
						/>
					</>
				)}
			</div>
		</main>
	);
}

