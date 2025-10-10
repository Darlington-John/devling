import { useState } from 'react';
import { FaCheck } from 'react-icons/fa';
import { toast } from 'react-toastify';
import AsyncButton from '~/app/components/buttons/async-button';
import { useAuthContext } from '~/app/context/auth-context';
import { apiRequest } from '~/utils/api-request';
import ClassicInput from '../inputs/classic-input';

interface PopupPrompt {
	isVisible: boolean;
	isActive: boolean;
	ref: React.RefObject<HTMLDivElement | null>;
	togglePopup: () => void;
	setDisable: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditName = ({
	isVisible,
	isActive,
	ref,
	togglePopup,
	setDisable,
}: PopupPrompt) => {
	const { user } = useAuthContext();
	const [firstName, setFirstName] = useState(user?.first_name || '');
	const [lastName, setLastName] = useState(user?.last_name || '');
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const [successful, setSuccessful] = useState(false);
	const editName = async () => {
		if (!user) {
			return;
		}
		if (loading) {
			return;
		}
		if (!firstName) {
			setError('First name is required');
			return;
		}
		setLoading(true);
		setError('');
		setDisable(true);
		await apiRequest({
			url: '/api/auth/change-name',
			method: 'PATCH',
			body: { userId: user._id, firstName, lastName },
			onSuccess: (response) => {
				setSuccessful(true);
				setFirstName('');
				setLastName('');
				toast.success(response.message, {
					icon: <FaCheck color="white" />,
				});
				window.dispatchEvent(new CustomEvent('userUpdated'));
				setTimeout(() => {
					togglePopup();
					setSuccessful(false);
				}, 3000);
			},
			onError: (error) => {
				setError(error);
			},
			onFinally: () => {
				setLoading(false);
				setDisable(false);
			},
		});
	};
	return (
		isActive && (
			<div className="fixed top-[0px]  h-full w-full  z-50 left-0 flex  justify-center  items-center        backdrop-brightness-50  px-8     xs:px-0">
				<div
					className={`w-[350px]     mid-popup   duration-300 ease-in-out flex flex-col py-6 px-6  gap-4   rounded-lg bg-navy border border-grey radial   items-center font-normal     ${
						isVisible ? '' : 'mid-popup-hidden'
					}`}
					ref={ref}
				>
					<div className="flex items-center flex-col gap-0 w-full leading-none">
						<h3 className="text-2xl sf-bold text-center text-fade-blue">
							Edit Name
						</h3>
						<p className="text-silver text-center text-sm ">
							Enter new name below
						</p>
					</div>
					<ClassicInput
						value={firstName}
						setValue={setFirstName}
						error={error}
						setError={setError}
						placeholder="first name"
						autofocus={true}
						name="firstName"
						errorContent="Name is required"
						serverError={['User  not authenticated']}
					/>
					<ClassicInput
						value={lastName}
						setValue={setLastName}
						error={error}
						setError={setError}
						placeholder="last name"
						name="lastName"
						serverError={['User  not authenticated']}
					/>
					<div className="gap-2 flex w-full">
						<AsyncButton
							classname_override="!h-[40px] !rounded-md"
							action="Edit"
							disabled={!firstName}
							loading={loading}
							success={successful}
							onClick={editName}
						/>
						<button
							className="bg-gray-500 text-center w-full  hover:outline outline-gray-600   !rounded-md text-sm text-white duration-150"
							onClick={togglePopup}
							disabled={loading}
						>
							Cancel
						</button>
					</div>
				</div>
			</div>
		)
	);
};

export default EditName;

