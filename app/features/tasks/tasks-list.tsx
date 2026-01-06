import { Calendar, Clock, FileText, ListTodo } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "~/components/ui/table";
import type { Route } from "../../routes/+types/tasks";

function formatDate(date: Date | string): string {
	const d = typeof date === "string" ? new Date(date) : date;
	return new Intl.DateTimeFormat("en-US", {
		year: "numeric",
		month: "short",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	}).format(d);
}

function truncateText(text: string, maxLength: number = 100): string {
	if (text.length <= maxLength) return text;
	return text.slice(0, maxLength) + "...";
}

export function TasksList({
	loaderData,
}: {
	loaderData: Route.ComponentProps["loaderData"];
}) {
	return (
		<div className="container mx-auto py-6 space-y-4">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-bold">Tasks</h1>
				<Badge variant="secondary">{loaderData.tasks.length} task(s)</Badge>
			</div>

			<div className="rounded-md border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="w-[120px]">
								<div className="flex items-center gap-2">
									<ListTodo className="h-4 w-4" />
									ID
								</div>
							</TableHead>
							<TableHead className="w-[200px]">
								<div className="flex items-center gap-2">
									<FileText className="h-4 w-4" />
									Title
								</div>
							</TableHead>
							<TableHead className="w-[300px]">Description</TableHead>
							<TableHead className="w-[150px]">
								<div className="flex items-center gap-2">
									<Clock className="h-4 w-4" />
									Estimated Time
								</div>
							</TableHead>
							<TableHead className="w-[180px]">
								<div className="flex items-center gap-2">
									<Calendar className="h-4 w-4" />
									Created At
								</div>
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{loaderData.tasks.length === 0 ? (
							<TableRow>
								<TableCell colSpan={5} className="h-24 text-center">
									No tasks found.
								</TableCell>
							</TableRow>
						) : (
							loaderData.tasks.map((task) => (
								<TableRow key={task.id}>
									<TableCell className="font-medium font-mono text-xs w-[120px]">
										{task.id.slice(0, 8)}...
									</TableCell>
									<TableCell className="font-medium w-[200px]">
										{task.title}
									</TableCell>
									<TableCell className="w-[300px] max-w-[300px]">
										<div className="truncate" title={task.description}>
											{truncateText(task.description, 80)}
										</div>
									</TableCell>
									<TableCell className="w-[150px]">
										{task.estimated_time}
									</TableCell>
									<TableCell className="w-[180px]">
										{formatDate(task.created_at)}
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
