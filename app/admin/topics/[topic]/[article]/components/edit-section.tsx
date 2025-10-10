'use client';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { FaAngleRight, FaPen } from 'react-icons/fa';
import { toast } from 'react-toastify';
import AsyncButton from '~/app/components/buttons/async-button';
import { useAuthContext } from '~/app/context/auth-context';
import ArticleViewer from '~/app/components/rich-text-editor/viewer';
import { apiRequest } from '~/utils/api-request';
import { usePopup } from '~/utils/toggle-popups';
import EditArticleContentPrompt from './edit-article-content-prompt';
import EditArticlePreviewPrompt from './edit-article-preview';
import { IArticle } from '~/types/article';
import type { JSONContent } from '@tiptap/react';
import CommentsSection from '~/app/components/comments/comments-section';
interface sectionProps {
	articleContent: JSONContent | undefined;
	article: IArticle | null;
	setArticleContent: React.Dispatch<
		React.SetStateAction<JSONContent | undefined>
	>;
}
const EditSection = ({
	articleContent,
	article,
	setArticleContent,
}: sectionProps) => {
	const { topic, article: article_param } = useParams();
	const { user } = useAuthContext();

	const {
		isActive: editArticleContentPrompt,
		isVisible: editArticleContentPromptVisible,
		ref: editArticleContentPromptRef,
		setDisableToggle: disableEditArticleContentPrompt,
		togglePopup: toggleEditArticleContentPrompt,
	} = usePopup();
	const {
		isActive: editArticlePreviewPrompt,
		isVisible: editArticlePreviewPromptVisible,
		ref: editArticlePreviewPromptRef,
		setDisableToggle: disableEditArticlePreviewPrompt,
		togglePopup: toggleEditArticlePreviewPrompt,
	} = usePopup();

	const [updating, setUpdating] = useState(false);
	const [errorUpdating, setErrorUpdating] = useState('');
	const [updated, setUpdated] = useState(false);

	const updatePublishedState = async () => {
		if (updating) {
			return;
		}

		setUpdating(true);
		setErrorUpdating('');

		await apiRequest({
			url: `/api/topics/${topic}/${article_param}/publish`,
			method: 'PATCH',
			body: { adminId: user?._id },
			onSuccess: (response) => {
				setUpdated(true);
				window.dispatchEvent(new CustomEvent('articleUpdated'));
				toast.success(response.message);
				setTimeout(() => setUpdated(false), 3000);
			},
			onError: (error) => {
				setErrorUpdating(error);
			},
			onFinally: () => {
				setUpdating(false);
			},
		});
	};

	const [featuring, setFeaturing] = useState(false);
	const [errorFeaturing, setErrorFeaturing] = useState('');
	const [featured, setFeatured] = useState(false);

	const updateFeaturedState = async () => {
		if (featuring) {
			return;
		}

		setFeaturing(true);
		setErrorFeaturing('');

		await apiRequest({
			url: `/api/topics/${topic}/${article_param}/feature`,
			method: 'PATCH',
			body: { adminId: user?._id },
			onSuccess: (response) => {
				setFeaturing(true);
				window.dispatchEvent(new CustomEvent('articleUpdated'));
				toast.success(response.message);
				setTimeout(() => setFeatured(false), 3000);
			},
			onError: (error) => {
				setErrorFeaturing(error);
			},
			onFinally: () => {
				setFeaturing(false);
			},
		});
	};

	return (
		<section className="w-full gap-24 flex justify-end max-2xl:gap-12 max-xl:flex-col  max-xl:items-center">
			<div className="flex flex-col gap-10 max-w-[750px] w-full">
				<ArticleViewer content={articleContent} />
				<CommentsSection />
			</div>

			<div className="flex flex-col justify-between max-xl:flex-row  gap-5 max-md:flex-col">
				<div
					className={`w-[450px] bg-navy radial  border-grey border rounded-2xl  shrink-0 flex flex-col gap-4 items-center sticky top-10 shadow-lg p-4 max-xl:w-1/2 max-xl:static max-md:w-full max-xl:shadow-sm ${
						user?.role === 'super_admin' || article?.author?._id === user?._id
							? ''
							: 'invisible'
					}`}
				>
					<div className="flex flex-col gap-3 ">
						<h1 className="text-2xl poppins-bold flex gap-1 text-fade-blue">
							<FaPen /> Edit Article
						</h1>
						<p className="text-sm text-white">
							To edit the article, select the specific part you want to change
							from the options below, then click Publish to apply your changes.
						</p>
						<span className=" text-white text-xs ">
							Note: For an article to be published, certain fields are required
							— title, description, cover image, duration (generated
							automatically), and actual content.
						</span>
					</div>
					<div className="flex gap-2 flex-col w-full font-normal">
						<button
							className="flex items-center justify-between w-full hover:bg-deepBlue border-2 border-grey p-2  rounded-md  h-[50px] radial text-sm text-white"
							onClick={() => {
								toggleEditArticleContentPrompt();
							}}
						>
							<h1>Edit Content</h1>

							<FaAngleRight />
						</button>
						<button
							className="flex items-center justify-between w-full hover:bg-deepBlue border-2 border-grey p-2  rounded-sm  h-[50px] text-sm radial text-white"
							onClick={() => {
								toggleEditArticlePreviewPrompt();
							}}
						>
							<h1>Edit article preview</h1>
							<FaAngleRight />
						</button>
						{user?.role === 'super_admin' && (
							<div className="flex items-center w-full  gap-2">
								<AsyncButton
									action={article?.published ? 'Unpublish' : 'Publish'}
									loading={updating}
									success={updated}
									disabled={updating}
									onClick={updatePublishedState}
								/>

								<AsyncButton
									action={article?.featured ? 'Unfeature' : 'Feature'}
									loading={featuring}
									success={featured}
									classname_override=" !bg-gray-700 hover:!bg-gray-600"
									disabled={featuring}
									onClick={updateFeaturedState}
								/>
							</div>
						)}
						{errorUpdating && (
							<p className="text-xs text-red">{errorUpdating}</p>
						)}
						{errorFeaturing && (
							<p className="text-xs text-red">{errorFeaturing}</p>
						)}
					</div>
				</div>
			</div>

			<EditArticleContentPrompt
				editArticleContentPromptRef={editArticleContentPromptRef}
				editArticleContentPrompt={editArticleContentPrompt}
				editArticleContentPromptVisible={editArticleContentPromptVisible}
				disableEditArticleContentPrompt={disableEditArticleContentPrompt}
				toggleEditArticleContentPrompt={toggleEditArticleContentPrompt}
				articleContent={articleContent as JSONContent | undefined}
				setArticleContent={
					setArticleContent as React.Dispatch<
						React.SetStateAction<JSONContent | undefined>
					>
				}
			/>
			<EditArticlePreviewPrompt
				isActive={editArticlePreviewPrompt}
				isVisible={editArticlePreviewPromptVisible}
				ref={editArticlePreviewPromptRef}
				togglePopup={toggleEditArticlePreviewPrompt}
				setDisable={disableEditArticlePreviewPrompt}
				articleToEdit={article as IArticle}
			/>
		</section>
	);
};

export default EditSection;

