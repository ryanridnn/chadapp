import { cva } from "class-variance-authority";
import { Loader } from "lucide-react";
import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";

interface LoadingButtonProps
	extends DetailedHTMLProps<
		ButtonHTMLAttributes<HTMLButtonElement>,
		HTMLButtonElement
	> {
	loading?: boolean;
	text: string;
	size?: "sm" | "default";
	Icon?: React.FC;
	rightIcon?: boolean;
}

const LoadingButtonVariants = cva("btn", {
	variants: {
		loading: {
			on: "!pl-3",
			off: "",
		},
		size: {
			sm: "!px-4 !py-2",
			default: "",
		},
	},
	defaultVariants: {
		loading: "off",
		size: "default",
	},
});

export default function LoadingButton({
	loading,
	text,
	size,
	Icon,
	rightIcon,
	...props
}: LoadingButtonProps) {
	return (
		<button
			{...props}
			className={LoadingButtonVariants({
				loading: loading ? "on" : "off",
				size,
			})}
			disabled={loading || props.disabled}
		>
			{Icon && !rightIcon && !loading && <Icon />}
			{loading && (
				<div className="animate-spin">
					<Loader size={16} />
				</div>
			)}
			<div>{text}</div>
			{Icon && rightIcon && !loading && <Icon />}
		</button>
	);
}
