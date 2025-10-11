'use client';
import Image from 'next/image';
import Link from 'next/link';
import { toggleOverlay } from '~/utils/toggle-overlay';
import logo from '~/public/icons/logo.svg';
import { useUtilsContext } from '../../context/utils-context';
import { IoMdClose, IoMdMenu } from 'react-icons/io';
import { motion } from 'motion/react';
import { useAuthContext } from '../../context/auth-context';
import ProfileDropdown from './profile-dropdown';
import { usePathname } from 'next/navigation';
import CategoriesDropdown from './categories-dropdown';
const Header = () => {
	const { overlayOpen, setOverlayOpen, toggleAuthPopup, setCurrentAction } =
		useUtilsContext();

	const { user } = useAuthContext();
	const handleToggleOverlay = () => {
		toggleOverlay();
		setOverlayOpen(!overlayOpen);
	};
	const linkname = usePathname();
	return (
		<header
			className={`py-4  mx-auto w-full sticky top-0  bg-dark-navy  z-50 flex items-center justify-center px-16 max-xl:px-10 max-xs:px-5 max-2xl:py-2 border-b-grey border-b border-dashed ${
				linkname.startsWith('/admin') && 'hidden'
			}`}
		>
			<div className="max-w-[1500px] flex items-center justify-between w-full">
				<Link href="/">
					<Image
						src={logo}
						alt="devling logo"
						className="w-[200px]  max-2xl:w-[140px]"
					/>
				</Link>

				<div className="flex items-center gap-5 text-[20px] font-light max-2xl:text-base  max-xs:text-sm max-2xs:hidden">
					<CategoriesDropdown />
					<Link
						href="https://darlington-john.framer.website/"
						className="link-style  text-silver "
						target="_blank"
					>
						About me
					</Link>
					{user ? (
						<ProfileDropdown />
					) : (
						<motion.button
							whileTap={{ scale: 0.9 }}
							onClick={() => {
								toggleAuthPopup();
								setCurrentAction('log-in');
							}}
							className=" h-[45px] text-center bg-blue text-white text-[20px] rounded-sm px-5 duration-150 hover:bg-darkBlue max-2xl:text-base  max-xs:text-sm max-lg:h-[35px] max-md:px-3 "
						>
							Sign In
						</motion.button>
					)}
				</div>
				<div className="max-2xs:flex items-center gap-1 hidden">
					<div className="max-2xs:flex">
						{' '}
						{user ? (
							<ProfileDropdown />
						) : (
							<motion.button
								whileTap={{ scale: 0.9 }}
								onClick={() => {
									toggleAuthPopup();
									setCurrentAction('log-in');
								}}
								className=" h-[45px] text-center bg-blue text-white text-[20px] rounded-sm px-5 duration-150 hover:bg-darkBlue max-2xl:text-base  max-xs:text-sm max-lg:h-[35px] max-xs:px-2"
							>
								Sign In
							</motion.button>
						)}
					</div>

					<button
						className=" p-2  rounded-sm  max-2xs:flex"
						onClick={handleToggleOverlay}
					>
						{overlayOpen ? (
							<IoMdClose className="text-2xl text-silver " />
						) : (
							<IoMdMenu className="text-2xl text-silver" />
						)}
					</button>
				</div>
			</div>
		</header>
	);
};

export default Header;

