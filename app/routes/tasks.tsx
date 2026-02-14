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

export async function action({ request }: Route.ActionArgs) {
	const formData = await request.formData();
	switch (formData.get("action")) {
		case "deleteTask":
			return deleteTask(formData);
	}
}

async function deleteTask(formData: FormData) {
	const taskId = formData.get("task_id") as string;

	if (!taskId) {
		return { success: false, error: "Invalid data" };
	}

	try {
		await prisma.task.delete({
			where: {
				id: taskId,
			},
		});
		return { success: true };
	} catch {
		return { success: false, error: "" };
	}
}

export default function ({ loaderData }: Route.ComponentProps) {
	return <TasksList loaderData={loaderData} />;
}
