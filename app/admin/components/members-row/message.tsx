import { useState } from 'react';
import { FaCheck } from 'react-icons/fa';
import { GrUserAdmin } from 'react-icons/gr';
import { toast } from 'react-toastify';
import AsyncButton from '~/app/components/buttons/async-button';
import ClassicInput from '~/app/components/inputs/classic-input';
import { useAuthContext } from '~/app/context/auth-context';
import { user_type } from '~/types/user';
import { apiRequest } from '~/utils/api-request';
interface messagePromptProps {
	messagePromptVisible: boolean;
	messagePrompt: boolean;
	toggleMessagePrompt: () => void;
	messagePromptRef: React.RefObject<HTMLDivElement | null>;
	member: user_type;
	setDisableToggle: React.Dispatch<React.SetStateAction<boolean>>;
}
const MessagePrompt = ({
	messagePromptVisible,
	messagePrompt,
	toggleMessagePrompt,
	messagePromptRef,
	member,
	setDisableToggle,
}: messagePromptProps) => {
	const [error, setError] = useState('');
	const [message, setMessage] = useState('');
	const [submitting, setSubmitting] = useState(false);
	const [successful, setSuccessful] = useState(false);
	const { user } = useAuthContext();
	const handleMessagePrompt = async () => {
		if (submitting) return;

		if (!member?._id) {
			setError('Missing required fields');
			return;
		}

		setSubmitting(true);
		setDisableToggle(true);
		await apiRequest({
			url: '/api/members/message-account',
			method: 'POST',
			body: {
				message,
				adminId: user?._id,
				email: member?.email,
			},
			onSuccess: () => {
				// window.dispatchEvent(new CustomEvent('refetchMembers'));
				setSuccessful(true);
				setTimeout(() => {
					toggleMessagePrompt();
				}, 500);
				setMessage('');
				toast.success(
					`${member?.first_name} ${
						member?.last_name || ''
					} messaged successfully`,
					{
						icon: <FaCheck color="white" />,
					},
				);
			},
			onError: (error) => {
				setError(error);
			},
			onFinally: () => {
				setSuccessful(false);
				setSubmitting(false);
				setDisableToggle(false);
			},
		});
	};
	return (
		messagePrompt && (
			<div className="fixed bottom-[0px]  h-full w-full  z-50 left-0 flex  justify-center  items-center        backdrop-brightness-50  px-8     xs:px-0">
				<div
					className={`w-[350px]     mid-popup   duration-300 ease-in-out flex flex-col py-6 px-6  gap-4   rounded-lg bg-navy radial border-grey  items-center      ${
						messagePromptVisible ? '' : 'mid-popup-hidden'
					}  `}
					ref={messagePromptRef}
				>
					<div className="flex flex-col gap-3 items-center w-full">
						<GrUserAdmin className="text-2xl text-blue" />

						<div className="flex flex-col gap-2 ">
							<h1 className="text-2xl text-center text-fade-blue">Message Account</h1>
							<p className="text-sm  text-center text-silver">
								You’re about to message
								<span className="neue-bold">
									{` ${member?.first_name} ${member?.last_name} `}{' '}
								</span>{' '}
								through his provided email
							</p>
						</div>
					</div>
					<ClassicInput
						value={message}
						setValue={setMessage}
						errorContent="Message is required"
						placeholder="message..."
						textarea={true}
						error={error}
						maxlength={300}
						setError={setError}
					/>
					{error && (
						<h1 className="text-[11px] text-red text-center">{error}</h1>
					)}
					<div className="flex gap-4 w-full">
						<AsyncButton
							action="Send"
							classname_override="!h-[40px] text-xs"
							loading={submitting}
							success={successful}
							disabled={submitting}
							onClick={handleMessagePrompt}
						/>

						<button
							className="flex items-center justify-center  gap-2  h-[40px]  px-2 rounded-md bg-gray-700     duration-150 hover:bg-gray-800    text-center w-[40%] text-white  text-xs "
							onClick={toggleMessagePrompt}
						>
							Cancel
						</button>
					</div>
				</div>
			</div>
		)
	);
};

export default MessagePrompt;

