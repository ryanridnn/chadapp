import homeIllustration from "@/assets/illustrations/home-illustration.svg";
import useOpenClose from "@/hooks/useOpenClose";
import Image from "next/image";
import ChatStarter from "@/components/Home/ChatStarter";

export default function HomeCard() {
	const { show, setOpen, setClose } = useOpenClose();

	return (
		<div className="flex items-center justify-center flex-col bg-app-grey-100 pt-12 pb-16 rounded-3xl px-12">
			<Image
				priority
				src={homeIllustration}
				alt="Person welcoming you to the chadspace"
			/>
			<div className="text-2xl font-bold text-center mt-4 mb-2">
				Let’s start a new conversation
			</div>
			<div className="max-w-[90vw] w-[360px] text-center text-sm text-app-text-200">
				Talk with your friends, and families in chadapp. Have fun, share
				laughter and memories with us!
			</div>
			<button
				onClick={setOpen}
				className="bg-app-theme-black-100 text-white text-sm mt-6 px-5 py-3 rounded-lg font-semibold transition duration-250 hover:bg-opacity-[.8] active:scale-[.95]"
			>
				Start a conversation
			</button>
			<ChatStarter show={show} setClose={setClose} />
		</div>
	);
}
