import { useState } from 'react';
import { FaCheck } from 'react-icons/fa';
import { toast } from 'react-toastify';
import AsyncButton from '~/app/components/buttons/async-button';
import { useAuthContext } from '~/app/context/auth-context';
import { apiRequest } from '~/utils/api-request';
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

const DeleteComment = ({
	isVisible,
	isActive,
	ref,
	togglePopup,
	setDisable,
	comment,
}: PopupPrompt) => {
	const { user } = useAuthContext();
	const { topic, article } = useParams();

	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const [successful, setSuccessful] = useState(false);
	const deleteComment = async () => {
		if (loading) {
			return;
		}

		setLoading(true);
		setError('');
		setDisable(true);
		await apiRequest({
			url: `/api/topics/${topic}/${article}/comments/delete-comment`,
			method: 'DELETE',
			body: { userId: user?._id, commentId: comment?._id },
			onSuccess: (response) => {
				setSuccessful(true);

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
					className={`w-[350px]     mid-popup   duration-300 ease-in-out flex flex-col py-6 px-6  gap-4   rounded-lg bg-navy    items-center font-normal     ${
						isVisible ? '' : 'mid-popup-hidden'
					}`}
					ref={ref}
				>
					<div className="flex items-center flex-col gap-0 w-full leading-none">
						<h1 className="text-2xl sf-bold text-center text-fade-blue">
							Delete Comment
						</h1>
						<p className="text-xs text-silver text-center">
							You&apos;re about to delete this comment. All replies under it
							will also be deleted. Are you sure you want to continue?
						</p>
					</div>

					<div className="gap-2 flex w-full">
						<AsyncButton
							classname_override="!h-[40px] !rounded-md !bg-red hover:!bg-red-500"
							action="Delete"
							loading={loading}
							success={successful}
							onClick={deleteComment}
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

export default DeleteComment;

