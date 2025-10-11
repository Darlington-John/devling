'use client';
import Link from 'next/link';

import { usePathname } from 'next/navigation';
import logo from '~/public/icons/logo.svg';
import { FaFacebook, FaGithub, FaInstagram, FaLinkedin } from 'react-icons/fa';
import Image from 'next/image';
import { useState } from 'react';
import { apiRequest } from '~/utils/api-request';
import { toast } from 'react-toastify';
import ClassicInput from '../inputs/classic-input';
import AsyncButton from '../buttons/async-button';
const Footer = () => {
	const mediaLink = [
		{
			icon: <FaGithub />,
			href: 'https://github.com/Darlington-John',
			id: 1,
		},
		{
			icon: <FaLinkedin />,
			href: 'https://www.linkedin.com/in/darlington-john/',
			id: 2,
		},
		{
			icon: <FaInstagram />,
			href: 'https://www.instagram.com/jxtdarlington/',
			id: 3,
		},

		{
			icon: <FaFacebook />,
			href: 'https://web.facebook.com/darlington.onuoha.165/',
			id: 4,
		},
	];

	const linkname = usePathname();
	const [email, setEmail] = useState('');
	const [subscribing, setSubscribing] = useState(false);
	const [error, setError] = useState('');
	const [subscribeSuccess, setSubscribeSuccess] = useState(false);
	const isValidEmail = (email: string): boolean => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	};

	const subscribe = async () => {
		if (subscribing) {
			return;
		}
		if (email.trim() === '') {
			setError('Email required');
			return;
		}
		if (!isValidEmail(email.trim().toLowerCase())) {
			setError('Please enter a valid email address');
			return;
		}
		setSubscribing(true);
		setError('');
		await apiRequest({
			url: '/api/subscribe',
			method: 'POST',
			body: { email },
			onSuccess: (res) => {
				toast.success(res.message);
				setSubscribeSuccess(true);
				setTimeout(() => setSubscribeSuccess(true), 3000);
			},
			onError: (error) => {
				setError(error);
			},
			onFinally: () => {
				setSubscribing(false);
			},
		});
	};
	return (
		<footer
			className={` cta-section border-t-2 border-dotted border-t-grey flex flex-col w-full  text-darkGrey ${
				linkname.startsWith('/admin') && 'hidden'
			}`}
		>
			<div className="flex item   max-3xl:px-10 max-xs:px-5 max-lg:flex-col max-sm:px-5 justify-between items-center max-w-[1500px] mx-auto w-full">
				<div className=" py-12 max-lg:py-5   text-white shrink-0 flex flex-col max-xl:px-0 max-lg:border-none   max-sm:px-0 max-lg:max-w-[600px] max-lg:w-full">
					<div className=" flex flex-col gap-6 max-w-[500px]">
						<div className="flex  flex-col gap-3">
							<Image
								src={logo}
								className="invert max-w-60"
								alt="devling logo"
							/>
							<p className="text-lg text-silver max-md:text-sm">
								A fun mix of food, travel, tech, and movies — I share stories,
								tips, and discoveries that make everyday life a little more
								exciting.
							</p>
						</div>
						<div className="flex  items-center gap-4">
							{mediaLink.map((media) => (
								<Link
									key={media.id}
									href={media.href}
									className="text-2xl link-style"
								>
									{media.icon}
								</Link>
							))}
						</div>
						<div className="flex gap-3 items-center  text-white">
							<span className=" text-sm font-light">
								© {new Date().getFullYear()} Devling by Darlington John. All
								rights reserved
							</span>
						</div>
					</div>
				</div>

				<section className="relative h-[400px] p-10 overflow-hidden max-lg:p-5 max-lg:h-auto max-md:px-0">
					<div className="flex gap-10 w-full flex-col relative items-center justify-center max-w-[1400px] h-full mx-auto z-[30]">
						<div className=" flex items-center w-full">
							<div className="flex flex-col gap-3 relative z-30 self-end w-full">
								<h2 className="text-[32px] max-lg:text-xl text-fade-blue poppins-bold">
									Subscribe to my newsletter
								</h2>
								<p className="max-w-[600px] text-silver text-base font-semibold max-lg:text-sm max-sm:font-normal">
									Love what you read? Subscribe to my newsletter and get fresh
									stories on food, travel, tech, and movies straight to your
									inbox!
								</p>
							</div>
						</div>
						<div className="flex gap-2  w-full items-end justify-start relative">
							<ClassicInput
								value={email}
								setValue={setEmail}
								error={error}
								setError={setError}
								classname_override="  !self-start max-xs:!w-full "
								errorContent={'Please enter a valid email address'}
								placeholder="Your email"
								aria-label="Email address for newsletter subscription"
							/>
							<AsyncButton
								action="Subscribe"
								classname_override="!w-[200px]"
								loading={subscribing}
								success={subscribeSuccess}
								onClick={subscribe}
							/>
						</div>
					</div>
				</section>
			</div>
			<div className="flex   w-full py-10  px-20 items-center justify-between text-[10px]  text-dimGrey  capitalize max-sm:px-5 flex-wrap max-w-[1500px] mx-auto gap-5 ">
				<div className="flex gap-3 items-center  text-white"></div>
			</div>
		</footer>
	);
};

export default Footer;

