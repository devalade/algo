import { ContextSystem } from "./context-system.js";
import type { ContextItem, ContextQuery } from "./context-system.js";

export class ContextManager {
	private contextSystem: ContextSystem;
	private namespace: string;

	constructor(namespace: string = "default") {
		this.contextSystem = new ContextSystem();
		this.namespace = namespace;
	}

	addContext(
		id: string,
		content: string,
		metadata?: Record<string, any>,
	): void {
		const item: ContextItem = {
			id: `${this.namespace}:${id}`,
			content,
			metadata: { ...metadata, namespace: this.namespace },
		};
		this.contextSystem.addItem(item);
	}

	search(query: string, limit: number = 10, filters?: Record<string, any>) {
		const contextQuery: ContextQuery = {
			text: query,
			limit,
			filters: filters
				? { ...filters, namespace: this.namespace }
				: { namespace: this.namespace },
		};
		return this.contextSystem.query(contextQuery);
	}

	removeContext(id: string): boolean {
		return this.contextSystem.removeItem(`${this.namespace}:${id}`);
	}

	clearNamespace(): void {
		const allItems = this.contextSystem.getAll();
		const namespaceItems = allItems.filter(
			(item) => item.metadata?.namespace === this.namespace,
		);

		namespaceItems.forEach((item) => {
			this.contextSystem.removeItem(item.id);
		});
	}

	getContextById(id: string): ContextItem | undefined {
		return this.contextSystem
			.getAll()
			.find((item) => item.id === `${this.namespace}:${id}`);
	}

	getAllContext(): ContextItem[] {
		return this.contextSystem
			.getAll()
			.filter((item) => item.metadata?.namespace === this.namespace);
	}

	export(): string {
		return this.contextSystem.export();
	}

	import(jsonData: string): void {
		this.contextSystem.import(jsonData);
	}
}

export class MultiNamespaceContext {
	private contexts: Map<string, ContextManager> = new Map();

	getNamespace(name: string): ContextManager {
		if (!this.contexts.has(name)) {
			this.contexts.set(name, new ContextManager(name));
		}
		return this.contexts.get(name)!;
	}

	searchAll(query: string, limit: number = 10) {
		const allResults = [];

		for (const context of this.contexts.values()) {
			const result = context.search(query, limit);
			allResults.push(...result.items);
		}

		const uniqueItems = Array.from(
			new Map(allResults.map((item) => [item.id, item])).values(),
		);

		uniqueItems.sort((a, b) => {
			const scoreA = this.calculateRelevanceScore(a, query);
			const scoreB = this.calculateRelevanceScore(b, query);
			return scoreB - scoreA;
		});

		return {
			items: uniqueItems.slice(0, limit),
			query,
			totalFound: uniqueItems.length,
		};
	}

	private calculateRelevanceScore(item: ContextItem, query: string): number {
		const content = item.content.toLowerCase();
		const queryLower = query.toLowerCase();

		let score = 0;

		if (content.includes(queryLower)) {
			score += 100;
		}

		const queryWords = queryLower.split(/\s+/);
		for (const word of queryWords) {
			if (word.length > 2) {
				const wordCount = (content.match(new RegExp(word, "g")) || []).length;
				score += wordCount * 10;
			}
		}

		if (item.timestamp) {
			const ageInHours = (Date.now() - item.timestamp) / (1000 * 60 * 60);
			score += Math.max(0, 10 - ageInHours / 24);
		}

		return score;
	}

	getAllNamespaces(): string[] {
		return Array.from(this.contexts.keys());
	}

	exportAll(): string {
		const data: Record<string, any> = {
			namespaces: {},
			exportDate: new Date().toISOString(),
		};

		for (const [name, context] of this.contexts) {
			data.namespaces[name] = JSON.parse(context.export());
		}

		return JSON.stringify(data, null, 2);
	}

	importAll(jsonData: string): void {
		try {
			const data = JSON.parse(jsonData);
			if (data.namespaces) {
				for (const [name, namespaceData] of Object.entries(data.namespaces)) {
					const context = this.getNamespace(name);
					context.import(JSON.stringify(namespaceData));
				}
			}
		} catch (error) {
			throw new Error("Invalid JSON data provided");
		}
	}
}
