import { useState } from 'react';
import { useAuthContext } from '~/app/context/auth-context';
import { apiRequest } from '~/utils/api-request';
import { FaCheck } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { IoTrashBinOutline } from 'react-icons/io5';
import AsyncButton from '../../buttons/async-button';

interface deleteTopicPrompt {
	isVisible: boolean;
	isActive: boolean;
	ref: React.RefObject<HTMLDivElement | null>;
	togglePopup: () => void;
	setDisable: React.Dispatch<React.SetStateAction<boolean>>;
	topicId: string;
}
const DeleteTopicPrompt = ({
	isVisible,
	isActive,
	ref,
	togglePopup,
	setDisable,
	topicId,
}: deleteTopicPrompt) => {
	const { user } = useAuthContext();

	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const [successful, setSuccessful] = useState(false);

	const deleteTopic = async () => {
		if (!user) {
			return;
		}
		if (loading) {
			return;
		}

		setLoading(true);
		setError('');
		setDisable(true);

		await apiRequest({
			url: '/api/topics/delete-topic',
			method: 'DELETE',
			body: { topicId, adminId: user?._id },
			onSuccess: (response) => {
				setSuccessful(true);
				toast.success(response.message, {
					icon: <FaCheck color="white" />,
				});
				window.dispatchEvent(new CustomEvent('topicsUpdated'));

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
					className={`w-[350px]     mid-popup   duration-300 ease-in-out flex flex-col py-6 px-6  gap-4   rounded-lg bg-white   items-center font-normal     ${
						isVisible ? '' : 'mid-popup-hidden'
					}`}
					ref={ref}
				>
					<IoTrashBinOutline className="text-4xl  text-red-400 object-cover" />
					<div className="flex items-center flex-col gap-1 w-full leading-none">
						<h1 className="text-2xl sf-bold text-center text-black">
							Delete topic
						</h1>
						<p className="text-sm text-center ">
							Your&apos;re about to delete this topic. All articles under this
							topic will be deleted also. Is that what you want?
						</p>
					</div>

					{error && <h1 className="text-xs text-center text-red">{error}</h1>}
					<div className="gap-2 flex w-full">
						<AsyncButton
							classname_override="!h-[40px] !rounded-md"
							action="Delete"
							loading={loading}
							success={successful}
							onClick={deleteTopic}
						/>
						<button
							className="bg-gray-600 text-center w-full  hover:outline outline-gray-600   !rounded-md text-sm text-white duration-150"
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

export default DeleteTopicPrompt;

