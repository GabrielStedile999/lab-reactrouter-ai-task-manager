import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";

export function Welcome() {
	return (
		<main className="p-12">
			<Card>
				<CardHeader>
					<CardTitle>Bem-vindo ao AI Task Manager</CardTitle>
					<CardDescription>
						Organize, acompanhe e otimize suas tarefas com inteligência
						artificial. Explore os recursos e aumente sua produtividade!
					</CardDescription>
				</CardHeader>
			</Card>
		</main>
	);
}
