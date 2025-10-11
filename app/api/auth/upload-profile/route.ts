import { NextRequest, NextResponse } from 'next/server';
import cloudinary from 'cloudinary';
import connectMongo from '~/lib/connect-mongo';
import User from '~/lib/models/user';

cloudinary.v2.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function PATCH(req: NextRequest) {
	try {
		const formData = await req.formData();
		const uploaded_image = formData.get('uploaded_image');
		const userId = formData.get('userId');

		if (!userId) {
			return NextResponse.json({ error: 'UserId not fount' }, { status: 401 });
		}

		if (
			!uploaded_image ||
			typeof uploaded_image === 'string' ||
			uploaded_image.size === 0
		) {
			return NextResponse.json(
				{ error: 'No file uploaded or incorrect format' },
				{ status: 400 },
			);
		}

		const buffer = Buffer.from(await uploaded_image.arrayBuffer());

		const uploadResult = await new Promise<{ secure_url: string }>(
			(resolve, reject) => {
				const uploadStream = cloudinary.v2.uploader.upload_stream(
					{ folder: 'devling_blog_profiles' },
					(error, result) => {
						if (error) {
							reject(new Error(error.message || 'Upload failed'));
						} else {
							resolve(result as { secure_url: string });
						}
					},
				);
				uploadStream.end(buffer);
			},
		);

		await connectMongo();
		const user = await User.findByIdAndUpdate(
			userId,
			{ profile: uploadResult.secure_url },
			{ new: true },
		);

		if (!user) {
			return NextResponse.json({ error: 'User not found' }, { status: 404 });
		}

		return NextResponse.json({ url: uploadResult.secure_url });
	} catch (error) {
		console.log(error);
		return NextResponse.json(
			{ error: 'An error occured, try again' },
			{ status: 500 },
		);
	}
}

