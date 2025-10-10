import { comment_type } from '~/types/comments';
import * as motion from 'motion/react-client';
import { FaCircle } from 'react-icons/fa';
import { formatRelativeTime } from '~/utils/relative-time';
import ReplyComment from './reply-comment';

interface CardProps {
	comment: comment_type;
}
export const CommentCard = ({ comment }: CardProps) => {
	return (
		<motion.div
			className="flex  items-start  gap-4  relative my-2 w-full max-md:gap-2"
			key={comment.updatedAt}
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{
				duration: 0.4,
			}}
		>
			<div className="flex items-center justify-center ">
				{/*eslint-disable-next-line */}
				<img
					src={comment?.comment_by.profile ?? '/icons/default-user.svg'}
					className="w-9 h-9 object-cover rounded-full max-sm:w-6 max-sm:h-6 relative z-10 overflow-hidden shrink-0"
					alt="profile"
				/>
				<div className="absolute w-[1px] bg-grey  top-0 h-full"></div>
			</div>

			<div className=" flex flex-col gap-1 w-full">
				<div className="flex  items-center  gap-1  ">
					<h4 className="text-base   font-semibold  max-md:text-sm text-white">
						{comment?.comment_by?.guest
							? 'Reader'
							: `${comment.comment_by.first_name} ${
									comment.comment_by.last_name ?? ''
							  }`}
					</h4>

					<FaCircle className="text-gray-600   " size={4} />
					<span className="text-sm max-md:text-xs text-silver">
						{formatRelativeTime(comment.createdAt as string)}
					</span>
				</div>

				<p className="max-md:text-sm text-silver">{comment?.comment}</p>
				<ReplyComment comment={comment} />
				{comment?.replies?.length > 0 && (
					<div className="flex flex-col w-full relative">
						{comment.replies.map((reply) => (
							<CommentCard key={reply._id} comment={reply} />
						))}
					</div>
				)}
			</div>
		</motion.div>
	);
};

