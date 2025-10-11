'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useUtilsContext } from '~/app/context/utils-context';
import Link from 'next/link';
import { Accordion } from './accordion';
import { useCategoriesContext } from '../context/categories-context';
interface link {
	header: string;
	link: {
		dir: string;
		href: string;
	}[];
}

const Overlay = () => {
	const { setOverlayOpen } = useUtilsContext();

	const linkname = usePathname();
	useEffect(() => {
		const overlayElement = document.getElementById('overlay');

		if (!overlayElement) {
			return;
		}
		overlayElement.style.transform = 'translateY(-100%)';

		setOverlayOpen(false);
	}, [linkname, setOverlayOpen]);
	const { categories } = useCategoriesContext();
	const footerLink = [
		{
			header: 'Categories',
			link: categories?.map((category) => ({
				dir: category.title,
				href: `/categories/${category.slug}`, // or just category.slug if you don’t need the `/`
			})),
		},
	];
	return (
		<div
			className=" hidden w-full  fixed z-40 top-0 right-0 bg-navy   max-md:flex      flex-col gap-16 justify-end   ease-out duration-[0.4s]  h-full text-white  "
			id="overlay"
			style={{ transform: 'translateY(-100%)' }}
		>
			<div className=" w-full  py-4   h-full mt-[57px]     flex flex-col  overflow-auto  gap-2 ">
				{categories && categories.length > 0 && (
					<Accordion
						links={footerLink as link[]}
						accordion_class_override="!text-fade-blue !text-base !border-fade-blue !px-5 !uppercase"
						arrow_class_override="!border-silver"
					/>
				)}

				<Link
					href="https://darlington-john.framer.website/"
					className="text-base uppercase py-4 px-6 text-fade-blue"
					target="_blank"
				>
					About Me
				</Link>
			</div>
		</div>
	);
};

export default Overlay;

