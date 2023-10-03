import Sidebar from "@/components/Sidebar/Sidebar";

export default function ChatLayout(
	page: React.ReactNode,
	withFloating?: boolean,
) {
	return (
		<div className="flex items-center min-h-screen">
			<Sidebar withFloating={withFloating || false} />
			{page}
		</div>
	);
}
