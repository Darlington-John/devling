'use client';
import ArticlesContainer from './components/articles-container/articles-container';

import { IArticle } from '~/types/article';
import { useTopicsContext } from './context/topics-context';
import RelatedTopicsSection from './components/related-topics';
import { useEffect, useState } from 'react';
import { apiRequest } from '~/utils/api-request';
import FeaturedArticlesPreview from './components/featured-articles-preview';
import Script from 'next/script';

export default function Home() {
	const { topics } = useTopicsContext();

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
				}&limit=${pageSize}&sort=${selectedSort}&search=${searchTerm}&filter=${activeFilter}`,
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

		fetchPage();
	}, [currentPage, selectedSort, searchTerm, activeFilter]);

	useEffect(() => {
		setCurrentPage(1);
	}, [searchTerm]);

	return (
		<>
			<Script
				id="structured-data-blog"
				type="application/ld+json"
				strategy="afterInteractive"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify({
						'@context': 'https://schema.org',
						'@type': 'Blog',
						mainEntityOfPage: {
							'@type': 'WebPage',
							'@id': 'https://devling.vercel.app/',
						},
						headline: 'Devling Blog',
						description:
							'Devling Blog shares tips, updates, and insights on hosting, site management, and digital tools to help you build smarter, faster, and safer online.',
						publisher: {
							'@type': 'Organization',
							name: 'WefitHost',
							logo: {
								'@type': 'ImageObject',
								url: 'https://res.cloudinary.com/dl6pa30kz/image/upload/v1756039608/logo_hdvqjb_1_1_u8ljxj.png',
							},
						},
						blogPost: [
							{
								'@type': 'BlogPosting',
								headline:
									'Tips for Building Rich SEO: A Complete Guide to Ranking Higher',
								url: 'https://devling.vercel.app/topics/tips/tips-for-building-rich-seo-a-complete-guide-to-ranking-higher',
								image:
									'https://res.cloudinary.com/dl6pa30kz/image/upload/v1756679177/wefithost_articles/ppiffswph6wdzxcwy3vj.png',
							},
							{
								'@type': 'BlogPosting',
								headline: 'Shared Hosting vs. VPS: Which Is More Secure?',
								url: 'https://devling.vercel.app/topics/security/shared-hosting-vs-vps-which-is-more-secure',
								image:
									'https://res.cloudinary.com/dl6pa30kz/image/upload/v1756301403/wefithost_articles/wtk4aecukpc8vtfvfprg.jpg',
							},

							{
								'@type': 'BlogPosting',
								headline: 'Dedicated Hosting Explained: Is It Worth the Cost?',
								url: 'https://devling.vercel.app/topics/hosting/dedicated-hosting-explained-is-it-worth-the-cost',
								image:
									'https://res.cloudinary.com/dl6pa30kz/image/upload/v1756679001/wefithost_articles/q0bpniyi6fnystzjvgvn.png',
							},

							{
								'@type': 'BlogPosting',
								headline:
									'Low Prices ≠ Great Value: Why Investing in Real Hosting Value Matters',
								url: 'https://devling.vercel.app/topics/news/low-prices-great-value-why-investing-in-real-hosting-value-matters',
								image:
									'https://res.cloudinary.com/dl6pa30kz/image/upload/v1757333151/wefithost_articles/low-prices-great-value-why-investing-in-real-hosting-value-matters.jpg',
							},
						],
					}),
				}}
			/>
			<main className="mx-auto  w-full">
				<div className="min-h-screen w-full py-8 gap-16 flex flex-col  max-w-[1500px] max-2xl:py-6 max-2xl:gap-10 mx-auto   max-2xl:px-10 max-xs:px-5 max-4xl:px-10">
					<FeaturedArticlesPreview />
					<section className="flex flex-col gap-4 max-w-[1500px]  w-full">
						<h1 className="text-4xl poppins-bold max-2xl:text-3xl max-xs:text-2xl text-fade-blue ">
							Devling Blog – Hosting Tips and Web Insights
						</h1>
						<h2 className="text-lg max-2xl:text-base max-w-[800px] max-2xs:text-sm text-silver">
							Devling Blog brings you the latest tips, updates, and insights on
							web hosting, website management, and digital tools — helping
							individuals and businesses build faster, smarter, and more secure
							online experiences
						</h2>
					</section>

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
					/>
					{/* CTA Section */}

					{topics && topics?.length > 0 && (
						<>
							<RelatedTopicsSection
								header="Explore Topics"
								related_topics={topics}
							/>
						</>
					)}
				</div>
			</main>
		</>
	);
}

