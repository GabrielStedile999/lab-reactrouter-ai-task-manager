import { faker } from "@faker-js/faker";
import prisma from "./prisma.js";

async function main() {
	console.log("🌱 Starting seed...");

	// Clear existing data (optional - comment out if you want to keep existing data)
	console.log("🗑️  Clearing existing data...");
	
	// Helper function to safely delete from a table
	const safeDeleteMany = async (modelName: string, deleteFn: () => Promise<unknown>) => {
		try {
			await deleteFn();
		} catch {
			console.log(`⚠️  ${modelName} table doesn't exist yet (migrations may not have been applied)`);
		}
	};

	await safeDeleteMany("Tasks", () => prisma.task.deleteMany());
	await safeDeleteMany("Posts", () => prisma.post.deleteMany());
	await safeDeleteMany("Users", () => prisma.user.deleteMany());

	// Create 20 users
	console.log("👥 Creating 20 users...");
	let users: unknown[];
	try {
		users = await Promise.all(
			Array.from({ length: 20 }, async () => {
				return prisma.user.create({
					data: {
						email: faker.internet.email().toLowerCase(),
						name: faker.person.fullName(),
						age: faker.number.int({ min: 18, max: 80 }),
					},
				});
			})
		);
		console.log(`✅ Created ${users.length} users`);
	} catch (error: unknown) {
		const errorMessage = error instanceof Error ? error.message : String(error);
		console.error("\n❌ Error creating users:");
		console.error(`   ${errorMessage}`);
		
		if (errorMessage.includes("no such table")) {
			console.error("\n📋 The database tables don't exist yet. Please run:");
			console.error("   1. npx prisma migrate dev    # Apply migrations to create tables");
			console.error("   2. npx prisma generate       # Regenerate Prisma Client");
			console.error("   3. npx prisma db seed        # Then run this seed again\n");
		}
		throw error;
	}

	// Create 60 posts distributed among users
	console.log("📝 Creating 60 posts...");
	let posts: unknown[];
	try {
		posts = await Promise.all(
			Array.from({ length: 60 }, async () => {
				const randomUser = faker.helpers.arrayElement(users) as { id: number };
				return prisma.post.create({
					data: {
						title: faker.lorem.sentence({ min: 3, max: 8 }),
						content: faker.lorem.paragraphs({ min: 1, max: 5 }),
						published: faker.datatype.boolean({ probability: 0.7 }),
						author_id: randomUser.id,
					},
				});
			})
		);
		console.log(`✅ Created ${posts.length} posts`);
	} catch (error: unknown) {
		const errorMessage = error instanceof Error ? error.message : String(error);
		console.error("\n❌ Error creating posts:");
		console.error(`   ${errorMessage}`);
		
		if (errorMessage.includes("no such table")) {
			console.error("\n📋 The database tables don't exist yet. Please run:");
			console.error("   1. npx prisma migrate dev    # Apply migrations to create tables");
			console.error("   2. npx prisma generate       # Regenerate Prisma Client");
			console.error("   3. npx prisma db seed        # Then run this seed again\n");
		}
		throw error;
	}

	// Create 20 tasks
	// NOTE: Make sure to run 'npx prisma migrate dev' and 'npx prisma generate' before seeding
	console.log("✅ Creating 20 tasks...");
	let tasks: unknown[] = [];
	try {
		tasks = await Promise.all(
			Array.from({ length: 20 }, async () => {
			const estimatedHours = faker.number.int({ min: 1, max: 8 });
			const estimatedMinutes = faker.number.int({ min: 0, max: 59 });
			const estimatedTime = `${estimatedHours}h ${estimatedMinutes > 0 ? `${estimatedMinutes}m` : ""}`.trim();

			// Generate steps as a numbered list
			const stepCount = faker.number.int({ min: 3, max: 7 });
			const steps = Array.from({ length: stepCount }, (_, i) => 
				`${i + 1}. ${faker.lorem.sentence({ min: 5, max: 12 })}`
			).join("\n");

			// Generate acceptance criteria
			const criteriaCount = faker.number.int({ min: 2, max: 5 });
			const acceptanceCriteria = Array.from({ length: criteriaCount }, () => 
				`- ${faker.lorem.sentence({ min: 4, max: 10 })}`
			).join("\n");

			return prisma.task.create({
				data: {
					title: faker.lorem.sentence({ min: 4, max: 8 }),
					description: faker.lorem.paragraph({ min: 2, max: 4 }),
					steps: steps,
					estimated_time: estimatedTime,
					implementation_suggestion: faker.lorem.paragraphs({ min: 2, max: 4 }),
					acceptance_criteria: acceptanceCriteria,
					suggested_tests: faker.lorem.paragraphs({ min: 1, max: 3 }),
					content: faker.datatype.boolean({ probability: 0.5 }) 
						? faker.lorem.paragraphs({ min: 1, max: 3 }) 
						: null,
					chat_history: null,
				},
			});
			})
		);
		console.log(`✅ Created ${tasks.length} tasks`);
	} catch (error: unknown) {
		const errorMessage = error instanceof Error ? error.message : String(error);
		console.error("\n❌ Error creating tasks:");
		console.error(`   ${errorMessage}`);
		
		if (errorMessage.includes("no such table")) {
			console.error("\n📋 The database tables don't exist yet. Please run:");
			console.error("   1. npx prisma migrate dev    # Apply migrations to create tables");
			console.error("   2. npx prisma generate       # Regenerate Prisma Client");
			console.error("   3. npx prisma db seed        # Then run this seed again\n");
		}
		throw error;
	}

	// Display summary
	console.log("\n📊 Seed Summary:");
	console.log(`   Users: ${users.length}`);
	console.log(`   Posts: ${posts.length}`);
	console.log(`   Tasks: ${tasks.length}`);
	console.log(`   Posts per user (avg): ${(posts.length / users.length).toFixed(1)}`);

	console.log("\n✨ Seed completed successfully!");
}

main()
	.catch((e) => {
		console.error("❌ Error seeding database:", e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});

