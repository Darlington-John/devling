import Image from 'next/image';
import logo from '~/public/icons/logo.svg';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import SidebarList from './sidebar-lists';
import { MdApps, MdArticle } from 'react-icons/md';
import { FaUsers } from 'react-icons/fa';
import { LuLogs } from 'react-icons/lu';
interface SidebarProps {
	hidden: boolean;
}
const Sidebar = ({ hidden }: SidebarProps) => {
	const linkname = usePathname();
	const menuList = [
		{
			id: 1,
			dir: 'Categories',
			href: '/admin/categories',
			icon: <MdArticle className="text-fade-blue" />,
			activeIcon: <MdArticle className="text-blue" />,
		},
		{
			id: 2,
			dir: 'Members',
			href: '/admin/members',
			icon: <FaUsers className="text-fade-blue" />,
			activeIcon: <FaUsers className="text-blue" />,
		},
		{
			id: 3,
			dir: 'Logs',
			href: '/admin/logs',
			icon: <LuLogs className="text-fade-blue" />,
			activeIcon: <LuLogs className="text-blue" />,
		},
	];
	return (
		<section
			className={`h-full w-[260px]  pt-3 pb-5 flex flex-col gap-10  items-start shrink-0   max-xl:pt-5 max-xl:px-2  bg-dark-navy max-lg:bg-transparent max-lg:w-full max-lg:px-0    max-lg:pt-3 ${
				hidden && 'max-lg:hidden'
			}`}
		>
			<div className="flex  items-center justify-center   w-full flex-col max-lg:hidden">
				<Link href={'/'}>
					<Image
						src={logo}
						alt=""
						className="w-[160px] max-xl:w-[120px] shrink-0"
						priority
					/>
				</Link>
				<h1 className="text-xs text-silver neue  ">Admin Dashboard</h1>
			</div>
			<div className="flex flex-col  w-full  gap-3 bg-dark-navy">
				<h1 className="text-silver text-xs pl-5 max-lg:hidden">MAIN MENU</h1>
				<div className="h-full  w-full flex flex-col gap-1">
					<Link
						href={'/admin'}
						className={`   py-3 px-5 text-[20px] neue  flex items-center  gap-3  w-full max-xl:text-xl text-silver relative duration-150      ${
							linkname === '/admin'
								? ' bg-deepBlue  text-white  '
								: 'hover:bg-grey'
						}`}
					>
						{linkname === '/admin' ? (
							<MdApps className="text-blue" />
						) : (
							<MdApps className="text-fade-blue" />
						)}

						{linkname === '/admin' && (
							<div className="absolute right-0 bg-blue h-full p-1"></div>
						)}
						<span>Overview</span>
					</Link>
					{menuList?.map((data) => (
						<SidebarList key={data.id} {...data} />
					))}
				</div>
			</div>
		</section>
	);
};

export default Sidebar;

