import prisma from "prisma/prisma";
import { TasksList } from "~/features/tasks/tasks-list";
import type { Route } from "./+types/tasks";

export async function loader() {
	return {
		tasks: await prisma.task.findMany({
			orderBy: {
				created_at: "desc",
			},
			include: {
				chat_message: true,
			},
		}),
	};
}

export default function ({ loaderData }: Route.ComponentProps) {
	return <TasksList loaderData={loaderData} />;
}
