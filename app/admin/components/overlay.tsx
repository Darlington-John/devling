'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useUtilsContext } from '~/app/context/utils-context';
import Sidebar from './sidebar/sidebar';

const Overlay = () => {
	const { setAdminOverlayOpen } = useUtilsContext();

	const linkname = usePathname();
	useEffect(() => {
		const overlayElement = document.getElementById('adminOverlay');

		if (!overlayElement) {
			return;
		}
		overlayElement.style.transform = 'translateX(-100%)';

		setAdminOverlayOpen(false);
	}, [linkname, setAdminOverlayOpen]);

	return (
		<div
			id="adminOverlay"
			style={{ transform: 'translateX(-100%)' }}
			className="hidden w-full  fixed z-40 top-0 right-0 bg-dark-navy  max-lg:flex      flex-col gap-16 justify-end   ease-out duration-[0.4s]  h-full text-[#000]  "
		>
			<div className=" w-full  py-4   h-full mt-[57px]     flex flex-col  overflow-auto  gap-2 max-lg:py-0">
				<Sidebar hidden={false} />
			</div>
		</div>
	);
};

export default Overlay;

