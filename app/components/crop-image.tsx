import { useCallback, useState } from 'react';
import Cropper from 'react-easy-crop';
import getCroppedImg from '~/utils/crop-image';

interface Props {
	ref: React.RefObject<HTMLDivElement | null>;
	selecting: boolean;
	setSelecting: React.Dispatch<React.SetStateAction<boolean>>;
	setImagePreview: React.Dispatch<React.SetStateAction<string | null>>;
	setImageBlob: React.Dispatch<React.SetStateAction<Blob | null>>;
	imageUrl: string | null;
	setImageUrl: React.Dispatch<React.SetStateAction<string | null>>;
	aspectRatio?: number; // ✅ New prop for crop ratio
	outputWidth?: number; // ✅ Optional, for dynamic output size
	outputHeight?: number;
}

const CropImage = ({
	selecting,
	setSelecting,
	ref,
	setImagePreview,
	setImageBlob,
	imageUrl,
	setImageUrl,
	aspectRatio = 1, // default 1:1
	outputWidth = 400,
	outputHeight = 400,
}: Props) => {
	type Area = { x: number; y: number; width: number; height: number };
	const [crop, setCrop] = useState({ x: 0, y: 0 });
	const [zoom, setZoom] = useState(1);
	const [ImageCropPixels, setImageCropPixels] = useState<Area | null>(null);

	const onCropComplete = useCallback(
		(_croppedArea: Area, croppedAreaPixels: Area) => {
			if (!imageUrl) return console.error('Image URL is null.');

			const image = new Image();
			image.src = imageUrl;

			image.onload = () => {
				const scaleX = image.naturalWidth / image.width;
				const scaleY = image.naturalHeight / image.height;

				setImageCropPixels({
					x: croppedAreaPixels.x * scaleX,
					y: croppedAreaPixels.y * scaleY,
					width: croppedAreaPixels.width * scaleX,
					height: croppedAreaPixels.height * scaleY,
				});
			};
		},
		[imageUrl],
	);

	const showCroppedImage = useCallback(async () => {
		if (!imageUrl || !ImageCropPixels) return;

		const blob = await getCroppedImg({
			imageSrc: imageUrl,
			pixelCrop: ImageCropPixels,
			width: outputWidth,
			height: outputHeight,
		});

		if (!blob) return;

		const previewUrl = URL.createObjectURL(blob);
		setImagePreview(previewUrl);
		setImageBlob(blob);
	}, [
		imageUrl,
		ImageCropPixels,
		setImagePreview,
		setImageBlob,
		outputWidth,
		outputHeight,
	]);

	const handleCancelCrop = () => {
		setSelecting(false);
		setCrop({ x: 0, y: 0 });
		setZoom(1);
		setImageUrl(null);
		setImageCropPixels(null);
		setImageBlob(null);
		setImagePreview(null);
	};

	return (
		<div
			className="w-[350px] flex flex-col py-6 px-6 gap-4 rounded-lg bg-navy radial border border-grey items-center font-normal"
			ref={ref}
		>
			{selecting && (
				<div className="relative w-full h-[300px]">
					<Cropper
						image={imageUrl as string}
						crop={crop}
						zoom={zoom}
						aspect={aspectRatio} // ✅ Now dynamic
						onCropChange={setCrop}
						onZoomChange={setZoom}
						onCropComplete={onCropComplete}
					/>
				</div>
			)}

			{selecting && (
				<div className="w-full flex justify-between items-center">
					<div className="flex gap-2 items-center">
						<button
							onClick={() => setZoom((z) => Math.max(1, z - 0.1))}
							className="bg-gray-500 text-white hover:bg-gray-600 w-5 h-5 flex items-center justify-center font-bold"
						>
							-
						</button>
						<span className="text-sm text-silver">{zoom.toFixed(1)}x</span>
						<button
							onClick={() => setZoom((z) => Math.min(3, z + 0.1))}
							className="bg-gray-500 text-white hover:bg-gray-600 w-5 h-5 flex items-center justify-center font-bold"
						>
							+
						</button>
					</div>

					<div className="flex gap-2">
						<button
							onClick={handleCancelCrop}
							className="bg-gray-500 hover:bg-gray-600 px-3 py-2 text-white rounded text-xs"
						>
							Cancel
						</button>
						<button
							onClick={() => {
								showCroppedImage();
								setSelecting(false);
							}}
							className="bg-blue hover:bg-darkBlue px-3 py-2 text-white rounded text-xs"
						>
							Save
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default CropImage;
