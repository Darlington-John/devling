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

const UpdateBioPrompt = ({
	isVisible,
	isActive,
	ref,
	togglePopup,
	setDisable,
}: PopupPrompt) => {
	const { user } = useAuthContext();
	const [bio, setBio] = useState(user?.bio || '');
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const [successful, setSuccessful] = useState(false);
	const updateBio = async () => {
		if (!user) {
			return;
		}
		if (loading) {
			return;
		}
		if (!bio) {
			setError('Bio is required');
			return;
		}
		setLoading(true);
		setError('');
		setDisable(true);
		await apiRequest({
			url: '/api/auth/update-bio',
			method: 'PATCH',
			body: { userId: user._id, bio },
			onSuccess: (response) => {
				setSuccessful(true);
				setBio('');

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
			<div className="fixed top-[0px]  h-full w-full  z-50 left-0 flex  justify-center  items-center backdrop-brightness-50  px-8     xs:px-0">
				<div
					className={`w-[350px]  mid-popup   duration-300 ease-in-out flex flex-col py-6 px-6  gap-6   rounded-lg bg-navy radial border border-grey   items-center font-normal     ${
						isVisible ? '' : 'mid-popup-hidden'
					}`}
					ref={ref}
				>
					<div className="flex items-center flex-col gap-0 w-full leading-none">
						<h3 className="text-2xl sf-bold text-center text-fade-blue">
							Update Bio
						</h3>
						<p className=" text-center text-xs text-silver">
							A bio tells the reader more about you and allows them to see
							things from your perspective or point of view.
						</p>
					</div>
					<ClassicInput
						value={bio}
						setValue={setBio}
						textarea
						maxlength={200}
						error={error}
						setError={setError}
						placeholder="John Doe is a Lagos-based UX Designer creating intuitive digital experiences for global brands."
						classname_override="!text-xs"
						autofocus={true}
						name="bio"
						errorContent="Bio is required"
						serverError={['User  not authenticated']}
						note="This will only be visible on the article you write"
					/>

					<div className="gap-2 flex w-full">
						<AsyncButton
							classname_override="!h-[40px] !rounded-md"
							action="Update"
							disabled={!bio}
							loading={loading}
							success={successful}
							onClick={updateBio}
						/>
						<button
							className="bg-gray-600 text-center w-full  hover:bg-gray-500   !rounded-md text-sm text-white duration-150"
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

export default UpdateBioPrompt;

