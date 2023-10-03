import { Search } from "lucide-react";
import Chats from "@/components/Sidebar/Chats";

export default function ChatBlock() {
	return (
		<div className="mt-4">
			<div className="relative">
				<input
					type="text"
					className="w-full bg-[#eaf0f7] text-sm py-2 pr-3 pl-8 rounded font-medium"
					placeholder="Search user/group..."
				/>
				<div className="absolute top-[50%] left-[.5rem] translate-y-[-50%]">
					<Search size={16} strokeWidth={1.25} />
				</div>
			</div>
			<Chats />
		</div>
	);
}
