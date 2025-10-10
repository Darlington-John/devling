'use client';
import Image from 'next/image';
import { useState } from 'react';
import google from '~/public/icons/google-color-svgrepo-com.svg';
import Login from './login';
import Signup from './signup';
import VerifyEmail from './verify-email';
import ForgotPassword from './forget-password/forget-password';
import ResetPassword from './forget-password/reset-password';
import { signIn } from 'next-auth/react';
import { BiArrowBack } from 'react-icons/bi';
import { FaXmark } from 'react-icons/fa6';
import { useUtilsContext } from '~/app/context/utils-context';
import { apiRequest } from '~/utils/api-request';
import { useCurrentUrl } from '~/utils/get-current-url';
const AuthPrompt = () => {
	const {
		authPopup,
		authPopupRef,
		authPopupVisible,
		toggleAuthPopup,
		setDisableToggle,
		currentAction,
		setCurrentAction,
		resetPassword,
	} = useUtilsContext();

	const [email, setEmail] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const [error, setError] = useState<string>('');
	const [submitting, setSubmitting] = useState(false);
	const [successful, setSuccessful] = useState(false);
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [verificationCode, setVerificationCode] = useState(Array(4).fill(''));
	const previousActions: Record<string, string> = {
		'log-in': 'log-in',
		'sign-up': 'log-in',
		'verify-email': 'sign-up',
		'forgot-password': 'log-in',
		'forgot-password-verify-email': 'forgot-password',
		'forgot-password-reset': 'forgot-password-verify-email',
	};

	const handleSubmit = async (action: string) => {
		const loginFieldsFilled = email && password;
		const signupFieldsFilled = loginFieldsFilled && firstName;
		let isValid;
		switch (action) {
			case 'log-in':
				isValid = loginFieldsFilled;
				break;
			case 'sign-up':
				isValid = signupFieldsFilled;
				break;
			case 'verify-email':
				isValid = verificationCode;
				break;
			case 'forgot-password':
				isValid = email;
				break;
			case 'forgot-password-verify-email':
				isValid = verificationCode;
				break;
			case 'forgot-password-reset':
				isValid = password;

				break;
			default:
				console.warn(`Unhandled action type: ${action}`);
				return;
		}

		if (!isValid) {
			setError('All fields are required');
			return;
		}
		setError('');
		setSubmitting(true);
		setDisableToggle(true);
		const actionUrls: Record<string, string> = {
			'log-in': '/api/auth/login',
			'sign-up': '/api/auth/signup',
			'verify-email': '/api/auth/verify-email',
			'forgot-password': '/api/auth/forgot-password/check-email',
			'forgot-password-verify-email': '/api/auth/forgot-password/verify-email',
			'forgot-password-reset': '/api/auth/forgot-password/reset-password',
		};

		const codeString = verificationCode.join('');
		await apiRequest({
			url: actionUrls[action],
			method: 'POST',
			body: {
				email,
				password,
				firstName,
				lastName,
				verificationCode: codeString,
			},
			onSuccess: async (response) => {
				const data = response;
				document.cookie = `email=${data.email}; Path=/;`;
				setSuccessful(true);
				switch (action as string) {
					case 'sign-up':
						setTimeout(() => {
							setCurrentAction('verify-email');
							setSuccessful(false);
						}, 1500);
						break;

					case 'verify-email':
						const { token } = data;
						document.cookie = `token=${token}; Path=/; Secure;`;
						window.dispatchEvent(new CustomEvent('userUpdated'));

						setTimeout(() => {
							toggleAuthPopup();

							setSuccessful(false);
							setVerificationCode(Array(4).fill(''));
							setCurrentAction('log-in');
						}, 1500);
						break;

					case 'log-in':
						window.dispatchEvent(new CustomEvent('userUpdated'));

						setTimeout(() => {
							toggleAuthPopup();

							setSuccessful(false);
						}, 1500);
						break;

					case 'forgot-password':
						setTimeout(() => {
							setSuccessful(false);
							setCurrentAction('forgot-password-verify-email');
						}, 1500);
						break;
					case 'forgot-password-verify-email':
						setTimeout(() => {
							setSuccessful(false);
							setCurrentAction('forgot-password-reset');
						}, 1500);
						break;
					case 'forgot-password-reset':
						window.dispatchEvent(new CustomEvent('userUpdated'));

						setTimeout(() => {
							setSuccessful(false);
							toggleAuthPopup();

							setCurrentAction('log-in');
						}, 1500);
						break;
					default:
						console.warn(`Unhandled action type: ${action}`);
						setSuccessful(false);
				}
			},
			onError: (error) => {
				setError(error);
			},
			onFinally: () => {
				setSubmitting(false);
				setDisableToggle(false);
			},
		});
	};
	const currentUrl = useCurrentUrl();
	const handleSignIn = async () => {
		await signIn('google', { callbackUrl: currentUrl || '/' });
	};

	return (
		authPopup && (
			<div className="fixed bottom-[0px]  h-full w-full  z-110 left-0 flex  justify-center  items-center        backdrop-blur-xs backdrop-brightness-40  px-8      max-sm:px-4">
				<div
					className={`w-[450px]     mid-popup   duration-300 ease-in-out flex flex-col py-6 px-6  gap-4   rounded-lg bg-navy   items-center radial border-grey border  max-2xs:w-full  max-sm:px-4 max-sm:py-4  max-sm:gap-2 ${
						authPopupVisible ? '' : 'mid-popup-hidden'
					}`}
					ref={authPopupRef}
				>
					<div className="flex w-full justify-between">
						{!resetPassword &&
							[
								'verify-email',
								'forgot-password',
								'forgot-password-verify-email',
								'forgot-password-reset',
							].includes(currentAction) && (
								<button
									className="p-2  rounded-full bg-gray-950 self-end hover:bg-grey"
									onClick={() => {
										setCurrentAction(previousActions[currentAction]);
										setError('');
									}}
								>
									<BiArrowBack className="w-5  text-white" />
								</button>
							)}

						<button
							className="p-2  rounded-full bg-blue  hover:bg-darkBlue self-end duration-150"
							onClick={toggleAuthPopup}
						>
							<FaXmark className="text-white text-xl max-sm:text-sm" />
						</button>
					</div>
					<div className="flex items-center   flex-col gap-3  w-[350px]  max-2xs:w-full max-sm:gap-1">
						<div className="flex flex-col gap-2 text-center">
							<h1 className="text-2xl text-fade-blue poppins-bold  max-sm:text-xl">
								{currentAction === 'log-in' && 'Log In'}
								{currentAction === 'sign-up' && 'Sign Up'}
								{['verify-email', 'forgot-password-verify-email'].includes(
									currentAction,
								) && 'Verify Email'}
								{currentAction === 'forgot-password-reset' && 'Reset Password'}
								{currentAction === 'forgot-password' && 'Reset Password'}
							</h1>
							<p className="text-sm text-silver">
								{currentAction === 'log-in' ||
									(currentAction === 'sign-up' &&
										'Join the community or log in to stay connected')}

								{['verify-email', 'forgot-password-verify-email'].includes(
									currentAction,
								) && (
									<span>{`Enter the 4-digit code we sent to ${email}`}</span>
								)}
							</p>
						</div>
						{![
							'verify-email',
							'forgot-password',
							'forgot-password-verify-email',
							'forgot-password-reset',
						].includes(currentAction) && (
							<>
								<button
									className="w-full h-[40px] rounded-full px-4 flex items-center justify-center gap-2 relative bg-deepBlue hover:bg-grey duration-150"
									onClick={() => handleSignIn()}
								>
									<Image src={google} alt="google" className="w-5 " />
									<span className="text-sm text-silver  self-center sf-reg">
										Continue with Google
									</span>
								</button>
								<span className="text-center  uppercase text-sm text-fade-blue ">
									or
								</span>
							</>
						)}

						{currentAction === 'log-in' && (
							<Login
								email={email}
								setEmail={setEmail}
								password={password}
								setPassword={setPassword}
								error={error}
								loading={submitting}
								success={successful}
								setError={setError}
								errorContent="All fields are required"
								setCurrentAction={setCurrentAction}
								submit={handleSubmit}
							/>
						)}
						{currentAction === 'sign-up' && (
							<Signup
								email={email}
								setEmail={setEmail}
								password={password}
								setPassword={setPassword}
								error={error}
								setError={setError}
								errorContent="All fields are required"
								setCurrentAction={setCurrentAction}
								firstName={firstName}
								setFirstName={setFirstName}
								lastName={lastName}
								setLastName={setLastName}
								submit={handleSubmit}
								success={successful}
								loading={submitting}
							/>
						)}
						{currentAction === 'verify-email' && (
							<VerifyEmail
								error={error}
								setError={setError}
								isVerifying={submitting}
								verificationCode={verificationCode}
								setVerificationCode={setVerificationCode}
								success={successful}
								submit={handleSubmit}
								auth_action="verify-email"
							/>
						)}
						{currentAction === 'forgot-password' && (
							<ForgotPassword
								error={error}
								setEmail={setEmail}
								email={email}
								setError={setError}
								isChecking={submitting}
								success={successful}
								submit={handleSubmit}
							></ForgotPassword>
						)}
						{currentAction === 'forgot-password-verify-email' && (
							<VerifyEmail
								error={error}
								setError={setError}
								isVerifying={submitting}
								verificationCode={verificationCode}
								setVerificationCode={setVerificationCode}
								success={successful}
								submit={handleSubmit}
								auth_action="forgot-password-verify-email"
							/>
						)}
						{currentAction === 'forgot-password-reset' && (
							<ResetPassword
								email={email}
								password={password}
								setPassword={setPassword}
								setError={setError}
								error={error}
								setCurrentAction={setCurrentAction}
								submit={handleSubmit}
								success={successful}
								loading={submitting}
							/>
						)}
					</div>
				</div>
			</div>
		)
	);
};

export default AuthPrompt;


