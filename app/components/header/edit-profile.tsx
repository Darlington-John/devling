import { useRef, useState } from 'react';
import { FaCheck } from 'react-icons/fa';
import { toast } from 'react-toastify';
import AsyncButton from '~/app/components/buttons/async-button';
import { useAuthContext } from '~/app/context/auth-context';
import { apiRequest } from '~/utils/api-request';
import { IoImageSharp } from 'react-icons/io5';
import CropImage from '../crop-image';

interface PopupPrompt {
	isVisible: boolean;
	isActive: boolean;
	ref: React.RefObject<HTMLDivElement | null>;
	togglePopup: () => void;
	setDisable: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditProfile = ({
	isVisible,
	isActive,
	ref,
	togglePopup,
	setDisable,
}: PopupPrompt) => {
	const { user } = useAuthContext();
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const [successful, setSuccessful] = useState(false);

	const [selecting, setSelecting] = useState(false);
	const [profileBlob, setProfileBlob] = useState<Blob | null>(null);
	const [profilePreview, setProfilePreview] = useState<string | null>(null);
	const [profileUrl, setProfileUrl] = useState<string | null>(null);
	const updateProfile = async () => {
		if (!user) {
			return;
		}
		if (loading) {
			return;
		}
		if (!profileUrl) {
			setError('No Avatar Selected');
			return;
		}
		setLoading(true);
		setError('');
		setDisable(true);
		const formData = new FormData();

		formData.append('userId', user._id);

		formData.append('uploaded_image', profileBlob as Blob);

		await apiRequest({
			url: '/api/auth/upload-profile',
			method: 'PATCH',
			body: formData,
			onSuccess: (response) => {
				setSuccessful(true);
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

	const inputProfileRef = useRef<HTMLInputElement | null>(null);
	const handleClickSelect = () => inputProfileRef.current?.click();
	const handleProfileFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;
		setSelecting(true);
		setError('');
		const reader = new FileReader();
		reader.onloadend = () => setProfileUrl(reader.result as string);
		reader.readAsDataURL(file);
	};

	return (
		isActive && (
			<div className="fixed top-[0px]  h-full w-full  z-50 left-0 flex  justify-center  items-center        backdrop-brightness-50  px-8     xs:px-0  ">
				{selecting ? (
					<CropImage
						selecting={selecting}
						setSelecting={setSelecting}
						ref={ref}
						setImagePreview={setProfilePreview}
						setImageBlob={setProfileBlob}
						imageUrl={profileUrl}
						setImageUrl={setProfileUrl}
						aspectRatio={1 / 1}
					/>
				) : (
					<div
						className={`w-[350px] mid-popup duration-300 ease-in-out flex flex-col py-6 px-6 gap-4 rounded-lg bg-navy border border-grey radial   items-center relative z-40 isolation-auto font-normal ${
							isVisible ? '' : 'mid-popup-hidden'
						}`}
						ref={ref}
					>
						<div className="flex items-center flex-col gap-0 w-full leading-none">
							<h3 className="text-2xl text-center text-fade-blue">
								Upload Image
							</h3>
						</div>

						<div className="flex flex-col gap-2 items-center justify-center">
							{profilePreview ? (
								// eslint-disable-next-line
								<img
									src={profilePreview}
									alt="icon"
									className="w-28  h-28  rounded-full "
								/>
							) : (
								<IoImageSharp className="w-28  h-28  text-silver object-cover" />
							)}
							<button
								className=" text-white link-style text-xs"
								onClick={handleClickSelect}
							>
								{profileUrl ? 'Choose another' : 'Select Image'}
							</button>
						</div>

						{error && <h3 className="text-xs text-center text-red">{error}</h3>}

						<div className="gap-2 flex w-full">
							<AsyncButton
								classname_override="!h-[40px] !rounded-md"
								action="Continue"
								disabled={!profileUrl?.trim()}
								loading={loading}
								success={successful}
								onClick={updateProfile}
							/>
							<button
								className="bg-gray-500 text-white text-center w-full  hover:outline outline-gray-600   !rounded-md text-sm duration-150"
								onClick={togglePopup}
								disabled={loading}
							>
								Cancel
							</button>
							<input
								type="file"
								accept="image/*"
								onChange={handleProfileFileChange}
								ref={inputProfileRef}
								className="hidden"
							/>
						</div>
					</div>
				)}
			</div>
		)
	);
};

export default EditProfile;

