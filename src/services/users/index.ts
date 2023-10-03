import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import {
	query,
	collection,
	where,
	getDocs,
	addDoc,
	doc,
	getDoc,
} from "firebase/firestore";
import { db, auth } from "@/services/firebase";
import { DB_COLLECTIONS } from "@/const";
import { getSnapData, getSnapsData } from "@/services/helpers";
import ChatStarter from "@/components/Home/ChatStarter";

const provider = new GoogleAuthProvider();

interface UserProp {
	name: string;
	email: string;
	avatar: string | null;
	gid: string;
}

export const signIn = async () => {
	try {
		const result = await signInWithPopup(auth, provider);
		const {
			user: { displayName, email, photoURL, uid },
		} = result;

		if (uid && displayName && email) {
			const noUser = await checkNoUser(uid);

			const user: UserProp = {
				name: displayName,
				email,
				avatar: photoURL,
				gid: uid,
			};

			if (noUser) {
				createUser(user);
			}
		}
	} catch (e) {}
};

export const logOut = async () => {
	try {
		await signOut(auth);

		return true;
	} catch (e) {
		return false;
	}
};

const usersRef = collection(db, DB_COLLECTIONS.Users);

export const checkNoUser = async (gid: string) => {
	const user = await findUserWithGID(gid);

	return !user;
};

export const findUserById = async (id: string) => {
	const userRef = doc(db, DB_COLLECTIONS.Users, id);
	const snap = await getDoc(userRef);

	const user = getSnapData(snap);

	return user || null;
};

export const findUserWithGID = async (gid: string) => {
	const q = query(usersRef, where("gid", "==", gid));

	const snaps = await getDocs(q);

	const users = getSnapsData(snaps);

	if (users.length === 0) {
		return null;
	} else {
		return users[0];
	}
};

export const findUserWithEmail = async (email: string) => {
	const q = query(usersRef, where("email", "==", email));
	const snaps = await getDocs(q);
	const users = getSnapsData(snaps);

	if (users.length > 0) {
		return users[0];
	} else {
		return null;
	}
};

export const createUser = async (user: UserProp) => {
	await addDoc(usersRef, user);
};
