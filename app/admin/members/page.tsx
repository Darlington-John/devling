'use client';

import { useAuthContext } from '~/app/context/auth-context';
import { user_type } from '~/types/user';
import { useEffect, useState } from 'react';
import { apiRequest } from '~/utils/api-request';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';
import MembersTable from '../components/members-table';
import BlockedSection from './blocked';
const Members = () => {
	const { user } = useAuthContext();
	const [currentPage, setCurrentPage] = useState(1);
	const pageSize = 10; // Users per page

	const [pagedMembers, setPagedMembers] = useState<user_type[]>([]);
	const [totalMembers, setTotalMembers] = useState(0);
	const [fetching, setFetching] = useState(true);
	const [error, setError] = useState('');
	const [searchTerm, setSearchTerm] = useState('');
	const totalPages = Math.ceil(totalMembers / pageSize);

	useEffect(() => {
		if (!user) return;

		const fetchMembers = async () => {
			setFetching(true);
			setError('');
			await apiRequest({
				url: `/api/members/fetch-members?adminId=${user._id}&skip=${
					(currentPage - 1) * pageSize
				}&limit=${pageSize}&search=${searchTerm}`,
				method: 'GET',
				onSuccess: (res) => {
					setPagedMembers(res.members);
					setTotalMembers(res.members_length);
				},
				onError: (error) => setError(error),
				onFinally: () => setFetching(false),
			});
		};

		fetchMembers();
		const refetchHandler = () => fetchMembers();
		window.addEventListener('refetchMembers', refetchHandler);

		return () => window.removeEventListener('refetchMembers', refetchHandler);
	}, [currentPage, user, searchTerm]);

	return (
		<main className="bg-dark-navy">
			<section className="flex flex-col gap-4  py-6 px-4 ">
				<div className="flex items-center justify-between w-full max-2xs:flex-col max-2xs:gap-2 max-2xs:items-start ">
					<h1 className="flex text-3xl neue-thin uppercase max-md:text-2xl  max-sm:text-xl text-fade-blue">
						Members ({totalMembers})
					</h1>
				</div>

				<MembersTable
					pagedMembers={pagedMembers}
					pageSize={pageSize}
					searchTerm={searchTerm}
					setSearchTerm={setSearchTerm}
					fetching={fetching}
					error={error}
				/>

				{pagedMembers && pagedMembers.length > 0 && (
					<div className="flex items-center gap-2">
						<div className="flex items-center gap-2">
							{/* Prev */}
							<button
								onClick={() => {
									setCurrentPage((p) => Math.max(p - 1, 1));
									document
										.getElementById('members-section')
										?.scrollIntoView({ behavior: 'smooth' });
								}}
								disabled={currentPage === 1}
								className={`flex items-center justify-center h-7 w-7 rounded-md ${
									currentPage === 1
										? 'bg-deepBlue text-silver opacity-40 !cursor-default'
										: 'bg-deepBlue text-silver hover:bg-gray-200'
								}`}
							>
								<MdKeyboardArrowLeft />
							</button>

							{(() => {
								const pages: (number | string)[] = [];
								const window = 2;

								for (let i = 1; i <= totalPages; i++) {
									if (
										i === 1 ||
										i === totalPages ||
										(i >= currentPage - window && i <= currentPage + window)
									) {
										pages.push(i);
									} else if (
										(i === currentPage - window - 1 &&
											currentPage - window > 2) ||
										(i === currentPage + window + 1 &&
											currentPage + window < totalPages - 1)
									) {
										pages.push('...');
									}
								}

								return pages.map((page, idx) =>
									page === '...' ? (
										<span key={`dots-${idx}`} className="px-2">
											…
										</span>
									) : (
										<button
											key={`page-${page}-${idx}`}
											onClick={() => {
												setCurrentPage(page as number);
												document
													.getElementById('members-section')
													?.scrollIntoView({ behavior: 'smooth' });
											}}
											className={`px-3 py-1 rounded-md  ${
												page === currentPage
													? 'bg-blue text-white'
													: 'text-silver hover:bg-grey'
											}`}
										>
											{page}
										</button>
									),
								);
							})()}

							{/* Next */}
							<button
								onClick={() => {
									setCurrentPage((p) => Math.min(p + 1, totalPages));
									document
										.getElementById('members-section')
										?.scrollIntoView({ behavior: 'smooth' });
								}}
								disabled={currentPage === totalPages}
								className={`flex items-center justify-center h-7 w-7 rounded-md  ${
									currentPage === totalPages
										? 'bg-deepBlue text-silver opacity-40 !cursor-default'
										: 'bg-deepBlue text-silver hover:bg-gray-200'
								}`}
							>
								<MdKeyboardArrowRight />
							</button>
						</div>
					</div>
				)}
			</section>

			<BlockedSection />
		</main>
	);
};

export default Members;



