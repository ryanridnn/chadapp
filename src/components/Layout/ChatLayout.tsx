import Sidebar from "@/components/Sidebar/Sidebar";

export default function ChatLayout(page: React.ReactNode, mainPage?: boolean) {
	return (
		<div className="flex items-center min-h-screen">
			<Sidebar mainPage={mainPage || false} />
			{page}
		</div>
	);
}
