import { Chat, useActiveChatState } from "@/atoms/chatAtom";
import { Message, useMessagesState } from "@/atoms/messageAtom";
import { useUserValue } from "@/atoms/userAtom";
import { cva } from "class-variance-authority";
import { Ban, Trash2 } from "lucide-react";
import moment from "moment";
import LoadingIconButton from "@/components/Common/LoadingIconButton";
import { useState } from "react";
import { deleteMessage } from "@/services/messages";
import FileComp from "./File";

interface MessageCardProps {
	message: Message;
}

const ContainerVariants = cva("flex gap-3", {
	variants: {
		user: {
			me: "self-end flex-row-reverse",
			other: "",
		},
	},
	defaultVariants: {
		user: "other",
	},
});

const CardVariants = cva("group relative p-3 rounded-lg w-[360px] max-w-full", {
	variants: {
		user: {
			me: "bg-app-theme-black-100 text-white self-end",
			other: "bg-app-grey-100",
		},
	},
	defaultVariants: {
		user: "other",
	},
});

const MenuVariants = cva(
	"absolute bottom-[100%] right-[0] text-[#333] transition z-10",
	{
		variants: {
			user: {
				me: "opacity-0 group-hover:opacity-[1] pointer-events-all",
				other: "opacity-0 pointer-events-none",
			},
		},
		defaultVariants: {
			user: "other",
		},
	},
);

export default function MessageCard({ message }: MessageCardProps) {
	const currentUser = useUserValue();
	const { activeChat, setActiveChat } = useActiveChatState();
	const [loadingDelete, setLoadingDelete] = useState<boolean>(false);
	const { setMessages } = useMessagesState();

	const byMe = currentUser.id === message.by;

	const getName = () => {
		if (byMe) {
			return currentUser.name;
		} else {
			return activeChat ? activeChat.with.name : "";
		}
	};

	const getAvatar = () => {
		if (byMe) {
			return currentUser.avatar;
		} else {
			return activeChat ? activeChat.with.avatar : "";
		}
	};

	const getFormattedTime = () => {
		return moment(message.updatedAt).format("DD/MM/YYYY hh:mm a");
	};

	const onDelete = async () => {
		setLoadingDelete(true);

		if (activeChat) {
			try {
				const lastMessage = await deleteMessage({
					chat: activeChat,
					messageId: message.id,
					userId: currentUser.id,
				});

				if (lastMessage) {
					setActiveChat(
						(prev) =>
							({
								...prev,
								lastMessage: {
									id: lastMessage.id,
									content: lastMessage.content,
									by: lastMessage.by,
								},
							} as Chat),
					);
				}
				setLoadingDelete(false);
				setMessages((prev) => {
					return prev.filter((each) => each.id !== message.id);
				});
			} catch (e) {
				console.log(e);
				setLoadingDelete(false);
			}
		}
	};

	return (
		<div className={ContainerVariants({ user: byMe ? "me" : "other" })}>
			<div className="mt-2 w-[32px] h-[32px] rounded-full overflow-hidden">
				<img className="w-full" src={getAvatar()} alt="avatar" />
			</div>
			<div
				className={CardVariants({
					user: byMe ? "me" : "other",
				})}
			>
				<div className="flex justify-between items-center">
					<div className="text-xs font-bold">{getName()}</div>
					<div className="text-[11px]">{getFormattedTime()}</div>
				</div>
				<div className="display-linebreak mt-1 text-sm">
					{!message.file && message.content}
					{message.file && (
						<FileComp file={message.file} byMe={byMe} />
					)}
				</div>
				<div
					className={MenuVariants({
						user: byMe ? "me" : "other",
					})}
				>
					<div className="flex items-center justify-center bg-slate-300 p-1 rounded mb-2">
						<LoadingIconButton
							Icon={() => <Trash2 size={18} />}
							loading={loadingDelete}
							onClick={onDelete}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
