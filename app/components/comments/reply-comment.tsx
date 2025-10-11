import { useAuthContext } from '~/app/context/auth-context';
import { useUtilsContext } from '~/app/context/utils-context';
import { BiSolidCommentDetail } from 'react-icons/bi';
import { useState } from 'react';
import ClassicInput from '../inputs/classic-input';
import AsyncButton from '../buttons/async-button';
import { apiRequest } from '~/utils/api-request';
import { useParams } from 'next/navigation';
import { toast } from 'react-toastify';
import { FaCheckCircle, FaEllipsisH, FaPen } from 'react-icons/fa';
import { useAccordion } from '~/utils/use-accordion';
import { usePopup } from '~/utils/toggle-popups';
import { RiDeleteBinLine } from 'react-icons/ri';
import EditComment from './edit-comment';
import { comment_type } from '~/types/comments';
import DeleteComment from './delete-comment';
import { MdBlock } from 'react-icons/md';
import BlockPrompt from './block';

interface replyProps {
	comment: comment_type;
}
const ReplyComment = ({ comment }: replyProps) => {
	const { user } = useAuthContext();
	const { ip } = useUtilsContext();
	const [replying, setReplying] = useState(false);
	const [replied, setReplied] = useState(false);
	const [replyError, setReplyError] = useState('');
	const [reply, setReply] = useState('');
	const { category, article } = useParams();
	const [isOpen, setIsOpen] = useState(false);
	const { contentRef, height } = useAccordion(isOpen);
	const {
		isActive: commentPrompt,
		isVisible: commentPromptVisible,
		ref: commentPromptRef,
		togglePopup: toggleCommentPrompt,
	} = usePopup();

	const {
		isActive: editCommentPrompt,
		isVisible: editCommentPromptVisible,
		ref: editCommentPromptRef,
		setDisableToggle: disableEditCommentToggle,
		togglePopup: toggleEditCommentPrompt,
	} = usePopup();
	const {
		isActive: deleteCommentPrompt,
		isVisible: deleteCommentPromptVisible,
		ref: deleteCommentPromptRef,
		setDisableToggle: disableDeleteCommentToggle,
		togglePopup: toggleDeleteCommentPrompt,
	} = usePopup();
	const {
		isActive: blockCommenterPrompt,
		isVisible: blockCommenterPromptVisible,
		ref: blockCommenterPromptRef,
		setDisableToggle: disableBlockCommenterToggle,
		togglePopup: toggleBlockCommenterPrompt,
	} = usePopup();
	const replyComment = async (commentId: string) => {
		if (replying) {
			return;
		}

		if (reply.trim() === '') {
			setReplyError('Comment is required');
			return;
		}

		if (!commentId) {
			setReplyError('Comment Id required');
		}

		setReplying(true);

		setReplyError('');
		await apiRequest({
			url: `/api/categories/${category}/${article}/comments/comment`,
			method: 'POST',
			body: {
				parentId: commentId,
				userId: user?._id,
				comment: reply,
			},
			onSuccess: () => {
				setIsOpen(false);
				toast.success('Comment replied successfully', {
					icon: <FaCheckCircle color="white" size={20} />,
				});
				setReplied(true);
				window.dispatchEvent(new CustomEvent('commentsUpdated'));

				setReply('');
				setTimeout(() => {
					setReplied(false);
				}, 1500);
			},
			onError: (error) => {
				setReplyError(error);
			},
			onFinally: () => {
				setReplying(false);
			},
		});
	};
	return (
		<>
			<div className="py-2 flex items-center gap-2">
				<button
					className={`px-2   flex  items-center  h-[25px]   gap-1 text-fade-blue hover:text-blue duration-150  rounded-full  `}
					onClick={() => {
						setIsOpen(!isOpen);
					}}
				>
					<BiSolidCommentDetail size={15} />
					<span className=" text-sm max-md:text-xs">Reply</span>
				</button>
				{
					// Case 1: Comment by a real user (non-anonymous)
					((!comment?.comment_by?.guest &&
						(comment?.comment_by?._id === user?._id ||
							user?.role === 'admin' ||
							user?.role === 'super_admin')) ||
						// Case 2: Comment by Anonymous → only admins/super_admins
						comment?.ip_address === ip ||
						user?.role === 'admin' ||
						user?.role === 'super_admin') && (
						<div className="relative">
							<button
								className="px-2 flex items-center h-[25px] gap-1 text-fade-blue hover:text-blue duration-150 rounded-full"
								onClick={() => {
									toggleCommentPrompt();
								}}
							>
								<FaEllipsisH size={15} />
							</button>

							{commentPrompt && (
								<div
									className={`flex flex-col bg-navy radial  border-grey border shadow-lg w-[150px] rounded-md duration-150 absolute top-0 left-[100%] divide-y divide-grey overflow-hidden z-20 ${
										commentPromptVisible ? 'opacity-100' : 'opacity-0'
									}`}
									ref={commentPromptRef}
								>
									{comment?.comment_by?._id === user?._id && (
										<button
											className="py-2 w-full text-[13px] text-white flex items-center gap-2 px-3 hover:bg-deepBlue duration-150"
											onClick={toggleEditCommentPrompt}
										>
											<FaPen className="text-sm" />
											<span>Edit comment</span>
										</button>
									)}

									<button
										className="py-2 w-full text-[13px] text-silver flex items-center gap-2 px-3 hover:bg-deepBlue duration-150"
										onClick={toggleDeleteCommentPrompt}
									>
										<RiDeleteBinLine className="text-sm text-red" />
										<span>Delete comment</span>
									</button>
									{user?.role === 'super_admin' &&
										comment?.comment_by?.guest && (
											<button
												className="py-2 w-full text-[13px] text-grey flex items-center gap-2 px-3 hover:bg-lightGrey duration-150"
												onClick={toggleBlockCommenterPrompt}
											>
												<MdBlock className="text-sm" />
												<span>Block I.P</span>
											</button>
										)}
								</div>
							)}
						</div>
					)
				}
			</div>

			<div
				className={`w-full     opacity-100   duration-300 ease-in-out flex flex-col    gap-2       items-center   overflow-hidden`}
				ref={contentRef}
				style={{ height, transition: 'height 0.3s ease' }}
			>
				<div className="flex items-center gap-2 w-full p-1">
					<ClassicInput
						value={reply}
						setValue={setReply}
						errorContent="Comment is required"
						placeholder="Add comment..."
						classname_override="!h-[35px] h"
						error={replyError}
						setError={setReplyError}
					/>
					<div className="flex gap-1 self-start">
						<AsyncButton
							action="Reply"
							classname_override="!w-[70px] px-3 !text-xs !h-[35px]"
							loading={replying}
							success={replied}
							onClick={() => replyComment(comment._id)}
							disabled={replying}
						/>

						<button
							className="bg-gray-600  text-white h-[35px] px-2 text-xs  rounded-sm  hover:bg-gray-700 duration-150"
							onClick={() => {
								setReply('');
								setIsOpen(!isOpen);
							}}
						>
							Cancel
						</button>
					</div>
				</div>

				<h1 className="text-xs text-red text-start self-start">{replyError}</h1>
				<EditComment
					isActive={editCommentPrompt}
					isVisible={editCommentPromptVisible}
					ref={editCommentPromptRef}
					setDisable={disableEditCommentToggle}
					togglePopup={toggleEditCommentPrompt}
					comment={comment}
				/>
				<DeleteComment
					isActive={deleteCommentPrompt}
					isVisible={deleteCommentPromptVisible}
					ref={deleteCommentPromptRef}
					setDisable={disableDeleteCommentToggle}
					togglePopup={toggleDeleteCommentPrompt}
					comment={comment}
				/>
				<BlockPrompt
					blockPrompt={blockCommenterPrompt}
					blockPromptVisible={blockCommenterPromptVisible}
					blockPromptRef={blockCommenterPromptRef}
					setDisableToggle={disableBlockCommenterToggle}
					toggleBlockPrompt={toggleBlockCommenterPrompt}
					comment={comment}
				/>
			</div>
		</>
	);
};

export default ReplyComment;

