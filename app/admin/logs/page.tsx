'use client';

import { useAuthContext } from '~/app/context/auth-context';
import { useEffect, useState } from 'react';
import { apiRequest } from '~/utils/api-request';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';
import { alert_type } from '~/types/alerts';
import { toast } from 'react-toastify';
import Alert from '../components/alert';
import Loader from '~/app/components/loader';
import LogsFilter from '../components/logs-filter';
import EmptyState from '~/app/components/empty-state';

const Alerts = () => {
	const { user } = useAuthContext();
	const [currentPage, setCurrentPage] = useState(1);
	const pageSize = 10;

	const [pagedAlerts, setPagedAlerts] = useState<alert_type[]>([]);
	const [totalAlerts, setTotalAlerts] = useState(0);
	const [fetching, setFetching] = useState(true);
	const [error, setError] = useState('');
	const totalPages = Math.ceil(totalAlerts / pageSize);

	const [activeStatus, setActiveStatus] = useState('all');
	const [activeRole, setActiveRole] = useState('all');
	const [activeAction, setActiveAction] = useState('all');
	useEffect(() => {
		if (!user) return;

		const fetchAlerts = async () => {
			setFetching(true);
			setError('');
			await apiRequest({
				url: `/api/alerts?adminId=${user._id}&skip=${
					(currentPage - 1) * pageSize
				}&limit=${pageSize}&status=${activeStatus}&role=${activeRole}&action=${activeAction}`,
				method: 'GET',
				onSuccess: (res) => {
					setPagedAlerts(res.response);
					setTotalAlerts(res.alertsLength);
				},
				onError: (error) => {
					setError(error);
					toast.error(error);
				},
				onFinally: () => setFetching(false),
			});
		};

		fetchAlerts();
		const refetchHandler = () => fetchAlerts();
		window.addEventListener('refetchAlerts', refetchHandler);

		return () => window.removeEventListener('refetchAlerts', refetchHandler);
	}, [currentPage, user, activeStatus, activeRole, activeAction]);
	const isFiltered =
		activeAction !== 'all' || activeRole !== 'all' || activeStatus !== 'all';

	return (
		<section className="flex flex-col gap-4  py-6 px-4 ">
			<div className="flex items-center justify-between w-full max-2xs:flex-col max-2xs:gap-2 max-2xs:items-start ">
				<h1 className="flex text-3xl neue-thin uppercase max-md:text-2xl  max-sm:text-xl text-fade-blue">
					Recent logs
				</h1>
			</div>
			<LogsFilter
				activeStatus={activeStatus}
				setActiveStatus={setActiveStatus}
				activeRole={activeRole}
				setActiveRole={setActiveRole}
				activeAction={activeAction}
				setActiveAction={setActiveAction}
			/>
			<div className="w-full overflow-auto">
				<div className="flex gap-3 flex-col w-full min-w-[1000px]">
					<div className="flex flex-col w-full  rounded-md  border overflow-hidden  border-grey">
						<div className="w-full flex gap-1 bg-grey text-silver">
							<div className="w-[20%] py-2 px-3 text-sm">User</div>
							<div className="w-[15%] py-2 px-3 text-sm">Role</div>
							<div className="w-[30%] py-2 px-3 text-sm">Action</div>
							<div className="w-[25%] py-2 px-3 text-sm">Date</div>
							<div className="w-[10%] py-2 px-3 text-sm"></div>
						</div>
						<Loader
							classname_override="!h-[400px]"
							fetching={fetching}
							error={error}
						>
							{pagedAlerts && pagedAlerts?.length > 0 ? (
								<>
									{pagedAlerts.map((alert) => (
										<Alert alert={alert} key={alert._id} />
									))}
									{Array(Math.max(0, pageSize - pagedAlerts.length))
										.fill(null)
										.map((_, i) => (
											<div
												key={i}
												className="h-[40px] flex items-center px-3 text-sm border-t border-t-grey bg-navy w-full"
											></div>
										))}
								</>
							) : isFiltered ? (
								<EmptyState message="No logs match your filters" />
							) : (
								<EmptyState message="No logs available" />
							)}
						</Loader>
					</div>
				</div>
			</div>
			{totalAlerts > pageSize && (
				<div className="flex items-center gap-2">
					<div className="flex items-center gap-2">
						{/* Prev */}
						<button
							onClick={() => {
								setCurrentPage((p) => Math.max(p - 1, 1));
							}}
							disabled={currentPage === 1}
							className={`flex items-center justify-center h-7 w-7 rounded-md ${
								currentPage === 1
									? 'bg-deepBlue text-silver opacity-40 !cursor-default'
									: 'bg-deepBlue text-silver hover:ring ring-fade-blue'
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
									<span key={`dots-${idx}`} className="px-2 text-silver">
										…
									</span>
								) : (
									<button
										key={`page-${page}-${idx}`}
										onClick={() => {
											setCurrentPage(page as number);
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
							}}
							disabled={currentPage === totalPages}
							className={`flex items-center justify-center h-7 w-7 rounded-md  ${
								currentPage === totalPages
									? 'bg-deepBlue text-silver opacity-40 !cursor-default'
									: 'bg-deepBlue text-silver hover:ring ring-fade-blue'
							}`}
						>
							<MdKeyboardArrowRight />
						</button>
					</div>
				</div>
			)}
		</section>
	);
};

export default Alerts;

