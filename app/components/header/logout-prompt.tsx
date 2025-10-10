import Image from 'next/image';
import { useState } from 'react';
import waving from '~/public/images/waving-hand-medium-light-skin-tone-svgrepo-com.svg';
import { toast } from 'react-toastify';
import { FaCheck } from 'react-icons/fa';
import AsyncButton from '../buttons/async-button';
import { apiRequest } from '~/utils/api-request';
import { useUtilsContext } from '~/app/context/utils-context';
interface promptProp {
	isLogoutPromptVisible: boolean;
	logoutPrompt: boolean;
	logoutPromptRef: React.RefObject<HTMLDivElement | null>;
	togglePopup: () => void;
}
const LogoutPrompt = ({
	isLogoutPromptVisible,
	logoutPrompt,
	logoutPromptRef,
	togglePopup,
}: promptProp) => {
	const [clearing, setClearing] = useState(false);
	const [successful, setSuccessful] = useState(false);
	const [error, setError] = useState('');
	const { setResetPassword } = useUtilsContext();
	const clearCookies = async () => {
		setClearing(true);
		setError('');
		apiRequest({
			url: '/api/auth/clear-cookies',
			method: 'POST',
			onSuccess: () => {
				window.dispatchEvent(new CustomEvent('userUpdated'));

				toast.success('Log out successful', {
					icon: <FaCheck color="white" />,
				});
				setSuccessful(true);
				setTimeout(() => togglePopup(), 2000);
				setTimeout(() => setSuccessful(false), 3000);
			},
			onError: () => {
				setError('An error occurred');
			},
			onFinally: () => {
				setClearing(false);
			},
		});
		try {
			const response = await fetch('/api/clear-cookies', {
				method: 'POST',
				credentials: 'include',
			});
			setClearing(true);
			if (!response.ok) {
			}
		} catch (error) {
			console.error('Error clearing cookies:', error);
		}
	};
	return (
		logoutPrompt && (
			<div
				className={`fixed top-[0px]  h-full w-full  z-50 left-0 flex  justify-center  items-center backdrop-brightness-50  px-8     xs:px-0 `}
			>
				<div
					className={`w-[350px]     mid-popup   duration-300 ease-in-out flex flex-col py-6 px-6  gap-4   rounded-lg bg-navy radial border border-grey   items-center font-normal     ${
						isLogoutPromptVisible ? '' : 'mid-popup-hidden'
					}`}
					ref={logoutPromptRef}
				>
					<div className="flex flex-col  items-center">
						<Image src={waving} className="w-20" alt="waving" />
						<div className="flex flex-col gap-2">
							<h3 className="text-[27px] text-center text-fade-blue font-semibold">
								See you soon
							</h3>
							<p className="text-sm sf-light  text-center text-silver">
								You are about to logout.
								<br />
								Are you sure that&apos;s what you want?
							</p>
						</div>
					</div>
					{error && <h3 className="text-sm text-red  text-center">{error}</h3>}
					<div
						className="flex items-center gap-2  w-full"
						onClick={() => setResetPassword(false)}
					>
						<AsyncButton
							onClick={clearCookies}
							action="Confirm logout"
							classname_override="!h-[40px]  text-sm duration-300  rounded-md"
							loading={clearing}
							disabled={clearing}
							success={successful}
						/>

						<button
							onClick={() => {
								togglePopup();
							}}
							className="bg-gray-500   text-white px-4 h-[40px]  rounded-md  hover:ring-[2px] hover:ring-offset-1  ring-gray-500   duration-300  gap-1    text-xs w-[40%] "
						>
							Cancel
						</button>
					</div>
				</div>
			</div>
		)
	);
};

export default LogoutPrompt;

