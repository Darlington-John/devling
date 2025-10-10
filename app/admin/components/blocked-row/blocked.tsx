import { usePopup } from '~/utils/toggle-popups';
import { FaEllipsisH } from 'react-icons/fa';
import { formatDate } from '~/utils/format-date';
import { useAuthContext } from '~/app/context/auth-context';
import UnblockPrompt from './unblock';
import { blocked_type } from '~/types/blocked';

interface blockedProps {
	blocked: blocked_type;
}
const BlockedRow = ({ blocked }: blockedProps) => {
	const { user } = useAuthContext();

	const {
		isVisible: unblockPromptVisible,
		isActive: unblockPrompt,
		togglePopup: toggleUnBlockPrompt,
		ref: unblockPromptRef,
		setDisableToggle: disableUnBlockPrompt,
	} = usePopup();
	return (
		<>
			<div
				className="w-full flex gap-1 bg-navy border-t    border-t-grey hover:bg-deepBlue cursor-pointer"
				key={blocked._id}
				onClick={toggleUnBlockPrompt}
			>
				<div className="w-[25%] h-[40px] flex items-center  px-3  gap-2">
					<span className="text-sm   max-sm:text-xs text-silver">
						{blocked?.blocked?.email || blocked?.ip_address}
					</span>
				</div>
				<div className="w-[30%] h-[40px] flex items-center  px-3 text-sm text-silver">
					{blocked?.blocked_by.first_name} {blocked?.blocked_by.last_name || ''}
				</div>
				<div className="w-[20%] h-[40px]  px-3 text-sm flex items-center">
					<h1 className={`text-xs  rounded-sm text-silver`}>
						{blocked?.reason ?? 'not given'}
					</h1>
				</div>
				<div className="w-[15%] h-[40px] flex items-center  px-3 text-sm text-silver">
					{formatDate(blocked?.createdAt as string, true)}
				</div>
				<div className="w-[10%] h-[40px] flex items-center  px-3 text-sm text-end justify-end relative text-silver">
					{user?.role === 'super_admin' && (
						<FaEllipsisH
							className="text-gray-500 cursor-pointer "
							onClick={toggleUnBlockPrompt}
						/>
					)}
				</div>
			</div>

			<UnblockPrompt
				unblockPromptVisible={unblockPromptVisible}
				unblockPrompt={unblockPrompt}
				toggleUnblockPrompt={toggleUnBlockPrompt}
				unblockPromptRef={unblockPromptRef}
				blocked={blocked}
				setDisableToggle={disableUnBlockPrompt}
			/>
		</>
	);
};

export default BlockedRow;






