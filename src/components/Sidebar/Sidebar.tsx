import logo from "@/assets/logo.svg";
import Image from "next/image";
import { useUserValue } from "@/atoms/userAtom";
import MoreOption, { Option } from "@/components/Common/MoreOption";
import { ArrowUpLeftFromCircle, MessageSquare } from "lucide-react";
import useOpenClose from "@/hooks/useOpenClose";
import { useState } from "react";
import { logOut } from "@/services/users";
import ChatBlock from "@/components/Sidebar/ChatBlock";
import ChatStarter from "@/components/Home/ChatStarter";
import { cva } from "class-variance-authority";

const SideBarVariants = cva("", {
	variants: {
		mainPage: {
			yes: "w-full lg:w-auto",
			no: "hidden lg:block",
		},
	},
});

interface SidebarProps {
	mainPage: boolean;
}

export default function Sidebar({ mainPage }: SidebarProps) {
	const currentUser = useUserValue();
	const optionControl = useOpenClose();
	const { show, setOpen, setClose } = useOpenClose();

	const [inLogOut, setInLogOut] = useState(false);

	const onLogOut: React.MouseEventHandler<HTMLButtonElement> = async (e) => {
		e.stopPropagation();
		setInLogOut(true);

		const res = await logOut();

		setInLogOut(false);
	};

	const getCountContent = () => {
		if (currentUser.unread > 1) {
			return `You got ${currentUser.unread} unread messages`;
		} else if (currentUser.unread > 0) {
			return "You got 1 unread message";
		} else {
			return "You got no new messages";
		}
	};

	return (
		<div className={SideBarVariants({ mainPage: mainPage ? "yes" : "no" })}>
			<div className="relative w-full lg:w-[300px] px-6 py-5 min-h-screen max-h-screen overflow-y-auto border-r-[1px] border-solid border-[#C9DAEE] custom-scrollbar">
				<div>
					<Image src={logo} alt="logo" />
				</div>
				<div className="flex items-center mt-5">
					{currentUser.avatar && (
						<img
							className="w-[2.5rem] h-[2.5rem] rounded-full mr-3"
							src={currentUser.avatar}
							alt="user avatar"
						/>
					)}
					<div className="flex-1 mt-[1px]">
						<div className="font-bold">{currentUser.name}</div>
						<div className="text-[12px] text-app-text-200">
							{getCountContent()}
						</div>
					</div>
					<MoreOption optionControl={optionControl}>
						<Option onClick={onLogOut} disabled={inLogOut}>
							<ArrowUpLeftFromCircle
								size={14}
								strokeWidth={2.5}
							/>
							<div>{inLogOut ? "Log Out..." : "Log Out"}</div>
						</Option>
					</MoreOption>
				</div>
				<ChatBlock />
				<div className="absolute bottom-[1rem] right-[1rem]">
					<button
						onClick={setOpen}
						className="base-btn flex-center-btn w-[44px] h-[44px] rounded-lg bg-app-theme-orange-100 text-white"
					>
						<MessageSquare size={20} />
					</button>
				</div>
			</div>
			<ChatStarter show={show} setClose={setClose} />
		</div>
	);
}
