import { NextRequest, NextResponse } from 'next/server';
import connectMongo from '~/lib/connect-mongo';
import { mailOptions, transporter } from '~/lib/nodemailer';
import { isValidObjectId } from 'mongoose';
import User from '~/lib/models/user';
import Alert from '~/lib/models/alerts';

export async function POST(req: NextRequest) {
	try {
		await connectMongo();

		const { message, adminId, email } = await req.json();

		if (message.trim() === '') {
			return NextResponse.json(
				{ error: 'A message is required' },
				{ status: 400 },
			);
		}
		if (email.trim() === '') {
			return NextResponse.json(
				{ error: 'Recipient email not provided' },
				{ status: 400 },
			);
		}
		if (!isValidObjectId(adminId)) {
			return NextResponse.json(
				{ error: 'Admin Id not provided or invalid' },
				{ status: 400 },
			);
		}

		const existingUser = await User.findById(adminId);
		if (!existingUser) {
			return NextResponse.json(
				{ error: 'No account found with this adminID' },
				{ status: 400 },
			);
		}

		if (existingUser.role === 'member') {
			return NextResponse.json(
				{ error: 'Only admins are allowed to perform this action' },
				{ status: 400 },
			);
		}

		const existingRecipient = await User.findOne({ email: email });
		if (!existingRecipient) {
			return NextResponse.json(
				{ error: 'No account found with the recipient email address' },
				{ status: 400 },
			);
		}

		await transporter.sendMail({
			...mailOptions,
			to: email,
			text: 'Message from Devling Blog',
			subject: 'Message from Devling Blog',
			html: `<table
	style="
		background-color: #fbfbff;
		font-family: Arial, sans-serif;
		border-radius: 10px;
		max-width: 400px;
		min-width:350px;
		margin: 10px auto;
		padding: 50px 30px;
	"
>
	<tr>
		<td align="center" style="padding-bottom: 10px">
			<img
				src="https://res.cloudinary.com/dycw73vuy/image/upload/v1760176571/Screenshot_2025-10-05_at_9.26.29_PM-removebg-preview_deooob.png"
				style="width: 150px"
				alt="Devling logo"
			/>
		</td>
	</tr>
	<tr>
		<td
			style="
				border-top: 1px solid #8a8a8a;
				padding: 50px 0px 0px;
				box-sizing: border-box;
				color: #000000;
			"
		>
			<p style="margin: 0; padding-bottom: 10px">Hello ${
				existingRecipient?.first_name
			},</p>
			<p
				style="
					font-size: 14px;
					font-weight: normal;
					line-height: 20px;
					margin: 0 0 20px 0;
				"
			>
				${message}
			</p>
		</td>
	</tr>

	<tr>
		<td align="start" style="padding-top: 20px">
			<p style="font-size: 14px; color: gray; margin: 0">
				©Devling. ${new Date()}
			</p>
			
		</td>
	</tr>
</table>
`,
		});
		await Alert.create({
			type: 'account_messaged',
			message: `messaged ${existingRecipient?.first_name} ${
				existingRecipient?.last_name || ''
			}`,
			triggered_by: existingUser._id,
			link: {
				url: `${message}`,
				label: 'Message',
			},
			status: 'info',
		});
		return NextResponse.json(
			{ message: 'Verification email sent successfully', email },
			{ status: 200 },
		);
	} catch (error) {
		console.log(error);
		return NextResponse.json(
			{ error: 'An server error occurred.' },
			{ status: 500 },
		);
	}
}

