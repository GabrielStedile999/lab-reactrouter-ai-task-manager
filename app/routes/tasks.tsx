import { TasksList } from "~/features/tasks/tasks-list";
import { deleteTask, getTasks } from "~/services/task.server";
import type { Route } from "./+types/tasks";

export async function loader() {
	return {
		tasks: await getTasks(),
	};
}

export async function action({ request }: Route.ActionArgs) {
	const formData = await request.formData();
	switch (formData.get("action")) {
		case "deleteTask":
			return deleteTask(formData);
	}
}

export default function ({ loaderData }: Route.ComponentProps) {
	return <TasksList loaderData={loaderData} />;
}
