import ProfileDropdown from '~/app/components/header/profile-dropdown';
import { IoMdClose, IoMdMenu } from 'react-icons/io';
import { useUtilsContext } from '~/app/context/utils-context';
import { toggleAdminOverlay } from '~/utils/toggle-overlay';
import Link from 'next/link';

import logo from '~/public/icons/logo.svg';
import Image from 'next/image';
const Header = () => {
	const { adminOverlayOpen, setAdminOverlayOpen } = useUtilsContext();

	const handleToggleAdminOverlay = () => {
		toggleAdminOverlay();

		setAdminOverlayOpen(!adminOverlayOpen);
	};
	return (
		<header className="py-2  mx-auto w-full  bg-dark-navy  z-50 flex items-center justify-between px-4 max-xl:px-10 max-xs:px-5 max-2xl:py-2 gap-3 sticky top-0 border-b-grey border-b border-dashed ">
			<div className="items-center justify-center    flex-col invisible max-lg:flex max-lg:visible">
				<Link href={'/'}>
					<Image
						src={logo}
						alt=""
						className="w-[160px] max-xl:w-[120px] shrink-0"
						priority
					/>
				</Link>
				<h1 className="text-xs text-fade-blue neue  ">Admin Dashboard</h1>
			</div>
			<div className="flex items-center gap-2 justify-self-end">
				<ProfileDropdown />

				<button
					className=" p-2  rounded-sm  max-lg:flex hidden"
					onClick={handleToggleAdminOverlay}
				>
					{adminOverlayOpen ? (
						<IoMdClose className="text-2xl text-silver " />
					) : (
						<IoMdMenu className="text-2xl text-silver" />
					)}
				</button>
			</div>
		</header>
	);
};

export default Header;

