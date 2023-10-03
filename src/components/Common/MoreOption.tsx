import { MoreVertical } from "lucide-react";
import { MouseEventHandler, useRef, useState } from "react";
import useOutsideListener from "@/hooks/useOutsideListener";
import { OptionControl } from "@/hooks/useOpenClose";
import { cva } from "class-variance-authority";

const PopupVariant = cva(
	"absolute mt-3 top-[100%] right-0 p-2 bg-white rounded-lg drop-shadow-lg min-w-[200px] z-[999]",
	{
		variants: {
			display: {
				on: "",
				off: "hidden",
			},
		},
		defaultVariants: {
			display: "on",
		},
	},
);

interface MoreOptionProps {
	children: React.ReactNode;
	optionControl: OptionControl;
}

export default function MoreOption({
	children,
	optionControl,
}: MoreOptionProps) {
	const { show, setShow, setOpen, setClose, popupRef } = optionControl;

	return (
		<div ref={popupRef} className="relative">
			<button
				onClick={() => setShow((prev) => !prev)}
				className="flex justify-center items-center w-[1.75rem] h-[1.75rem] rounded-full bg-app-grey-100 hover:bg-app-grey-400 hover:drop-shadow-lg transition duration-250"
			>
				<MoreVertical size={16} />
			</button>

			<div
				onClick={setClose}
				className={PopupVariant({ display: show ? "on" : "off" })}
			>
				{children}
			</div>
		</div>
	);
}

interface OptionProps {
	children: React.ReactNode;
	onClick: MouseEventHandler<HTMLButtonElement>;
	disabled?: boolean;
}

export const Option = ({ children, onClick, disabled }: OptionProps) => {
	return (
		<button
			onClick={onClick}
			className="flex items-center gap-2 text-sm py-2 px-3 bg-app-grey-100 rounded-md w-full font-semibold text-app-text-100 transition duration-150 hover-linear-grad-100 hover:scale-[1.03] hover:text-white disabled:text-app-text-300"
			disabled={disabled}
		>
			{children}
		</button>
	);
};
