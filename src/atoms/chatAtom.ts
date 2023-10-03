import { User } from "@/atoms/userAtom";
import { Message } from "@/atoms/messageAtom";
import { atom, useRecoilState, useRecoilValue } from "recoil";

export interface Chat {
	id: string;
	with: User;
	lastMessage: Pick<Message, "id" | "by" | "content"> | null;
	updatedAt: string | null;
	unread: number;
	unreadMessages: string[];
	deletedMessages: string[];
	startChat?: boolean;
}

export type ActiveState = Chat | null;

const defaultChats: Chat[] = [];

const activeChatState = atom<ActiveState>({
	key: "activeChatState",
	default: null,
});

const chatsState = atom({
	key: "chatsState",
	default: defaultChats,
});

export const useActiveChatValue = () => {
	const activeChat = useRecoilValue(activeChatState);

	return activeChat;
};

export const useActiveChatState = () => {
	const [activeChat, setActiveChat] = useRecoilState(activeChatState);

	return { activeChat, setActiveChat };
};

export const useChatsValue = () => {
	const chats = useRecoilValue(chatsState);

	return chats;
};

export const useChatsState = () => {
	const [chats, setChats] = useRecoilState(chatsState);

	return { chats, setChats };
};

export const getStartChat = (user: User): Chat => {
	return {
		id: "",
		lastMessage: null,
		updatedAt: null,
		unread: 0,
		startChat: true,
		with: user,
		unreadMessages: [],
		deletedMessages: [],
	};
};
