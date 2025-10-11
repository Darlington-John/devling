'use client';

import { SetStateAction } from 'react';
import { ICategory } from '~/types/category';
interface filterProps {
	activeFilter?: string;
	setActiveFilter?: React.Dispatch<SetStateAction<string>>;
	searchTerm?: string;
	setSearchTerm?: React.Dispatch<SetStateAction<string>>;
	selectedSort?: string;
	setSelectedSort?: React.Dispatch<SetStateAction<string>>;
	categories: ICategory[] | null;
	showFilters: boolean;
}
const FilterBar = ({
	activeFilter,
	setActiveFilter,
	searchTerm,
	setSearchTerm,
	selectedSort,
	setSelectedSort,
	categories,
	showFilters,
}: filterProps) => {
	const handleSearchChange = (
		event: React.ChangeEvent<HTMLInputElement>,
	): void => {
		const query = event.target.value;
		setSearchTerm?.(query);
	};

	const sorts = ['newest', 'oldest'];
	return (
		<section
			aria-labelledby="filters-controls"
			className={`flex items-center  gap-2 flex-wrap  max-lg:flex-col-reverse max-lg:gap-3 ${
				showFilters ? ' justify-between' : ' justify-end'
			}`}
		>
			{showFilters && (
				<div className="flex items-center gap-3 max-2xl:gap-1  max-lg:justify-self-start max-lg:self-start">
					<>
						<button
							onClick={() => setActiveFilter?.('all')}
							className={`capitalize text-lg h-[33px] px-3 rounded-sm duration-150 max-2xl:text-sm max-xs:px-2 max-xs:h-[25px] max-xs:text-xs text-silver ${
								'all' === activeFilter ? 'bg-blue text-white ' : 'hover:bg-grey'
							}`}
						>
							all
						</button>
						{categories &&
							categories.map((data) => (
								<button
									key={data._id}
									onClick={() => setActiveFilter?.(data._id)}
									className={`capitalize text-lg h-[33px] px-3 rounded-sm duration-150 max-2xl:text-sm max-xs:px-2 max-xs:h-[25px] max-xs:text-xs text-silver ${
										data._id === activeFilter
											? 'bg-blue text-white '
											: 'hover:bg-grey'
									}`}
									role="group"
									aria-label="Filter articles by category"
								>
									{data?.title}
								</button>
							))}
					</>
				</div>
			)}
			<div className="flex  gap-4 max-2xl:gap-2 max-lg:justify-self-end max-lg:self-end  max-lg:w-full max-lg:justify-between">
				<input
					className={`  py-1 px-3 bg-[#1C3A4C]  text-white   text-sm    focus:ring-[1px]    ring-blue    outline-none w-[350px]  duration-150 rounded-sm max-2xl:w-[250px] max-lg:w-[70%] max-xs:text-xs placeholder-silver
pr-8
            `}
					placeholder="Search for an article"
					aria-label="Search articles"
					value={searchTerm}
					name="search"
					onChange={(e) => {
						handleSearchChange(e);
					}}
					// onKeyDown={handleKeyDown}
				/>
				<div className="flex gap-1 bg-grey rounded-sm p-1 max-2xl:text-sm">
					{sorts.map((sort) => (
						<button
							key={sort}
							className={`flex items-center gap-2  h-[40px] px-2 rounded-sm  text-center text-sm duration-150 max-xs:text-xs max-xs:h-[30px] ${
								selectedSort === sort
									? 'bg-blue text-white shadow-sm '
									: 'hover:text-blue text-fade-blue'
							}`}
							role="group"
							aria-label="Sort articles"
							onClick={() => setSelectedSort?.(sort)}
						>
							{sort}
						</button>
					))}
				</div>
			</div>
		</section>
	);
};

export default FilterBar;

