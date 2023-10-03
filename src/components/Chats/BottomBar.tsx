import { Plus, SendHorizontal, SmilePlus } from "lucide-react";
import LoadingButton from "../Common/LoadingButton";
import { useRef, useState } from "react";
import { Chat, useActiveChatState } from "@/atoms/chatAtom";
import { useUserValue } from "@/atoms/userAtom";
import { SendMessagePayload, sendFile, sendMessage } from "@/services/messages";
import { Message, useMessagesState } from "@/atoms/messageAtom";
import EmojiPicker from "emoji-picker-react";
import useOpenClose from "@/hooks/useOpenClose";
import FileComp from "@/components/Chats/File";
import { v4 } from "uuid";

export default function BottomBar() {
	const [content, setContent] = useState<string>("");
	const { activeChat, setActiveChat } = useActiveChatState();
	const currentUser = useUserValue();
	const { setMessages } = useMessagesState();
	const [loading, setLoading] = useState<boolean>(false);
	const [file, setFile] = useState<File | null>(null);
	const {
		show: openEmoji,
		setOpen: setOpenEmoji,
		setClose: setCloseEmoji,
		popupRef,
	} = useOpenClose();

	const fileInputRef = useRef<any>();

	const onChange: React.ChangeEventHandler<HTMLTextAreaElement> = (e) => {
		setContent(e.target.value);
	};

	const onSend: React.MouseEventHandler<HTMLButtonElement> = async () => {
		setLoading(true);
		let fileUrl: string | undefined;

		if (file) {
			fileUrl = await handleFile(file);
		}

		handleMessage(fileUrl);
	};

	const handleFile = async (file: File) => {
		return await sendFile(file);
	};

	const handleMessage = async (fileUrl?: string | undefined) => {
		if (content.length > 0 || fileUrl) {
			setLoading(true);

			let payload: SendMessagePayload = {
				content,
			};

			if (file && fileUrl) {
				payload.isFile = true;
				payload.file = {
					name: file.name,
					url: fileUrl,
					type: file.type.includes("image/") ? "image" : "file",
				};
			}

			const message: Message | null = await sendMessage(
				payload,
				activeChat,
				currentUser.id,
			);

			if (message) {
				setMessages((prev) => [message, ...prev]);
				setActiveChat(
					(prev) =>
						({
							...prev,
							lastMessage: {
								id: message.id,
								content: message.content,
								by: message.by,
							},
						} as Chat),
				);
			}

			setLoading(false);
			onRemoveFile();
			setContent("");
		}
	};

	const onRemoveFile = () => {
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
			setFile(null);
		}
	};

	return (
		<div className="flex justify-between items-center w-full px-6 pt-5 pb-3 bg-app-grey-500 border-t-[1px] border-solid border-[#C9DAEE]">
			<div className="w-full relative">
				<div className="rounded-tl-lg rounded-tr-lg bg-app-grey-600">
					{!file && (
						<textarea
							value={content}
							onChange={onChange}
							className="block w-full rounded-lg resize-none px-3 pt-2 min-h-[82px] max-h-[82px] custom-scrollbar pb-12 text-[15px] bg-app-grey-600"
							placeholder="Type in your message..."
						></textarea>
					)}
					{file && <FileComp file={file} onRemove={onRemoveFile} />}
				</div>
				<div className="rounded-br-lg rounded-bl-lg mt-0 px-1 py-6 h-[36px] flex items-center justify-between bg-app-grey-600">
					<div>
						<div>
							<input
								ref={fileInputRef}
								type="file"
								className="hidden"
								onChange={(e) => {
									if (
										e.target.files &&
										e.target.files.length > 0
									) {
										setFile(e.target.files[0]);
									}
								}}
								multiple
							/>
							<button
								onClick={() => {
									if (fileInputRef.current) {
										fileInputRef.current.click();
									}
								}}
								className="bg-app-theme-black-100 text-white h-[24px] w-[24px] flex items-center justify-center rounded ml-2 base-btn"
							>
								<Plus size={18} />
							</button>
						</div>
						{/*<div ref={popupRef} className="relative pl-2">
							<button
								onClick={setOpenEmoji}
								className="base-btn flex-center-btn"
							>
								<SmilePlus size={20} />
							</button>
							<div
								className={`absolute bottom-0 ${
									openEmoji
										? "opacity-1 pointer-events-all"
										: "opacity-0 pointer-events-none"
								}`}
							>
								<EmojiPicker
									onEmojiClick={(emoji) => {
										setContent(
											(prev) => `${prev}${emoji.emoji}`,
										);
										setCloseEmoji();
									}}
								/>
							</div>
						</div>*/}
					</div>
					<div className="">
						<LoadingButton
							text="Send"
							size="sm"
							onClick={onSend}
							loading={loading}
							Icon={() => <SendHorizontal size={16} />}
							rightIcon
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
