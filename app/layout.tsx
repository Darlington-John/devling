import type { Metadata } from 'next';
import './globals.css';

import localFont from 'next/font/local';
import Header from './components/header/header';
import { ToastContainer } from 'react-toastify';
import Footer from './components/footer/footer';
import { UtilsProvider } from './context/utils-context';
import Overlay from './components/overlay';
import AuthPrompt from './components/auth/auth';
import { AuthProvider } from './context/auth-context';
import { NextAuthProvider } from './next-auth-provider';
import { CategoriesProvider } from './context/categories-context';
import Script from 'next/script';
import UpdateIp from './components/update-ip';
import { Analytics } from '@vercel/analytics/next';
const PoppinsReg = localFont({
	src: './fonts/Poppins-Regular.ttf',
	variable: '--font-poppins',
});

const QuicksandReg = localFont({
	src: './fonts/Quicksand-VariableFont_wght.ttf',
	variable: '--font-quicksand',
});
const PoppinsBold = localFont({
	src: './fonts/Poppins-ExtraBold.ttf',
	variable: '--font-poppinsextra',
});
export const metadata: Metadata = {
	title: 'Travel, Tech & Movie Stories That Inspire Everyday Life',
	alternates: {
		canonical: 'https://devling.vercel.app',
	},
	keywords: [
		'Devling',
		'Devling Blog',
		'Travel Blog',
		'Tech Blog',
		'Darlington John',
		'Darlington',
		'Movies Blog',
		'Blog in Nigeria',
		'Freelancer',
	],
	description:
		'Discover articles on travel, tech, and movies at Devling Blog — your one-stop spot for tasty reads, travel inspo, and film reviews!',
	openGraph: {
		title: 'Devling Blog',
		description:
			'Discover articles on travel, tech, and movies at Devling Blog — your one-stop spot for tasty reads, travel inspo, and film reviews!',
		url: 'https://res.cloudinary.com/dycw73vuy/image/upload/v1760173027/Screenshot_2025-10-11_at_9.55.25_AM_c8ajaz.png',
		siteName: 'Devling Blog',
		images: [
			{
				url: 'https://res.cloudinary.com/dycw73vuy/image/upload/v1760173027/Screenshot_2025-10-11_at_9.55.25_AM_c8ajaz.png', // your OG image
				width: 1200,
				height: 630,
				alt: 'Devling Blog Cover',
			},
		],
		locale: 'en_US',
		type: 'website',
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Devling Blog',
		description:
			'Discover articles on travel, tech, and movies at Devling Blog — your one-stop spot for tasty reads, travel inspo, and film reviews!',
		images: [
			'https://res.cloudinary.com/dycw73vuy/image/upload/v1760173027/Screenshot_2025-10-11_at_9.55.25_AM_c8ajaz.png',
		], // can reuse OG image
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" data-scroll-behavior="smooth">
			<head>
				<meta
					name="google-site-verification"
					content="KOKNMGeWap4j_ppWm9uSPp6Hk7OSv-BWkSkHkW4_rWU"
				/>
				<script></script>
				<Script
					async
					src="https://www.googletagmanager.com/gtag/js?id=G-CSTLY9HZDZ"
				></Script>
				<Script id="google-analytics">
					{`window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-CSTLY9HZDZ');`}
				</Script>
			</head>
			<body
				className={`${PoppinsReg.variable}  ${PoppinsBold.variable}  ${QuicksandReg.variable} antialiased  flex flex-col mx-auto bg-dark-navy`}
				id="body"
			>
				<NextAuthProvider>
					<ToastContainer position="bottom-right" closeButton={false} />
					<UtilsProvider>
						<CategoriesProvider>
							<AuthProvider>
								<UpdateIp />
								<Header />
								<Overlay />
								<AuthPrompt />
								{children}
								<Analytics />
								<Footer />
							</AuthProvider>
						</CategoriesProvider>
					</UtilsProvider>
				</NextAuthProvider>
			</body>
		</html>
	);
}

