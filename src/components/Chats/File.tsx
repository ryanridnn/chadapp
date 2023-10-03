import { Paperclip, X } from "lucide-react";
import { useEffect, useState } from "react";

interface FileProps {
	file: File;
	onRemove: () => void;
}

export default function FileComp({ file, onRemove }: FileProps) {
	const isImage = file.type.includes("image/");
	const getFileSize = () => {
		return Number(file.size.toFixed(2));
	};

	const fileSize = getFileSize();

	const [imageSrc, setImageSrc] = useState<string>("");

	useEffect(() => {
		if (file) {
			const url = URL.createObjectURL(file);
			setImageSrc(url);
		}
	}, [file]);

	return (
		<div className="flex ml-3 pt-4">
			{isImage && (
				<div className="relative w-[64px] h-[64px]">
					<div className="w-full h-full rounded-lg overflow-hidden">
						<img
							src={imageSrc}
							className="w-full"
							alt="Added file"
						/>
					</div>
					<button
						onClick={onRemove}
						className="absolute top-0 right-0 translate-x-[50%] translate-y-[-50%] base-btn bg-white p-1 rounded-full text-app-theme-orange-100 hover:scale-[1.1]"
					>
						<X size={14} />
					</button>
				</div>
			)}
			{!isImage && (
				<div className="relative flex items-center gap-3 h-[56px] bg-app-grey-500 rounded-lg pl-2 pr-5">
					<div className="flex justify-center items-center rounded-md h-[40px] w-[40px] bg-app-grey-600">
						<Paperclip size={18} />
					</div>
					<div className="text-sm font-semibold">{file.name}</div>
					<button
						onClick={onRemove}
						className="absolute top-0 right-0 translate-x-[50%] translate-y-[-50%] base-btn bg-white p-1 rounded-full text-app-theme-orange-100 hover:scale-[1.1]"
					>
						<X size={14} />
					</button>
				</div>
			)}
		</div>
	);
}
