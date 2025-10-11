import { useState } from 'react';
import { FaCheck } from 'react-icons/fa';
import { GrUserAdmin } from 'react-icons/gr';
import { toast } from 'react-toastify';
import AsyncButton from '~/app/components/buttons/async-button';
import { useAuthContext } from '~/app/context/auth-context';
import { user_type } from '~/types/user';
import { apiRequest } from '~/utils/api-request';
interface setRoleProps {
	rolePromptVisible: boolean;
	rolePrompt: boolean;
	toggleSetRole: () => void;
	setRoleRef: React.RefObject<HTMLDivElement | null>;
	member: user_type;
	setDisableToggle: React.Dispatch<React.SetStateAction<boolean>>;
}
const SetRole = ({
	rolePromptVisible,
	rolePrompt,
	toggleSetRole,
	setRoleRef,
	member,
	setDisableToggle,
}: setRoleProps) => {
	const [error, setError] = useState('');
	const [submitting, setSubmitting] = useState(false);
	const [successful, setSuccessful] = useState(false);
	const { user } = useAuthContext();
	const handleSetRole = async () => {
		if (submitting) return;

		if (!member?._id) {
			setError('Missing required fields');
			return;
		}

		setSubmitting(true);
		setDisableToggle(true);
		await apiRequest({
			url: '/api/members/set-role',
			method: 'PATCH',
			body: {
				memberId: member?._id,
				adminId: user?._id,
			},
			onSuccess: () => {
				window.dispatchEvent(new CustomEvent('userUpdated'));
				window.dispatchEvent(new CustomEvent('refetchMembers'));
				setSuccessful(true);
				setTimeout(() => {
					toggleSetRole();
				}, 500);
				toast.success(
					`${member?.first_name} ${member?.last_name || ''} made ${
						member?.role === 'member' ? 'an admin' : 'a member'
					}`,
					{
						icon: <FaCheck color="white" />,
					},
				);
			},
			onError: (error) => {
				setError(error);
			},
			onFinally: () => {
				setSuccessful(false);
				setSubmitting(false);
				setDisableToggle(false);
			},
		});
	};
	return (
		rolePrompt && (
			<div className="fixed bottom-[0px]  h-full w-full  z-50 left-0 flex  justify-center  items-center        backdrop-brightness-50  px-8     xs:px-0">
				<div
					className={`w-[350px]     mid-popup   duration-300 ease-in-out flex flex-col py-6 px-6  gap-4   rounded-lg bg-navy radial border border-grey  items-center      ${
						rolePromptVisible ? '' : 'mid-popup-hidden'
					}  `}
					ref={setRoleRef}
				>
					<div className="flex flex-col gap-3 items-center w-full">
						<GrUserAdmin className="text-2xl text-blue" />

						<div className="flex flex-col gap-2 ">
							<h1 className="text-2xl text-center text-fade-blue">
								{member?.role !== 'member' ? 'Demote' : 'Promote'}
							</h1>
							{member?.role !== 'member' ? (
								<p className="text-sm  text-center text-silver">
									You’re about to set{' '}
									<span className="neue-bold">
										{` ${member?.first_name} ${member?.last_name} `}{' '}
									</span>
									to a member. He/She would be will no longer be able to edit,
									delete and add articles. Are you sure you want to?
								</p>
							) : (
								<p className="text-sm  text-center text-silver">
									You’re about to set{' '}
									<span className="neue-bold">
										{`${member?.first_name} ${member?.last_name}`}{' '}
									</span>
									to an admin. He/She would be able to edit, delete and add
									categories or articles. Are you sure you want to?
								</p>
							)}
						</div>
					</div>
					{error && (
						<h1 className="text-[11px] text-red-300 text-center">{error}</h1>
					)}
					<div className="flex gap-4 w-full">
						<AsyncButton
							action={
								member?.role !== 'member' ? 'Set as member' : 'Set as admin'
							}
							classname_override="!h-[40px] text-xs"
							loading={submitting}
							success={successful}
							disabled={submitting}
							onClick={handleSetRole}
						/>

						<button
							className="flex items-center justify-center  gap-2  h-[40px]  px-2 rounded-md bg-gray-700     duration-150 hover:bg-gray-800    text-center w-[40%] text-white  text-xs "
							onClick={toggleSetRole}
						>
							Cancel
						</button>
					</div>
				</div>
			</div>
		)
	);
};

export default SetRole;

