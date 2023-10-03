import { UserCircle, Search } from "lucide-react";
import Popup from "@/components/Common/Popup";
import { findUserWithEmail } from "@/services/users";
import { findChatByReceiverId } from "@/services/chats";
import { ChangeEventHandler, useEffect, useState } from "react";
import useDebounce from "@/hooks/useDebounce";
import * as yup from "yup";
import Alert, { AlertTypes, useAlertHandler } from "@/components/Common/Alert";
import LoadingButton from "@/components/Common/LoadingButton";
import { useUserValue, User } from "@/atoms/userAtom";
import { useRouter } from "next/router";
import { useActiveChatState } from "@/atoms/chatAtom";

interface ChatStarterProps {
	show: boolean;
	setClose: () => void;
}

const userSchema = yup.object({
	email: yup.string().email(),
});

export default function ChatStarter({ show, setClose }: ChatStarterProps) {
	const router = useRouter();
	const debounce = useDebounce();
	const currentUser = useUserValue();

	const [email, setEmail] = useState("");
	const [match, setMatch] = useState<User | null>(null);
	const [valid, setValid] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);

	const { alert, setAlert } = useAlertHandler();
	const { setActiveChat } = useActiveChatState();

	const getState = () => {
		if (valid) {
			return match ? "chat" : "invite";
		}
	};

	const onEmailChange: ChangeEventHandler<HTMLInputElement> = (e) => {
		setMatch(null);
		setValid(false);
		setEmail(e.target.value);
		debounce(async () => {
			try {
				const user = { email: e.target.value };
				const validated = await userSchema.validate(user);

				setValid(true);
				const matchUser = await findUserWithEmail(user.email);
				if (matchUser) {
					if (matchUser.email === currentUser.email) {
						setAlert({
							type: AlertTypes.Danger,
							message: "You entered your own email!",
							noTimeout: true,
						});
					} else {
						setMatch(matchUser);
						setAlert({
							type: AlertTypes.Success,
							message:
								"User is available. Let’s start your conversation!",
							noTimeout: true,
						});
					}
				} else {
					setAlert({
						type: AlertTypes.Danger,
						message:
							"Can’t find the user. You can invite them to ChadApp",
						noTimeout: true,
					});
				}
			} catch (e: any) {
				setAlert({
					type: AlertTypes.Danger,
					message: e?.message || "Failed to find user with the email",
				});
			}
		}, 200);
	};

	const onMainButton = () => {
		const state = getState();

		if (state) {
			setLoading(true);
			if (state === "chat") {
				startChat();
			}
		}
	};

	const startChat = async () => {
		if (match) {
			try {
				const matchChat = await findChatByReceiverId(
					currentUser.id,
					match.id,
				);

				if (matchChat) {
					setActiveChat(matchChat);
					router.push(`/chats/${matchChat.id}`);
					setClose();
				} else {
					setActiveChat({
						id: "",
						with: match,
						lastMessage: null,
						updatedAt: null,
						startChat: true,
						unread: 0,
						unreadMessages: [],
						deletedMessages: [],
					});
					router.push(`/chats/new?receiverId=${match.id}`);
					setClose();
				}
			} catch (e) {}
		}
	};

	const inviteUser = () => {};

	useEffect(() => {
		if (!show) {
			setEmail("");
			setAlert(null);
			setLoading(false);
		}
	}, [show]);

	return (
		<Popup show={show} setClose={setClose}>
			<div className="flex flex-col">
				<div className="linear-grad-100 self-start p-3 rounded-full">
					<UserCircle color="#fff" size={32} />
				</div>
				<div className="font-semibold text-xl mt-2">
					Search for user
				</div>
				<div className="mt-4">
					<div className="relative">
						<input
							type="email"
							className="w-full bg-[#eaf0f7] text-sm py-3 pr-3 pl-10 rounded-lg font-medium"
							placeholder="ex: ryanridnn@gmail.com"
							value={email}
							onChange={onEmailChange}
						/>
						<div className="absolute top-[50%] left-[.75rem] translate-y-[-50%]">
							<Search size={16} strokeWidth={1.25} />
						</div>
					</div>
				</div>
			</div>
			<div className="mt-3">
				<Alert alert={alert} />
			</div>
			<div className="flex justify-end pt-3">
				<LoadingButton
					text="Chat Now"
					loading={loading}
					disabled={!match}
					onClick={onMainButton}
				/>
			</div>
		</Popup>
	);
}
