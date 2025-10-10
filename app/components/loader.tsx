import React from 'react';
import Image from 'next/image';
import logo from '~/public/icons/spin-purple.svg';
import errorIcon from '~/public/icons/error.svg';
interface LoaderProps {
	fetching: boolean;
	error?: string;
	children: React.ReactNode;
	classname_override?: string;
	try_again?: () => void;
	message?: string;
}

const Loader: React.FC<LoaderProps> = ({
	fetching,
	error,
	children,
	classname_override,
	try_again,
	message = 'Oops! We ran into a server error.',
}) => {
	const renderErrorState = () => (
		<div className=" min-h-[50vh] w-full flex items-center justify-center  flex-col">
			<div className="flex  flex-col gap-3 bg-deepBlue    rounded-2xl  w-[400px] py-2 max-xs:w-full max-xs:px-4">
				<div className="flex gap-4 items-start    p-4  w-full" role="alert">
					<Image src={errorIcon} className="w-8 max-sm:w-6" alt="Error icon" />
					<div className="flex flex-col gap-1">
						<p className=" text-xl text-fade-blue      spaced leading-none max-sm:text-base">
							{message}
						</p>
						<p className="text-sm  normal-case  tracking-normal text-silver line-clamp-3">
							{error}
						</p>
					</div>
				</div>
				<div className="w-full  items-center justify-start  px-4 flex gap-2">
					<button
						className="h-[30px]  px-3 text-xs bg-blue rounded-sm   hover:ring ring-blue ring-offset-1  duration-150 text-white "
						onClick={try_again ? try_again : () => window.location.reload()}
					>
						Try again
					</button>
				</div>
			</div>
		</div>
	);

	const renderLoadingState = () => (
		<div
			className={`${classname_override}   h-[50vh] w-full flex items-center justify-center  `}
			role="status"
			aria-live="polite"
		>
			<div className=" flex items-center justify-center  w-20  h-20   relative  ">
				<div className="bg-deepBlue p-5 absolute  animate-ping w-full h-full   "></div>
				<Image
					src={logo}
					alt="Loading"
					className="w-16 relative z-10 max-md:w-10 "
					priority
				/>
			</div>
		</div>
	);
	let content;

	if (error) {
		content = renderErrorState();
	} else if (fetching) {
		content = renderLoadingState();
	} else {
		content = children;
	}

	return content;
};

export default Loader;

