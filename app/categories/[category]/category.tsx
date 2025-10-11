'use client';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import ArticlesContainer from '~/app/components/articles-container/articles-container';
import RelatedCategoriesSection from '~/app/components/related-categories';
import { useCategoriesContext } from '~/app/context/categories-context';
import { IArticle } from '~/types/article';
import { apiRequest } from '~/utils/api-request';
import { slugify } from '~/utils/slugify';
interface categoryProps {
	articles: IArticle[];
	title: string;
	desc: string;
	totalArticles: number;
}

export default function Category() {
	const { category } = useParams();

	const { categories } = useCategoriesContext();

	const [currentPage, setCurrentPage] = useState(1);
	const pageSize = 9; // articles per page

	const [pagedArticles, setPagedArticles] = useState<categoryProps | null>(
		null,
	);
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
				url: `/api/categories/${category}?skip=${
					(currentPage - 1) * pageSize
				}&limit=${pageSize}&sort=${selectedSort}&search=${searchTerm}&filter=${activeFilter}`,
				method: 'GET',
				onSuccess: (res) => {
					setPagedArticles(res.categoryDetails);
					setTotalArticles(res.categoryDetails.totalArticles);
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
	}, [currentPage, selectedSort, searchTerm, activeFilter, category]);

	useEffect(() => {
		setCurrentPage(1);
	}, [searchTerm]);

	const other_categories = categories?.filter(
		(type) => slugify(type?.title) !== category,
	);

	return (
		<main className="mx-auto w-full">
			<div className="min-h-screen w-full py-8 gap-16 flex flex-col  max-w-[1500px] max-2xl:py-6 max-2xl:gap-10   max-2xl:px-10 max-xs:px-5 mx-auto ">
				{pagedArticles && pagedArticles?.title && (
					<>
						<section className="flex flex-col gap-4 max-w-[900px] max-xs:gap-2">
							<h1 className="text-4xl poppins-bold max-2xl:text-3xl max-xs:text-2xl capitalize text-fade-blue">
								All Articles on {pagedArticles?.title}
							</h1>
							<h2 className="text-lg max-2xl:text-base max-xs:text-[15px] text-silver max-w-[700px]">
								{pagedArticles?.desc}
							</h2>
						</section>
					</>
				)}
				<ArticlesContainer
					pagedArticles={pagedArticles?.articles as IArticle[]}
					totalArticles={totalArticles}
					currentPage={currentPage}
					setCurrentPage={setCurrentPage}
					pageSize={pageSize}
					showFilters={false}
					selectedSort={selectedSort}
					setSelectedSort={setSelectedSort}
					searchTerm={searchTerm}
					setSearchTerm={setSearchTerm}
					activeFilter={activeFilter}
					setActiveFilter={setActiveFilter}
					fetching={fetching}
					error={error}
				/>
				{other_categories && other_categories?.length > 0 && (
					<>
						<RelatedCategoriesSection
							header="Check out our other categories"
							related_categories={other_categories}
						/>
					</>
				)}
				{/* CTA Section */}
				{/* <CtaSection /> */}
			</div>
		</main>
	);
}

