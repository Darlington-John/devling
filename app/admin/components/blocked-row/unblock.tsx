import { useState } from 'react';
import { CgUnblock } from 'react-icons/cg';
import { FaCheck } from 'react-icons/fa';
import { toast } from 'react-toastify';
import AsyncButton from '~/app/components/buttons/async-button';
import { useAuthContext } from '~/app/context/auth-context';
import { blocked_type } from '~/types/blocked';
import { apiRequest } from '~/utils/api-request';
interface unblockPromptProps {
	unblockPromptVisible: boolean;
	unblockPrompt: boolean;
	toggleUnblockPrompt: () => void;
	unblockPromptRef: React.RefObject<HTMLDivElement | null>;
	blocked: blocked_type;
	setDisableToggle: React.Dispatch<React.SetStateAction<boolean>>;
}
const UnblockPrompt = ({
	unblockPromptVisible,
	unblockPrompt,
	toggleUnblockPrompt,
	unblockPromptRef,
	blocked,
	setDisableToggle,
}: unblockPromptProps) => {
	const [error, setError] = useState('');
	const [submitting, setSubmitting] = useState(false);
	const [successful, setSuccessful] = useState(false);
	const { user } = useAuthContext();
	const handleUnblockPrompt = async () => {
		if (submitting) return;

		if (!blocked?._id) {
			setError('Missing required fields');
			return;
		}

		setSubmitting(true);
		setDisableToggle(true);

		await apiRequest({
			url: '/api/blockeds/unblock-account',
			method: 'POST',
			body: {
				blockedId: blocked?._id,
				adminId: user?._id,
			},
			onSuccess: () => {
				window.dispatchEvent(new CustomEvent('refetchblockeds'));
				setSuccessful(true);
				setTimeout(() => {
					toggleUnblockPrompt();
				}, 500);

				toast.success(
					`${
						blocked?.blocked.first_name || blocked.ip_address
					}  account unblocked successfully`,
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
		unblockPrompt && (
			<div className="fixed bottom-[0px]  h-full w-full  z-50 left-0 flex  justify-center  items-center        backdrop-brightness-50  px-8     xs:px-0">
				<div
					className={`w-[350px]     mid-popup   duration-300 ease-in-out flex flex-col py-6 px-6  gap-4   rounded-lg bg-white  items-center      ${
						unblockPromptVisible ? '' : 'mid-popup-hidden'
					}  `}
					ref={unblockPromptRef}
				>
					<div className="flex flex-col gap-3 items-center w-full">
						<CgUnblock className="text-2xl" />

						<div className="flex flex-col gap-2 ">
							<h1 className="text-2xl text-center">unblock Account</h1>
							<p className="text-sm  text-center">
								You’re about to unblock
								<span className="neue-bold">
									{` ${blocked?.blocked.first_name || blocked?.ip_address} ${
										blocked?.blocked.last_name || ''
									} `}{' '}
								</span>
								. Are you sure you want to?
							</p>
						</div>
					</div>
					{error && (
						<h1 className="text-[11px] text-red text-center">{error}</h1>
					)}
					<div className="flex gap-4 w-full">
						<AsyncButton
							action="unblock"
							classname_override="!h-[40px] text-xs"
							loading={submitting}
							success={successful}
							disabled={submitting}
							onClick={handleUnblockPrompt}
						/>

						<button
							className="flex items-center justify-center  gap-2  h-[40px]  px-2 rounded-md bg-gray-700     duration-150 hover:bg-gray-800    text-center w-[40%] text-white  text-xs "
							onClick={toggleUnblockPrompt}
						>
							Cancel
						</button>
					</div>
				</div>
			</div>
		)
	);
};

export default UnblockPrompt;

