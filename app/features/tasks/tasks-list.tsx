import { Clock, FileText, MessageCircle, Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "~/components/ui/table";
import type { Route } from "../../routes/+types/tasks";

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
							<TableHead className="w-[300px]">
								<div className="flex items-center gap-2">
									<FileText className="h-4 w-4" />
									Title
								</div>
							</TableHead>

							<TableHead className="w-[100px]">
								<div className="flex items-center gap-2">
									<Clock className="h-4 w-4" />
									Estimated Time
								</div>
							</TableHead>

							<TableHead className="w-[1%] text-center">Actions</TableHead>
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
									<TableCell className="font-medium w-[300px]">
										<Link 
											to={`/task/view/${task.id}`}
											className="decoration-dotted underline underline-offset-4">
												{task.title}
										</Link>
									</TableCell>

									<TableCell className="w-[100px]">
										{task.estimated_time}
									</TableCell>

									<TableCell>
										<div className="flex items-center gap-2">
											{task.chat_message ? (
												<Button
													variant="ghost"
													size="icon"
													className="h-8 w-8"
													title="Chat"
													asChild
												>
													<Link
														to={`/task/new?chat=${task.chat_message.chat_id}`}
													>
														<MessageCircle className="h-4 w-4" />
													</Link>
												</Button>
											) : (
												<Button
													variant="ghost"
													size="icon"
													className="h-8 w-8"
													title="Chat"
													disabled
												>
													<MessageCircle className="h-4 w-4" />
												</Button>
											)}
											<Button
												variant="ghost"
												size="icon"
												className="h-8 w-8"
												title="Edit task"
												asChild
											>
												<Link to={`/task/edit/${task.id}`}>
													<Pencil className="h-4 w-4" />
												</Link>
											</Button>
											<Button
												variant="ghost"
												size="icon"
												className="h-8 w-8 text-destructive hover:text-destructive"
												title="Delete task"
											>
												<Trash2 className="h-4 w-4" />
											</Button>
										</div>
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
