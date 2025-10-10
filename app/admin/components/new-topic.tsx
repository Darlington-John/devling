'use client';
import { useRef, useState } from 'react';
import { FaCheck, FaPlus } from 'react-icons/fa';
import { toast } from 'react-toastify';
import AsyncButton from '~/app/components/buttons/async-button';
import CropImage from '~/app/components/crop-image';
import ClassicInput from '~/app/components/inputs/classic-input';
import { useAuthContext } from '~/app/context/auth-context';
import { apiRequest } from '~/utils/api-request';
import { usePopup } from '~/utils/toggle-popups';
import { IoImageSharp } from 'react-icons/io5';
const NewTopic = () => {
	const {
		isActive: newTopicPrompt,
		isVisible: newTopicPromptVisible,
		ref: newTopicPromptRef,
		setDisableToggle: disableNewTopicPrompt,
		togglePopup: toggleNewTopicPrompt,
	} = usePopup();
	const { user } = useAuthContext();
	const [title, setTitle] = useState('');
	const [desc, setDesc] = useState('');

	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const [successful, setSuccessful] = useState(false);

	const [selecting, setSelecting] = useState(false);
	const [imageBlob, setImageBlob] = useState<Blob | null>(null);
	const [imagePreview, setImagePreview] = useState<string | null>(null);
	const [imageUrl, setImageUrl] = useState<string | null>(null);
	const createTopic = async () => {
		if (!user) {
			return;
		}
		if (loading) {
			return;
		}
		if (desc.trim() === '') {
			setError('Description is required');
			return;
		}
		if (title.trim() === '') {
			setError('Title is required');
			return;
		}
		if (!imageUrl) {
			setError('An image is required');
			return;
		}
		setLoading(true);
		setError('');
		disableNewTopicPrompt(true);
		const formData = new FormData();

		formData.append('adminId', user._id);
		formData.append('title', title);
		formData.append('description', desc);
		formData.append('uploaded_image', imageBlob as Blob);

		await apiRequest({
			url: '/api/topics/create-topic',
			method: 'POST',
			body: formData,
			onSuccess: (response) => {
				setSuccessful(true);
				toast.success(response.message, {
					icon: <FaCheck color="white" />,
				});
				window.dispatchEvent(new CustomEvent('topicsUpdated'));

				setTimeout(() => {
					toggleNewTopicPrompt();
					cancelCreation();
					setSuccessful(false);
				}, 3000);
			},
			onError: (error) => {
				setError(error);
			},
			onFinally: () => {
				setLoading(false);
				disableNewTopicPrompt(false);
			},
		});
	};
	const inputImageRef = useRef<HTMLInputElement | null>(null);
	const handleClickSelect = () => inputImageRef.current?.click();
	const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;
		setSelecting(true);
		setError('');
		const reader = new FileReader();
		reader.onloadend = () => setImageUrl(reader.result as string);
		reader.readAsDataURL(file);
	};

	const cancelCreation = () => {
		toggleNewTopicPrompt();
		setTitle('');
		setDesc('');

		setError('');
		setLoading(false);
		setSuccessful(false);

		setSelecting(false);
		setImageBlob(null);
		setImagePreview(null);
		setImageUrl(null);
	};
	return (
		<>
			{user?.role === 'super_admin' && (
				<button
					className="h-[40px] rounded-md px-4 bg-blue hover:bg-darkBlue duration-150 flex items-center justify-center text-white gap-2 text-center "
					onClick={toggleNewTopicPrompt}
				>
					<span>
						<FaPlus />
					</span>
					<span>New topic</span>
				</button>
			)}
			{newTopicPrompt && (
				<div className="fixed top-[0px]  h-full w-full  z-50 left-0 flex  justify-center  items-center        backdrop-brightness-50  px-8     xs:px-0">
					{selecting ? (
						<CropImage
							selecting={selecting}
							setSelecting={setSelecting}
							ref={newTopicPromptRef}
							setImagePreview={setImagePreview}
							setImageBlob={setImageBlob}
							imageUrl={imageUrl}
							setImageUrl={setImageUrl}
							aspectRatio={465 / 301}
						/>
					) : (
						<div
							className={`w-[350px]     mid-popup   duration-300 ease-in-out flex flex-col py-6 px-6  gap-4   rounded-lg bg-navy radial border border-grey   items-center font-normal     ${
								newTopicPromptVisible ? '' : 'mid-popup-hidden'
							}`}
							ref={newTopicPromptRef}
						>
							<div className="flex items-center flex-col gap-0 w-full leading-none">
								<h1 className="text-2xl sf-bold text-center text-fade-blue">
									Create a new topic
								</h1>
							</div>
							<div className="flex flex-col gap-2 items-center justify-center w-full">
								{imagePreview ? (
									// eslint-disable-next-line
									<img src={imagePreview} alt="icon" className="w-full   " />
								) : (
									<IoImageSharp className="text-9xl  text-silver object-cover" />
								)}
								<button
									className=" text-white link-style text-xs"
									onClick={handleClickSelect}
								>
									{imageUrl ? 'Choose another' : 'Select Image'}
								</button>
							</div>
							<ClassicInput
								value={title}
								setValue={setTitle}
								error={error}
								setError={setError}
								placeholder="hosting"
								autofocus={true}
								label="Title"
								name="title"
								errorContent="Title is required"
							/>
							<ClassicInput
								value={desc}
								setValue={setDesc}
								textarea
								error={error}
								setError={setError}
								placeholder="Everything hosting"
								errorContent="Description is required"
								name="desc"
								label="Description"
								maxlength={160}
							/>
							{error && (
								<h1 className="text-xs text-center text-red-400">{error}</h1>
							)}
							<div className="gap-2 flex w-full">
								<AsyncButton
									classname_override="!h-[40px] !rounded-md"
									action="Create"
									disabled={!title || !desc || !imageUrl}
									loading={loading}
									success={successful}
									onClick={createTopic}
								/>
								<button
									className="bg-gray-600 text-center w-full  hover:outline outline-gray-600   !rounded-md text-sm text-white duration-150"
									onClick={cancelCreation}
									disabled={loading}
								>
									Cancel
								</button>

								<input
									type="file"
									accept="image/*"
									onChange={handleImageFileChange}
									ref={inputImageRef}
									className="hidden"
								/>
							</div>
						</div>
					)}
				</div>
			)}
		</>
	);
};

export default NewTopic;

