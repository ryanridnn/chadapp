// interface ChatProps {
// 	chat:
// }

import { Chat, useActiveChatState } from "@/atoms/chatAtom";
import { cva } from "class-variance-authority";
import { useRouter } from "next/router";

const CardVariants = cva(
	"rounded-lg px-3 py-3 cursor-pointer transition duration-150 hover:scale-[1.04] active:scale-[.98] select-none",
	{
		variants: {
			priority: {
				on: "linear-grad-100",
				off: "bg-app-grey-100",
			},
		},
		defaultVariants: {
			priority: "off",
		},
	},
);

const CardMessageVariants = cva("mt-2 text-xs ellipsis-2-lines", {
	variants: {
		priority: {
			on: "font-semibold",
			off: "text-app-text-200 font-medium",
		},
	},
	defaultVariants: {
		priority: "off",
	},
});

interface ChatProps {
	chat: Chat;
}

export default function Chat({ chat }: ChatProps) {
	const router = useRouter();
	const { setActiveChat } = useActiveChatState();

	const goToChat = () => {
		setActiveChat(chat);
		router.push(`/chats/${chat.id}`);
	};

	return (
		<div
			className={CardVariants({
				priority: chat.unread > 0 ? "on" : "off",
			})}
			onClick={goToChat}
		>
			<div className="flex items-center gap-2">
				<div className="overflow-hidden">
					<img
						src={chat.with.avatar}
						className="w-[1.5rem] h-[1.5rem] rounded-full"
						alt="User avatar"
					/>
				</div>
				<div className="flex-1 text-sm font-bold text-ellipsis overflow-hidden">
					{chat.with.name}
				</div>
				{Boolean(chat.unread) && (
					<div className="bg-app-theme-black-100 text-xs text-white px-1 font-semibold rounded">
						{chat.unread}
					</div>
				)}
			</div>
			{!chat.startChat && chat.lastMessage && (
				<div
					className={CardMessageVariants({
						priority: chat.unread > 0 ? "on" : "off",
					})}
				>
					{chat.lastMessage.content}
				</div>
			)}
		</div>
	);
}
