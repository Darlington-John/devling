import { useState } from 'react';
import ClassicInput from '../inputs/classic-input';
import { useFetch } from '~/utils/fetch-page-data';
import { comment_type } from '~/types/comments';
import { CommentCard } from './comment';
import { useParams } from 'next/navigation';
import Loader from '../loader';
import EmptyState from '../empty-state';
import { FaCommentSlash } from 'react-icons/fa';
import AsyncButton from '../buttons/async-button';
import { useAuthContext } from '~/app/context/auth-context';
import { apiRequest } from '~/utils/api-request';
import { toast } from 'react-toastify';

const CommentsSection = () => {
	const { topic, article } = useParams();
	const [comment, setComment] = useState('');
	const [commentError, setCommentError] = useState('');
	const [commenting, setCommenting] = useState(false);
	const [commentSuccessful, setCommentSuccessful] = useState(false);

	const { user } = useAuthContext();
	const addComment = async () => {
		if (comment.trim() === '') {
			setCommentError('Comment is required');
			return;
		}
		if (commenting) {
			return;
		}

		setCommentError('');
		setCommenting(true);
		await apiRequest({
			url: `/api/topics/${topic}/${article}/comments/comment`,
			method: 'POST',
			body: { comment, userId: user?._id, parentId: null },
			onSuccess: (response) => {
				toast.success(response.message);
				setComment('');
				setCommentSuccessful(true);
				setTimeout(() => setCommentSuccessful(false), 3000);
				window.dispatchEvent(new CustomEvent('commentsUpdated'));
			},
			onError: (error) => {
				setCommentError(error);
			},
			onFinally: () => {
				setCommenting(false);
			},
		});
	};
	const {
		fetchedData: comments,
		isFetching,
		error,
		refetch,
	} = useFetch<comment_type[]>({
		basePath: `/api/topics/${topic}/${article}/comments/fetch-comments`,
		ids: [],
		eventKey: 'commentsUpdated',
		dataKey: 'result',
		// enabled: !!user && !loading,
		//  deps:[loading,user]
	});
	return (
		<aside className="flex flex-col gap-3 w-full ">
			<h3 className="text-2xl poppins-bold max-md:text-xl text-fade-blue">Comments</h3>
			<div className="flex flex-col gap-1">
				<div className="flex items-center gap-2">
					<ClassicInput
						value={comment}
						setValue={setComment}
						errorContent="Comment is required"
						placeholder="Add a comment..."
					
						error={commentError}
						setError={setCommentError}
					/>
					<AsyncButton
						action="Comment"
						classname_override="!w-[200px] max-md:!w-[100px] max-md:text-xs"
						loading={commenting}
						success={commentSuccessful}
						onClick={addComment}
						disabled={commenting}
					/>
				</div>
				{commentError && <p className="text-xs text-red">{commentError}</p>}
			</div>
			<div className="flex w-full flex-col">
				<Loader fetching={isFetching} error={error} try_again={refetch}>
					<div className="flex flex-col gap-5">
						{comments && comments.length > 0 ? (
							comments.map((data) => (
								<CommentCard
									key={data.updatedAt + data.createdAt}
									comment={data}
								/>
							))
						) : (
							<EmptyState
								icon={FaCommentSlash}
								message="No comments yet"
								container_override="!min-h-auto"
							/>
						)}
					</div>
				</Loader>
			</div>
		</aside>
	);
};

export default CommentsSection;

