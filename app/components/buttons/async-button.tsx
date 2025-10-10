import Image from 'next/image';
import { FaCheck } from 'react-icons/fa';
import loader from '~/public/icons/spin-white.svg';
interface asyncProps {
	className?: string;
	action: string;
	loading: boolean;
	success: boolean;
	disabled?: boolean;
	classname_override?: string;
	buttonType?: 'button' | 'submit' | 'reset' | undefined;
	onClick: React.MouseEventHandler<HTMLButtonElement>;
}
const AsyncButton = ({
	className = '  flex items-center justify-center    rounded-sm   text-center bg-blue  text-white  w-full h-[45px] text-sm font-semibold hover:bg-darkBlue duration-200',
	action,
	loading,
	success,
	disabled,
	classname_override,
	onClick,
	buttonType = 'button',
}: asyncProps) => {
	return (
		<button
			className={`${classname_override}  ${className} ${
				disabled && 'opacity-40'
			}`}
			disabled={disabled}
			onClick={onClick}
			type={buttonType}
		>
			{success ? (
				<FaCheck className="text-sm" />
			) : loading ? (
				<Image src={loader} className="w-7" alt="" />
			) : (
				action
			)}
		</button>
	);
};

export default AsyncButton;

