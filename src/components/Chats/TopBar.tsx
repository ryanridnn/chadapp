import { useActiveChatValue } from "@/atoms/chatAtom";
import { MoreVertical } from "lucide-react";

export default function TopBar() {
	const activeChat = useActiveChatValue();

	if (activeChat) {
		return (
			<div className="flex justify-between items-center w-full px-6 py-[14px] bg-app-grey-500 border-b-[1px] border-solid border-[#C9DAEE]">
				<div className="flex items-center gap-3">
					<img
						src={activeChat.with.avatar || ""}
						className="w-[32px] h-[32px] rounded-full"
					/>
					<div className="font-semibold">{activeChat.with.name}</div>
				</div>
				<div className="flex items-center gap-3">
					{/*<button className="base-btn flex-center-btn bg-app-theme-orange-100 text-white rounded-md w-[32px] h-[32px]">
						<MoreVertical size={20} strokeWidth={1.5} />
					</button>*/}
				</div>
			</div>
		);
	} else {
		return <></>;
	}
}
