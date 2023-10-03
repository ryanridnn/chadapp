import { RecoilRoot } from "recoil";
import UserWatcher from "@/components/Layout/UserWatcher";

interface RootLayoutProps {
	children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
	return (
		<RecoilRoot>
			<UserWatcher>{children}</UserWatcher>
		</RecoilRoot>
	);
}
