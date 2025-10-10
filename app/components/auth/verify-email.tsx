import AsyncButton from '../buttons/async-button';

interface verificationProps {
	error: string;
	setError: React.Dispatch<React.SetStateAction<string>>;
	isVerifying: boolean;
	verificationCode: string[];
	setVerificationCode: React.Dispatch<React.SetStateAction<string[]>>;
	success: boolean;
	auth_action: string;
	submit: (action: string) => void;
}

const VerifyEmail = ({
	error,
	setError,
	isVerifying,
	verificationCode,
	setVerificationCode,
	success,
	submit,
	auth_action,
}: verificationProps) => {
	const isVerificationCodeComplete = () => {
		return verificationCode.every((digit) => digit.length === 1);
	};

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement>,
		index: number,
	) => {
		setError('');
		const value = e.target.value;

		if (/^[0-9]$/.test(value) || value === '') {
			const newCode = [...verificationCode];
			newCode[index] = value;
			setVerificationCode(newCode);

			if (value && index < 5) {
				document.getElementById(`code-input-${index + 1}`)?.focus();
			}
		}
	};

	const handleKeyDown = (
		e: React.KeyboardEvent<HTMLInputElement>,
		index: number,
	) => {
		if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
			document.getElementById(`code-input-${index - 1}`)?.focus();
		}
	};
	const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
		e.preventDefault();
		const pastedData = e.clipboardData.getData('Text').trim();
		const isValid = /^[0-9]*$/.test(pastedData);

		if (isValid) {
			const newCode = [...verificationCode];
			pastedData.split('').forEach((char, i) => {
				if (i < newCode.length) newCode[i] = char;
			});
			setVerificationCode(newCode);

			const lastFilledIndex = Math.min(
				pastedData.length - 1,
				verificationCode.length - 1,
			);
			document.getElementById(`code-input-${lastFilledIndex}`)?.focus();
		}
	};
	return (
		<div className="flex items-center flex-col gap-4 w-full">
			<div className="flex flex-col w-full">
				<div className="flex justify-center  gap-2 w-full text-white">
					{verificationCode.map((digit, index) => (
						<input
							key={index}
							id={`code-input-${index}`}
							type="text"
							value={digit}
							onChange={(e) => handleChange(e, index)}
							onPaste={handlePaste}
							onKeyDown={(e) => handleKeyDown(e, index)}
							maxLength={1}
							className={`text-[22px]   outline-none px-2 py-3 rounded-md w-full bg-deepBlue text-center focus:ring-2 ring-blue h-[56px]  text-white  grow-0 shrink-0 max-w-[55px]  max-h-[56px]  ${
								error && 'border border-red'
							}`}
							placeholder="*"
						/>
					))}
				</div>
			</div>
			{error && (
				<div className="flex gap-2 items-center ">
					<div className="p-1  bg-pink rounded-full "></div>
					<h1 className="text-sm text-red">{error}</h1>
				</div>
			)}
			<AsyncButton
				action="Verify"
				loading={isVerifying}
				success={success}
				classname_override="hover:!bg-darkBlue duration-150"
				disabled={!isVerificationCodeComplete()}
				onClick={() => submit(auth_action)}
			/>
		</div>
	);
};

export default VerifyEmail;

