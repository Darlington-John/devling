import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { JSX } from 'react';
interface ListProps {
	id: number;
	dir: string;
	href: string;
	icon: JSX.Element;
	activeIcon: JSX.Element;
}
const SidebarList = ({ href, icon, activeIcon, dir }: ListProps) => {
	const linkname = usePathname();

	return (
		<div className="relative flex  items-center">
			<Link
				href={`${href}`}
				className={`  h-[55px] pl-4 pr-5  text-[22px]  flex items-center  gap-2  w-full max-xl:text-xl relative      ${
					linkname.startsWith(`${href}`)
						? ' bg-deepBlue  text-white'
						: ' text-silver hover:bg-grey '
				}`}
			>
				{linkname.startsWith(`${href}`) ? activeIcon : icon}
				<span className="line-clamp-1 neue   text-lg   ">{dir}</span>
			</Link>
			{linkname.startsWith(`${href}`) && (
				<div className="absolute right-0 bg-blue h-full p-1"></div>
			)}
		</div>
	);
};

export default SidebarList;


