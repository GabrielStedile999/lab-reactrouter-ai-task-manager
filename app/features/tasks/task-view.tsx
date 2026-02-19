import { ArrowRight } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Separator } from "~/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import type { Task } from "~/generated/prisma/client";
import { convertListToStrings } from "./utils";
import type { SimilarTask } from "./types";

interface Props {
	task: Task;
	similarTasks: SimilarTask[];
}

export function TaskView({ task, similarTasks }: Props) {
	const { steps, acceptanceCriteria, suggestedTests } =
		convertListToStrings(task);

	return (
		<ScrollArea className="max-h-[calc(100vh-4rem)] p-4">
			<Breadcrumb className="mb-4">
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbLink href="/tasks">Tasks</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbPage>{task.title}</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>
			<section className="grid grid-cols-2 gap-6">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between gap-4">
						<div>
							<CardTitle className="text-2xl mb-1">{task.title}</CardTitle>
							<CardDescription>ID: {task.id}</CardDescription>
						</div>
						<Badge variant="secondary">{task.estimated_time}</Badge>
					</CardHeader>
					<CardContent className="flex flex-col gap-6">
						<div>
							<Label className="mb-1">Description</Label>
							<p className="text-base text-muted-foreground whitespace-pre-line bg-muted/40 rounded-md p-3 border mt-1">
								{task.description}
							</p>
						</div>
						{task.implementation_suggestion && (
							<div>
								<Label className="mb-1">Implementation Suggestion</Label>
								<p className="text-sm text-muted-foreground whitespace-pre-line bg-muted/30 rounded-md p-3 border mt-1">
									{task.implementation_suggestion}
								</p>
							</div>
						)}
						<Separator />
						<Tabs defaultValue="steps" className="w-full">
							<TabsList>
								<TabsTrigger value="steps">Steps</TabsTrigger>
								<TabsTrigger value="acceptance">
									Acceptance Criteria
								</TabsTrigger>
								<TabsTrigger value="tests">Suggested Tests</TabsTrigger>
							</TabsList>
							<TabsContent value="steps">
								<ul className="list-decimal list-inside space-y-2 mt-2">
									{steps.length > 0 ? (
										steps.map((step) => (
											<li key={step} className="text-base text-foreground">
												{step}
											</li>
										))
									) : (
										<li className="text-muted-foreground">
											No steps available.
										</li>
									)}
								</ul>
							</TabsContent>
							<TabsContent value="acceptance">
								<ul className="list-disc list-inside space-y-2 mt-2">
									{acceptanceCriteria.length > 0 ? (
										acceptanceCriteria.map((criteria) => (
											<li key={criteria} className="text-base text-foreground">
												{criteria}
											</li>
										))
									) : (
										<li className="text-muted-foreground">
											No acceptance criteria available.
										</li>
									)}
								</ul>
							</TabsContent>
							<TabsContent value="tests">
								<ul className="list-disc list-inside space-y-2 mt-2">
									{suggestedTests.length > 0 ? (
										suggestedTests.map((test) => (
											<li
												key={test}
												className="text-base font-mono text-foreground"
											>
												{test}
											</li>
										))
									) : (
										<li className="text-muted-foreground">
											No suggested tests available.
										</li>
									)}
								</ul>
							</TabsContent>
						</Tabs>
					</CardContent>
					<CardFooter className="justify-end text-xs text-muted-foreground">
						Created at: {new Date(task.created_at).toLocaleString("en-US")}
						{task.updated_at && (
							<span className="ml-4">
								Updated at: {new Date(task.updated_at).toLocaleString("en-US")}
							</span>
						)}
					</CardFooter>
				</Card>
				<Card className="bg-muted/40">
					<CardHeader>
						<CardTitle className="text-lg">Similar Tasks</CardTitle>
						<CardDescription>
							Other tasks that might be relevant to you
						</CardDescription>
					</CardHeader>
					<CardContent className="flex flex-col p-0">
						{similarTasks && similarTasks.length > 0 ? (
							similarTasks.map((t, i) => {
								const similarityPercent = Math.round(
									(t.similarity_score ?? 0) * 100,
								);
								return (
									<>
										<a
											key={t.id}
											href={`/task/view/${t.id}`}
											className="flex items-center gap-4 px-6 py-4 group hover:bg-muted/60 transition rounded-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary"
											title={`View task: ${t.title}`}
										>
											<div className="flex-1 min-w-0">
												<div className="flex items-center gap-2">
													<div className="font-semibold text-base text-foreground truncate">
														{t.title}
													</div>
													<span className="text-xs text-muted-foreground">
														{similarityPercent}%
													</span>
												</div>
												<div className="text-sm text-muted-foreground truncate">
													{t.description}
												</div>
											</div>
											<Badge
												variant="secondary"
												className="flex items-center gap-1 px-2 py-1 ml-2"
											>
												<span>{t.estimated_time}</span>
												<ArrowRight className="w-4 h-4 text-primary ml-1" />
											</Badge>
										</a>
										{i < similarTasks.length - 1 && (
											<Separator className="mx-6" />
										)}
									</>
								);
							})
						) : (
							<div className="text-muted-foreground text-sm p-6">
								No similar tasks found.
							</div>
						)}
					</CardContent>
				</Card>
			</section>
		</ScrollArea>
	);
}
