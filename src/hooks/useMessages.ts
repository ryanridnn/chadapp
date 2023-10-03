import { Message, useMessagesState } from "@/atoms/messageAtom";
import { useEffect, useState } from "react";
import { useActiveChatValue } from "@/atoms/chatAtom";
import { findMessageByChatId } from "@/services/messages";

export default function useMessages() {
	const { messages, setMessages } = useMessagesState();
	const activeChat = useActiveChatValue();

	useEffect(() => {
		const getMessages = async (chatId: string) => {
			const retrievedMessages = await findMessageByChatId(chatId);
			setMessages(retrievedMessages);
		};

		if (activeChat && activeChat.id) {
			getMessages(activeChat.id);
		}
	}, [activeChat]);

	return messages;
}
