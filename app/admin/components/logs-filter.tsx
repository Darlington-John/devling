import { FaAngleDown, FaCircle } from 'react-icons/fa';
import { MdOutlineChecklist } from 'react-icons/md';
import { usePopup } from '~/utils/toggle-popups';
interface filterProp {
	activeStatus: string;
	setActiveStatus: React.Dispatch<React.SetStateAction<string>>;
	activeRole: string;
	setActiveRole: React.Dispatch<React.SetStateAction<string>>;
	activeAction: string;
	setActiveAction: React.Dispatch<React.SetStateAction<string>>;
}
const statusOptions = [
	{
		key: 'all',
		label: 'All',
		icon: <MdOutlineChecklist />,
	},
	{
		key: 'create',
		label: 'Create',
		icon: (
			<FaCircle className="text-green-100 border border-green-300 rounded-full" />
		),
	},
	{
		key: 'edit',
		label: 'Edit',
		icon: (
			<FaCircle className="text-yellow-100 border border-yellow-300 rounded-full" />
		),
	},
	{
		key: 'delete',
		label: 'Delete',
		icon: (
			<FaCircle className="text-red-100 border border-red-300 rounded-full" />
		),
	},
	{
		key: 'info',
		label: 'Info',
		icon: (
			<FaCircle className="text-blue-100 border border-blue-300 rounded-full" />
		),
	},
];

const roleOptions = [
	{
		key: 'all',
		label: 'All',
	},
	{
		key: 'super_admin',
		label: 'Super admin',
	},
	{
		key: 'admin',
		label: 'Admin',
	},
	{
		key: 'member',
		label: 'Member',
	},
];

const actionOptions = [
	{ key: 'all', label: 'All' },
	{ key: 'article_created', label: 'Article created' },
	{ key: 'article_deleted', label: 'Article deleted' },
	{ key: 'article_edited', label: 'Article edited' },
	{ key: 'article_published', label: 'Article published' },
	{ key: 'article_unpublished', label: 'Article unpublished' },
	{ key: 'article_featured', label: 'Article featured' },
	{ key: 'article_unfeatured', label: 'Article unfeatured' },
	{ key: 'topic_created', label: 'Topic created' },
	{ key: 'topic_deleted', label: 'Topic deleted' },
	{ key: 'topic_edited', label: 'Topic edited' },
	{ key: 'comment_created', label: 'Comment created' },
	{ key: 'comment_deleted', label: 'Comment deleted' },
	{ key: 'comment_edited', label: 'Comment edited' },
	{ key: 'account_deleted', label: 'Account deleted' },
	{ key: 'account_messaged', label: 'Account messaged' },
	{ key: 'user_subscribed', label: 'User subscribed' },
	{ key: 'role_changed', label: 'Role changed' },
	{ key: 'member_blocked', label: 'Member blocked' },
	{ key: 'member_unblocked', label: 'Member unblocked' },
	{ key: 'ip_unblocked', label: 'IP unblocked' },
	{ key: 'ip_blocked', label: 'IP blocked' },
];

const LogsFilter = ({
	activeStatus,
	setActiveStatus,
	activeRole,
	setActiveRole,
	activeAction,
	setActiveAction,
}: filterProp) => {
	const {
		isVisible: statusPromptVisible,
		isActive: statusPrompt,
		togglePopup: toggleStatusPrompt,
		ref: statusPromptRef,
	} = usePopup();
	const {
		isVisible: rolePromptVisible,
		isActive: rolePrompt,
		togglePopup: toggleRolePrompt,
		ref: rolePromptRef,
	} = usePopup();
	const {
		isVisible: actionPromptVisible,
		isActive: actionPrompt,
		togglePopup: toggleActionPrompt,
		ref: actionPromptRef,
	} = usePopup();

	return (
		<div className="flex items-center gap-2 w-full justify-end">
			<div
				className="py-2 px-2 bg-grey  text-center text-sm flex items-center gap-1 rounded-sm relative cursor-pointer text-silver"
				onClick={toggleStatusPrompt}
			>
				<span className="capitalize">Status: {activeStatus}</span>{' '}
				<FaAngleDown
					className={`${statusPrompt ? 'rotate-180' : ''} duration-150`}
				/>
				{statusPrompt && (
					<div
						className={`flex flex-col bg-navy shadow-lg w-[150px] rounded-md duration-150 absolute top-[105%] right-0 divide-y divide-grey overflow-hidden border border-grey  z-20 ${
							statusPromptVisible ? 'opacity-100' : 'opacity-0'
						}`}
						ref={statusPromptRef}
					>
						{statusOptions.map(({ key, label, icon }) => (
							<button
								key={key}
								className={`py-2 w-full text-[13px] flex items-center gap-3 px-3 duration-150 ${
									activeStatus === key ?'bg-deepBlue' : 'hover:bg-grey'
								}`}
								onClick={() => {
									toggleStatusPrompt();
									setActiveStatus(key);
								}}
							>
								{icon}
								<span>{label}</span>
							</button>
						))}
					</div>
				)}
			</div>

			<div
				className="py-2 px-2 bg-grey radial  text-center text-sm flex items-center gap-1 rounded-sm relative cursor-pointer text-silver"
				onClick={toggleRolePrompt}
			>
				<span className="capitalize">Role: {activeRole}</span>{' '}
				<FaAngleDown
					className={`${rolePrompt ? 'rotate-180' : ''} duration-150`}
				/>
				{rolePrompt && (
					<div
						className={`flex flex-col bg-navy radial shadow-lg w-[130px] rounded-md duration-150 absolute top-[105%] right-0 divide-y divide-grey overflow-hidden border border-grey z-20 ${
							rolePromptVisible ? 'opacity-100' : 'opacity-0'
						}`}
						ref={rolePromptRef}
					>
						{roleOptions.map(({ key, label}) => (
							<button
								key={key}
								className={`py-2 w-full text-[13px] flex items-center gap-3 px-3 duration-150  text-silver ${
									activeRole === key ? 'bg-deepBlue' : 'hover:bg-grey'
								}`}
								onClick={() => {
									toggleRolePrompt();
									setActiveRole(key);
								}}
							>
								<span>{label}</span>
							</button>
						))}
					</div>
				)}
			</div>

			<div
				className="py-2 px-2 bg-grey  text-center text-sm flex items-center gap-1 rounded-sm relative cursor-pointer text-silver "
				onClick={toggleActionPrompt}
			>
				<span className="capitalize">Action: {activeAction}</span>{' '}
				<FaAngleDown
					className={`${actionPrompt ? 'rotate-180' : ''} duration-150`}
				/>
				{actionPrompt && (
					<div
						className={`grid grid-cols-2  bg-navy radial shadow-lg w-[300px] rounded-md duration-150 absolute top-[105%] right-0 divide-y divide-grey overflow-hidden border border-grey z-20 ${
							actionPromptVisible ? 'opacity-100' : 'opacity-0'
						}`}
						ref={actionPromptRef}
					>
						{actionOptions.map(({ key, label }) => (
							<button
								key={key}
								className={`py-2 w-full text-[13px] flex items-center gap-3 px-3 duration-150  ${
									activeAction === key ? 'bg-deepBlue' : 'hover:bg-grey'
								}`}
								onClick={() => {
									toggleActionPrompt();
									setActiveAction(key);
								}}
							>
								<span>{label}</span>
							</button>
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default LogsFilter;

