import { useState } from 'react';
import { FaCheck } from 'react-icons/fa';
import { MdBlock } from 'react-icons/md';
import { toast } from 'react-toastify';
import AsyncButton from '~/app/components/buttons/async-button';
import { useAuthContext } from '~/app/context/auth-context';
import { comment_type } from '~/types/comments';
import { apiRequest } from '~/utils/api-request';
import ClassicInput from '../inputs/classic-input';
interface blockPromptProps {
	blockPromptVisible: boolean;
	blockPrompt: boolean;
	toggleBlockPrompt: () => void;
	blockPromptRef: React.RefObject<HTMLDivElement | null>;
	comment: comment_type;
	setDisableToggle: React.Dispatch<React.SetStateAction<boolean>>;
}
const BlockPrompt = ({
	blockPromptVisible,
	blockPrompt,
	toggleBlockPrompt,
	blockPromptRef,
	comment,
	setDisableToggle,
}: blockPromptProps) => {
	const [error, setError] = useState('');
	const [blocking, setBlocking] = useState(false);
	const [successful, setSuccessful] = useState(false);
	const [reason, setReason] = useState('');
	const { user } = useAuthContext();

	const handleBlock = async () => {
		if (blocking) return;
		if (!user) {
			setError('User not authenticated');
		}

		if (!comment?.ip_address) {
			setError('Comment does not contain an I.P address');
			return;
		}

		setBlocking(true);
		setDisableToggle(true);

		await apiRequest({
			url: '/api/block/block-by-ip',
			method: 'POST',
			body: {
				userId: user?._id,
				reason,
				ip: comment?.ip_address,
			},
			onSuccess: () => {
				window.dispatchEvent(new CustomEvent('commentsUpdated'));
				setSuccessful(true);
				setTimeout(() => {
					toggleBlockPrompt();
				}, 500);

				toast.success(`Ip Blocked successfully`, {
					icon: <FaCheck color="white" />,
				});
			},

			onError: (error) => {
				setError(error);
			},
			onFinally: () => {
				setSuccessful(false);
				setBlocking(false);
				setDisableToggle(false);
			},
		});
	};
	return (
		blockPrompt && (
			<div className="fixed bottom-[0px]  h-full w-full  z-50 left-0 flex  justify-center  items-center        backdrop-brightness-50  px-8     xs:px-0">
				<div
					className={`w-[350px]     mid-popup   duration-300 ease-in-out flex flex-col py-6 px-6  gap-4   rounded-lg bg-navy radial border border-grey  items-center      ${
						blockPromptVisible ? '' : 'mid-popup-hidden'
					}  `}
					ref={blockPromptRef}
				>
					<div className="flex flex-col gap-3 items-center w-full">
						<MdBlock className="text-2xl text-red-300" />

						<div className="flex flex-col gap-2 ">
							<h1 className="text-2xl text-center text-fade-blue">Block I.P</h1>
							<p className="text-sm  text-center text-silver">
								You’re about to block the commenter with this I.P Address. Are
								you sure you want to?
							</p>
						</div>
					</div>
					<ClassicInput
						value={reason}
						setValue={setReason}
						error={error}
						setError={setError}
						textarea
						label="Reason for blocking"
						maxlength={160}
						placeholder="reason"
						autofocus={true}
						name="reason"
						errorContent="A reason is required"
					/>
					{error && (
						<h1 className="text-[11px] text-red-300 text-center">{error}</h1>
					)}
					<div className="flex gap-4 w-full">
						<AsyncButton
							action="Block"
							classname_override="!h-[40px] text-xs"
							loading={blocking}
							success={successful}
							disabled={blocking}
							onClick={handleBlock}
						/>

						<button
							className="flex items-center justify-center  gap-2  h-[40px]  px-2 rounded-md bg-gray-700     duration-150 hover:bg-gray-600    text-center w-[40%] text-white  text-xs "
							onClick={toggleBlockPrompt}
						>
							Cancel
						</button>
					</div>
				</div>
			</div>
		)
	);
};

export default BlockPrompt;

