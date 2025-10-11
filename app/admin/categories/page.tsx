'use client';
import NewCategory from '../components/new-category';
import { ICategory } from '~/types/category';
import CategoryCard from '~/app/components/cards/category-card/category-card';

import { useAuthContext } from '~/app/context/auth-context';
import Loader from '~/app/components/loader';
import EmptyState from '~/app/components/empty-state';
import { useFetch } from '~/utils/fetch-page-data';

const Categories = () => {
	const { loading, user } = useAuthContext();

	const {
		fetchedData: categories,
		isFetching,
		error,
		refetch,
	} = useFetch<ICategory[]>({
		basePath: `/api/categories`,
		ids: [],
		eventKey: 'categoriesUpdated',
		enabled: !!user && !loading,
		//  deps:[loading,user]
	});

	return (
		<main className="px-4 py-6 bg-dark-navy min-h-screen flex flex-col gap-16 w-full">
			<div className="flex items-center justify-between w-full flex-wrap gap-3">
				<div className="flex flex-col gap-3">
					<h1 className="text-3xl font-semibold text-fade-blue">
						All Categories
					</h1>
					<p className="text-base max-w-[600px] text-silver">
						Manage all your categories in one place—edit, publish, or delete
						with ease to keep your content fresh and organized.
					</p>
				</div>
				<NewCategory />
			</div>
			<Loader fetching={isFetching} error={error} try_again={refetch}>
				{categories && categories.length > 0 ? (
					<div className="grid grid-cols-4  gap-4 max-xl:grid-cols-2 max-lg:grid-cols-2 max-md:grid-cols-1">
						{categories &&
							categories.map((category) => (
								<CategoryCard
									category={category}
									key={category?.title}
									admin={true}
								/>
							))}
					</div>
				) : (
					<EmptyState message="No Category has been created yet" />
				)}
			</Loader>
		</main>
	);
};

export default Categories;

