import { useState } from 'react';
import ClassicInput from '../inputs/classic-input';
import AsyncButton from '../buttons/async-button';
interface SignupProps {
	email: string;
	setEmail: React.Dispatch<React.SetStateAction<string>>;
	password: string;
	setPassword: React.Dispatch<React.SetStateAction<string>>;
	error?: string;
	setError?: React.Dispatch<React.SetStateAction<string>>;
	errorContent?: string;
	// currentAction?: string;
	setCurrentAction?: React.Dispatch<React.SetStateAction<string>>;
	firstName: string;
	setFirstName: React.Dispatch<React.SetStateAction<string>>;
	lastName: string;
	setLastName: React.Dispatch<React.SetStateAction<string>>;
	submit: (action: string) => void;
	loading: boolean;
	success: boolean;
}

const Signup = ({
	email,
	password,
	setEmail,
	setPassword,
	setError,
	errorContent,
	error,
	// currentAction,
	setCurrentAction,
	firstName,
	setFirstName,
	submit,
	success,
	loading,
	lastName,
	setLastName,
}: SignupProps) => {
	const [passwordVisible, setPasswordVisible] = useState(false);
	const toggleVisibility = () => {
		setPasswordVisible(!passwordVisible);
	};
	return (
		<div className="flex items-center w-full flex-col gap-3 ">
			<div className="flex gap-2">
				<ClassicInput
					value={firstName}
					setValue={setFirstName}
					setError={setError}
					errorContent={errorContent}
					error={error}
					
					label="first name*"
					inputType="text"
					name="firstName"
				/>

				<ClassicInput
					value={lastName}
					setValue={setLastName}
					setError={setError}
					errorContent={errorContent}
					required={false}
					error={error}
					
					label="last name (optional)"
					inputType="text"
					name="lastName"
				/>
			</div>

			<ClassicInput
				value={email}
				setValue={setEmail}
				setError={setError}
				errorContent={errorContent}
				
				error={error}
				label="email*"
				inputType="email"
				name="email"
				serverError={['This email is already in use, login instead.']}
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
			/>

			<div className="flex flex-col gap-3 w-full  text-sm pt-5">
				<h1 className="text-silver">
					Already have an account?{' '}
					<button
						className="text-blue"
						onClick={() => {
							setCurrentAction?.('log-in');
							setError?.('');
						}}
					>
						Log In
					</button>
				</h1>
			</div>
			{error !== 'This email is already in use, login instead.' && (
				<h1 className="text-red text-center text-sm sf-light">{error}</h1>
			)}
			<AsyncButton
				onClick={() => submit('sign-up')}
				success={success}
				classname_override="hover:!bg-darkBlue duration-150"
				loading={loading}
				disabled={!email || !password || !firstName}
				action="Sign Up"
			/>
		</div>
	);
};

export default Signup;

