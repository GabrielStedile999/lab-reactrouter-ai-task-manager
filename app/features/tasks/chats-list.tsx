import { Clock, FileText, Pencil, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useFetcher } from "react-router";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "~/components/ui/table";
import type { Route } from "../../routes/+types/chats";

type Chat = Route.ComponentProps["loaderData"]["chats"][number];

function EditableTitleCell({
	chat,
	isEditing,
	onEdit,
	onCancel,
}: {
	chat: Chat;
	isEditing: boolean;
	onEdit: () => void;
	onCancel: () => void;
}) {
	const fetcher = useFetcher();
	const [value, setValue] = useState(chat.title ?? "");
	const [optimisticTitle, setOptimisticTitle] = useState<string | null>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		setValue(chat.title ?? "");
		if (optimisticTitle && chat.title === optimisticTitle) {
			setOptimisticTitle(null);
		}
	}, [chat.title, optimisticTitle]);

	useEffect(() => {
		if (!isEditing) return;
		requestAnimationFrame(() => {
			inputRef.current?.focus();
			inputRef.current?.select();
		});
	}, [isEditing]);

	const submitTitle = () => {
		const trimmedValue = value.trim();
		if (trimmedValue === (chat.title ?? "")) {
			onCancel();
			return;
		}

		setOptimisticTitle(trimmedValue);
		fetcher.submit(
			{
				action: "updateChat",
				chat_id: chat.id,
				title: trimmedValue,
			},
			{ method: "post" },
		);
		onCancel();
	};

	useEffect(() => {
		if (fetcher.state !== "idle") return;
		if (fetcher.data?.success === false) {
			setOptimisticTitle(null);
			setValue(chat.title ?? "");
		}
	}, [fetcher.state, fetcher.data, chat.title]);

	const displayTitle = optimisticTitle ?? chat.title ?? "Untitled";

	if (isEditing) {
		return (
			<Input
				ref={inputRef}
				value={value}
				onChange={(event) => setValue(event.target.value)}
				onBlur={submitTitle}
				onKeyDown={(event) => {
					if (event.key === "Enter") {
						event.preventDefault();
						submitTitle();
					}
					if (event.key === "Escape") {
						event.preventDefault();
						setValue(chat.title ?? "");
						onCancel();
					}
				}}
				placeholder="Untitled"
				className="h-8"
			/>
		);
	}

	return (
		<button
			type="button"
			className="text-left text-muted-foreground hover:text-foreground"
			onClick={onEdit}
		>
			{displayTitle}
		</button>
	);
}

export function ChatsList({
	loaderData,
}: {
	loaderData: Route.ComponentProps["loaderData"];
}) {
	const [editingChatId, setEditingChatId] = useState<string | null>(null);
	const fetcherDelete = useFetcher();

	return (
		<div className="container mx-auto py-6 space-y-4">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-bold">Chats</h1>
				<Badge variant="secondary">{loaderData.chats.length} chat(s)</Badge>
			</div>

			<div className="rounded-md border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="w-[300px]">
								<div className="flex items-center gap-2">
									<FileText className="h-4 w-4" />
									ID
								</div>
							</TableHead>
							<TableHead className="w-[300px]">
								<div className="flex items-center gap-2">
									<FileText className="h-4 w-4" />
									Title
								</div>
							</TableHead>

							<TableHead className="w-[100px]">
								<div className="flex items-center gap-2">
									<Clock className="h-4 w-4" />
									Created At
								</div>
							</TableHead>

							<TableHead className="w-[1%] text-center">Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{loaderData.chats.length === 0 ? (
							<TableRow>
								<TableCell colSpan={5} className="h-24 text-center">
									No chats found.
								</TableCell>
							</TableRow>
						) : (
							loaderData.chats.map((chat) => (
								<TableRow key={chat.id}>
									<TableCell className="w-[300px]">
										<Link
											to={`/task/new?chat=${chat.id}`}
											className="decoration-dotted underline underline-offset-4"
										>
											{chat.id}
										</Link>
									</TableCell>
									<TableCell className="font-medium w-[300px]">
										<EditableTitleCell
											chat={chat}
											isEditing={editingChatId === chat.id}
											onEdit={() => setEditingChatId(chat.id)}
											onCancel={() => setEditingChatId(null)}
										/>
									</TableCell>

									<TableCell className="w-[100px]">
										{chat.created_at?.toLocaleString()}
									</TableCell>

									<TableCell>
										<div className="flex items-center gap-2">
											<Button
												variant="ghost"
												size="icon"
												className="h-8 w-8"
												title="Edit chat"
												onClick={() => setEditingChatId(chat.id)}
											>
												<Pencil className="h-4 w-4" />
											</Button>
											<Button
												type="button"
												variant="ghost"
												size="icon"
												className="h-8 w-8 text-destructive hover:text-destructive"
												title="Delete chat"
												onClick={() =>
													fetcherDelete.submit(
														{ action: "deleteChat", chat_id: chat.id },
														{ method: "post" },
													)
												}
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
