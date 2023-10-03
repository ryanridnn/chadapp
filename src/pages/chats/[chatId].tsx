import ChatLayout from "@/components/Layout/ChatLayout";
import ChatPage from "@/components/Chats/ChatPage";
import useChatListener from "@/hooks/useChatListener";
import { useActiveChatState } from "@/atoms/chatAtom";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useUserValue } from "@/atoms/userAtom";
import { findChatById } from "@/services/chats";

function Page() {
	const router = useRouter();
	const { chatId } = router.query;
	const { activeChat, setActiveChat } = useActiveChatState();
	const currentUser = useUserValue();

	useChatListener();

	useEffect(() => {
		const getCurrentChat = async (userId: string, chatId: string) => {
			const chat = await findChatById(userId, chatId);

			setActiveChat(chat);
		};

		if (!activeChat && currentUser && currentUser.id) {
			getCurrentChat(currentUser.id, chatId as string);
		}
	}, [activeChat, currentUser]);

	return <ChatPage />;
}

Page.getLayout = ChatLayout;

export default Page;
