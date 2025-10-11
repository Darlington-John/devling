'use client';
import Image from 'next/image';
import wave from '~/public/images/waving-hand-medium-light-skin-tone-svgrepo-com.svg';
import { useAuthContext } from '../context/auth-context';
import { useEffect, useState } from 'react';
import { apiRequest } from '~/utils/api-request';
import { IArticle } from '~/types/article';
import ArticlesContainer from '../components/articles-container/articles-container';

import Stats from './components/stats';
import Categories from './categories/page';
import NewArticle from './components/new-article';

const Admin = () => {
	const { user } = useAuthContext();

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
				}&limit=${pageSize}&sort=${selectedSort}&search=${searchTerm}&filter=${activeFilter}&admin=true`,
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

		const refetchHandler = () => fetchPage();
		window.addEventListener('refetchAdminArticles', refetchHandler);
		fetchPage();
		return () =>
			window.removeEventListener('refetchAdminArticles', refetchHandler);
	}, [currentPage, selectedSort, searchTerm, activeFilter]);

	useEffect(() => {
		setCurrentPage(1);
	}, [searchTerm]);

	return (
		<div className=" w-full  bg-dark-navy">
			<div className="flex flex-col gap-12 max-xs:gap-8  items-start w-full px-4 ">
				<div>
					<h1 className="  text-fade-blue  text-xl flex items-center gap-2 max-sm:text-xl pt-2">
						<Image src={wave} alt="" className="w-5" />
						<span>Welcome back, {user?.first_name}</span>
					</h1>
					{/* <h1 className="   text-sm text-grey ">
                  These are the latest updates for the last 7 days.
               </h1> */}
				</div>
				<Stats />
				<div className="w-full flex flex-col gap-4 ">
					<div className="flex items-start justify-between w-full flex-wrap gap-3">
						<div className="flex flex-col gap-3">
							<h1 className="max-xs:text-2xl capitalize  text-3xl font-semibold text-fade-blue">
								All Articles
							</h1>
							<p className="text-base max-w-[600px] text-silver">
								Manage all your articles in one place—edit, publish, or delete
								with ease to keep your content fresh and organized.
							</p>
						</div>
						<NewArticle />
					</div>
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
						admin={true}
					/>
				</div>
				<Categories />
			</div>
		</div>
	);
};

export default Admin;

