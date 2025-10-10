import { useState } from 'react';
import ClassicInput from '../inputs/classic-input';
import AsyncButton from '../buttons/async-button';

interface loginProps {
	email: string;
	setEmail: React.Dispatch<React.SetStateAction<string>>;
	password: string;
	setPassword: React.Dispatch<React.SetStateAction<string>>;
	error?: string;
	setError?: React.Dispatch<React.SetStateAction<string>>;
	errorContent?: string;
	// currentAction?: string;
	setCurrentAction?: React.Dispatch<React.SetStateAction<string>>;
	setPreviousAction?: React.Dispatch<React.SetStateAction<string>>;
	submit: (action: string) => void;
	loading: boolean;
	success: boolean;
}

const Login = ({
	email,
	password,
	setEmail,
	setPassword,
	setError,
	errorContent,
	error,
	// currentAction,
	setCurrentAction,
	submit,
	loading,
	success,
}: loginProps) => {
	const [passwordVisible, setPasswordVisible] = useState(false);
	const toggleVisibility = () => {
		setPasswordVisible(!passwordVisible);
	};

	const emailErrors = [
		'No account found with this email address.',
		'This email is registered with Google. Please log in using Google or set a password.',
	];
	const handledErrors = [
		...emailErrors,
		'Incorrect password. Please try again.',
	];
	return (
		<div className="flex items-center w-full flex-col gap-3  max-sm:gap-2 ">
			<ClassicInput
				value={email}
				setValue={setEmail}
				setError={setError}
				errorContent={errorContent}
				error={error}
				label="email*"
				inputType="email"
				required={true}
				name="email"
				serverError={emailErrors}
			/>

			<ClassicInput
				value={password}
				label="password*"
				setValue={setPassword}
				setError={setError}
				errorContent={errorContent}
				error={error}
				name="password"
				inputType={passwordVisible ? 'text' : 'password'}
				password
				toggleVisibility={toggleVisibility}
				passwordVisible={passwordVisible}
				serverError={['Incorrect password. Please try again.']}
			/>

			<div className="flex flex-col gap-3 w-full  text-sm pt-5">
				<button
					className="text-blue hover:text-darkBlue   self-start"
					onClick={() => {
						setCurrentAction?.('forgot-password');
						setError?.('');
					}}
				>
					Set or Forgot Password?
				</button>
				<div>
					<span className="text-silver">New to WeFitHost Blog? </span>

					<button
						className="text-blue hover:text-darkBlue"
						onClick={() => {
							setCurrentAction?.('sign-up');
							setError?.('');
						}}
					>
						Sign Up
					</button>
				</div>
			</div>
			{error && !handledErrors.includes(error) && (
				<h1 className="text-red text-center text-sm ">{error}</h1>
			)}

			<AsyncButton
				action="Log In"
				loading={loading}
				classname_override="max-sm:!h-[40px] hover:!bg-darkBlue duration-150 "
				success={success}
				disabled={!email || !password}
				onClick={() => submit('log-in')}
			/>
		</div>
	);
};

export default Login;

