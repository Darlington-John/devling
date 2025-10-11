import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectMongo from '~/lib/connect-mongo';
import { mailOptions, transporter } from '~/lib/nodemailer';

import User from '~/lib/models/user';
import verification from '~/lib/models/verification';
export async function POST(req: NextRequest) {
	try {
		await connectMongo();

		const { email, password, firstName, lastName } = await req.json();

		if (!firstName) {
			return NextResponse.json(
				{ error: 'First name is required' },
				{ status: 409 },
			);
		}

		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return NextResponse.json(
				{ error: 'This email is already in use, login instead.' },
				{ status: 409 },
			);
		}

		const verificationCode = Math.floor(1000 + Math.random() * 9000);
		const hashedVerificationCode = await bcrypt.hash(
			verificationCode.toString(),
			10,
		);

		const existingVerification = await verification.findOne({ email });

		if (existingVerification) {
			await verification.updateOne(
				{ email },
				{
					hashed_code: hashedVerificationCode,
					password: await bcrypt.hash(password, 10),
					first_name: firstName,
					last_name: lastName,
					oauth_provider: 'local',
					createdAt: new Date(),
				},
			);
		} else {
			await verification.create({
				email,
				hashed_code: hashedVerificationCode,
				password: await bcrypt.hash(password, 10),
				first_name: firstName,
				last_name: lastName,
				oauth_provider: 'local',
				createdAt: new Date(),
			});
		}

		await transporter.sendMail({
			...mailOptions,
			to: email,
			text: 'Hello. This mail is for your email verification.',
			subject: 'Welcome to Devling blog,Verify Your Email',
			html: `<table
	style="
		background-color: #fbfbff;
		font-family: Arial, sans-serif;
		border-radius: 10px;
		max-width: 400px;
		margin: 10px auto;
		padding: 50px 30px;
	"
>
	<tr>
		<td align="center" style="padding-bottom: 10px">
			<img
				src="https://res.cloudinary.com/dycw73vuy/image/upload/v1760176571/Screenshot_2025-10-05_at_9.26.29_PM-removebg-preview_deooob.png"
				style="width: 150px"
				alt="devling logo"
			/>
		</td>
	</tr>
	<tr>
		<td
			style="
				border-top: 1px solid #8a8a8a;
				padding: 50px 15px 0px;
				box-sizing: border-box;
				color: #000000;
			"
		>
			<p style="margin: 0; padding-bottom: 10px">Hello ${firstName},</p>
			<p
				style="
					font-size: 14px;
					font-weight: 300;
					line-height: 20px;
					margin: 0 0 20px 0;
				"
			>
				Thanks for signing up with Devling blog! Before you get started, we
				need you to confirm your email address. Please copy this number below to
				complete your signup.
			</p>
		</td>
	</tr>
	<tr>
		<td align="center" style="padding: 10px 0">
			<p style="font-size: 40px; color: #171639; font-weight: bold; margin: 0">
				${verificationCode}
			</p>
		</td>
	</tr>
	<tr>
		<td align="start" style="padding-top: 20px">
			<p style="font-size: 14px; color: gray; margin: 0">
				©devling. ${new Date()}
			</p>
			<p style="font-size: 12px; color: gray">
				You’re receiving this email from Darlington John.
			</p>
		</td>
	</tr>
</table>
`,
		});

		return NextResponse.json(
			{ message: 'Verification email sent successfully', email },
			{ status: 200 },
		);
	} catch (error) {
		console.log(error);
		return NextResponse.json(
			{ error: 'An error occurred during signup.' },
			{ status: 500 },
		);
	}
}

