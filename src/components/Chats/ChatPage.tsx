import TopBar from "@/components/Chats/TopBar";
import MainScreen from "@/components/Chats/MainScreen";
import BottomBar from "@/components/Chats/BottomBar";
import { useActiveChatValue } from "@/atoms/chatAtom";

export default function ChatPage() {
	const activeChat = useActiveChatValue();

	return (
		<div className="flex flex-col items-center justify-center flex-1 min-h-screen max-h-screen">
			<TopBar />
			<MainScreen />
			<BottomBar />
		</div>
	);
}
