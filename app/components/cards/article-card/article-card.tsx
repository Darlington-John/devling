import Link from 'next/link';
import { FaCircle, FaPen } from 'react-icons/fa';
import { formatDate } from '~/utils/format-date';
import { slugify } from '~/utils/slugify';
import { IArticle } from '~/types/article';
import { FaEllipsisVertical } from 'react-icons/fa6';
import { usePopup } from '~/utils/toggle-popups';
import { useState } from 'react';
import { RiDeleteBin5Line } from 'react-icons/ri';
import DeleteArticlePrompt from './delete-article-prompt';
import * as motion from 'motion/react-client';

import EditArticlePrompt from './edit-article-prompt';
import { useAuthContext } from '~/app/context/auth-context';

interface articleProps {
	article: IArticle;
	admin?: boolean;
}
const ArticleCard = ({ article, admin = false }: articleProps) => {
	const {
		isActive: adminPrompt,
		isVisible: adminPromptVisible,
		ref: adminPromptRef,
		togglePopup: toggleAdminPrompt,
	} = usePopup();
	const {
		isActive: editArticlePrompt,
		isVisible: editArticlePromptVisible,
		ref: editArticlePromptRef,
		setDisableToggle: disableEditArticlePrompt,
		togglePopup: toggleEditArticlePrompt,
	} = usePopup();
	const {
		isActive: deleteArticlePrompt,
		isVisible: deleteArticlePromptVisible,
		ref: deleteArticlePromptRef,
		setDisableToggle: disableDeleteArticlePrompt,
		togglePopup: toggleDeleteArticlePrompt,
	} = usePopup();
	const [articleToEdit, setArticleToEdit] = useState<IArticle | null>(null);
	const { user } = useAuthContext();
	return (
		<>
			<motion.article
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{
					scale: { type: 'spring', visualDuration: 0.2, bounce: 0.2 },
				}}
			>
				<Link
					href={
						admin
							? `/admin/categories/${slugify(article?.category?.title)}/${
									slugify(article?.title) || ''
							  }`
							: `/categories/${slugify(article?.category?.title) || ''}/${
									slugify(article?.title) || ''
							  }`
					}
					className="flex flex-col  items-start overflow-hidden  rounded-xl p-3 hover:shadow-md duration-150 bg-dark-navy  max-xs:gap-2  max-2xs:h-auto relative justify-between gap-4 radial !ring ring-[#1d2126] hover:ring-grey"
				>
					{article?.title && (
						<>
							{admin && (
								<div className="absolute top-5 right-5 z-20">
									{(user?.role === 'super_admin' ||
										article?.author?._id === user?._id) && (
										<button
											className="flex items-center justify-center h-8 w-8 rounded-full hover:bg-[#ffffff43]"
											onClick={(e) => {
												e.preventDefault();
												e.stopPropagation();
												toggleAdminPrompt();
											}}
										>
											<FaEllipsisVertical className="text-xl text-white" />
										</button>
									)}

									{adminPrompt && (
										<div
											className={`flex  flex-col bg-navy radial shadow-lg  w-[150px] rounded-md   duration-150 absolute top-0 right-[100%] divide-y divide-grey overflow-hidden border border-grey z-20   ${
												adminPromptVisible ? 'opacity-100' : 'opacity-0 '
											}`}
											ref={adminPromptRef}
										>
											<button
												className="py-2 w-full text-[13px]  text-white flex items-center gap-2  px-3 hover:bg-deepBlue duration-150"
												onClick={(e) => {
													e.preventDefault();
													e.stopPropagation();
													toggleEditArticlePrompt();
													setArticleToEdit(article);
												}}
											>
												<FaPen className="text-sm" />
												<span>Edit article</span>
											</button>
											<button
												className="py-2 w-full text-[13px]  text-white flex items-center gap-2  px-3 hover:bg-deepBlue duration-150"
												onClick={(e) => {
													e.preventDefault();
													e.stopPropagation();
													toggleDeleteArticlePrompt();
												}}
											>
												<RiDeleteBin5Line className="text-sm text-red-300" />
												<span>Delete article</span>
											</button>
										</div>
									)}
								</div>
							)}

							{admin && (!article?.published || article?.featured) && (
								<div className="flex items-center flex-col gap-3  absolute top-6 left-[50%] translate-x-[-50%] z-10">
									{admin && !article?.published && (
										<button className="flex items-center justify-center   bg-[#080708] text-xs py-1 px-3 rounded-sm text-white">
											Unpublished
										</button>
									)}
									{admin && article?.featured && (
										<button className="flex items-center justify-center   bg-[#000000] text-xs py-1 px-3 rounded-sm text-white">
											Featured
										</button>
									)}
								</div>
							)}
							<div className="aspect-[465/301] w-full overflow-hidden rounded-xl blog-img relative   max-2xs:max-h-auto  bg-[#0019338f]">
								{/* eslint-disable-next-line */}
								<img
									src={article?.image}
									alt={article?.image || 'Article Image'}
									className="w-full h-full object-cover "
								/>
								{admin && (
									<div className="absolute top-0 left-0 h-full w-full bg-[#15133d7a]"></div>
								)}
							</div>
							<div className="flex items-center justify-between w-full gap-2">
								<div className="flex gap-4 items-center text-lg  max-dmd:text-base max-md:text-sm text-silver">
									<span>{formatDate(article?.createdAt)}</span>

									<FaCircle className="text-[10px] " />

									<span>{article?.duration || '2'} mins read</span>
								</div>
								<button className="bg-blue h-[30px] cursor-none duration-150 px-3 text-white text-sm rounded-sm font-semibold max-2xs:h-[30px] max-2xs:px-2  max-2xs:text-xs max-2xs:top-3 max-2xs:left-3 ">
									{article?.category.title}
								</button>
							</div>
							<h3 className="text-lg poppins-bold line-clamp-2 max-2xs:text-base article-header text-fade-blue">
								{article?.title}
							</h3>
							<p className="text-lg line-clamp-2 article-desc max-md:text-base max-xs:text-sm article-header text-silver">
								{article.description}
							</p>
							<div className="flex items-center justify-between w-full">
								<div className="flex items-center gap-2">
									{/* eslint-disable-next-line */}
									<img
										src={article?.author?.profile ?? '/icons/default-user.svg'}
										className="w-7 h-7 object-cover rounded-full max-sm:w-6 max-sm:h-6"
										alt={article?.author?.first_name ?? 'author'}
									/>
									<span className="text-base font-semibold text-silver max-sm:text-xs ">
										{article?.author?.first_name} {article?.author?.last_name}
									</span>
								</div>
								<button className="text-base text-fade-blue hover:text-darkBlue max-sm:text-sm ">
									Read more
								</button>
							</div>
						</>
					)}
				</Link>
			</motion.article>
			<EditArticlePrompt
				isVisible={editArticlePromptVisible}
				ref={editArticlePromptRef}
				isActive={editArticlePrompt}
				togglePopup={toggleEditArticlePrompt}
				setDisable={disableEditArticlePrompt}
				articleToEdit={articleToEdit as IArticle}
			/>
			<DeleteArticlePrompt
				isVisible={deleteArticlePromptVisible}
				ref={deleteArticlePromptRef}
				isActive={deleteArticlePrompt}
				togglePopup={toggleDeleteArticlePrompt}
				setDisable={disableDeleteArticlePrompt}
				articleId={article?._id}
			/>
		</>
	);
};

export default ArticleCard;

