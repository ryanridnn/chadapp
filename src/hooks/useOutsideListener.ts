import { useEffect } from "react";

export default function useOutsideListener(setShow: any, elementRef: any) {
	useEffect(() => {
		const outsideClickListener = (e: any) => {
			setShow((prevShow: boolean) => {
				if (
					prevShow &&
					elementRef.current &&
					!elementRef.current.contains(e.target)
				) {
					return false;
				} else {
					return prevShow;
				}
			});
		};

		window.addEventListener("click", outsideClickListener);

		return () => {
			window.removeEventListener("click", outsideClickListener);
		};
	}, []);
}
