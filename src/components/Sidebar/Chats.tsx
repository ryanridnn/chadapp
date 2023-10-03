import { useAuthValue, useUserValue } from "@/atoms/userAtom";
import Chat from "@/components/Sidebar/Chat";
import useChatsListener from "@/hooks/useChatsListener";

// let chats = [
// 	{
// 		name: "Preston Heller",
// 		avatar: "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/818.jpg",
// 		lastMessage: {
// 			from: "",
// 			content:
// 				"Blanditiis velit sapiente error. Eaque vitae cumque atque officiis quidem nisi tempora voluptas.",
// 		},
// 		unread: 1,
// 		type: "individual",
// 	},
// 	{
// 		name: "Albert Shields",
// 		avatar: "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/1202.jpg",
// 		lastMessage: {
// 			from: "",
// 			content:
// 				"Suscipit mollitia nam minus maiores. Illum possimus voluptates assumenda totam. Doloremque possimus deserunt aperiam nam modi ducimus eaque beatae ex. Et aspernatur esse modi consequatur blanditiis quod animi accusantium.",
// 		},
// 		unread: 1,
// 		type: "individual",
// 	},
// 	{
// 		name: "Raul O'Kon",
// 		avatar: "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/1232.jpg",
// 		lastMessage: {
// 			from: "",
// 			content:
// 				"Facilis numquam ipsum. Iure dignissimos nam ab modi ipsam. Alias quibusdam qui assumenda quisquam labore ullam voluptatum laudantium ex. Cum aliquid unde dignissimos. Sunt unde magnam eveniet omnis.",
// 		},
// 		unread: 0,
// 		type: "individual",
// 	},
// 	{
// 		name: "Jacquelyn Hyatt",
// 		avatar: "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/366.jpg",
// 		lastMessage: {
// 			from: "",
// 			content:
// 				"Cumque expedita dolorum ipsam. Quae dicta nobis maxime tenetur. Praesentium officia animi facilis molestias iure cum. Minus praesentium minus excepturi laboriosam animi numquam. Ex delectus id consectetur quia cupiditate soluta.",
// 		},
// 		unread: 0,
// 		type: "individual",
// 	},
// 	{
// 		name: "Luz Kuvalis",
// 		avatar: "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/930.jpg",
// 		lastMessage: {
// 			from: "",
// 			content:
// 				"Cum reiciendis ea nesciunt. Laboriosam est rem soluta quod natus ducimus illo assumenda laborum.",
// 		},
// 		unread: 3,
// 		type: "individual",
// 	},
// 	{
// 		name: "Dr. Marc Johns",
// 		avatar: "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/875.jpg",
// 		lastMessage: {
// 			from: "",
// 			content:
// 				"Nisi deleniti nobis sapiente vel nostrum assumenda neque. Nam molestias esse quisquam sunt.",
// 		},
// 		unread: 1,
// 		type: "individual",
// 	},
// 	{
// 		name: "Rudy Renner IV",
// 		avatar: "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/1058.jpg",
// 		lastMessage: {
// 			from: "",
// 			content:
// 				"Necessitatibus recusandae iste. Eveniet earum commodi neque ducimus vitae optio pariatur aliquam eius. Dolor quibusdam sunt veniam fuga quae dolorum atque. Dolor facere impedit. Molestiae nihil rem aliquid quos ipsam molestiae. Laudantium sapiente ex dolorem dolores et commodi consequatur laborum.",
// 		},
// 		unread: 0,
// 		type: "individual",
// 	},
// 	{
// 		name: "Lela Blick",
// 		avatar: "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/528.jpg",
// 		lastMessage: {
// 			from: "",
// 			content:
// 				"Perferendis cupiditate quidem rem. Maxime doloremque dignissimos repellendus expedita iusto repellat.",
// 		},
// 		unread: 2,
// 		type: "individual",
// 	},
// 	{
// 		name: "Gerald Ward",
// 		avatar: "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/150.jpg",
// 		lastMessage: {
// 			from: "",
// 			content:
// 				"Asperiores cumque laborum necessitatibus. Similique nisi aliquid. Laudantium porro ad ipsa sit. Rem vitae eius. Porro ab debitis voluptatibus dignissimos incidunt et expedita. Dolore eius atque doloremque ratione natus similique possimus quas optio.",
// 		},
// 		unread: 3,
// 		type: "individual",
// 	},
// 	{
// 		name: "Gregory Schmidt",
// 		avatar: "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/1099.jpg",
// 		lastMessage: {
// 			from: "",
// 			content:
// 				"Asperiores tempore in molestiae atque voluptatum maxime dolore. In doloribus consectetur quidem adipisci vero voluptatem. Provident sint totam repellat id suscipit eius consequuntur quo velit. Ratione qui ex quos. Deserunt quidem nostrum vitae sed perferendis suscipit suscipit quod libero.",
// 		},
// 		unread: 1,
// 		type: "individual",
// 	},
// ];

// chats = chats.sort((a, b) => b.unread - a.unread);

export default function Chats() {
	const { id: currentUserId } = useUserValue();

	const chats = useChatsListener(currentUserId);

	return (
		<div className="flex flex-col gap-3 mt-4">
			{chats.map((chat) => (
				<Chat key={chat.id} chat={chat} />
			))}
			{chats.length === 0 && (
				<div className="text-[13px] text-semibold mt-2 px-3 text-center">
					No conversation.
				</div>
			)}
		</div>
	);
}
