import { FaCheckCircle, FaEnvelope } from 'react-icons/fa';
import ClassicInput from './inputs/classic-input';
import { useState } from 'react';
import { apiRequest } from '~/utils/api-request';
import { toast } from 'react-toastify';
import AsyncButton from './buttons/async-button';
import { usePopup } from '~/utils/toggle-popups';
import { FaXmark } from 'react-icons/fa6';
interface aboutProps {
	className_override?: string;
}
const AboutBlog = ({ className_override }: aboutProps) => {
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
				toast.success(res.message, {
					icon: <FaCheckCircle className="text-white text-2xl" />,
				});
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
	const {
		isActive: aboutPrompt,
		isVisible: aboutPromptVisible,
		ref: aboutPromptRef,
		togglePopup: toggleAboutPrompt,
	} = usePopup();

	return (
		<>
			<aside
				className={`flex-col max-xl:flex-row  items-start  gap-5 max-md:flex-col sticky top-28 ${className_override}`}
			>
				<div className="w-[450px] bg-navy radial border-grey border rounded-2xl  shrink-0 flex flex-col gap-4 items-center justify-between  shadow-lg p-4 max-xl:w-1/2 max-xl:static max-md:w-full max-xl:shadow-sm max-xs:gap-2">
					<FaEnvelope className="text-4xl text-blue " />

					<h3 className="text-lg poppins text-center text-fade-blue">
						Subscribe to my newsletter
					</h3>
					<p className="text-center text-silver">
						Get the latest hosting tips and business insights
					</p>
					<div className="flex flex-col gap-1 w-full">
						<div className="flex gap-2 flex-col w-full items-start justify-start">
							<ClassicInput
								value={email}
								setValue={setEmail}
								error={error}
								setError={setError}
								classname_override="!w-full !self-start"
								errorContent={'Please enter a valid email address'}
								placeholder="Your email"
								name="email"
							/>

							<AsyncButton
								action="Subscribe"
								classname_override="!w-full"
								loading={subscribing}
								success={subscribeSuccess}
								disabled={!email}
								onClick={subscribe}
							/>
						</div>
						{error && <p className="text-sm text-red-300">{error}</p>}
					</div>

					<span className="text-xs text-silver">
						I&apos;ll never share your email. Unsubscribe anytime.
					</span>
				</div>
			</aside>
			{aboutPrompt && (
				<div className="fixed bottom-[0px]  h-full w-full  z-50 left-0 flex  justify-center  items-center        backdrop-brightness-50  px-8     max-md:px-2">
					<div
						className={`w-[800px]     mid-popup   duration-300 ease-in-out flex flex-col py-6 px-2  gap-4   rounded-lg bg-white  items-center   relative   ${
							aboutPromptVisible ? '' : 'mid-popup-hidden'
						}  `}
						ref={aboutPromptRef}
					>
						<button
							className="h-8 w-8 bg-gray-500 text-white rounded-full flex items-center justify-center absolute top-4 right-4 max-xs:h-7 max-xs:w-7 "
							onClick={toggleAboutPrompt}
						>
							<FaXmark className="text-xl max-xs:text-base" />
						</button>
						<div className="flex flex-col gap-4 max-h-[90vh] overflow-auto px-10 py-4 new-article max-md:px-3 max-2xs:px-2 ">
							<div className="flex flex-col gap-1 items-center max-2xs:items-start w-full">
								<h4 className="text-2xl text-center max-2xs:text-start poppins-bold max-2xs:text-xl">
									About the WeFitHost Blog
								</h4>
								<p className="text-base text-center max-2xs:text-start max-w-[500px] max-2xs:text-[15px]">
									Welcome to the WeFitHost Blog – Your Ultimate Resource for Web
									Hosting & Online Success.
								</p>
							</div>
							<p className="text-base max-2xs:text-[15px]">
								Navigating the world of web hosting, website performance, and
								online business growth can be complex. You have questions about
								speed, security, scalability, and strategy. That&apos;s where we
								come in.
							</p>
							<p className="text-base max-2xs:text-[15px]">
								The WeFitHost blog is more than just a collection of articles;
								it&apos;s a dedicated hub of knowledge, insights, and practical
								advice designed to empower you—the website owner, developer, and
								entrepreneur.
							</p>
							<div className="flex flex-col w-full ">
								<h5 className="text-base max-2xs:text-[15px] font-semibold">
									Our Mission
								</h5>
								<p className="text-base max-2xs:text-[15px]">
									Our mission is simple: to demystify web technology and provide
									you with the actionable information you need to build, manage,
									and grow a successful online presence. We believe that with
									the right tools and knowledge, anyone can thrive online.
									We&apos;re here to provide that knowledge.
								</p>
							</div>
							<div className="flex flex-col w-full ">
								<h5 className="text-base max-2xs:text-[15px] font-semibold">
									What You&apos;ll Find Here:
								</h5>
								<p className="text-sm text-gray-600">
									We publish high-quality, in-depth content on a wide range of
									categories critical to your online journey:
								</p>
								<ul className="list-disc list-inside flex flex-col gap-1">
									<li className="text-base max-2xs:text-[15px]">
										Web Hosting Explained:
										<p className="text-gray-600">
											Clear guides on different types of hosting (Shared, VPS,
											Dedicated, Cloud), how to choose the right plan, and
											understanding the technical jargon.
										</p>
									</li>

									<li className="text-base max-2xs:text-[15px]">
										Performance & Speed Optimization:
										<p className="text-gray-600">
											Tips, tricks, and tutorials on how to make your website
											load faster, improving user experience and SEO.
										</p>
									</li>

									<li className="text-base max-2xs:text-[15px]">
										Security Best Practices:
										<p className="text-gray-600">
											Essential advice on how to protect your website from
											threats, keep your data safe, and ensure peace of mind.
										</p>
									</li>

									<li className="text-base max-2xs:text-[15px]">
										Website Management:
										<p className="text-gray-600">
											Guides on using popular platforms like WordPress, cPanel,
											and more to manage your site efficiently.
										</p>
									</li>

									<li className="text-base max-2xs:text-[15px]">
										Business Growth & Online Strategy:
										<p className="text-gray-600">
											Insights on how to leverage your hosted website to attract
											visitors, convert customers, and grow your brand.
										</p>
									</li>

									<li className="text-base max-2xs:text-[15px]">
										News & Trends:
										<p className="text-gray-600">
											Industry Updates on the latest in web technology, hosting
											innovations, and digital trends that could impact your
											site.
										</p>
									</li>
								</ul>
							</div>
							<div className="flex flex-col w-full ">
								<h5 className="text-base max-2xs:text-[15px] font-semibold">
									Who We Write For
								</h5>
								<p className="text-sm text-gray-600">
									Our content is crafted for a diverse audience:
								</p>
								<ul className="list-disc list-inside flex flex-col gap-1">
									<li className="text-base max-2xs:text-[15px] text-gray-600 ">
										Beginners taking their first steps into creating a website.
									</li>

									<li className="text-base max-2xs:text-[15px] text-gray-600 ">
										Small Business Owners looking to establish or improve their
										online storefront.
									</li>

									<li className="text-base max-2xs:text-[15px] text-gray-600 ">
										Bloggers & Content Creators who need a reliable and fast
										platform for their audience.
									</li>

									<li className="text-base max-2xs:text-[15px] text-gray-600 ">
										Web Developers & Agencies seeking advanced tips on server
										management and client hosting solutions.
									</li>
								</ul>
							</div>
							<div className="flex flex-col w-full bg-purple-50 p-4 rounded-xl">
								<h5 className="text-base max-2xs:text-[15px] ">
									Thank you for visiting and being part of our journey. We’re
									always excited to share more insights with you.
								</h5>
								<p className="text-base max-2xs:text-[15px] font-semibold text-end">
									—The WeFitHost Team
								</p>
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default AboutBlog;

