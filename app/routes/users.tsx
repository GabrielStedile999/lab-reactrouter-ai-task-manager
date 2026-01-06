import { Calendar, Mail, User } from "lucide-react";
import prisma from "prisma/prisma";
import { Badge } from "~/components/ui/badge";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "~/components/ui/table";
import type { Route } from "./+types/users";

export async function loader() {
	return {
		users: await prisma.user.findMany(),
	};
}

export default function ({ loaderData }: Route.ComponentProps) {
	return (
		<div className="container mx-auto py-6 space-y-4">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-bold">Users</h1>
				<Badge variant="secondary">{loaderData.users.length} user(s)</Badge>
			</div>

			<div className="rounded-md border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="w-[80px]">ID</TableHead>
							<TableHead>
								<div className="flex items-center gap-2">
									<User className="h-4 w-4" />
									Name
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
									<Calendar className="h-4 w-4" />
									Age
								</div>
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{loaderData.users.length === 0 ? (
							<TableRow>
								<TableCell colSpan={6} className="h-24 text-center">
									No users found.
								</TableCell>
							</TableRow>
						) : (
							loaderData.users.map((user) => (
								<TableRow key={user.id}>
									<TableCell className="font-medium">{user.id}</TableCell>
									<TableCell>{user.name}</TableCell>
									<TableCell>{user.email}</TableCell>
									<TableCell>{user.age}</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
