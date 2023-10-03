import ChatLayout from "@/components/Layout/ChatLayout";
import ChatPage from "@/components/Chats/ChatPage";
import {
	useActiveChatState,
	getStartChat,
	useChatsState,
} from "@/atoms/chatAtom";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { findUserById } from "@/services/users";

function Page() {
	const { activeChat, setActiveChat } = useActiveChatState();
	const router = useRouter();
	const { receiverId } = router.query;
	const { chats, setChats } = useChatsState();

	useEffect(() => {
		if (!activeChat) {
			findUserById(receiverId as string).then((user) => {
				if (user) {
					const startChat = getStartChat(user);

					setActiveChat(startChat);
				}
			});
		} else {
			const match = chats.find((chat) => {
				return (
					chat.with &&
					activeChat.with &&
					chat.with.id === activeChat.with.id
				);
			});

			if (!match) {
				setChats((prev) => {
					const filtered = prev.filter((prev) => !prev.startChat);

					return [activeChat, ...filtered];
				});
			}
		}
	}, [activeChat]);

	if (activeChat) {
		return <ChatPage />;
	} else {
		return <></>;
	}
}

Page.getLayout = ChatLayout;

export default Page;
