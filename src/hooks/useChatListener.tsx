import {
	ActiveState,
	Chat,
	useActiveChatState,
	useChatsState,
} from "@/atoms/chatAtom";
import { useUserValue } from "@/atoms/userAtom";
import { useEffect, useState } from "react";
import { emptyDeletedMessage, readAllMessages } from "@/services/chats";
import { useMessagesState } from "@/atoms/messageAtom";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/services/firebase";
import { DB_COLLECTIONS } from "@/const";
import { getSnapData } from "@/services/helpers";
import { findMessagesByIds } from "@/services/messages";

export default function useChatListener() {
	const { activeChat, setActiveChat } = useActiveChatState();
	const currentUser = useUserValue();
	const [initialClear, setInitialClear] = useState<boolean>(false);
	const [startClearing, setStartClearing] = useState<boolean>(false);
	const { chats, setChats } = useChatsState();
	const { messages, setMessages } = useMessagesState();

	useEffect(() => {
		// if (activeChat && currentUser && currentUser.id && !startClearing) {
		// 	setStartClearing(true);

		// 	if (activeChat.unreadMessages.length > 0) {
		// 		console.log(activeChat.unreadMessages);
		// 		readAllMessages(
		// 			currentUser.id,
		// 			activeChat.id,
		// 			activeChat.unreadMessages,
		// 		).then((res) => {
		// 			setInitialClear(true);

		// 			setActiveChat(
		// 				(prev) =>
		// 					({
		// 						...prev,
		// 						unread: 0,
		// 						unreadMessages: [],
		// 					} as ActiveState),
		// 			);
		// 		});
		// 	}
		// }

		if (activeChat && currentUser && currentUser.id) {
			const unsub = onSnapshot(
				doc(
					db,
					DB_COLLECTIONS.Users,
					currentUser.id,
					DB_COLLECTIONS.Chats,
					activeChat.id,
				),
				async (snap) => {
					const currentChat = getSnapData(snap);

					if (
						currentChat.deletedMessages &&
						currentChat.deletedMessages.length > 0
					) {
						setMessages((prev) => {
							return prev.filter(
								(each) =>
									!(
										currentChat.deletedMessages || []
									).includes(each.id),
							);
						});

						emptyDeletedMessage(currentUser.id, currentChat.id);
					}

					if (currentChat.unreadMessages.length > 0) {
						const messages = await findMessagesByIds(
							currentChat.unreadMessages,
						);

						setMessages((prev) => {
							let ids: string[] = [];

							let newMessages = [...messages, ...prev];

							newMessages = newMessages.filter((message) => {
								if (ids.find((id) => id === message.id)) {
									return false;
								} else {
									ids.push(message.id);
									return true;
								}
							});

							return newMessages;
						});

						await readAllMessages(
							currentUser.id,
							activeChat.id,
							currentChat.unreadMessages,
						);

						setActiveChat(
							(prev) =>
								({
									...prev,
									...currentChat,
									with: prev?.with,
									unread: 0,
									unreadMessages: [],
								} as ActiveState),
						);
					}
				},
			);

			return unsub;
		}
	}, [activeChat, currentUser, initialClear]);
}
