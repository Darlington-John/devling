'use client';
import Link from 'next/link';
import { FaPen } from 'react-icons/fa';
import { FaEllipsisVertical } from 'react-icons/fa6';
import { RiDeleteBin5Line } from 'react-icons/ri';
import { ITopic } from '~/types/topic';
import { usePopup } from '~/utils/toggle-popups';
import EditTopicPrompt from './edit-topic-prompt';
import { useState } from 'react';
import DeleteTopicPrompt from './delete-topic-prompt';
import { useAuthContext } from '~/app/context/auth-context';
interface TopicProps {
	topic: ITopic;
	admin?: boolean;
	classname_override?: string;
}

const TopicCard = ({
	topic,
	admin = false,
	classname_override,
}: TopicProps) => {
	const {
		isActive: adminPrompt,
		isVisible: adminPromptVisible,
		ref: adminPromptRef,
		togglePopup: toggleAdminPrompt,
	} = usePopup();
	const {
		isActive: editTopicPrompt,
		isVisible: editTopicPromptVisible,
		ref: editTopicPromptRef,
		setDisableToggle: disableEditTopicPrompt,
		togglePopup: toggleEditTopicPrompt,
	} = usePopup();
	const {
		isActive: deleteTopicPrompt,
		isVisible: deleteTopicPromptVisible,
		ref: deleteTopicPromptRef,
		setDisableToggle: disableDeleteTopicPrompt,
		togglePopup: toggleDeleteTopicPrompt,
	} = usePopup();
	const [topicToEdit, setTopicToEdit] = useState<ITopic | null>(null);
	const { user } = useAuthContext();
	return (
		<>
			<Link
				href={admin ? `/admin/topics/${topic?.slug}` : `/topics/${topic?.slug}`}
				className={`${
					classname_override ??
					'flex flex-col items-start overflow-hidden    hover:shadow-md duration-300   max-xs:gap-2  max-2xs:h-auto rounded-lg relative border border-grey'
				}      `}
			>
				{admin && (
					<div className="absolute top-3 right-3 z-20">
						{user?.role === 'super_admin' && (
							<button
								className="flex items-center justify-center h-8 w-8 rounded-full hover:bg-[#ffffff43]  "
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
								className={`flex  flex-col bg-navy shadow-lg  w-[130px] rounded-md   duration-150 absolute top-0 right-[100%] divide-y divide-grey overflow-hidden border border-grey z-20   ${
									adminPromptVisible ? 'opacity-100' : 'opacity-0 '
								}`}
								ref={adminPromptRef}
							>
								<button
									className="py-2 w-full text-[13px]  text-silver flex items-center gap-2  px-3 hover:bg-deepBlue duration-150"
									onClick={(e) => {
										e.preventDefault();
										e.stopPropagation();
										toggleEditTopicPrompt();
										setTopicToEdit(topic);
									}}
								>
									<FaPen className="text-sm" />
									<span>Edit topic</span>
								</button>
								<button
									className="py-2 w-full text-[13px]  text-silver flex items-center gap-2  px-3 hover:bg-deepBlue duration-150"
									onClick={(e) => {
										e.preventDefault();
										e.stopPropagation();
										toggleDeleteTopicPrompt();
									}}
								>
									<RiDeleteBin5Line className="text-sm" />
									<span>Delete topic</span>
								</button>
							</div>
						)}
					</div>
				)}

				<div className=" w-full overflow-hidden  blog-img relative   max-2xs:max-h-auto max-2xs:min-h-[200px]">
					{/* eslint-disable-next-line */}
					<img
						src={topic?.image}
						alt={topic?.image || 'topic image'}
						className="w-full h-full object-cover min-h-[200px]"
					/>
					<div className="absolute top-0 left-0 h-full w-full bg-[#15133d7a] min-h-[200px]"></div>
					<h3 className="  text-white text-2xl rounded-sm absolute  bottom-2 left-5 font-semibold  max-2xs:px-2 max-2xs:text-2xl poppins-bold capitalize">
						{topic?.title}
					</h3>
				</div>
				<div className="p-6 max-md:p-3">
					<p className="text-silver text-base line-clamp-3 article-desc max-md:text-sm max-2xs:text-sm  ">
						{topic?.description}
					</p>
				</div>
			</Link>
			<EditTopicPrompt
				isVisible={editTopicPromptVisible}
				ref={editTopicPromptRef}
				isActive={editTopicPrompt}
				togglePopup={toggleEditTopicPrompt}
				setDisable={disableEditTopicPrompt}
				topicToEdit={topicToEdit as ITopic}
			/>
			<DeleteTopicPrompt
				isVisible={deleteTopicPromptVisible}
				ref={deleteTopicPromptRef}
				isActive={deleteTopicPrompt}
				togglePopup={toggleDeleteTopicPrompt}
				setDisable={disableDeleteTopicPrompt}
				topicId={topic?._id}
			/>
		</>
	);
};

export default TopicCard;

