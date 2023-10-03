import {
	defaultUser,
	User,
	useAuthState,
	defaultAuthState,
	useUserState,
} from "@/atoms/userAtom";
import { DB_COLLECTIONS } from "@/const";
import { auth, db } from "@/services/firebase";
import { getSnapData } from "@/services/helpers";
import { findUserWithGID } from "@/services/users";
import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

interface UserWatcherProps {
	children: React.ReactNode;
}

export default function UserWatcher({ children }: UserWatcherProps) {
	const { currentUser, setCurrentUser } = useUserState();
	const { currentAuthState, setCurrentAuthState } = useAuthState();
	const [userId, setUserId] = useState<string>("");

	const router = useRouter();

	useEffect(() => {
		const unsub = onAuthStateChanged(auth, async (userState) => {
			if (userState) {
				const { uid } = userState;

				setCurrentAuthState({ id: uid, state: "loading" });

				try {
					const user = await findUserWithGID(uid);

					setUserId(user.id);

					if (user) {
						setCurrentUser(user);
						setCurrentAuthState({ id: uid, state: "loaded" });
					} else {
						setCurrentAuthState({
							...defaultAuthState,
							state: "loaded",
						});
					}
				} catch (e) {
					setCurrentAuthState({
						...defaultAuthState,
						state: "loaded",
					});
				}
			} else {
				setCurrentAuthState({ ...defaultAuthState, state: "loaded" });
				setCurrentUser(defaultUser);
			}
		});

		return unsub;
	}, []);

	useEffect(() => {
		const redirectPath = getRedirected();

		if (redirectPath) {
			router.push(redirectPath);
		}
	}, [currentAuthState, router.pathname]);

	useEffect(() => {
		if (userId) {
			const unsub = onSnapshot(
				doc(db, DB_COLLECTIONS.Users, userId),
				(snap) => {
					const user = getSnapData(snap);

					if (user) {
						setCurrentUser(user);
					}
				},
			);

			return unsub;
		}
	}, [userId]);

	const getRedirected = () => {
		let redirectPath: string | null | boolean = null;

		if (currentAuthState.state === "loaded") {
			if (currentAuthState.id && router.pathname === "/login") {
				redirectPath = "/";
			} else if (!currentAuthState.id && router.pathname !== "/login") {
				redirectPath = "/login";
			} else {
				redirectPath = null;
			}
		}

		return redirectPath;
	};

	const redirectPath = getRedirected();

	return (
		<div>
			{currentAuthState.state === "loaded" && redirectPath === null ? (
				children
			) : (
				<></>
			)}
		</div>
	);
}
