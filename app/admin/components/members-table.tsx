import { user_type } from '~/types/user';
import Member from './members-row/member';
import EmptyState from '~/app/components/empty-state';
import Loader from '~/app/components/loader';

interface members {
	pagedMembers: user_type[] | null;
	pageSize: number;
	searchTerm: string;
	setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
	fetching: boolean;
	error: string;
}
const MembersTable = ({
	pagedMembers,
	pageSize,
	searchTerm,
	setSearchTerm,
	fetching,
	error,
}: members) => {
	const handleSearchChange = (
		event: React.ChangeEvent<HTMLInputElement>,
	): void => {
		const query = event.target.value;
		setSearchTerm?.(query);
	};
	const hasMembers = pagedMembers && pagedMembers.length > 0;
	const hasSearch = searchTerm && searchTerm.trim().length > 0;
	return (
		<>
			<input
				className={`h-[40px]  py-1 px-3 bg-grey  text-white   text-sm    focus:ring-[1px]    ring-blue    outline-none w-[350px]  duration-150 rounded-sm max-2xl:w-[250px] max-lg:w-full self-end
pr-8
            `}
				placeholder="Search for a member"
				value={searchTerm}
				onChange={(e) => {
					handleSearchChange(e);
				}}
			/>
			<section className="flex gap-3 flex-col w-full  overflow-auto justify-end">
				<div className="flex flex-col   rounded-md  border   border-grey  w-full min-w-[1000px]">
					<div className="w-full flex gap-1 bg-grey text-silver">
						<div className="w-[25%] py-2 px-3 text-sm">Name</div>
						<div className="w-[25%] py-2 px-3 text-sm">Email</div>
						<div className="w-[15%] py-2 px-3 text-sm">Role</div>
						<div className="w-[15%] py-2 px-3 text-sm">Country</div>
						<div className="w-[10%] py-2 px-3 text-sm">Joined</div>
						
						<div className="w-[10%] py-2 px-3 text-sm"></div>
					</div>
					<Loader
						classname_override="!h-[400px]"
						fetching={fetching}
						error={error}
					>
						{hasMembers ? (
							<>
								{pagedMembers.map((member) => (
									<Member key={member?._id} member={member} />
								))}
								{Array(Math.max(0, pageSize - pagedMembers.length))
									.fill(null)
									.map((_, i) => (
										<div
											key={i}
											className="h-[40px] flex items-center px-3 text-sm border-t border-t-grey bg-navy w-full"
										></div>
									))}
							</>
						) : (
							<EmptyState
								message={
									hasSearch ? 'No member matches your search' : 'No members yet'
								}
							/>
						)}
					</Loader>
				</div>
			</section>
		</>
	);
};

export default MembersTable;

