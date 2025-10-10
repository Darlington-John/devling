'use client';

import { useParams } from 'next/navigation';
import { IArticle } from '~/types/article';

import NewArticle from '../../components/new-article';
import ArticlesContainer from '~/app/components/articles-container/articles-container';
import { useEffect, useState } from 'react';
import { apiRequest } from '~/utils/api-request';
// import Breadcrumbs from '../../components/bread-crumbs';
const Articles = () => {
	const { topic } = useParams();
	interface topicProps {
		articles: IArticle[];
		title: string;
		desc: string;
		totalArticles: number;
	}
	const [currentPage, setCurrentPage] = useState(1);
	const pageSize = 9; // articles per page

	const [pagedArticles, setPagedArticles] = useState<topicProps | null>(null);
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
				url: `/api/topics/${topic}?skip=${
					(currentPage - 1) * pageSize
				}&limit=${pageSize}&sort=${selectedSort}&search=${searchTerm}&filter=${activeFilter}&admin=true`,
				method: 'GET',
				onSuccess: (res) => {
					setPagedArticles(res.topicDetails);
					setTotalArticles(res.topicDetails.totalArticles);
				},
				onError: (error) => {
					setError(error);
				},
				onFinally: () => {
					setFetching(false);
				},
			});
		};

		const refetchHandler = () => fetchPage();
		window.addEventListener('refetchArticles', refetchHandler);
		fetchPage();
		return () => window.removeEventListener('refetchArticles', refetchHandler);
	}, [currentPage, selectedSort, searchTerm, activeFilter, topic]);

	useEffect(() => {
		setCurrentPage(1);
	}, [searchTerm]);

	return (
		<main className="px-4 py-6 bg-dark-navy min-h-screen flex flex-col gap-8 ">
			<div className="flex items-start justify-between w-full">
				<div className="flex flex-col gap-3">
					<h1 className="max-xs:text-2xl capitalize  text-3xl font-semibold text-fade-blue">
						All Articles in {pagedArticles?.title}
					</h1>
					<p className="text-base max-w-[600px] text-silver">
						Manage all your articles in one place—edit, publish, or delete with
						ease to keep your content fresh and organized.
					</p>
				</div>
				<NewArticle />
			</div>

			<div className="min-h-screen w-full py-8 gap-16 flex flex-col  max-w-[1500px] max-2xl:py-6 max-2xl:gap-10 ">
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
					admin={true}
				/>
			</div>
		</main>
	);
};

export default Articles;

