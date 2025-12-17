import { Bot, Send, User } from "lucide-react";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { useFetcher } from "react-router";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Input } from "~/components/ui/input";

interface Message {
	id: string;
	role: "user" | "assistant";
	content: string;
	timestamp: Date;
}

export function ChatInterface() {
	const [inputValue, setInputValue] = useState("");
	const [messages, setMessages] = useState<Message[]>([]);
	const fetcher = useFetcher();
	const messagesEndRef = useRef<HTMLDivElement>(null);

	const isLoading =
		fetcher.state === "submitting" || fetcher.state === "loading";

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <todo>
	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	// Handle response from action
	useEffect(() => {
		if (fetcher.data && fetcher.state === "idle") {
			const data = fetcher.data as { message?: string };
			if (data?.message) {
				const assistantMessage: Message = {
					id: `assistant-${Date.now()}`,
					role: "assistant",
					content: data.message,
					timestamp: new Date(),
				};
				setMessages((prev) => [...prev, assistantMessage]);
			} else if (fetcher.data && typeof fetcher.data === "object") {
				// Handle error response
				const errorData = fetcher.data as { message?: string };
				const errorMessage: Message = {
					id: `error-${Date.now()}`,
					role: "assistant",
					content:
						errorData.message ||
						"Sorry, I encountered an error. Please try again.",
					timestamp: new Date(),
				};
				setMessages((prev) => [...prev, errorMessage]);
			}
		}
	}, [fetcher.data, fetcher.state]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (inputValue.trim() && !isLoading) {
			const userMessage: Message = {
				id: `user-${Date.now()}`,
				role: "user",
				content: inputValue,
				timestamp: new Date(),
			};

			setMessages((prev) => [...prev, userMessage]);
			const messageToSend = inputValue;
			setInputValue("");

			// Use fetcher.submit with FormData for React Router compatibility
			const formData = new FormData();
			formData.append("message", messageToSend);

			fetcher.submit(formData, {
				method: "POST",
			});
		}
	};

	return (
		<Card className="w-full max-w-2xl h-[600px] flex flex-col shadow-2xl backdrop-blur-sm bg-card/95">
			{/* Header */}
			<div className="flex items-center gap-3 p-4 border-b bg-primary/5">
				<Avatar className="h-10 w-10 bg-primary">
					<AvatarFallback className="bg-primary text-primary-foreground">
						<Bot className="h-5 w-5" />
					</AvatarFallback>
				</Avatar>
				<div>
					<h2 className="font-semibold text-lg text-foreground">Chat Friend</h2>
					<p className="text-xs text-muted-foreground">
						{isLoading ? "Typing..." : "Online"}
					</p>
				</div>
			</div>

			{/* Messages */}
			<div className="flex-1 overflow-y-auto p-4 space-y-4">
				{messages.length === 0 && (
					<div className="flex flex-col items-center justify-center h-full text-center space-y-3">
						<div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
							<Bot className="h-8 w-8 text-primary" />
						</div>
						<div>
							<h3 className="font-semibold text-lg text-foreground">
								Start a conversation
							</h3>
							<p className="text-sm text-muted-foreground mt-1">
								Ask me anything and I'll be happy to help!
							</p>
						</div>
					</div>
				)}

				{messages.map((message) => (
					<div
						key={message.id}
						className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}
					>
						<Avatar
							className={`h-8 w-8 ${message.role === "user" ? "bg-secondary" : "bg-primary"}`}
						>
							<AvatarFallback
								className={
									message.role === "user"
										? "bg-secondary text-secondary-foreground"
										: "bg-primary text-primary-foreground"
								}
							>
								{message.role === "user" ? (
									<User className="h-4 w-4" />
								) : (
									<Bot className="h-4 w-4" />
								)}
							</AvatarFallback>
						</Avatar>

						<div
							className={`flex flex-col max-w-[75%] ${message.role === "user" ? "items-end" : "items-start"}`}
						>
							<div
								className={`rounded-2xl px-4 py-2 ${
									message.role === "user"
										? "bg-primary text-primary-foreground"
										: "bg-secondary text-secondary-foreground"
								}`}
							>
								<p className="text-sm leading-relaxed whitespace-pre-wrap">
									{message.content}
								</p>
							</div>
							<span className="text-xs text-muted-foreground mt-1 px-1">
								{message.timestamp.toLocaleTimeString([], {
									hour: "2-digit",
									minute: "2-digit",
								})}
							</span>
						</div>
					</div>
				))}
				<div ref={messagesEndRef} />
			</div>

			{/* Input */}
			<div className="p-4 border-t bg-card">
				<form onSubmit={handleSubmit} className="flex gap-2">
					<Input
						value={inputValue}
						onChange={(e) => setInputValue(e.target.value)}
						placeholder="Type your message..."
						disabled={isLoading}
						className="flex-1 bg-background"
					/>
					<Button
						type="submit"
						size="icon"
						disabled={isLoading || !inputValue.trim()}
						className="bg-primary hover:bg-primary/90"
					>
						<Send className="h-4 w-4" />
						<span className="sr-only">Send message</span>
					</Button>
				</form>
			</div>
		</Card>
	);
}
