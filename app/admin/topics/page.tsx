'use client';
import NewTopic from '../components/new-topic';
import { ITopic } from '~/types/topic';
import TopicCard from '~/app/components/cards/topic-card/topic-card';

import { useAuthContext } from '~/app/context/auth-context';
import Loader from '~/app/components/loader';
import EmptyState from '~/app/components/empty-state';
import { useFetch } from '~/utils/fetch-page-data';

const Topics = () => {
	const { loading, user } = useAuthContext();

	const {
		fetchedData: topics,
		isFetching,
		error,
		refetch,
	} = useFetch<ITopic[]>({
		basePath: `/api/topics`,
		ids: [],
		eventKey: 'topicsUpdated',
		enabled: !!user && !loading,
		//  deps:[loading,user]
	});

	return (
		<main className="px-4 py-6 bg-dark-navy min-h-screen flex flex-col gap-16 w-full">
			<div className="flex items-center justify-between w-full flex-wrap gap-3">
				<div className="flex flex-col gap-3">
					<h1 className="text-3xl font-semibold text-fade-blue">All Topics</h1>
					<p className="text-base max-w-[600px] text-silver">
						Manage all your topics in one place—edit, publish, or delete with
						ease to keep your content fresh and organized.
					</p>
				</div>
				<NewTopic />
			</div>
			<Loader fetching={isFetching} error={error} try_again={refetch}>
				{topics && topics.length > 0 ? (
					<div className="grid grid-cols-4  gap-4 max-xl:grid-cols-2 max-lg:grid-cols-2 max-md:grid-cols-1">
						{topics &&
							topics.map((topic) => (
								<TopicCard topic={topic} key={topic?.title} admin={true} />
							))}
					</div>
				) : (
					<EmptyState message="No Topic has been created yet" />
				)}
			</Loader>
		</main>
	);
};

export default Topics;

