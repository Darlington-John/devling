'use client';
import { useParams } from 'next/navigation';
import { FaCircle } from 'react-icons/fa';
import { formatDate } from '~/utils/format-date';
import { slugify } from '~/utils/slugify';

import ArticleViewer from '../../../components/rich-text-editor/viewer';
import RelatedArticlesSection from '../../../components/related-articles';
import { useFetch } from '~/utils/fetch-page-data';
import { IArticle } from '~/types/article';
import Loader from '~/app/components/loader';
import { getReadingTime } from '~/utils/get-reading-time';
import CommentsSection from '~/app/components/comments/comments-section';
import * as motion from 'motion/react-client';
import AboutBlog from '~/app/components/about-blog';
const Article = () => {
	const params = useParams();

	const { article, topic } = params;
	const {
		fetchedData: article_data,
		isFetching,
		error: errorFetching,
	} = useFetch<IArticle>({
		basePath: `/api/topics/${topic}/${article}`,
		ids: [],
		dataKey: 'selectedArticle',
	});

	const {
		fetchedData: articles,
		isFetching: fetchingArticles,
		error: errorFetchingArticles,
	} = useFetch<IArticle[]>({
		basePath: `/api/fetch-articles`,
		ids: [],
	});
	const related_articles = articles?.filter(
		(type) => slugify(type?.title) !== article,
	);

	return (
		<>
			<motion.main
				className=" flex flex-col mx-auto max-w-[1500px] min-h-screen w-full gap-10 py-12 px-8 max-md:py-6 max-md:gap-5 max-xs:px-5"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{
					scale: { type: 'spring', visualDuration: 0.2, bounce: 0.2 },
				}}
			>
				<Loader fetching={isFetching} error={errorFetching}>
					<section className="flex w-full flex-col gap-3 items-start">
						<div className="flex w-full  bg-navy rounded-2xl overflow-hidden max-md:flex-col  max-md:rounded-sm max-md:bg-transparent items-center">
							<div className="relative w-1/2 max-md:w-full">
								{/* eslint-disable-next-line */}
								<img
									src={article_data?.image}
									alt={article_data?.title || 'article image'}
									className="w-full  bg-[#ffffff] object-cover    max-md:max-h-auto max-md:rounded-sm"
								/>
							</div>
							<div className="flex items-start flex-col justify-between p-20 w-1/2 max-2xl:p-5 max-md:w-full    max-md:bg-white max-md:p-0 max-md:py-2 gap-1">
								<button className="bg-blue hover:bg-darkBlue text-white text-lg max-dmd:text-sm h-[40px] px-2.5 duration-150 rounded-sm max-md:text-sm max-dmd:h-[30px] max-md:hidden">
									{article_data?.topic.title}
								</button>
								<h1 className="text-[32px] poppins-bold  text-white max-dmd:text-xl max-md:text-black max-md:text-lg ">
									{article_data?.title}
								</h1>
								<h2 className="text-lg  text-white  max-md:text-black max-dmd:text-sm">
									{article_data?.description}
								</h2>
								<div className=" items-center gap-2 hidden md:flex">
									{/* eslint-disable-next-line */}
									<img
										src={
											article_data?.author?.profile ?? '/icons/default-user.svg'
										}
										className="w-9 h-9 object-cover rounded-full border border-gray-700"
										alt={article_data?.author?.first_name || 'author'}
									/>
									<div className="flex items-start gap-0  flex-col">
										<span className="text-base font-semibold text-white max-dmd:text-sm">
											{article_data?.author?.first_name}{' '}
											{article_data?.author?.last_name}
										</span>
										<div className="flex gap-4 items-center text-sm  text-white max-md:text-black max-dmd:text-xs">
											<span>
												{formatDate(article_data?.createdAt as string)}
											</span>

											{article_data && (
												<>
													<FaCircle className="text-[10px] " />
													<span>
														{(article_data?.article &&
															getReadingTime(article_data?.article)) ||
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
				</Loader>
				<section className="w-full gap-24 items-start flex justify-end max-2xl:gap-12 max-xl:flex-col  max-xl:items-center">
					<div className="flex flex-col gap-10 max-w-[750px] w-full">
						<ArticleViewer content={article_data?.article} />
						{!isFetching && !errorFetching && article_data?.author && (
							<>
								<div className=" border-t-1 border-fade-blue  border-dotted w-full  flex flex-col gap-2 py-4">
									<h4 className=" text-base text-fade-blue">About the author</h4>
									<div className=" items-center gap-2 flex">
										{/* eslint-disable-next-line */}
										<img
											src={
												article_data?.author?.profile ??
												'/icons/default-user.svg'
											}
											className="w-9 h-9 object-cover rounded-full border border-blue"
											alt={article_data?.author?.first_name ?? 'author'}
										/>
										<div className="flex items-start gap-0  flex-col">
											<span className="text-base font-semibold text-white max-md:text-sm">
												{article_data?.author?.first_name}{' '}
												{article_data?.author?.last_name}
											</span>
											<div className="flex gap-4 items-center text-sm  text-silver max-md:text-black max-md:text-xs">
												<span>
													{formatDate(article_data?.createdAt as string)}
												</span>
											</div>
										</div>
									</div>
									{article_data?.author?.bio && (
										<div className="flex flex-col gap-2">
											{article_data?.author?.bio
												.split('\n\n')
												.map((para, i) => (
													<p key={i} className="max-md:text-sm text-silver">
														{para}
													</p>
												))}
										</div>
									)}
								</div>
								<CommentsSection />
							</>
						)}
					</div>

					<AboutBlog className_override="flex max-xl:hidden" />
				</section>
				<Loader fetching={fetchingArticles} error={errorFetchingArticles}>
					{related_articles && related_articles?.length > 0 && (
						<>
							<RelatedArticlesSection
								header="You may also like"
								related_articles={related_articles}
							/>
						</>
					)}
				</Loader>
				<AboutBlog className_override="hidden max-xl:flex" />
			</motion.main>
		</>
	);
};

export default Article;

