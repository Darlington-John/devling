'use client';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { FaCheck } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { apiRequest } from '~/utils/api-request';
import AsyncButton from '../components/buttons/async-button';
import { MdUnsubscribe } from 'react-icons/md';

const Unsubscribe = () => {
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const [successful, setSuccessful] = useState(false);

	const searchParams = useSearchParams();
	const encodedEmail = searchParams.get('email') || '';
	const email = decodeURIComponent(encodedEmail);

	const unsubscribe = async () => {
		if (!email) {
			setError('An Email is Required');
			return;
		}

		setLoading(true);
		setError('');

		await apiRequest({
			url: `/api/unsubscribe`,
			method: 'POST',
			body: { email },
			onSuccess: (response) => {
				setSuccessful(true);

				toast.success(response.message, {
					icon: <FaCheck color="white" />,
				});
				window.dispatchEvent(new CustomEvent('commentsUpdated'));
			},
			onError: (error) => {
				setError(error);
			},
			onFinally: () => {
				setLoading(false);
			},
		});
	};
	return (
		<main className="min-h-[90vh] flex items-center justify-center">
			<div
				className={`w-[400px] max-w-full bg-navy radial border border-grey   flex flex-col py-6 px-6  gap-4   rounded-lg   items-center font-normal `}
			>
				<MdUnsubscribe className="text-4xl text-blue" />
				<div className="flex items-center flex-col gap-2 w-full leading-none">
					<h1 className="text-2xl sf-bold text-center text-fade-blue">
						Unsubscribe from my newsletter
					</h1>
					<p className="text-sm text-silver text-center">
						You&apos;re about to unsubscribe from my newsletter. You&apos;ll no
						longer get updates from me. Are you sure you want to continue?
					</p>
				</div>

				<div className="gap-2 flex w-full">
					<AsyncButton
						classname_override="!h-[40px] !rounded-md !bg-red-400  hover:!bg-red-500 w-full"
						action="Continue"
						loading={loading}
						success={successful}
						onClick={unsubscribe}
					/>
				</div>
				{error && <h1 className="text-xs text-center text-red-300">{error}</h1>}
			</div>
		</main>
	);
};

export default Unsubscribe;

