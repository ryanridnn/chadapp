import { cva } from "class-variance-authority";
import { X } from "lucide-react";

const PopupVariants = cva(
	"fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] transition z-[999] bg-white min-w-[500px] max-w-[90vw] p-5 rounded-3xl z-[999]",
	{
		variants: {
			state: {
				on: "opacity-1 pointer-events-all",
				off: "opacity-0 pointer-events-none",
			},
		},
		defaultVariants: {
			state: "off",
		},
	},
);

const LayerVariants = cva(
	"absolute top-0 left-0 w-screen h-screen bg-black  transition z-[10]",
	{
		variants: {
			state: {
				on: "bg-opacity-10 pointer-events-all",
				off: "bg-opacity-0 pointer-events-none",
			},
		},
		defaultVariants: {
			state: "off",
		},
	},
);

interface PopupProps {
	show: boolean;
	setClose: () => void;
	children: React.ReactNode;
}

export default function Popup({ show, setClose, children }: PopupProps) {
	return (
		<div>
			<div className={PopupVariants({ state: show ? "on" : "off" })}>
				<div className="flex justify-end">
					<button
						onClick={setClose}
						className="w-[2rem] h-[2rem] rounded-full bg-app-grey-100 flex items-center justify-center hover:bg-app-grey-400 transition"
					>
						<X size={20} />
					</button>
				</div>
				{children}
			</div>
			<div
				onClick={setClose}
				className={LayerVariants({ state: show ? "on" : "off" })}
			></div>
		</div>
	);
}
