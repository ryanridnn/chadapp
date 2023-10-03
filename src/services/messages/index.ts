import { ActiveState } from "@/atoms/chatAtom";
import {
	createChat,
	findReceiverChatById,
	alertNewMessage,
	updateLastMessage,
} from "@/services/chats";
import {
	getCurrentISODate,
	getSnapData,
	getSnapsData,
} from "@/services/helpers";
import {
	DocumentData,
	Query,
	addDoc,
	arrayUnion,
	collection,
	deleteDoc,
	doc,
	getDoc,
	getDocs,
	increment,
	limit,
	orderBy,
	query,
	updateDoc,
	where,
} from "firebase/firestore";
import { db, storage } from "@/services/firebase";
import { DB_COLLECTIONS } from "@/const";
import { Chat as IChat } from "@/atoms/chatAtom";
import { v4 } from "uuid";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const messagesRef = collection(db, DB_COLLECTIONS.Messages);

interface Chat {
	userId: string;
	chatId: string;
}

import { Message } from "@/atoms/messageAtom";

export type SendMessagePayload = Pick<Message, "content" | "file" | "isFile">;

export const sendMessage = async (
	payload: SendMessagePayload,
	activeChat: ActiveState,
	userId: string,
) => {
	const { content, file, isFile } = payload;

	if (activeChat) {
		let chats: Chat[] = [];

		const receiverId = activeChat.with.id;
		let receiverChatId: string;

		if (activeChat.startChat) {
			const lastMessage = {
				by: userId,
				content: isFile && file ? file.name : content,
			};

			const userChat = await createChat(lastMessage, userId, receiverId);
			const receiverChat = await createChat(
				lastMessage,
				receiverId,
				userId,
			);

			chats = [
				{ userId, chatId: userChat.id },
				{ userId: receiverId, chatId: receiverChat.id },
			];

			receiverChatId = receiverChat.id;
		} else {
			const receiverChat = await findReceiverChatById(userId, receiverId);

			chats = [
				{
					userId,
					chatId: activeChat.id,
				},
				{
					userId: receiverId,
					chatId: receiverChat.id,
				},
			];

			receiverChatId = receiverChat.id;
		}

		let message: Omit<Message, "id"> = {
			content,
			by: userId,
			chats: chats.map((chat) => chat.chatId),
			updatedAt: getCurrentISODate(),
		};

		if (isFile) {
			message = {
				...message,
				isFile,
				file,
			};
		}

		const snap = await addDoc(messagesRef, message);

		alertNewMessage({
			userId: chats[0].userId,
			chatId: chats[0].chatId,
			message: {
				id: snap.id,
				content: isFile && file ? file.name : content,
				by: userId,
			},
			noUnreadUpdate: true,
		});

		alertNewMessage({
			userId: chats[1].userId,
			chatId: chats[1].chatId,
			message: {
				id: snap.id,
				content,
				by: userId,
			},
		});

		const receiverRef = doc(db, DB_COLLECTIONS.Users, receiverId);

		await updateDoc(receiverRef, {
			unread: increment(1),
		});

		return { id: snap.id, ...message };
	} else {
		return null;
	}
};

export const findMessageByChatId = async (
	chatId: string,
	docsLimit?: number,
) => {
	let q: Query<DocumentData, DocumentData>;

	if (docsLimit) {
		q = query(
			messagesRef,
			where("chats", "array-contains", chatId),
			orderBy("updatedAt", "desc"),
			limit(docsLimit),
		);
	} else {
		q = query(
			messagesRef,
			where("chats", "array-contains", chatId),
			orderBy("updatedAt", "desc"),
		);
	}

	const snaps = await getDocs(q);

	const messages = getSnapsData(snaps);

	return messages;
};

export const findMessageById = async (id: string) => {
	const messageRef = doc(db, DB_COLLECTIONS.Messages, id);
	const snap = await getDoc(messageRef);
	const message = getSnapData(snap);

	return message;
};

export const findMessagesByIds = async (ids: string[]) => {
	const promises = ids.map(async (id) => {
		return await findMessageById(id);
	});

	const messages = await Promise.all(promises);

	return messages.filter((message) => !!message);
};

interface deleteMessageProps {
	userId: string;
	chat: IChat;
	messageId: string;
}

export const deleteMessage = async ({
	chat,
	messageId,
	userId,
}: deleteMessageProps) => {
	const messageRef = doc(db, DB_COLLECTIONS.Messages, messageId);

	await deleteDoc(messageRef);
	const receiverChat = await findReceiverChatById(userId, chat.with.id);

	const receiverChatRef = doc(
		db,
		DB_COLLECTIONS.Users,
		chat.with.id,
		DB_COLLECTIONS.Chats,
		receiverChat.id,
	);

	await updateDoc(receiverChatRef, {
		deletedMessages: arrayUnion(messageId),
	});

	if (chat.lastMessage?.id === messageId) {
		const messages = await findMessageByChatId(chat.id, 1);
		const message = messages[0];

		await updateLastMessage({
			userId,
			chat,
			lastMessage: {
				id: message.id,
				content:
					message.isFile && message.file
						? message.file.name
						: message.content,
				by: message.by,
			},
			deletedMessageId: messageId,
		});

		await updateLastMessage({
			userId: chat.with.id,
			chat: receiverChat,
			lastMessage: {
				id: message.id,
				content:
					message.isFile && message.file
						? message.file.name
						: message.content,
				by: message.by,
			},
			deletedMessageId: messageId,
		});

		return message;
	}
};

export const sendFile = async (file: File) => {
	const name = `${v4()}-${file.name}`;

	const fileRef = ref(storage, name);

	await uploadBytes(fileRef, file);

	const url = await getDownloadURL(fileRef);

	return url;
};
