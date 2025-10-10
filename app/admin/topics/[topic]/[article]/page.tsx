'use client';

import { FaCircle } from 'react-icons/fa';
import { formatDate } from '~/utils/format-date';
import { useParams } from 'next/navigation';
import { useAuthContext } from '~/app/context/auth-context';
import { useCallback, useEffect, useState } from 'react';
import { IArticle } from '~/types/article';
import { apiRequest } from '~/utils/api-request';
import Loader from '~/app/components/loader';
import type { JSONContent } from '@tiptap/react';
import { getReadingTime } from '~/utils/get-reading-time';
import EditSection from './components/edit-section';
const Article = () => {
	const { topic, article: article_param } = useParams();
	const { loading, user } = useAuthContext();
	const [article, setArticle] = useState<IArticle | null>(null);
	const [articleContent, setArticleContent] = useState<JSONContent | undefined>(
		article?.article,
	);
	const [fetching, setFetching] = useState(true);
	const [errorFetching, setErrorFetching] = useState('');

	const fetchArticle = useCallback(async () => {
		setErrorFetching('');
		if (loading) return;

		if (!user) {
			setErrorFetching('User not authenticated');
			return;
		}

		await apiRequest({
			url: `/api/topics/${topic}/${article_param}`,
			method: 'GET',
			onSuccess: (res) => {
				setArticle(res.selectedArticle);
				setArticleContent(res.selectedArticle.article);
			},
			onError: (error) => {
				setErrorFetching(error);
			},
			onFinally: () => {
				setFetching(false);
			},
		});
	}, [loading, user, topic, article_param]);

	useEffect(() => {
		fetchArticle();

		const handleTopicsFetched = () => {
			fetchArticle();
		};

		window.addEventListener('articleUpdated', handleTopicsFetched);

		return () => {
			window.removeEventListener('articleUpdated', handleTopicsFetched);
		};
	}, [fetchArticle]);

	return (
		<main className=" flex flex-col mx-auto max-w-[1500px] min-h-screen w-full gap-10 py-12 px-8 max-md:py-6 max-md:gap-5 max-xs:px-5">
			<Loader fetching={fetching} error={errorFetching}>
				<section className="flex w-full flex-col gap-3 items-start">
					<div className="flex w-full  bg-navy rounded-2xl overflow-hidden max-md:flex-col  max-md:rounded-sm max-md:bg-transparent items-center">
						<div className="relative w-1/2 max-md:w-full">
							{/* eslint-disable-next-line */}
							<img
								src={article?.image}
								alt={article?.title || 'article image'}
								className="w-full  bg-deepBlue object-cover    max-md:max-h-auto max-md:rounded-sm"
							/>
						</div>
						<div className="flex items-start flex-col justify-between p-20 w-1/2 max-2xl:p-5 max-md:w-full    max-md:bg-navy max-md:p-2 max-md:py-2 gap-1">
							<button className="bg-blue hover:bg-darkBlue text-white text-lg max-dmd:text-sm h-[40px] px-2.5 duration-150 rounded-sm max-md:text-sm max-dmd:h-[30px] max-md:hidden">
								{article?.topic.title}
							</button>
							<h1 className="text-[32px] poppins-bold  text-white max-dmd:text-xl  max-md:text-lg ">
								{article?.title}
							</h1>
							<p className="text-lg  text-white  max-md:text-silver max-dmd:text-sm">
								{article?.description}
							</p>
							<div className=" items-center gap-2 hidden md:flex">
								{/* eslint-disable-next-line */}
								<img
									src={article?.author?.profile ?? '/icons/default-user.svg'}
									className="w-9 h-9 object-cover rounded-full border border-gray-700"
									alt={article?.author?.first_name || 'author'}
								/>
								<div className="flex items-start gap-0  flex-col">
									<span className="text-base font-semibold text-white max-dmd:text-sm">
										{article?.author?.first_name} {article?.author?.last_name}
									</span>
									<div className="flex gap-4 items-center text-sm  text-white max-md:text-black max-dmd:text-xs">
										<span>{formatDate(article?.createdAt as string)}</span>

										{article && (
											<>
												<FaCircle className="text-[10px] " />
												<span>
													{(article?.article &&
														getReadingTime(article?.article)) ||
														'2'}{' '}
													mins read
												</span>
											</>
										)}
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>
				<EditSection
					articleContent={articleContent}
					article={article}
					setArticleContent={setArticleContent}
				/>
			</Loader>
		</main>
	);
};

export default Article;

