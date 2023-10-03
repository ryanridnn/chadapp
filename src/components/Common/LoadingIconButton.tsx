import { Loader } from "lucide-react";
import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";

interface LoadingIconButtonProps
	extends DetailedHTMLProps<
		ButtonHTMLAttributes<HTMLButtonElement>,
		HTMLButtonElement
	> {
	loading?: boolean;
	Icon?: React.FC;
}

export default function LoadingIconButton({
	loading,
	Icon,
	...props
}: LoadingIconButtonProps) {
	return (
		<button {...props}>
			{!loading && Icon && <Icon />}
			{!loading && !Icon && <div>Button</div>}
			{loading && (
				<div>
					<div className="animate-spin">
						<Loader size={16} />
					</div>
				</div>
			)}
		</button>
	);
}
