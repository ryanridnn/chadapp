import { Chat } from "@/atoms/chatAtom";
import {
	getCurrentISODate,
	getSnapData,
	getSnapsData,
} from "@/services/helpers";
import {
	FieldValue,
	addDoc,
	arrayRemove,
	arrayUnion,
	collection,
	doc,
	getDoc,
	getDocs,
	increment,
	query,
	updateDoc,
	where,
} from "firebase/firestore";
import { db } from "@/services/firebase";
import { DB_COLLECTIONS } from "@/const";
import { findUserById } from "../users";

type PayloadChat = Omit<Chat, "id">;

interface LastMessage {
	by: string;
	content: string;
}

export const findChatById = async (id: string, chatId: string) => {
	const chatRef = doc(
		db,
		DB_COLLECTIONS.Users,
		id,
		DB_COLLECTIONS.Chats,
		chatId,
	);

	const snap = await getDoc(chatRef);
	const chat = getSnapData(snap);

	const user = await findUserById(chat.with);

	return { ...chat, with: user };
};

export const findChatByReceiverId = async (id: string, receiverId: string) => {
	const chatsRef = collection(
		db,
		DB_COLLECTIONS.Users,
		id,
		DB_COLLECTIONS.Chats,
	);
	const q = query(chatsRef, where("with", "==", receiverId));
	const snaps = await getDocs(q);
	const chats = getSnapsData(snaps);

	if (chats.length > 0) {
		const chat = chats[0];

		const user = await findUserById(chat.with);

		return {
			...chat,
			with: user,
		};
	} else {
		return null;
	}
};

export const createChat = async (
	lastMessage: LastMessage,
	userId: string,
	receiverId: string,
) => {
	const chat = {
		lastMessage,
		with: receiverId,
		unread: 0,
		unreadMessages: [],
		updatedAt: getCurrentISODate(),
	};

	const chatsRef = collection(
		db,
		DB_COLLECTIONS.Users,
		userId,
		DB_COLLECTIONS.Chats,
	);

	const newChat = await addDoc(chatsRef, chat);

	return {
		id: newChat.id,
		...chat,
	};
};

export const findReceiverChatById = async (
	userId: string,
	receiverId: string,
) => {
	const chatsRef = collection(
		db,
		DB_COLLECTIONS.Users,
		receiverId,
		DB_COLLECTIONS.Chats,
	);
	const q = query(chatsRef, where("with", "==", userId));
	const snaps = await getDocs(q);
	const chats = getSnapsData(snaps);

	if (chats.length > 0) {
		return chats[0];
	} else {
		return null;
	}
};

interface AlertNewMessageProps {
	userId: string;
	chatId: string;
	message: {
		id: string;
		by: string;
		content: string;
	};
	noUnreadUpdate?: boolean;
}

interface AlertNewMessagePayload {
	lastMessage: {
		id: string;
		by: string;
		content: string;
	};
	unread?: FieldValue;
	unreadMessages?: FieldValue;
}

export const alertNewMessage = async ({
	userId,
	chatId,
	message,
	noUnreadUpdate,
}: AlertNewMessageProps) => {
	const chatRef = doc(
		db,
		DB_COLLECTIONS.Users,
		userId,
		DB_COLLECTIONS.Chats,
		chatId,
	);

	if (!noUnreadUpdate) {
		const payload = {
			lastMessage: {
				id: message.id,
				by: message.by,
				content: message.content,
			},
			unread: increment(1),
			unreadMessages: arrayUnion(message.id),
		};

		return await updateDoc(chatRef, payload);
	} else {
		const payload = {
			lastMessage: {
				id: message.id,
				by: message.by,
				content: message.content,
			},
		};

		return await updateDoc(chatRef, payload);
	}
};

export const readAllMessages = async (
	userId: string,
	chatId: string,
	unreadMessages: string[],
) => {
	const chatRef = doc(
		db,
		DB_COLLECTIONS.Users,
		userId,
		DB_COLLECTIONS.Chats,
		chatId,
	);

	await updateDoc(chatRef, {
		unread: increment(-1 * unreadMessages.length),
		unreadMessages: arrayRemove(...unreadMessages),
		deletedMessages: [],
	});

	const userRef = doc(db, DB_COLLECTIONS.Users, userId);

	await updateDoc(userRef, {
		unread: increment(-1 * unreadMessages.length),
	});

	return true;
};

interface updateLastMessageProps {
	userId: string;
	chat: Chat;
	lastMessage: {
		id: string;
		content: string;
		by: string;
	};
	deletedMessageId: string;
}

export const updateLastMessage = async ({
	userId,
	chat,
	lastMessage,
	deletedMessageId,
}: updateLastMessageProps) => {
	const chatRef = doc(
		db,
		DB_COLLECTIONS.Users,
		userId,
		DB_COLLECTIONS.Chats,
		chat.id,
	);

	const userRef = doc(db, DB_COLLECTIONS.Users, userId);

	const unreadMessages = chat.unreadMessages.filter(
		(message) => message !== deletedMessageId,
	);

	const payload = {
		lastMessage,
		unreadMessages: unreadMessages,
		unread: unreadMessages.length,
	};

	await updateDoc(chatRef, payload);

	if (
		chat.unreadMessages.find((messageId) => messageId === deletedMessageId)
	) {
		await updateDoc(userRef, {
			unread: increment(-1),
		});
	}
};

export const emptyDeletedMessage = async (userId: string, chatId: string) => {
	const chatRef = doc(
		db,
		DB_COLLECTIONS.Users,
		userId,
		DB_COLLECTIONS.Chats,
		chatId,
	);

	await updateDoc(chatRef, {
		deletedMessages: [],
	});
};
