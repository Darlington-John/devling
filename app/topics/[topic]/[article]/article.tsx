'use client';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { FaCircle, FaEnvelope } from 'react-icons/fa';
import { formatDate } from '~/utils/format-date';
import { slugify } from '~/utils/slugify';
import logo from '~/public/icons/logo-icon.png';
import ClassicInput from '../../../components/inputs/classic-input';
import { apiRequest } from '~/utils/api-request';
import { toast } from 'react-toastify';
import { useState } from 'react';
import AsyncButton from '../../../components/buttons/async-button';
import Link from 'next/link';
import ArticleViewer from '../../../components/rich-text-editor/viewer';
import RelatedArticlesSection from '../../../components/related-articles';
import { useFetch } from '~/utils/fetch-page-data';
import { IArticle } from '~/types/article';
import Loader from '~/app/components/loader';
import { getReadingTime } from '~/utils/get-reading-time';
import CommentsSection from '~/app/components/comments/comments-section';
import * as motion from 'motion/react-client';
import Script from 'next/script';
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

	const [email, setEmail] = useState('');

	const [subscribing, setSubscribing] = useState(false);
	const [error, setError] = useState('');
	const [subscribeSuccess, setSubscribeSuccess] = useState(false);
	const isValidEmail = (email: string): boolean => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	};

	const subscribe = async () => {
		if (subscribing) {
			return;
		}
		if (email.trim() === '') {
			setError('Email required');
			return;
		}
		if (!isValidEmail(email.trim().toLowerCase())) {
			setError('Please enter a valid email address');
			return;
		}
		setSubscribing(true);
		setError('');

		await apiRequest({
			url: '/api/subscribe',
			method: 'POST',
			body: { email },
			onSuccess: (res) => {
				toast.success(res.message);
				setSubscribeSuccess(true);
				setTimeout(() => setSubscribeSuccess(true), 3000);
			},
			onError: (error) => {
				setError(error);
			},
			onFinally: () => {
				setSubscribing(false);
			},
		});
	};
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
			<Script
				id="structured-data-article"
				type="application/ld+json"
				strategy="afterInteractive"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify({
						'@context': 'https://schema.org',
						'@type': 'BlogPosting',
						mainEntityOfPage: {
							'@type': 'WebPage',
							'@id': `https://blog.wefithost.com/${article_data?.slug}`,
						},
						headline: article_data?.title,
						description: article_data?.description,
						image: article_data?.image,
						author: {
							'@type': 'Person',
							name: `${article_data?.author.first_name} ${article_data?.author.last_name}`,
						},
						publisher: {
							'@type': 'Organization',
							name: 'WefitHost',
							logo: {
								'@type': 'ImageObject',
								url: 'https://res.cloudinary.com/dl6pa30kz/image/upload/v1756039608/logo_hdvqjb_1_1_u8ljxj.png',
							},
						},
						datePublished: article_data?.createdAt,
						dateModified: article_data?.updatedAt || article_data?.createdAt,
					}),
				}}
			/>
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
						<div className="flex w-full  bg-[#14132b] rounded-2xl overflow-hidden max-md:flex-col  max-md:rounded-sm max-md:bg-transparent items-center">
							<div className="relative w-1/2 max-md:w-full">
								{/* eslint-disable-next-line */}
								<img
									src={article_data?.image}
									alt={article_data?.title || 'article image'}
									className="w-full  bg-[#ffffff] object-cover    max-md:max-h-auto max-md:rounded-sm"
								/>
							</div>
							<div className="flex items-start flex-col justify-between p-20 w-1/2 max-2xl:p-5 max-md:w-full    max-md:bg-white max-md:p-0 max-md:py-2 gap-1">
								<button className="bg-purple hover:bg-darkPurple text-white text-lg max-dmd:text-sm h-[40px] px-2.5 duration-150 rounded-sm max-md:text-sm max-dmd:h-[30px] max-md:hidden">
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
				<section className="w-full gap-24 flex justify-end max-2xl:gap-12 max-xl:flex-col  max-xl:items-center">
					<div className="flex flex-col gap-10 max-w-[750px] w-full">
						<ArticleViewer content={article_data?.article} />
						{!isFetching && !error && article_data?.author && (
							<>
								<div className=" border-t-1 border-gray-400 w-full  flex flex-col gap-2 py-4">
									<h4 className=" text-base">About the author</h4>
									<div className=" items-center gap-2 flex">
										{/* eslint-disable-next-line */}
										<img
											src={
												article_data?.author?.profile ??
												'/icons/default-user.svg'
											}
											className="w-9 h-9 object-cover rounded-full border border-gray-400"
											alt={article_data?.author?.first_name ?? 'author'}
										/>
										<div className="flex items-start gap-0  flex-col">
											<span className="text-base font-semibold text-black max-md:text-sm">
												{article_data?.author?.first_name}{' '}
												{article_data?.author?.last_name}
											</span>
											<div className="flex gap-4 items-center text-sm  text-black max-md:text-black max-md:text-xs">
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
													<p key={i} className="max-md:text-sm">
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
					<aside className="flex flex-col justify-between max-xl:flex-row  gap-5 max-md:flex-col max-xl:hidden">
						<div className="w-[450px] bg-white border-purple rounded-2xl  shrink-0 flex flex-col gap-4 items-center justify-between sticky top-20 shadow-sm p-4 max-xl:w-1/2 max-xl:static max-md:w-full max-xs:gap-2">
							<Image
								src={logo}
								alt="wefithost logo"
								className="w-28 max-xs:w-18"
							/>
							<h3 className="text-lg poppins text-center">About our blog</h3>
							<p className="text-center text-base text-gray-500">
								Welcome to WeFitHost Insights, where we share expert knowledge
								and strategies to help you succeed in the hosting world.
							</p>
							<Link
								href="/"
								className="bg-purple hover:bg-darkPurple text-white  h-[40px] px-2.5 duration-150 rounded-sm w-full text-center flex items-center justify-center text-sm font-semibold"
							>
								Learn about us
							</Link>
						</div>

						<div className="w-[450px] bg-white border-purple rounded-2xl  shrink-0 flex flex-col gap-4 items-center justify-between sticky top-10 shadow-lg p-4 max-xl:w-1/2 max-xl:static max-md:w-full max-xl:shadow-sm max-xs:gap-2">
							<FaEnvelope className="text-4xl text-purple " />
							<h3 className="text-lg poppins text-center">
								Subscribe to our newsletter
							</h3>
							<p className="text-center">
								Get the latest hosting tips and business insights
							</p>
							<div className="flex gap-2 flex-col w-full items-start justify-start">
								<ClassicInput
									value={email}
									setValue={setEmail}
									error={error}
									setError={setError}
									classname_override="!bg-lightGrey !text-black !w-full !self-start"
									errorContent={'Please enter a valid email address'}
									placeholder="Your email"
								/>
								<AsyncButton
									action="Subscribe"
									classname_override="!w-full"
									loading={subscribing}
									success={subscribeSuccess}
									disabled={!email}
									onClick={subscribe}
								/>
							</div>
							<span className="text-xs ">
								We&apos;ll never share your email. Unsubscribe anytime.
							</span>
						</div>
					</aside>
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
				<aside className=" flex-col justify-between max-xl:flex-row  gap-5 max-md:flex-col max-xl:flex hidden">
					<div className="w-[450px] bg-white border-purple rounded-2xl  shrink-0 flex flex-col gap-4 items-center justify-between sticky top-20 shadow-sm p-4 max-xl:w-1/2 max-xl:static max-md:w-full max-xs:gap-2">
						<Image
							src={logo}
							alt="wefithost logo"
							className="w-28 max-xs:w-18"
						/>
						<h3 className="text-lg poppins text-center">About our blog</h3>
						<p className="text-center text-base text-gray-500">
							Welcome to WeFitHost Insights, where we share expert knowledge and
							strategies to help you succeed in the hosting world.
						</p>
						<Link
							href="/"
							className="bg-purple hover:bg-darkPurple text-white  h-[40px] px-2.5 duration-150 rounded-sm w-full text-center flex items-center justify-center text-sm font-semibold"
						>
							Learn about us
						</Link>
					</div>

					<div className="w-[450px] bg-white border-purple rounded-2xl  shrink-0 flex flex-col gap-4 items-center justify-between sticky top-10 shadow-lg p-4 max-xl:w-1/2 max-xl:static max-md:w-full max-xl:shadow-sm max-xs:gap-2">
						<FaEnvelope className="text-4xl text-purple " />
						<h3 className="text-lg poppins text-center">
							Subscribe to our newsletter
						</h3>
						<p className="text-center">
							Get the latest hosting tips and business insights
						</p>
						<div className="flex gap-2 flex-col w-full items-start justify-start">
							<ClassicInput
								value={email}
								setValue={setEmail}
								error={error}
								setError={setError}
								classname_override="!bg-lightGrey !text-black !w-full !self-start"
								errorContent={'Please enter a valid email address'}
								placeholder="Your email"
							/>
							<AsyncButton
								action="Subscribe"
								classname_override="!w-full"
								loading={subscribing}
								success={subscribeSuccess}
								disabled={!email}
								onClick={subscribe}
							/>
						</div>
						<span className="text-xs ">
							We&apos;ll never share your email. Unsubscribe anytime.
						</span>
					</div>
				</aside>
			</motion.main>
		</>
	);
};

export default Article;

