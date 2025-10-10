import { useState } from 'react';
import { FaCheck } from 'react-icons/fa';
import { MdBlock } from 'react-icons/md';
import { toast } from 'react-toastify';
import AsyncButton from '~/app/components/buttons/async-button';
import ClassicInput from '~/app/components/inputs/classic-input';
import { useAuthContext } from '~/app/context/auth-context';
import { user_type } from '~/types/user';
import { apiRequest } from '~/utils/api-request';
interface blockPromptProps {
	blockPromptVisible: boolean;
	blockPrompt: boolean;
	toggleBlockPrompt: () => void;
	blockPromptRef: React.RefObject<HTMLDivElement | null>;
	member: user_type;
	setDisableToggle: React.Dispatch<React.SetStateAction<boolean>>;
}
const BlockPrompt = ({
	blockPromptVisible,
	blockPrompt,
	toggleBlockPrompt,
	blockPromptRef,
	member,
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
		

		if (!member?._id) {
			setError('Member Id not provided');
			return;
		}

		setBlocking(true);
		setDisableToggle(true);

		await apiRequest({
			url: '/api/block/block-by-id',
			method: 'POST',
			body: {
				memberId: member?._id,
				reason,
				adminId: user?._id,
			},
			onSuccess: () => {
				window.dispatchEvent(new CustomEvent('refetchBlocked'));
				setSuccessful(true);
				setTimeout(() => {
					toggleBlockPrompt();
				}, 500);

				toast.success(`Member Blocked successfully`, {
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
					className={`w-[350px]     mid-popup   duration-300 ease-in-out flex flex-col py-6 px-6  gap-4   rounded-lg bg-navy border border-grey radial  items-center      ${
						blockPromptVisible ? '' : 'mid-popup-hidden'
					}  `}
					ref={blockPromptRef}
				>
					<div className="flex flex-col gap-3 items-center w-full">
						<MdBlock className="text-2xl text-red-300" />

						<div className="flex flex-col gap-2 ">
							<h1 className="text-2xl text-center text-fade-blue">Block Account</h1>
							<p className="text-sm  text-center text-silver">
								You’re about to block
								<span className="neue-bold">
									{` ${member?.first_name} ${member?.last_name || ''} `}
								</span>
								. Are you sure you want to?
							</p>
						</div>
					</div>

					<ClassicInput
						value={reason}
						setValue={setReason}
						error={error}
						setError={setError}
						label="Reason for blocking"
						textarea
						maxlength={160}
						placeholder="reason"
						autofocus={true}
						name="reason"
						errorContent="A reason is required"
					/>
					{error && (
						<h1 className="text-[11px] text-red text-center">{error}</h1>
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
							className="flex items-center justify-center  gap-2  h-[40px]  px-2 rounded-md bg-gray-700     duration-150 hover:bg-gray-800    text-center w-[40%] text-white  text-xs "
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

