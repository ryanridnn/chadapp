export const getSnapsData = (snaps: any) => {
	const data = snaps.docs.map((snap: any) => getSnapData(snap));

	return data;
};

export const getSnapData = (snap: any) => {
	return {
		id: snap.id,
		...snap.data(),
	};
};

export const getCurrentISODate = () => {
	return new Date().toISOString();
};
