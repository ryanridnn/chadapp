import Image from "next/image";
import loginIllustration from "@/assets/illustrations/login-illustration.svg";
import { signIn } from "@/services/users";

export default function LoginCard() {
	return (
		<div className="flex items-center justify-center flex-col bg-app-grey-100 pt-8 pb-16 rounded-3xl px-4">
			<Image
				priority
				src={loginIllustration}
				alt="Person welcoming you to the chadspace"
			/>
			<div className="text-2xl font-bold text-center mt-2 mb-2">
				ChadSpace! Your Favorite Chat App!
			</div>
			<div className="max-w-[90vw] w-[460px] text-center text-sm text-app-text-200">
				Connect with friends, and family with fast and reliable chat app
				made with passion and love. Sign in now!
			</div>
			<button
				onClick={signIn}
				className="bg-app-theme-black-100 text-white text-sm mt-6 px-5 py-3 rounded-lg font-semibold transition duration-250 hover:bg-opacity-[.8] active:scale-[.95]"
			>
				Sign in With Google
			</button>
		</div>
	);
}
