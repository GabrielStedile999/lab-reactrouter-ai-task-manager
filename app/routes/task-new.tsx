import type { ActionFunctionArgs } from "react-router";
import { TasksChatbot } from "~/features/tasks/tasks-chatbot";

export const maxDuration = 30;

const mockResponses = [
	"Hello! I'm your AI assistant. How can I help you today?",
	"That's an interesting question! Let me think about that for a moment.",
	"I'd be happy to help you with that. Could you provide more details?",
	"Great question! Here's what I think about that topic.",
	"I understand what you're asking. Let me explain it in a clear way.",
	"That's a common concern. Here's my perspective on the matter.",
	"I'm here to assist you with any questions you have!",
	"Thanks for asking! Here's some information that might help you.",
];

function getContextualResponse(userMessage: string): string {
	const lowerMessage = userMessage.toLowerCase();

	// Context-aware responses
	if (
		lowerMessage.includes("hello") ||
		lowerMessage.includes("hi") ||
		lowerMessage.includes("hey")
	) {
		return "Hello! It's great to hear from you. How can I assist you today?";
	}

	if (lowerMessage.includes("help")) {
		return "I'm here to help! You can ask me questions about various topics, and I'll do my best to provide helpful answers. What would you like to know?";
	}

	if (lowerMessage.includes("thank")) {
		return "You're very welcome! Feel free to ask if you need anything else. I'm always here to help!";
	}

	if (
		lowerMessage.includes("how are you") ||
		lowerMessage.includes("how do you do")
	) {
		return "I'm doing great, thank you for asking! I'm ready to help you with whatever you need. How can I assist you?";
	}

	if (lowerMessage.includes("bye") || lowerMessage.includes("goodbye")) {
		return "Goodbye! It was nice chatting with you. Feel free to come back anytime you need assistance!";
	}

	if (lowerMessage.includes("name")) {
		return "I'm an AI Assistant, here to help answer your questions and assist with various tasks. What would you like to know?";
	}

	// Default to a random response based on message length
	const responseIndex = userMessage.length % mockResponses.length;
	return mockResponses[responseIndex];
}

export async function action({ request }: ActionFunctionArgs) {
	try {
		console.log("[chat] Action called for:", request.url);
		console.log("[chat] Method:", request.method);
		console.log("[chat] Content-Type:", request.headers.get("Content-Type"));

		// Handle both JSON and FormData
		let message: string;
		const contentType = request.headers.get("Content-Type") || "";

		if (contentType.includes("application/json")) {
			const body = await request.json();
			console.log("[chat] Body received (JSON):", body);
			message = body.message;
		} else {
			// FormData
			const formData = await request.formData();
			console.log("[chat] FormData received:", formData);
			message = formData.get("message") as string;
		}

		if (!message || typeof message !== "string") {
			console.error("[chat] Invalid message:", message);
			return Response.json(
				{ message: "Please provide a valid message." },
				{ status: 400 },
			);
		}

		// Simulate a small delay to make it feel more natural
		await new Promise((resolve) => setTimeout(resolve, 500));

		const response = getContextualResponse(message);
		console.log("[chat] Response generated:", response);

		return Response.json({ message: response });
	} catch (error) {
		console.error("[chat] Error in chat action:", error);
		if (error instanceof Error) {
			console.error("[chat] Error message:", error.message);
			console.error("[chat] Error stack:", error.stack);
		}
		return Response.json(
			{ message: "Sorry, I encountered an error. Please try again." },
			{ status: 500 },
		);
	}
}

export default function () {
	return <TasksChatbot />;
}
