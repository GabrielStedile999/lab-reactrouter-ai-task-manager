import prisma from "prisma/prisma";
import { ChatsList } from "~/features/tasks/chats-list";
import { deleteChat, updateChat } from "~/services/chat.server";
import type { Route } from "./+types/chats";

export async function loader() {
	const chats = await prisma.chat.findMany();
	return { chats };
}

export async function action({ request }: Route.ActionArgs) {
	const formData = await request.formData();
	switch (formData.get("action")) {
		case "deleteChat":
			return deleteChat(formData);
		case "updateChat":
			return updateChat(formData);
	}
}

export default function ({ loaderData }: Route.ComponentProps) {
	return <ChatsList loaderData={loaderData} />;
}
