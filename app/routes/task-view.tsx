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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

import { Badge } from "~/components/ui/badge";
import { Label } from "~/components/ui/label";
import type { Route } from "./+types/task-view";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Separator } from "~/components/ui/separator";
import prisma from "prisma/prisma";
import { redirect, useLoaderData } from "react-router";

export async function loader({ params }: Route.LoaderArgs) {
	const task = await prisma.task.findUnique({
		where: {
			id: params.id,
		},
	});

	if (!task) {
		return redirect("/tasks");
	}

	return { task };
}

export default function () {
	const { task } = useLoaderData<typeof loader>();
	// Defensive parsing for JSON fields
	let steps: string[] = [];
	let acceptanceCriteria: string[] = [];
	let suggestedTests: string[] = [];
	try {
		steps = JSON.parse(task.steps ?? "[]");
	} catch {}
	try {
		acceptanceCriteria = JSON.parse(task.acceptance_criteria ?? "[]");
	} catch {}
	try {
		suggestedTests = JSON.parse(task.suggested_tests ?? "[]");
	} catch {}

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
							<TabsTrigger value="acceptance">Acceptance Criteria</TabsTrigger>
							<TabsTrigger value="tests">Suggested Tests</TabsTrigger>
						</TabsList>
						<TabsContent value="steps">
							<ul className="list-decimal list-inside space-y-2 mt-2">
								{steps.length > 0 ? (
									steps.map((step) => (
										<li key={typeof step === "string" ? step : JSON.stringify(step)} className="text-base text-foreground">
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
										<li
											key={typeof criteria === "string" ? criteria : JSON.stringify(criteria)}
											className="text-base text-foreground"
										>
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
										<li key={typeof test === "string" ? test : JSON.stringify(test)} className="text-base font-mono text-foreground">
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
		</ScrollArea>
	);
}
