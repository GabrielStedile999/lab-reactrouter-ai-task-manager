import {
	Calendar,
	CheckCircle2,
	Clock,
	Mail,
	User,
	XCircle,
} from "lucide-react";
import { Badge } from "~/components/ui/badge";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "~/components/ui/table";
import { turso } from "~/turso";
import type { Route } from "./+types/users";

interface UserData {
	id: number;
	email: string;
	username: string;
	password_hash: string;
	created_at: string;
	updated_at: string;
	is_active: number;
	last_login_at: string | null;
}

export async function loader() {
	const response = await turso.execute("SELECT * FROM users");

	// Convert rows to proper format
	const users: UserData[] = response.rows.map((row) => ({
		id: row.id as number,
		email: row.email as string,
		username: row.username as string,
		password_hash: row.password_hash as string,
		created_at: row.created_at as string,
		updated_at: row.updated_at as string,
		is_active: row.is_active as number,
		last_login_at: row.last_login_at as string | null,
	}));

	return {
		users,
	};
}

function formatDate(dateString: string | null): string {
	if (!dateString) return "Never";
	try {
		const date = new Date(dateString);
		return date.toLocaleDateString("pt-BR", {
			year: "numeric",
			month: "short",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	} catch {
		return "Invalid date";
	}
}

export default function ({ loaderData }: Route.ComponentProps) {
	const users: UserData[] =
		loaderData &&
		typeof loaderData === "object" &&
		"users" in loaderData &&
		Array.isArray((loaderData as unknown as { users: unknown }).users)
			? (loaderData as unknown as { users: UserData[] }).users
			: [];

	return (
		<div className="container mx-auto py-6 space-y-4">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-bold">Users</h1>
				<Badge variant="secondary">{users.length} user(s)</Badge>
			</div>

			<div className="rounded-md border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="w-[80px]">ID</TableHead>
							<TableHead>
								<div className="flex items-center gap-2">
									<User className="h-4 w-4" />
									Username
								</div>
							</TableHead>
							<TableHead>
								<div className="flex items-center gap-2">
									<Mail className="h-4 w-4" />
									Email
								</div>
							</TableHead>
							<TableHead>
								<div className="flex items-center gap-2">
									<CheckCircle2 className="h-4 w-4" />
									Status
								</div>
							</TableHead>
							<TableHead>
								<div className="flex items-center gap-2">
									<Calendar className="h-4 w-4" />
									Created At
								</div>
							</TableHead>
							<TableHead>
								<div className="flex items-center gap-2">
									<Clock className="h-4 w-4" />
									Last Login
								</div>
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{users.length === 0 ? (
							<TableRow>
								<TableCell colSpan={6} className="h-24 text-center">
									No users found.
								</TableCell>
							</TableRow>
						) : (
							users.map((user) => (
								<TableRow key={user.id}>
									<TableCell className="font-medium">{user.id}</TableCell>
									<TableCell>{user.username}</TableCell>
									<TableCell>{user.email}</TableCell>
									<TableCell>
										<Badge
											variant={user.is_active ? "default" : "secondary"}
											className="flex items-center gap-1 w-fit"
										>
											{user.is_active ? (
												<>
													<CheckCircle2 className="h-3 w-3" />
													Active
												</>
											) : (
												<>
													<XCircle className="h-3 w-3" />
													Inactive
												</>
											)}
										</Badge>
									</TableCell>
									<TableCell className="text-muted-foreground">
										{formatDate(user.created_at)}
									</TableCell>
									<TableCell className="text-muted-foreground">
										{formatDate(user.last_login_at)}
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
