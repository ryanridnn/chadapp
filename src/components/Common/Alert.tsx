import { cva } from "class-variance-authority";
import { AlertTriangle, CheckCircle, Info } from "lucide-react";
import { useState } from "react";

export enum AlertTypes {
	Danger = "danger",
	Success = "success",
	Default = "default",
}

export interface AlertType {
	type: AlertTypes;
	message: string;
	noTimeout?: boolean;
}

interface AlertProps {
	alert: AlertType | null;
}

export const useAlertHandler = (timeout: number = 5000) => {
	const [alert, setAlert] = useState<AlertType | null>(null);
	const [timer, setTimer] = useState<any>(null);

	const setNewAlert = (newAlert: AlertType | null) => {
		setAlert(newAlert);

		if (timer) {
			clearTimeout(timer);
		}

		if (newAlert && !newAlert.noTimeout) {
			const newTimer = setTimeout(() => {
				setAlert(null);
			}, timeout);
			setTimer(newTimer);
		}
	};

	return { alert, setAlert: setNewAlert };
};

const AlertVariants = cva(
	"flex items-center gap-2 font-semibold py-3 px-4 rounded-lg text-sm",
	{
		variants: {
			type: {
				danger: "bg-app-theme-danger-100 bg-opacity-[.08] text-app-theme-danger-100",
				success:
					"bg-app-theme-success-100 bg-opacity-[.06] text-app-theme-success-200",
				default: "bg-app-grey-100",
			},
		},
		defaultVariants: {
			type: "default",
		},
	},
);

export default function Alert({ alert }: AlertProps) {
	if (alert) {
		return (
			<div className={AlertVariants({ type: alert.type })}>
				{alert.type === AlertTypes.Default && (
					<div>
						<Info size={16} strokeWidth={2.5} />
					</div>
				)}
				{alert.type === AlertTypes.Danger && (
					<div className="">
						<AlertTriangle size={16} strokeWidth={2.5} />
					</div>
				)}
				{alert.type === AlertTypes.Success && (
					<div className="">
						<CheckCircle size={16} strokeWidth={2.5} />
					</div>
				)}
				<div>{alert.message}</div>
			</div>
		);
	} else {
		return <></>;
	}
}
