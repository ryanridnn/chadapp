import { useEffect, useState } from "react";

export default function useDebounce() {
	const [timer, setTimer] = useState<any>();

	const debounce = (func: () => void, time: number = 300) => {
		if (timer) {
			clearTimeout(timer);
		}
		const res = setTimeout(func, time);
		setTimer(res);
	};

	return debounce;
}
