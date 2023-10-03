import useMessages from "@/hooks/useMessages";
import { Message } from "@/atoms/messageAtom";
import MessageCard from "@/components/Messages/Message";

export default function MainScreen() {
	const messages = useMessages();

	// console.log(messages);

	return (
		<div className="w-full flex-1 flex flex-col-reverse gap-3 p-6 justify-start h-full custom-scrollbar overflow-y-scroll">
			{messages.map((message: Message) => (
				<MessageCard key={message.id} message={message} />
			))}
		</div>
	);
}
