import { atom, useRecoilState, useRecoilValue } from "recoil";

export interface User {
	id: string;
	name: string;
	email: string;
	gid: string;
	avatar: string;
	unread: number;
}

export interface IAuthState {
	id: string;
	state: "loading" | "loaded";
}

export const defaultUser: User = {
	id: "",
	name: "",
	email: "",
	gid: "",
	avatar: "",
	unread: 0,
};

export const defaultAuthState: IAuthState = {
	id: "",
	state: "loading",
};

const AuthState = atom({
	key: "AuthState",
	default: defaultAuthState,
});

const userState = atom({
	key: "userState",
	default: defaultUser,
});

export const useAuthState = () => {
	const [currentAuthState, setCurrentAuthState] = useRecoilState(AuthState);

	return { currentAuthState, setCurrentAuthState };
};

export const useAuthValue = () => {
	const currentAuth = useRecoilValue(AuthState);

	return currentAuth;
};

export const useUserState = () => {
	const [currentUser, setCurrentUser] = useRecoilState(userState);

	return { currentUser, setCurrentUser };
};

export const useUserValue = () => {
	const currentUser = useRecoilValue(userState);

	return currentUser;
};
