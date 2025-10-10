import { CiLogout } from 'react-icons/ci';
import { MdOutlineKeyboardArrowRight } from 'react-icons/md';
import { useAuthContext } from '~/app/context/auth-context';
import { formatDate } from '~/utils/format-date';
import { usePopup } from '~/utils/toggle-popups';
import LogoutPrompt from './logout-prompt';
import EditName from './edit-name-prompt';
import EditProfile from './edit-profile';
import { useUtilsContext } from '~/app/context/utils-context';
import Link from 'next/link';
import { FaAngleDown } from 'react-icons/fa';
import UpdateBioPrompt from './update-bio-prompt';

const ProfileDropdown = () => {
	const { user } = useAuthContext();
	const { toggleAuthPopup, setResetPassword, setCurrentAction } =
		useUtilsContext();
	const {
		isActive: logoutPrompt,
		isVisible: logoutPromptVisible,
		togglePopup: toggleLogoutPrompt,
		ref: logoutPromptRef,
	} = usePopup();
	const {
		isActive: changeNamePrompt,
		isVisible: changeNamePromptVisible,
		togglePopup: toggleChangeNamePrompt,
		ref: changeNamePromptRef,
		setDisableToggle: disableChangeNamePrompt,
	} = usePopup();
	const {
		isActive: changeProfilePrompt,
		isVisible: changeProfilePromptVisible,
		togglePopup: toggleChangeProfilePrompt,
		ref: changeProfilePromptRef,
		setDisableToggle: disableChangeProfilePrompt,
	} = usePopup();
	const {
		isActive: profileDropdown,
		isVisible: profileDropdownVisible,
		togglePopup: toggleProfileDropdown,
		ref: profileDropdownRef,
	} = usePopup();
	const {
		isActive: changeBioPrompt,
		isVisible: changeBioPromptVisible,
		togglePopup: toggleChangeBioPrompt,
		ref: changeBioPromptRef,
		setDisableToggle: disableChangeBioPrompt,
	} = usePopup();
	return (
		<>
			<div className="relative">
				<div
					className="text-sm  flex gap-2 items-center  py-1 px-2 rounded-full bg-navy radial border border-grey  cursor-pointer  max-sm:py-0 max-sm:px-0"
					onClick={toggleProfileDropdown}
				>
					{/* eslint-disable-next-line */}
					<img
						src={user?.profile ? user.profile : '/icons/default-user.svg'}
						className="w-6 h-6 object-cover rounded-full "
						alt="profile"
					/>
					<h3 className="text-silver  max-2xl:text-base  max-xs:text-sm text-base leading-0 max-sm:hidden flex ">
						{user?.first_name ?? user?.email}
					</h3>
					<FaAngleDown
						className={`duration-150 text-silver text-base font-light max-sm:hidden ${
							profileDropdownVisible ? 'rotate-180' : ''
						}`}
					/>
				</div>
				{profileDropdown && (
					<div
						className={`w-[400px]  border border-grey   rounded-lg  py-4 px-6  flex flex-col gap-4  bg-navy radial     shadow-lg duration-300 absolute top-10 right-0  z-20   font-normal max-2xs:right-[50%] max-2xs:translate-x-[-50%] max-2xs:transform max-2xs:left-[50%] max-2xs:fixed max-2xs:top-14 max-2xs:w-[350px] ${
							profileDropdownVisible ? 'opacity-100' : 'opacity-0'
						}`}
						ref={profileDropdownRef}
					>
						<h3 className="text-xl  text-fade-blue ">Your account</h3>
						<div className="flex flex-col w-full gap-1">
							<div className="flex  items-center gap-3 py-2 px-3   bg-deepBlue rounded-lg  border-gray-400 ">
								{/* eslint-disable-next-line */}
								<img
									src={user?.profile ? user.profile : '/icons/default-user.svg'}
									className="w-10  h-10 object-cover rounded-full cursor-pointer "
									onClick={toggleChangeProfilePrompt}
									alt="profile"
								/>
								<div className="flex flex-col items-start line-clamp-1 ">
									<h3 className="text-[16px] leading-[24px] line-clamp-1 text-silver">
										{user?.first_name} {user?.last_name}
									</h3>
									{user?.first_name && (
										<h3 className="text-sm leading-[20px] text-silver">
											{user?.email}
										</h3>
									)}
								</div>
							</div>
							<div className="flex items-center justify-between">
								<h3 className="text-sm text-silver py-1 px-3 ">
									joined{' '}
									<span className=" text-blue">
										{formatDate(user?.createdAt as string)}
									</span>
								</h3>

								{user?.role !== 'member' && (
									<Link
										href="/admin"
										className={`text-xs px-2 rounded-sm
    ${
			user?.role === 'super_admin'
				? 'text-[hsl(308,100%,97%)] bg-[#783A71]'
				: 'text-[#FFFBDB] bg-[#a37a00]'
		}`}
									>
										{user?.role}
									</Link>
								)}
							</div>
							<div className="w-full flex flex-col gap-2 ">
								<button
									className="flex items-center bg-deepBlue  justify-between p-3 rounded-lg outline-none duration-150  hover:bg-grey text-silver"
									onClick={toggleChangeNamePrompt}
								>
									<h3 className="text-sm">
										{user?.first_name ? 'Change name' : 'Enter your name'}
									</h3>
									<MdOutlineKeyboardArrowRight className="text-sm " />
								</button>
								<button
									className="flex items-center bg-deepBlue justify-between p-3 rounded-lg outline-none  hover:bg-grey  duration-150 text-silver "
									onClick={toggleChangeProfilePrompt}
								>
									<h3 className="text-sm">Change profile</h3>
									<MdOutlineKeyboardArrowRight className="text-sm " />
								</button>
								{user?.role !== 'member' && (
									<button
										className="flex items-center bg-deepBlue  justify-between p-3 rounded-lg outline-none  hover:bg-grey text-silver  duration-150  "
										onClick={() => {
											toggleChangeBioPrompt();
										}}
									>
										<h3 className="text-sm">
											{' '}
											{user?.bio ? 'Edit bio' : 'Add a bio'}
										</h3>
										<MdOutlineKeyboardArrowRight className="text-sm " />
									</button>
								)}

								<button
									className="flex items-center bg-deepBlue  justify-between p-3 rounded-lg outline-none  hover:bg-grey  duration-150  text-silver"
									onClick={() => {
										toggleAuthPopup();
										setResetPassword(true);
										setCurrentAction('forgot-password');
									}}
								>
									<h3 className="text-sm">
										{' '}
										{user?.password ? 'Change password' : 'Set a password'}
									</h3>
									<MdOutlineKeyboardArrowRight className="text-sm " />
								</button>
							</div>
						</div>
						<button
							className="bg-blue  rounded-full w-full  flex items-center justify-center  h-[40px] gap-2 duration-300 hover:ring  ring-blue ring-offset-1"
							onClick={() => {
								toggleLogoutPrompt();
								setCurrentAction('log-in');
								setResetPassword(false);
							}}
						>
							<CiLogout className="text-white" />
							<span className="norm-mid text-white text-sm">Log Out</span>
						</button>
					</div>
				)}
			</div>

			<LogoutPrompt
				logoutPrompt={logoutPrompt}
				logoutPromptRef={logoutPromptRef}
				togglePopup={toggleLogoutPrompt}
				isLogoutPromptVisible={logoutPromptVisible}
			/>
			<EditName
				isActive={changeNamePrompt}
				isVisible={changeNamePromptVisible}
				togglePopup={toggleChangeNamePrompt}
				ref={changeNamePromptRef}
				setDisable={disableChangeNamePrompt}
			/>
			<EditProfile
				isVisible={changeProfilePromptVisible}
				isActive={changeProfilePrompt}
				ref={changeProfilePromptRef}
				togglePopup={toggleChangeProfilePrompt}
				setDisable={disableChangeProfilePrompt}
			/>
			<UpdateBioPrompt
				isVisible={changeBioPromptVisible}
				isActive={changeBioPrompt}
				ref={changeBioPromptRef}
				togglePopup={toggleChangeBioPrompt}
				setDisable={disableChangeBioPrompt}
			/>
		</>
	);
};

export default ProfileDropdown;

