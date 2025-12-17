import {
	CheckCircle2,
	Clock,
	Code,
	FileText,
	ListOrdered,
	TestTube,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";

interface TaskData {
	title: string;
	description: string;
	estimated_time: string;
	steps: string[];
	suggested_tests: string[];
	acceptance_criteria: string[];
	implementation_suggestion: string;
}

const mockTaskData: TaskData = {
	title: "Secure Login Form with Authentication",
	description:
		"Implement a modern login form with field validation, session-based authentication, and real-time error feedback.",
	estimated_time: "2 days",
	steps: [
		"Create a form component using React",
		"Add field validation using a suitable library",
		"Connect backend for user authentication",
		"Persist sessions using SQLite",
		"Test full login and logout flow",
	],
	suggested_tests: [
		"it('should render login form correctly')",
		"it('should validate input fields')",
		"it('should authenticate valid credentials')",
		"it('should prevent access with invalid credentials')",
	],
	acceptance_criteria: [
		"Login form displays properly with required fields",
		"Invalid input is correctly flagged",
		"Valid users can log in and maintain a session",
		"Users are redirected upon login and logout",
	],
	implementation_suggestion:
		"Use React Hook Form for input validation, Prisma ORM for managing user data, and configure protected routes using React Router 7.",
};

export function TaskContent() {
	const {
		title,
		description,
		estimated_time,
		steps,
		suggested_tests,
		acceptance_criteria,
		implementation_suggestion,
	} = mockTaskData;

	return (
		<div className="space-y-6">
			{/* Title & Description Card */}
			<Card>
				<CardHeader>
					<div className="flex items-center gap-3">
						<FileText className="h-5 w-5 text-primary" />
						<CardTitle>{title}</CardTitle>
					</div>
					<CardDescription className="mt-2">{description}</CardDescription>
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
					<p className="text-lg font-medium">{estimated_time}</p>
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
						{steps.map((step) => (
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
						{suggested_tests.map((test) => (
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
						{acceptance_criteria.map((criterion) => (
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
					<p className="text-sm leading-relaxed">{implementation_suggestion}</p>
				</CardContent>
			</Card>

			<div>
				<Button>Salvar Task</Button>
			</div>
		</div>
	);
}
