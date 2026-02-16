import Redis from "ioredis";

export const TTL = 60 * 60 * 24;

type CacheClient = {
	get: (key: string) => Promise<string | null>;
	set: (
		key: string,
		value: string,
		mode?: "EX",
		ttlSeconds?: number,
	) => Promise<"OK" | null>;
};

class InMemoryCache implements CacheClient {
	private store = new Map<string, { value: string; expiresAt: number | null }>();

	async get(key: string) {
		const entry = this.store.get(key);
		if (!entry) return null;
		if (entry.expiresAt && entry.expiresAt <= Date.now()) {
			this.store.delete(key);
			return null;
		}
		return entry.value;
	}

	async set(key: string, value: string, mode?: "EX", ttlSeconds?: number) {
		const expiresAt =
			mode === "EX" && typeof ttlSeconds === "number"
				? Date.now() + ttlSeconds * 1000
				: null;
		this.store.set(key, { value, expiresAt });
		return "OK" as const;
	}
}

class RedisCache implements CacheClient {
	constructor(private redis: Redis) {}

	async get(key: string) {
		return this.redis.get(key);
	}

	async set(key: string, value: string, mode?: "EX", ttlSeconds?: number) {
		if (mode === "EX" && typeof ttlSeconds === "number") {
			return this.redis.set(key, value, "EX", ttlSeconds);
		}
		return this.redis.set(key, value);
	}
}

const upstashUrl = process.env.UPSTASH;
const isRedisUrl = typeof upstashUrl === "string" && /^rediss?:\/\//.test(upstashUrl);

export const cache: CacheClient = isRedisUrl
	? new RedisCache(
			new Redis(upstashUrl, {
				maxRetriesPerRequest: 1,
				enableReadyCheck: false,
			}),
		)
	: new InMemoryCache();