import { FaEllipsisH } from 'react-icons/fa';
import { alert_type } from '~/types/alerts';
import { formatDate } from '~/utils/format-date';
import { usePopup } from '~/utils/toggle-popups';
import { CgDetailsMore } from 'react-icons/cg';
import Link from 'next/link';
interface alertTypes {
	alert: alert_type;
}
const Alert = ({ alert }: alertTypes) => {
	const statusColors: Record<string, string> = {
		create: ' border-l-2 border-l-green-300',
		delete: ' border-l-2 border-l-red-300',
		edit: ' border-l-2 border-l-yellow-300',
		info: ' border-l-2 border-l-blue-300',
	};
	const {
		isVisible: detailsPromptVisible,
		isActive: detailsPrompt,
		togglePopup: toggleDetailsPrompt,
		ref: detailsPromptRef,
	} = usePopup();
	return (
		<>
			<div
				className={`w-full flex gap-1 hover:bg-deepBlue bg-navy border-t  border-t-grey `}
			>
				<div className="w-[20%] py-2 px-3 text-sm text-white">
					<span
						className={`p-1 ${statusColors[alert?.status ?? ''] || ''}`}
					></span>
					{alert?.triggered_by === null
						? 'A reader'
						: `${alert?.triggered_by?.first_name} ${
								alert?.triggered_by?.last_name || ''
						  }`}
				</div>
				<div className={`w-[15%] py-2 px-3 text-sm text-silver`}>
					{alert?.triggered_by === null
						? 'reader'
						: `${alert?.triggered_by?.role}`}
				</div>
				<div className="w-[30%] py-2 px-3 text-sm text-silver">
					{alert?.message}
				</div>
				<div className="w-[25%] py-2 px-3 text-sm text-silver">
					{' '}
					{formatDate(alert?.createdAt, true)}
				</div>
				<div className="w-[10%] py-2 px-3 flex items-center   text-sm text-end justify-end relative">
					<FaEllipsisH
						className="text-silver cursor-pointer "
						onClick={toggleDetailsPrompt}
					/>
				</div>
			</div>
			{detailsPrompt && (
				<div className="fixed bottom-[0px]  h-full w-full  z-50 left-0 flex  justify-center  items-center        backdrop-brightness-50  px-8     xs:px-0">
					<div
						className={`w-[350px]     mid-popup   duration-300 ease-in-out flex flex-col py-6 px-6  gap-4   rounded-lg bg-navy radial border border-grey  items-center      ${
							detailsPromptVisible ? '' : 'mid-popup-hidden'
						}  `}
						ref={detailsPromptRef}
					>
						<div className="flex flex-col  items-center w-full">
							<CgDetailsMore className="text-3xl text-blue" />

							<div className="flex flex-col gap-2 ">
								<h1 className="text-2xl text-center text-fade-blue">More details</h1>
							</div>
						</div>
						<div className="flex w-full flex-col ">
							<Row
								header="User"
								content={`${alert?.triggered_by?.first_name} ${alert?.triggered_by?.last_name}`}
							/>
							<Row
								header="Role"
								content={`${
									alert?.triggered_by === null
										? 'reader'
										: alert?.triggered_by?.role
								}`}
							/>
							<Row header="Action" content={`${alert?.message}`} />
							<Row
								header="Date"
								content={`${formatDate(alert?.createdAt, true)}`}
							/>
							<Row header="Status" content={`${alert?.status}`} />
							{alert?.status !== 'delete' && (
								<div className="flex  w-full  border-b-2 border-grey text-xs divide-grey divide-x">
									<div className="text-start w-[50%] py-2 px-1">
										<h1>{alert?.link?.label}:</h1>
									</div>
									<div className="text-end w-[50%] py-2 px-1">
										{alert?.type === 'account_messaged' ||
										alert?.type === 'user_subscribed' ? (
											<p className="text-silver">{alert?.link?.url}</p>
										) : (
											<Link
												href={`/admin${alert?.link?.url}`}
												className="text-blue"
											>
												View article
											</Link>
										)}
									</div>
								</div>
							)}
						</div>

						<div className="flex gap-4 w-full">
							<button
								className="flex items-center justify-center  gap-2  h-[40px]  px-2 rounded-md bg-blue     duration-150 hover:bg-darkBlue    text-center w-full text-white  text-xs "
								onClick={toggleDetailsPrompt}
							>
								Done
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default Alert;

interface rowProps {
	header: string;
	content: string;
}
const Row = ({ header, content }: rowProps) => {
	return (
		<div className="flex  w-full  border-b-2 border-grey text-xs divide-grey  text-silver divide-x">
			<div className="text-start w-[50%] py-2 px-1">
				<h1>{header}:</h1>
			</div>
			<div className="text-end w-[50%] py-2 px-1 overflow-hidden">
				<h1 className="text-ellipsis">{content}</h1>
			</div>
		</div>
	);
};








