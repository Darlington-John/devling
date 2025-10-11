import RichTextEditor from '~/app/components/rich-text-editor/editor';
import type { JSONContent } from '@tiptap/react';
import AsyncButton from '~/app/components/buttons/async-button';
import { useEffect, useState } from 'react';
import { useAuthContext } from '~/app/context/auth-context';
import { apiRequest } from '~/utils/api-request';
import { toast } from 'react-toastify';
import { FaCheck } from 'react-icons/fa';
import { useParams } from 'next/navigation';
interface Props {
	editArticleContentPrompt: boolean;
	editArticleContentPromptVisible: boolean;
	editArticleContentPromptRef: React.RefObject<HTMLDivElement | null>;
	disableEditArticleContentPrompt: React.Dispatch<
		React.SetStateAction<boolean>
	>;
	toggleEditArticleContentPrompt: () => void;

	articleContent: JSONContent | undefined;
	setArticleContent: React.Dispatch<
		React.SetStateAction<JSONContent | undefined>
	>;
}
const EditArticleContentPrompt = ({
	editArticleContentPrompt,
	editArticleContentPromptRef,
	editArticleContentPromptVisible,
	disableEditArticleContentPrompt,
	toggleEditArticleContentPrompt,

	articleContent,
	setArticleContent,
}: Props) => {
	const [error, setError] = useState('');
	const { category, article: articleParam } = useParams();
	const { user } = useAuthContext();
	const [editedContent, setEditedContent] = useState<JSONContent | undefined>(
		articleContent,
	);
	const [loading, setLoading] = useState(false);
	const [successful, setSuccessful] = useState(false);
	useEffect(() => {
		setEditedContent(articleContent);
	}, [articleContent]);
	const hasValidContent = (nodes: JSONContent[]): boolean => {
		return nodes?.some((node) => {
			if (node.type === 'image') return true;

			if (node.type === 'text' && node.text?.trim() !== '') return true;

			// If the node has children, check them too
			if (node.content) {
				return hasValidContent(node.content);
			}

			return false;
		});
	};
	const editArticleContent = async () => {
		if (!user || loading) {
			return;
		}

		if (!hasValidContent(editedContent?.content || [])) {
			setError('Article must contain text or an image');
			return;
		}

		setLoading(true);
		setError('');
		disableEditArticleContentPrompt(true);

		await apiRequest({
			url: `/api/categories/${category}/${articleParam}/edit-content`,
			method: 'POST',
			body: { content: editedContent, adminId: user?._id },
			onSuccess: (response) => {
				setSuccessful(true);
				toast.success(response.message, {
					icon: <FaCheck color="white" />,
				});
				setArticleContent(response.article_content);
				setTimeout(() => {
					toggleEditArticleContentPrompt();

					setSuccessful(false);
				}, 1000);
			},
			onError: (error) => {
				setError(error);
			},
			onFinally: () => {
				setLoading(false);
				disableEditArticleContentPrompt(false);
			},
		});
	};
	return (
		editArticleContentPrompt && (
			<div className="fixed top-[0px]  h-full w-full  z-50 left-0 flex  justify-center  items-center       backdrop-brightness-50  px-8     xs:px-0">
				<div
					className={`w-[900px]     mid-popup   duration-300 ease-in-out flex flex-col py-6 px-6  gap-4   rounded-lg bg-dark-navy items-start font-normal   radial border border-grey  ${
						editArticleContentPromptVisible ? '' : 'mid-popup-hidden'
					}`}
					ref={editArticleContentPromptRef}
				>
					<RichTextEditor
						default_content={editedContent}
						onContentChange={(json) => {
							setEditedContent(json);
							setError('');
						}}
					/>
					{error && <h1 className="text-sm text-red">{error}</h1>}
					<div className="flex gap-2 ">
						<AsyncButton
							classname_override={` !rounded-md px-6`}
							action="Update"
							disabled={
								!hasValidContent(editedContent?.content || []) || loading
							}
							loading={loading}
							success={successful}
							onClick={editArticleContent}
						/>

						<button
							className="text-sm text-white bg-gray-600 rounded-sm py-3 px-6 hover:bg-gray-500 duration-150"
							onClick={toggleEditArticleContentPrompt}
						>
							Cancel
						</button>
					</div>
				</div>
			</div>
		)
	);
};

export default EditArticleContentPrompt;

