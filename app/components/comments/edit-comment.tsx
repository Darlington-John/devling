import { useState } from 'react';
import { FaCheck } from 'react-icons/fa';
import { toast } from 'react-toastify';
import AsyncButton from '~/app/components/buttons/async-button';
import { useAuthContext } from '~/app/context/auth-context';
import { apiRequest } from '~/utils/api-request';
import ClassicInput from '../inputs/classic-input';
import { comment_type } from '~/types/comments';
import { useParams } from 'next/navigation';

interface PopupPrompt {
	isVisible: boolean;
	isActive: boolean;
	ref: React.RefObject<HTMLDivElement | null>;
	togglePopup: () => void;
	setDisable: React.Dispatch<React.SetStateAction<boolean>>;
	comment: comment_type;
}

const EditComment = ({
	isVisible,
	isActive,
	ref,
	togglePopup,
	setDisable,
	comment,
}: PopupPrompt) => {
	const { user } = useAuthContext();
	const { category, article } = useParams();
	const [commentEdit, setCommentEdit] = useState(comment?.comment || '');

	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const [successful, setSuccessful] = useState(false);
	const editComment = async () => {
		if (loading) {
			return;
		}
		if (commentEdit.trim() === '') {
			setError('Comment is required');
			return;
		}
		setLoading(true);
		setError('');
		setDisable(true);
		await apiRequest({
			url: `/api/categories/${category}/${article}/comments/edit-comment`,
			method: 'PATCH',
			body: { userId: user?._id, commentEdit, commentId: comment?._id },
			onSuccess: (response) => {
				setSuccessful(true);
				setCommentEdit('');
				toast.success(response.message, {
					icon: <FaCheck color="white" />,
				});
				window.dispatchEvent(new CustomEvent('commentsUpdated'));
				setTimeout(() => {
					togglePopup();
					setSuccessful(false);
				}, 3000);
			},
			onError: (error) => {
				setError(error);
			},
			onFinally: () => {
				setLoading(false);
				setDisable(false);
			},
		});
	};
	return (
		isActive && (
			<div className="fixed top-[0px]  h-full w-full  z-50 left-0 flex  justify-center  items-center        backdrop-brightness-50  px-8     xs:px-0">
				<div
					className={`w-[350px]     mid-popup   duration-300 ease-in-out flex flex-col py-6 px-6  gap-4   rounded-lg bg-navy   items-center font-normal     ${
						isVisible ? '' : 'mid-popup-hidden'
					}`}
					ref={ref}
				>
					<div className="flex items-center flex-col gap-0 w-full leading-none">
						<h1 className="text-2xl sf-bold text-center text-fade-blue">
							Edit Comment
						</h1>
					</div>
					<ClassicInput
						value={commentEdit}
						setValue={setCommentEdit}
						error={error}
						setError={setError}
						placeholder="comment"
						autofocus={true}
						name="comment"
						errorContent="Comment is required"
						serverError={['User  not authenticated']}
					/>

					<div className="gap-2 flex w-full">
						<AsyncButton
							classname_override="!h-[40px] !rounded-md"
							action="Edit"
							disabled={!commentEdit}
							loading={loading}
							success={successful}
							onClick={editComment}
						/>
						<button
							className="bg-gray-500 text-center w-full  hover:outline outline-gray-600   !rounded-md text-sm text-white duration-150"
							onClick={togglePopup}
							disabled={loading}
						>
							Cancel
						</button>
					</div>

					{error && <h1 className="text-xs text-center text-red">{error}</h1>}
				</div>
			</div>
		)
	);
};

export default EditComment;

