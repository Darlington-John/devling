'use client';
import FilterBar from '../filter-bar';
import React from 'react';
import EmptyState from '../empty-state';
import { IArticle } from '~/types/article';
import { useCategoriesContext } from '../../context/categories-context';
import { ArticleGrid } from './articles-grid';
import Loader from '../loader';

interface containerProps {
	showFilters?: boolean;

	admin?: boolean;
	pagedArticles: IArticle[];
	totalArticles: number;
	currentPage: number;
	setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
	pageSize: number;
	selectedSort?: string;
	setSelectedSort?: React.Dispatch<React.SetStateAction<string>>;
	searchTerm?: string;
	setSearchTerm?: React.Dispatch<React.SetStateAction<string>>;
	activeFilter?: string;
	setActiveFilter?: React.Dispatch<React.SetStateAction<string>>;
	fetching: boolean;
	error: string;
}

const ArticlesContainer = ({
	showFilters = true,
	pagedArticles,
	totalArticles,
	admin = false,
	currentPage,
	setCurrentPage,
	pageSize = 9,
	selectedSort,
	setSelectedSort,
	searchTerm,
	setSearchTerm,
	activeFilter,
	setActiveFilter,
	fetching,
	error,
}: containerProps) => {
	const { categories } = useCategoriesContext();

	const hasArticles = pagedArticles && pagedArticles.length > 0;
	const hasSearch = searchTerm && searchTerm.trim().length > 0;
	const isFiltered = activeFilter !== 'all';

	return (
		<section
			className="flex w-full flex-col gap-8 max-2xl:gap-4 bg-dark-navy"
			id="articles-section"
			style={{ scrollMarginTop: '200px' }}
		>
			{/* Filters */}
			{(hasSearch || isFiltered || hasArticles) && (
				<div className="w-full">
					<FilterBar
						activeFilter={activeFilter}
						setActiveFilter={setActiveFilter}
						searchTerm={searchTerm}
						setSearchTerm={setSearchTerm}
						selectedSort={selectedSort as string}
						setSelectedSort={setSelectedSort}
						categories={categories}
						showFilters={showFilters}
					/>
				</div>
			)}

			{/* Search results */}
			<Loader fetching={fetching} error={error}>
				{hasSearch ? (
					hasArticles ? (
						<div className="flex w-full items-center flex-col gap-4">
							<span className="text-lg font-semibold spaced self-start">
								Found {totalArticles}{' '}
								{totalArticles === 1 ? 'article' : 'articles'} for “{searchTerm}
								”
							</span>
							<ArticleGrid
								articles={pagedArticles}
								totalArticles={totalArticles}
								currentPage={currentPage}
								pageSize={pageSize}
								onPageChange={setCurrentPage}
								admin={admin}
							/>
						</div>
					) : (
						<EmptyState message={`No articles found for “${searchTerm}”`} />
					)
				) : isFiltered ? (
					// Category filter (handled on backend now)
					hasArticles ? (
						<ArticleGrid
							articles={pagedArticles}
							totalArticles={totalArticles}
							currentPage={currentPage}
							pageSize={pageSize}
							onPageChange={setCurrentPage}
							admin={admin}
						/>
					) : (
						<EmptyState message="No articles match your filters" />
					)
				) : hasArticles ? (
					// Default (all articles)
					<ArticleGrid
						articles={pagedArticles}
						totalArticles={totalArticles}
						currentPage={currentPage}
						pageSize={pageSize}
						onPageChange={setCurrentPage}
						admin={admin}
					/>
				) : (
					// Nothing at all
					<EmptyState message="No articles available" />
				)}
			</Loader>
		</section>
	);
};
export default ArticlesContainer;

