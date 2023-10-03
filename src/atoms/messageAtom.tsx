import { atom, useRecoilState, useRecoilValue } from "recoil";

export interface MessageFile {
	type: "image" | "file";
	url: string;
	name: string;
}

export interface Message {
	content: string;
	id: string;
	chats: string[];
	by: string;
	updatedAt: string;
	deleted?: boolean;
	isFile?: boolean;
	file?: MessageFile;
}

const defaultMessages: Message[] = [];

const messagesAtom = atom({
	key: "messages",
	default: defaultMessages,
});

const filteredMessagesAtom = atom({
	key: "filteredMessages",
	default: [],
});

export const useFilteredMessagesValue = () => {
	const messages = useRecoilValue(filteredMessagesAtom);

	return messages;
};

export const useFilteredMessagesState = () => {
	const [filteredMessages, setFilteredMessages] =
		useRecoilState(filteredMessagesAtom);

	return {
		filteredMessages,
		setFilteredMessages,
	};
};

export const useMessagesValue = () => {
	const messages = useRecoilValue(messagesAtom);

	return messages;
};

export const useMessagesState = () => {
	const [messages, setMessages] = useRecoilState(messagesAtom);

	return {
		messages,
		setMessages,
	};
};
