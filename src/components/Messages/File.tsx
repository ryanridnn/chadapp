import { MessageFile } from "@/atoms/messageAtom";
import { cva } from "class-variance-authority";
import { ArrowDownToLine, Paperclip } from "lucide-react";

interface FileCompProps {
	file: MessageFile;
	byMe: boolean;
}

const CardVariants = cva(
	"mt-2 relative flex items-center justify-between gap-3 h-[56px] rounded-lg pl-2 pr-5",
	{
		variants: {
			user: {
				me: "bg-[#474747]",
				other: "bg-app-grey-700",
			},
		},
	},
);

const IconVariants = cva(
	"flex justify-center items-center rounded-md h-[40px] w-[40px]",
	{
		variants: {
			user: {
				me: "bg-[#5F5F5F] text-white",
				other: "bg-app-grey-100",
			},
		},
	},
);

export default function FileComp({ file, byMe }: FileCompProps) {
	const downloadFile = () => {
		window.open(file.url);
	};

	return (
		<div className="">
			{file.type === "image" && (
				<div className="flex flex-col gap-3 pt-3">
					<div className="relative rounded-lg overflow-hidden">
						<img src={file.url} alt={file.name} />
						<button
							onClick={downloadFile}
							className="absolute top-[.5rem] right-[.5rem] base-btn w-[24px] h-[24px] pb-[2px] rounded-full bg-[#fff] bg-opacity-[.2] hover:bg-opacity-[.4] flex items-center justify-center text-white"
						>
							<ArrowDownToLine size={16} />
						</button>
					</div>
					<div className="">{file.name}</div>
				</div>
			)}
			{file.type === "file" && (
				<div className={CardVariants({ user: byMe ? "me" : "other" })}>
					<div className="flex items-center gap-3">
						<div
							className={IconVariants({
								user: byMe ? "me" : "other",
							})}
						>
							<Paperclip size={18} />
						</div>
						<div className="text-sm font-semibold">{file.name}</div>
					</div>
					<button
						onClick={downloadFile}
						className="base-btn w-[24px] h-[24px] pb-[2px] rounded-full bg-app-theme-orange-100 flex items-center justify-center text-white"
					>
						<ArrowDownToLine size={16} />
					</button>
				</div>
			)}
		</div>
	);
}
