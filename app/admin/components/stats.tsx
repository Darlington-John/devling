'use client';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useAuthContext } from '~/app/context/auth-context';
import { apiRequest } from '~/utils/api-request';
import { useFetch } from '~/utils/fetch-page-data';
interface membersProps {
	totalMembers: number;
	memberSubscribedToday: number;
	totalArticles: number;
	articleCreatedToday: number;
}
const Stats = () => {
	const { loading, user } = useAuthContext();

	const { fetchedData: stats } = useFetch<membersProps>({
		basePath: `/api/stats?adminId=${user?._id}`,
		ids: [],
		eventKey: 'statsUpdated',
		dataKey: 'stats',
		enabled: !!user && !loading,
		//  deps:[loading,user]
	});

	const [lastMonthVisitors, setLastMonthVisitors] = useState(null);
	const [todayVisitors, setTodayVisitors] = useState(null);
	useEffect(() => {
		const fetchAnalytics = async () => {
			await apiRequest({
				url: '/api/analytics',
				method: 'GET',
				onSuccess: (res) => {
					setTodayVisitors(res.today);
					setLastMonthVisitors(res.lastMonth);
				},
				onError: (error) => {
					toast.error(error);
				},
			});
		};
		fetchAnalytics();
	}, []);
	return (
		<div className=" grid grid-cols-3      justify-between  rounded-[40px]  w-full gap-3 max-sm:grid-cols-2 max-2xs:grid-cols-1 pb-10">
			<div className=" p-5  rounded-lg bg-navy radial border border-grey  flex flex-col gap-2 items-start  w-full  max-md:p-2">
				<h1 className="text-sm text-fade-blue leading-none ">Total Members</h1>
				<h1 className="text-3xl  poppins text-white">
					{stats?.totalMembers || 0}
				</h1>

				{stats && stats?.memberSubscribedToday > 0 ? (
					<div className="bg-[#1B3A2B] text-[hsl(151,36%,70%)]    px-3 py-1 rounded-full text-xs   ">
						{stats?.memberSubscribedToday} subscribed today
					</div>
				) : (
					<div className="bg-[#2C240B]  text-[hsl(45,100%,50%)] px-3 py-1 rounded-full text-xs   ">
						No one subscribed today
					</div>
				)}
			</div>

			<div className=" p-5  rounded-lg bg-navy radial border border-grey  flex flex-col gap-2 items-start  w-full max-md:p-2">
				<h1 className="text-sm text-fade-blue  leading-none ">
					Total Articles
				</h1>
				<h1 className="text-3xl  poppins text-white">
					{stats?.totalArticles || 0}
				</h1>
				{stats && stats?.articleCreatedToday > 0 ? (
					<div className="bg-[#1B3A2B] text-[hsl(151,36%,70%)]     px-3 py-1 rounded-full text-xs   ">
						{stats?.articleCreatedToday} articles created today
					</div>
				) : (
					<div className="bg-[#2C240B]  text-[hsl(45,100%,50%)] px-3 py-1 rounded-full text-xs   ">
						No article created today
					</div>
				)}
			</div>
			<div className=" p-5  rounded-lg bg-navy radial border border-grey  flex flex-col gap-2 items-start  w-full  max-md:p-2">
				<h1 className="text-sm text-fade-blue  leading-none ">
					Total Visitors in the last month
				</h1>
				<h1 className="text-3xl  text-white">{lastMonthVisitors ?? 0}</h1>

				{todayVisitors && todayVisitors > 0 ? (
					<div className="bg-[#1B3A2B] text-[hsl(151,36%,70%)]    px-3 py-1 rounded-full text-xs   ">
						{todayVisitors} visited today
					</div>
				) : (
					<div className="bg-[#2C240B]  text-[hsl(45,100%,50%)] px-3 py-1 rounded-full text-xs   ">
						{todayVisitors} visited today
					</div>
				)}
			</div>
		</div>
	);
};

export default Stats;

