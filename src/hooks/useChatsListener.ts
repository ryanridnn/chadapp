import { db } from "@/services/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { useState, useEffect } from "react";
import { DB_COLLECTIONS } from "@/const";
import { getSnapsData } from "@/services/helpers";
import { useChatsState } from "@/atoms/chatAtom";
import useReceiverSearcher from "@/hooks/useReceiverSearcher";

export default function useChatsListener(userId: string) {
	const { chats, setChats } = useChatsState();

	const searchReceiver = useReceiverSearcher();

	useEffect(() => {
		if (userId) {
			const unsub = onSnapshot(
				collection(
					db,
					DB_COLLECTIONS.Users,
					userId,
					DB_COLLECTIONS.Chats,
				),
				async (snaps: any) => {
					const docs = getSnapsData(snaps);

					const allPromises = docs.map(async (doc: any) => {
						const receiver = await searchReceiver(doc.with);

						return {
							...doc,
							with: receiver,
						};
					});

					const populated = await Promise.all(allPromises);

					setChats(populated);
				},
			);

			return unsub;
		}
	}, [userId]);

	return chats;
}
