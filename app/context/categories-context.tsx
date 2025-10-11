'use client';
import React, { createContext, useContext, useMemo } from 'react';
import { ICategory } from '~/types/category';
import { useFetch } from '~/utils/fetch-page-data';

interface CategoriesContextType {
	categories: ICategory[] | null;
	isFetching: boolean;
	error: string;
	refetch: () => Promise<void>;
}
export const CategoriesContext = createContext<CategoriesContextType | null>(
	null,
);

export const CategoriesProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const {
		fetchedData: categories,
		isFetching,
		error,
		refetch,
	} = useFetch<ICategory[]>({
		basePath: `/api/categories`,
		ids: [],
		eventKey: 'articlesUpdated',
		// enabled: !!user && !loading,
		//  deps:[loading,user]
	});

	const providerValue = useMemo(
		() => ({
			categories,
			isFetching,
			error,
			refetch,
		}),
		[categories, isFetching, error, refetch],
	);

	return (
		<CategoriesContext.Provider value={providerValue}>
			{children}
		</CategoriesContext.Provider>
	);
};

export const useCategoriesContext = (): CategoriesContextType => {
	const context = useContext(CategoriesContext);
	if (!context) {
		throw new Error('Context must be used within a Provider');
	}
	return context;
};

