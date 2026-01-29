export type ChatMessage = {
	id: string;
	role: "user" | "assistant";
	content: string;
	timestamp: Date;
};

export type ChatMessages = ChatMessage[];