import {
	CheckCircle2,
	Clock,
	Code,
	FileText,
	ListOrdered,
	TestTube,
} from "lucide-react";
import { Link, useFetcher, useLoaderData } from "react-router";
import { Button } from "~/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";
import type { loader } from "~/routes/task-new";

export function TaskContent() {
	const fetcher = useFetcher();
	const { task, message_id, task_id } = useLoaderData<typeof loader>();

	if (!task.title) {
		return null;
	}

	return (
		<div className="space-y-6">
			{/* Title & Description Card */}
			<Card>
				<CardHeader>
					<div className="flex items-center gap-3">
						<FileText className="h-5 w-5 text-primary" />
						<CardTitle>{task.title}</CardTitle>
					</div>
					<CardDescription className="mt-2">{task.description}</CardDescription>
				</CardHeader>
			</Card>

			{/* Estimated Time Card */}
			<Card>
				<CardHeader>
					<div className="flex items-center gap-3">
						<Clock className="h-5 w-5 text-primary" />
						<CardTitle>Estimated Time</CardTitle>
					</div>
				</CardHeader>
				<CardContent>
					<p className="text-lg font-medium">{task.estimated_time}</p>
				</CardContent>
			</Card>

			{/* Steps Card */}
			<Card>
				<CardHeader>
					<div className="flex items-center gap-3">
						<ListOrdered className="h-5 w-5 text-primary" />
						<CardTitle>Implementation Steps</CardTitle>
					</div>
				</CardHeader>
				<CardContent>
					<ol className="space-y-2 list-decimal list-inside">
						{task.steps.map((step) => (
							<li key={step} className="text-sm">
								{step}
							</li>
						))}
					</ol>
				</CardContent>
			</Card>

			{/* Suggested Tests Card */}
			<Card>
				<CardHeader>
					<div className="flex items-center gap-3">
						<TestTube className="h-5 w-5 text-primary" />
						<CardTitle>Suggested Tests</CardTitle>
					</div>
				</CardHeader>
				<CardContent>
					<ul className="space-y-2">
						{task.suggested_tests.map((test) => (
							<li key={test} className="text-sm font-mono bg-muted p-2 rounded">
								{test}
							</li>
						))}
					</ul>
				</CardContent>
			</Card>

			{/* Acceptance Criteria Card */}
			<Card>
				<CardHeader>
					<div className="flex items-center gap-3">
						<CheckCircle2 className="h-5 w-5 text-primary" />
						<CardTitle>Acceptance Criteria</CardTitle>
					</div>
				</CardHeader>
				<CardContent>
					<ul className="space-y-2">
						{task.acceptance_criteria.map((criterion) => (
							<li key={criterion} className="flex items-start gap-2 text-sm">
								<CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
								<span>{criterion}</span>
							</li>
						))}
					</ul>
				</CardContent>
			</Card>

			{/* Implementation Suggestion Card */}
			<Card>
				<CardHeader>
					<div className="flex items-center gap-3">
						<Code className="h-5 w-5 text-primary" />
						<CardTitle>Implementation Suggestion</CardTitle>
					</div>
				</CardHeader>
				<CardContent>
					<p className="text-sm leading-relaxed">
						{task.implementation_suggestion}
					</p>
				</CardContent>
			</Card>

			<fetcher.Form method="POST" className="flex justify-between">
				<input type="hidden" name="message_id" value={message_id} />
				<input type="hidden" name="task_id" value={task_id} />

				{task_id ? (
					<Button type="button">
						<Link to={`/task/view/${task_id}`}>Task Details</Link>
					</Button>
				) : (
					<div>&nbsp;</div>
				)}
				<Button type="submit" disabled={fetcher.state !== "idle"}>
					Save Task
				</Button>
			</fetcher.Form>
		</div>
	);
}
