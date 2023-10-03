import { useState } from "react";
import { User } from "@/atoms/userAtom";
import { findUserById } from "@/services/users";

export default function useReceiverSearcher() {
	const [foundUsers, setFoundUsers] = useState<User[]>([]);

	const searchReceiver = async (id: string) => {
		const matchLocal = foundUsers.find((user) => user.id === id);

		if (matchLocal) {
			return matchLocal;
		} else {
			const user = await findUserById(id);
			if (user) {
				setFoundUsers((prev) => [...prev, user]);
				return user;
			} else {
				return null;
			}
		}
	};

	return searchReceiver;
}
