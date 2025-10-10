'use client';
import { useRef, useState } from 'react';
import { FaAngleDown, FaCheck, FaPlus } from 'react-icons/fa';
import { toast } from 'react-toastify';
import AsyncButton from '~/app/components/buttons/async-button';
import CropImage from '~/app/components/crop-image';
import ClassicInput from '~/app/components/inputs/classic-input';
import { useAuthContext } from '~/app/context/auth-context';
import { apiRequest } from '~/utils/api-request';
import { usePopup } from '~/utils/toggle-popups';
import { IoImageSharp } from 'react-icons/io5';
import { useParams, usePathname } from 'next/navigation';
import { useTopicsContext } from '~/app/context/topics-context';
const NewArticle = () => {
	const {
		isActive: newArticlePrompt,
		isVisible: newArticlePromptVisible,
		ref: newArticlePromptRef,
		setDisableToggle: disableNewArticlePrompt,
		togglePopup: toggleNewArticlePrompt,
	} = usePopup();
	const { user } = useAuthContext();
	const { topic } = useParams();
	const [title, setTitle] = useState('');
	const [desc, setDesc] = useState('');

	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const [successful, setSuccessful] = useState(false);

	const [selecting, setSelecting] = useState(false);
	const [imageBlob, setImageBlob] = useState<Blob | null>(null);
	const [imagePreview, setImagePreview] = useState<string | null>(null);
	const [imageUrl, setImageUrl] = useState<string | null>(null);
	const [selectedTopic, setSelectedTopic] = useState('');
	const { topics } = useTopicsContext();
	const createArticle = async () => {
		if (!user || loading) {
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
		disableNewArticlePrompt(true);
		const formData = new FormData();

		formData.append('adminId', user._id);
		formData.append('title', title);
		formData.append('description', desc);
		formData.append('selected_topic', selectedTopic);
		formData.append('uploaded_image', imageBlob as Blob);

		await apiRequest({
			url: `/api/topics/${topic}/create-article`,
			method: 'POST',
			body: formData,
			onSuccess: (response) => {
				setSelectedTopic('');
				setSuccessful(true);
				toast.success(response.message, {
					icon: <FaCheck color="white" />,
				});
				window.dispatchEvent(new CustomEvent('refetchArticles'));
				window.dispatchEvent(new CustomEvent('refetchAdminArticles'));
				setTimeout(() => {
					toggleNewArticlePrompt();
					cancelCreation();
					setSuccessful(false);
				}, 3000);
			},
			onError: (error) => {
				setError(error);
				setSelectedTopic('');
			},
			onFinally: () => {
				setLoading(false);
				disableNewArticlePrompt(false);
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
		toggleNewArticlePrompt();
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
	const {
		isVisible: topicPromptVisible,
		isActive: topicPrompt,
		togglePopup: toggleTopicPrompt,
		ref: topicPromptRef,
	} = usePopup();
	const linkname = usePathname();
	return (
		<>
			<button
				className="h-[40px] rounded-md px-4 bg-blue hover:bg-darkBlue duration-150 flex items-center justify-center text-white gap-2 text-center "
				onClick={toggleNewArticlePrompt}
			>
				<span className="text-base">
					<FaPlus />
				</span>
				<span className="text-base">New Article</span>
			</button>

			{newArticlePrompt && (
				<div className="fixed top-[0px]  h-full w-full  z-50 left-0 flex  justify-center  items-center        backdrop-brightness-50  px-8     xs:px-0">
					{selecting ? (
						<CropImage
							selecting={selecting}
							setSelecting={setSelecting}
							ref={newArticlePromptRef}
							setImagePreview={setImagePreview}
							setImageBlob={setImageBlob}
							imageUrl={imageUrl}
							setImageUrl={setImageUrl}
							aspectRatio={465 / 301}
						/>
					) : (
						<div
							className={`w-[350px]     mid-popup   duration-300 ease-in-out flex flex-col py-6 px-6  gap-4   rounded-lg bg-navy radial border border-grey   items-center font-normal     ${
								newArticlePromptVisible ? '' : 'mid-popup-hidden'
							}`}
							ref={newArticlePromptRef}
						>
							<div className="flex items-center flex-col gap-0 w-full leading-none">
								<h1 className="text-2xl  text-center text-fade-blue">
									Create a new Article
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
									className=" text-white link-style-dark text-xs"
									onClick={handleClickSelect}
								>
									{imageUrl ? 'Choose another' : 'Select Image'}
								</button>
							</div>
							{!linkname.startsWith('/admin/topics/') && (
								<div
									className="py-2 px-2 bg-deepBlue border border-grey radial  text-center text-sm flex items-center gap-1 rounded-sm relative cursor-pointer w-full justify-between"
									onClick={toggleTopicPrompt}
								>
									<span className="capitalize text-white">
										Topic: {selectedTopic}
									</span>{' '}
									<FaAngleDown
										className={`text-white ${
											topicPrompt ? 'rotate-180' : ''
										} duration-150`}
									/>
									{topicPrompt && (
										<div
											className={`flex flex-col bg-navy radial  shadow-lg w-full rounded-md duration-150 absolute top-[105%] right-0 divide-y divide-grey overflow-hidden border border-grey z-20 ${
												topicPromptVisible ? 'opacity-100' : 'opacity-0'
											}`}
											ref={topicPromptRef}
										>
											{topics &&
												topics.map((data) => (
													<button
														key={data.title}
														className={`py-2 w-full text-[13px] flex items-center gap-3 px-3 duration-150  ${
															selectedTopic === data.slug
																? 'bg-deepBlue'
																: 'hover:bg-deepBlue'
														}`}
														onClick={() => {
															toggleTopicPrompt();
															setSelectedTopic(data.slug);
														}}
													>
														<span className="capitalize text-white">
															{data.title}
														</span>
													</button>
												))}
										</div>
									)}
								</div>
							)}

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
								label="Description"
								error={error}
								setError={setError}
								placeholder="Everything hosting"
								errorContent="Description is required"
								name="desc"
								maxlength={160}
							/>

							{!error && (
								<>
									<h1 className="text-xs text-center text-silver">
										*more details will need to be filled in the article page and
										by default an article is unpublished until set
									</h1>
								</>
							)}
							{error && (
								<h1 className="text-xs text-center text-red-300">{error}</h1>
							)}
							<div className="gap-2 flex w-full">
								<AsyncButton
									classname_override="!h-[40px] !rounded-md"
									action="Create"
									disabled={!title || !desc || !imageUrl}
									loading={loading}
									success={successful}
									onClick={createArticle}
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

export default NewArticle;

