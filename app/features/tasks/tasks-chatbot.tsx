import { ChatInterface } from "~/components/chat-interface";
import { TaskContent } from "./task-content";

export function TasksChatbot() {
	return (
		<div className="p-6 flex flex-col gap-6 md:grid md:grid-cols-2 md:h-[calc(100svh-var(--header-height))] md:min-h-0">
			<div className="min-h-0 md:min-h-0">
				<ChatInterface />
			</div>
			<div className="min-h-0 md:overflow-y-auto">
				<TaskContent />
			</div>
		</div>
	);
}
