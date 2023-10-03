import {
	Dispatch,
	SetStateAction,
	useState,
	useRef,
	MutableRefObject,
} from "react";
import useOutsideListener from "@/hooks/useOutsideListener";

export interface OptionControl {
	show: boolean;
	setShow: Dispatch<SetStateAction<boolean>>;
	setOpen: () => void;
	setClose: () => void;
	popupRef: MutableRefObject<any>;
}

export default function useOpenClose(initialValue?: boolean) {
	const [show, setShow] = useState(() => initialValue || false);

	const popupRef = useRef<any>();

	const setOpen = () => {
		setShow(true);
	};

	const setClose = () => {
		setShow(false);
	};

	useOutsideListener(setShow, popupRef);

	return {
		show,
		setShow,
		setOpen,
		setClose,
		popupRef,
	};
}
